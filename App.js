import "react-native-gesture-handler"; // This line must be at the top of the file
import React, { useEffect, useState } from "react";

import * as SecureStore from "expo-secure-store";

import Navigator from "./navigation/Navigator.js";
import * as Font from "expo-font";

import { LoginRequest } from "./utils/Request.js";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState("Home");

  useEffect(() => {
    const load = async () => {
      try {
        await Font.loadAsync({
          "Poppins-SemiBold": require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
        });

        //The below commented lines allow to delete the data saved on the device if needed
        /*
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("username");
        await SecureStore.deleteItemAsync("password");
*/
        const username = await SecureStore.getItemAsync("username");
        const password = await SecureStore.getItemAsync("password");
        if (username && password) {
          const resp = await LoginRequest(username, password);
          await SecureStore.setItemAsync("token", resp.token);
          setInitialRoute("Learn");
        }
      } catch (e) {
        if (e === "timeout") {
          setInitialRoute("Home");
          console.error("Timeout error\nCould not retieved token from server");
        } else {
          console.error(e);
        }
      } finally {
        setAppIsReady(true);
      }
    };
    load();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return <Navigator initialRoute={initialRoute} />;
}
