import "react-native-gesture-handler"; // This line must be at the top of the file
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

import * as SecureStore from "expo-secure-store";

import Navigator from "./navigation/Navigator.js";

import * as Font from "expo-font";

import { LoginRequest } from "./utils/Request.js";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState("Home");
  const [words, setWords] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        await Font.loadAsync({ "Poppins-SemiBold": require("./assets/fonts/Poppins/Poppins-SemiBold.ttf") });

        //The below commented lines allow to delete the data saved on the device if needed
        /*
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("username");
        await SecureStore.deleteItemAsync("password");
        await SecureStore.deleteItemAsync("cache");
    */
        const username = await SecureStore.getItemAsync("username");
        const password = await SecureStore.getItemAsync("password");
        if (username && password) {
          //Getting a new token
          setInitialRoute("Learn");
          var resp = await LoginRequest(username, password);
          if (resp.success) {
            setWords(resp.words);
            await SecureStore.setItemAsync("token", resp.token);
            await SecureStore.setItemAsync("cache", JSON.stringify(resp.words));
          }
        }
      } catch (e) {
        if (e === "timeout") {
          console.error("Timeout error\nCould not retieved user data");
          Alert.alert("Could not contact server", "Using cached dataThe app may not work properly");

          const cache = await SecureStore.getItemAsync("cache");
          if (cache) setWords(JSON.parse(cache));
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

  return <Navigator initialRoute={initialRoute} words={words} />;
}
