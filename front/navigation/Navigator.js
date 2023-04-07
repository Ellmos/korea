import React from "react";
import { StatusBar } from "react-native";

import HomeScreen from "../screens/Home.js";
import LoginScreen from "../screens/Login.js";
import SignupScreen from "../screens/Signup.js";
import LearnScreen from "../screens/Learn.js";
import CreateWordsScreen from "../screens/CreateWords";
import DrawerScreen from "../screens/Drawer.js";
import DeleteAccountScreen from "../screens/DeleteAccount.js";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

export default function Navigator({ initialRoute, words }) {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer theme={{ colors: { background: "black" } }}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          presentation: "transparentModal",
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Drawer" component={DrawerScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Learn" component={LearnScreen} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
        <Stack.Screen name="CreateWords" component={CreateWordsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
