import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView, TextInput, Alert, TouchableWithoutFeedback, ImageBackground, Keyboard, ActivityIndicator } from "react-native";
import Checkbox from "expo-checkbox";

import styles from "../Styles.js";

import * as SecureStore from "expo-secure-store";
import { CommonActions } from "@react-navigation/native";

import { SignupRequest } from "../utils/Request.js";

export default function SignupScreen({ navigation }) {
  const [usernameText, setUsernameText] = useState("");
  const [mailText, setMailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [passwordConfirmText, setPasswordConfirmText] = useState("");
  const [inputColors, setInputColors] = useState({
    username: "black",
    mail: "black",
    password: "black",
    passwordConfirm: "black",
  });

  const [passwordHidden, setPasswordHidden] = useState(true);
  const [passwordConfirmHidden, setPasswordConfirmHidden] = useState(true);

  const usernameRef = useRef();
  const mailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  //-----------------------------LOGIN-----------------------------------
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  function CheckInputs() {
    Keyboard.dismiss();
    if (!(mailText && usernameText && passwordText && passwordConfirmText)) {
      InvalidInputAlert("Missing input", "Fill all the required fields", {
        mail: mailText ? "black" : "red",
        username: usernameText ? "black" : "red",
        password: passwordText ? "black" : "red",
        passwordConfirm: passwordConfirmText ? "black" : "red",
      });
    } else if (passwordText !== passwordConfirmText) {
      InvalidInputAlert("Invalid input", "Passwords don't match", { password: "red", passwordConfirm: "red" });
    } else {
      TrySignup();
    }
  }

  async function TrySignup() {
    try {
      setIsRequesting(true);
      const resp = await SignupRequest(usernameText, passwordText, mailText);
      setIsRequesting(false);
      if (resp.success) {
        Signup(resp.token);
      } else {
        switch (resp.error) {
          case "USERNAME_TOO_SHORT":
            InvalidInputAlert("Invalid input", "Username should be at least 3 characters long", { username: "red" });
            break;
          case "USERNAME_TOO_LONG":
            InvalidInputAlert("Invalid input", "Username should be at most 30 characters long", { username: "red" });
            break;
          case "INVALID_USERNAME":
            InvalidInputAlert("Invalid input", "Username contains illegal characters", { username: "red" });
            break;
          case "LOGIN_CANT_BE_EMAIL":
            InvalidInputAlert("Invalid input", "Login can't be an email", { username: "red" });
            break;
          case "INVALID_EMAIL":
            InvalidInputAlert("Invalid input", "Email malformed", { mail: "red" });
            break;
          case "PASSWORD_TOO_SHORT":
            InvalidInputAlert("Invalid input", "Password should be at least 8 characters long", { password: "red", passwordConfirm: "red" });
            break;
          case "PASSWORD_TOO_LONG":
            InvalidInputAlert("Invalid input", "Password should be at most 100 characters long", { password: "red", passwordConfirm: "red" });
            break;
          case "USERNAME_ALREADY_TAKEN":
            InvalidInputAlert("Could not create account", "This username is already taken", { username: "red" });
            break;
          case "EMAIL_ALREADY_TAKEN":
            InvalidInputAlert("Could not create account", "This email is already taken", { mail: "red" });
            break;
          default:
            InvalidInputAlert("An error occured", "Please try again", {});
            break;
        }
      }
    } catch (e) {
      if (e === "timeout") {
        Alert.alert("Could not login", "Check your internet connection and try again");
      } else throw e;
    }
  }
  const InvalidInputAlert = (title, message, invalidInputs) => {
    Alert.alert(title, message);
    setInputColors({ ...inputColors, ...invalidInputs });
  };

  async function Signup(token) {
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("username", usernameText.trim());
    if (stayLoggedIn) {
      await SecureStore.setItemAsync("password", passwordText);
    }

    Alert.alert(
      "Account created",
      "Successfully created your account",
      [
        {
          text: "Continue",
          onPress: () => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Learn" }] })),
        },
      ],
      { cancelable: false }
    );
  }

  //------------------------------------------------------------------------//
  //-------------------------------WINDOW-----------------------------------//
  //------------------------------------------------------------------------//
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require("../assets/images/background.png")} resizeMode="cover" style={[styles.background, { justifyContent: "space-evenly" }]}>
          <TouchableOpacity style={[styles.backButton, { zIndex: 1 }]} onPress={() => navigation.goBack()} hitSlop={styles.hitslop}>
            <Image source={require("../assets/images/back_button.png")} style={styles.backButtonImage} />
          </TouchableOpacity>

          <View style={[styles.container, { justifyContent: "space-evenly", paddingVertical: 20, marginTop: 40 }]}>
            <View style={[styles.loginContainer, { marginBottom: 30 }]}>
              <Text style={styles.title}>Sign up</Text>
            </View>

            <View style={styles.loginContainer}>
              <View style={styles.signupElement}>
                <Text style={[styles.signupText, { color: inputColors.username }]}>Username</Text>
                <TextInput
                  ref={usernameRef}
                  style={styles.signupInput}
                  placeholder={"Enter your username"}
                  placeholderTextColor="grey"
                  autoCapitalize="sentences"
                  autoComplete="username"
                  autoCorrect={false}
                  clearTextOnFocus={false}
                  keyboardType="email-address"
                  textContentType="username"
                  multiline={false}
                  onChangeText={(text) => setUsernameText(text)}
                  onFocus={() => setInputColors({ ...inputColors, username: "black" })}
                  onSubmitEditing={() => mailRef.current?.focus()}
                  value={usernameText}
                />
              </View>

              <View style={styles.signupElement}>
                <Text style={[styles.signupText, { color: inputColors.mail }]}>E-mail</Text>
                <TextInput
                  ref={mailRef}
                  style={styles.signupInput}
                  placeholder={"Enter your e-mail"}
                  placeholderTextColor="grey"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  clearTextOnFocus={false}
                  keyboardType="email-address"
                  textContentType="username"
                  multiline={false}
                  onChangeText={(text) => setMailText(text)}
                  onFocus={() => setInputColors({ ...inputColors, mail: "black" })}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  value={mailText}
                />
              </View>
              <View style={styles.signupElement}>
                <Text style={[styles.signupText, { color: inputColors.password }]}>Password</Text>
                <View style={{ flexDirection: "row", width: "100%", alignSelf: "flex-start" }}>
                  <TextInput
                    ref={passwordRef}
                    style={styles.signupInput}
                    placeholder={"Enter your password"}
                    placeholderTextColor="grey"
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearTextOnFocus={false}
                    textAlign="left"
                    textContentType="password"
                    secureTextEntry={passwordHidden}
                    multiline={false}
                    onChangeText={(text) => setPasswordText(text)}
                    onFocus={() => setInputColors({ ...inputColors, password: "black" })}
                    onSubmitEditing={() => passwordConfirmRef.current?.focus()}
                    value={passwordText}
                  />
                  <TouchableOpacity style={{ left: -37, top: 2 }} hitSlop={styles.hitslop} onPress={() => setPasswordHidden(!passwordHidden)}>
                    {passwordHidden ? (
                      <Image source={require("../assets/images/eyeShow.png")} style={styles.passwordImage} />
                    ) : (
                      <Image source={require("../assets/images/eyeHide.png")} style={styles.passwordImage} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.signupElement}>
                <Text style={[styles.signupText, { color: inputColors.passwordConfirm }]}>Confirm password</Text>
                <View style={{ flexDirection: "row", width: "100%", alignSelf: "flex-start" }}>
                  <TextInput
                    ref={passwordConfirmRef}
                    style={styles.signupInput}
                    placeholder={"Enter your password"}
                    placeholderTextColor="grey"
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearTextOnFocus={false}
                    textAlign="left"
                    textContentType="password"
                    secureTextEntry={passwordConfirmHidden}
                    multiline={false}
                    onChangeText={(text) => setPasswordConfirmText(text)}
                    onFocus={() => setInputColors({ ...inputColors, passwordConfirm: "black" })}
                    value={passwordConfirmText}
                  />
                  <TouchableOpacity style={{ left: -37, top: 2 }} hitSlop={styles.hitslop} onPress={() => setPasswordConfirmHidden(!passwordConfirmHidden)}>
                    {passwordConfirmHidden ? (
                      <Image source={require("../assets/images/eyeShow.png")} style={styles.passwordImage} />
                    ) : (
                      <Image source={require("../assets/images/eyeHide.png")} style={styles.passwordImage} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", marginLeft: 2, marginTop: 0 }}>
              <Checkbox style={styles.checkbox} color={stayLoggedIn ? "#4298fe" : undefined} hitSlop={styles.hitslop} value={stayLoggedIn} onValueChange={setStayLoggedIn} />
              <Text style={{ fontSize: 17, fontWeight: "500", marginLeft: 10, color: "white" }}>Stay logged in</Text>
            </View>

            <View style={[styles.loginContainer, { marginBottom: 40 }]}>
              <View style={{ alignItems: "center", width: "75%" }}>
                <TouchableOpacity style={[styles.loginButton, { marginBottom: 30 }]} onPress={() => CheckInputs()}>
                  <Text style={styles.loginButtonText}>Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLinkerText}>Already have an account ? </Text>
                  <Text style={[styles.loginLinkerText, { color: "orange" }]}>Login</Text>
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
