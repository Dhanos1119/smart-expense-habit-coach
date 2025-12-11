// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

const {
  JWT_ACCESS_SECRET = 'change_me_access',
  JWT_REFRESH_SECRET = 'change_me_refresh',
  ACCESS_TOKEN_EXPIRY = '15m',
  REFRESH_TOKEN_EXPIRY = '7d',
} = process.env;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
}));

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}
function signRefreshToken(user) {
  return jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

/** Register **/
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'User exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, name, passwordHash } });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // set httpOnly cookie (for web clients) - mobile will read accessToken from body
    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

/** Login **/
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

/** Current user **/
app.get('/api/users/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Missing auth' });
    const token = auth.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

/** Refresh token **/
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const token = req.cookies.jid || req.body.refreshToken;
    if (!token) return res.status(401).json({ error: 'No refresh token' });

    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    const dbToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!dbToken || dbToken.revoked) return res.status(401).json({ error: 'Invalid refresh token' });

    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } });
    const newRefresh = signRefreshToken(user);
    await prisma.refreshToken.create({ data: { token: newRefresh, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });

    const accessToken = signAccessToken(user);
    res.cookie('jid', newRefresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    return res.json({ accessToken });
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: 'Invalid refresh' });
  }
});

/** Logout **/
app.post('/api/auth/logout', async (req, res) => {
  try {
    const token = req.cookies.jid || req.body.refreshToken;
    if (token) {
      await prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } });
    }
    res.clearCookie('jid');
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log('Server running on', PORT));
