import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, SafeAreaView, Image, TextInput, Alert, ImageBackground, ActivityIndicator } from "react-native";
import Checkbox from "expo-checkbox";

import * as SecureStore from "expo-secure-store";
import { CommonActions } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";

import styles from "../Styles.js";
import { LoginRequest } from "../utils/Request.js";

export default function LoginScreen({ navigation }) {
  const [usernameText, setUsernameText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [inputColors, setInputColors] = useState({ username: "black", password: "black" });
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const username = await SecureStore.getItemAsync("username");
        setUsernameText(username);
      } catch (e) {
        throw e;
      }
    };

    getUserData();
  }, []);

  const usernameRef = useRef();
  const passwordRef = useRef();

  //-----------------------------LOGIN-----------------------------------
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  function CheckInputs() {
    Keyboard.dismiss();
    if (!(usernameText || passwordText)) {
      Alert.alert("Missing input", "Please enter yout username and password");
      setInputColors({ username: "red", password: "red" });
    } else if (!usernameText) {
      Alert.alert("Missing input", "Please enter your username");
      setInputColors({ username: "red", password: "black" });
    } else if (!passwordText) {
      Alert.alert("Missing input", "Please enter your password");
      setInputColors({ username: "black", password: "red" });
    } else {
      TryLogin();
    }
  }

  async function TryLogin() {
    try {
      setIsRequesting(true);
      const resp = await LoginRequest(usernameText, passwordText);
      setIsRequesting(false);
      if (resp.success) {
        Login(resp.token);
      } else {
        switch (resp.error) {
          case "WRONG_PASSWORD":
            Alert.alert("Login failed", "Incorrect password");
            break;
          case "UNKNOWN_USER":
            Alert.alert("This username does not exist", "Try your email");
            break;
          case "UNKNOWN_EMAIL":
            Alert.alert("This email does not exist", "Try your username");
            break;
          default:
            console.log(resp);
            Alert.alert("An error occured", "Please try again");
            break;
        }
      }
    } catch (e) {
      if (e === "timeout") {
        Alert.alert("Could not login", "Check your internet connection and try again");
      } else throw e;
    }
  }

  async function Login(token) {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("username", usernameText);
    if (stayLoggedIn) {
      await SecureStore.setItemAsync("password", passwordText);
    }

    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Learn" }] }));
    setPasswordHidden(true);
    setPasswordText("");
  }

  //------------------------------------------------------------------------------------//
  //------------------------------------WINDOW------------------------------------------//
  //------------------------------------------------------------------------------------//
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require("../assets/images/background.png")} resizeMode="cover" style={[styles.background, { justifyContent: "space-evenly" }]}>
          <TouchableOpacity style={[styles.backButton, { zIndex: 1 }]} onPress={() => navigation.goBack()} hitSlop={styles.hitslop}>
            <Image source={require("../assets/images/back_button.png")} style={styles.backButtonImage} />
          </TouchableOpacity>

          <View style={[styles.container, { justifyContent: "space-evenly", paddingVertical: 20 }]}>
            <View style={styles.loginContainer}>
              <Text style={styles.title}>Login</Text>
            </View>

            <View style={styles.loginContainer}>
              <View style={styles.loginElement}>
                <Text style={[styles.loginText, { color: inputColors.username }]}>Username or e-mail</Text>
                <TextInput
                  ref={usernameRef}
                  style={styles.loginInput}
                  placeholder={"Enter your username or e-mail"}
                  placeholderTextColor="grey"
                  autoCapitalize="sentences"
                  autoComplete="username"
                  autoCorrect={false}
                  blurOnSubmit={true}
                  clearTextOnFocus={false}
                  keyboardType="email-address"
                  textContentType="username"
                  multiline={false}
                  onChangeText={(text) => setUsernameText(text)}
                  onFocus={() => setInputColors({ ...inputColors, username: "black" })}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  value={usernameText}
                />
              </View>

              <View style={[styles.loginElement]}>
                <Text style={[styles.loginText, { color: inputColors.password }]}>Password</Text>
                <View style={{ flexDirection: "row", width: "100%", alignSelf: "flex-start" }}>
                  <TextInput
                    ref={passwordRef}
                    style={styles.loginInput}
                    placeholder={"Enter your password"}
                    placeholderTextColor="grey"
                    autoCapitalize="none"
                    autoCorrect={false}
                    blurOnSubmit={true}
                    clearTextOnFocus={false}
                    textAlign="left"
                    textContentType="password"
                    secureTextEntry={passwordHidden}
                    multiline={false}
                    onChangeText={(text) => setPasswordText(text)}
                    onFocus={() => setInputColors({ ...inputColors, password: "black" })}
                    value={passwordText}
                  />
                  <TouchableOpacity style={{ left: -42, top: 0, padding: 5 }} onPress={() => setPasswordHidden(!passwordHidden)}>
                    {passwordHidden ? (
                      <Image source={require("../assets/images/eyeShow.png")} style={styles.passwordImage} />
                    ) : (
                      <Image source={require("../assets/images/eyeHide.png")} style={styles.passwordImage} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center", marginLeft: 2, marginTop: 20 }}>
                <Checkbox style={styles.checkbox} color={stayLoggedIn ? "#4298fe" : undefined} hitSlop={styles.hitslop} value={stayLoggedIn} onValueChange={setStayLoggedIn} />
                <Text style={{ fontSize: 17, fontWeight: "500", marginLeft: 10, color: "white" }}>Stay logged in</Text>
              </View>
            </View>

            <View style={[styles.loginContainer, { marginTop: -30 }]}>
              <View style={{ alignItems: "center", width: "75%" }}>
                <TouchableOpacity style={[styles.loginButton, { marginBottom: 30 }]} onPress={() => CheckInputs()}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{}} onPress={() => WebBrowser.openBrowserAsync("https://sharedfolder.dynedoc.fr/wordpress/index.php/password-reset")}>
                  <Text style={[styles.loginLinkerText, { color: "#aaaaaa" }]}>Forgot your password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => navigation.navigate("Signup")}>
                  <Text style={styles.loginLinkerText}>Don't have an account ? </Text>
                  <Text style={[styles.loginLinkerText, { color: "orange" }]}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
        {isRequesting && (
          <SafeAreaView style={[styles.absoluteContainer, { backgroundColor: isRequesting ? "#00000055" : "#00000000" }]}>
            <ActivityIndicator size="large" style={{ transform: [{ scale: 1.5 }] }} />
          </SafeAreaView>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
