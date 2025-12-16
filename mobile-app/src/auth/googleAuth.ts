
//737892300997-0lb7ngusri98udu7j245l1mljus7c8rm.apps.googleusercontent.com
//737892300997-ph9jr58emh7cg9jq21qmlgal2tbahleo.apps.googleusercontent.com


import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  return Google.useAuthRequest({
    webClientId:
      "737892300997-ph9jr58emh7cg9jq21qmlgal2tbahleo.apps.googleusercontent.com",

    iosClientId:
      "737892300997-0lb7ngusri98udu7j245l1mljus7c8rm.apps.googleusercontent.com",

    androidClientId:
      "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  });
}
