import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, TextInput, View, Keyboard, Image, Alert, ActivityIndicator } from "react-native";

import * as SecureStore from "expo-secure-store";
import { CommonActions } from "@react-navigation/native";

import styles from "../Styles.js";

import { DeleteUserRequest } from "../utils/Request.js";

export default function DeleteAccountScreen({ route, navigation }) {
  const username = route.params.username;
  const token = route.params.token;

  const [passwordText, setPasswordText] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);

  async function CheckCreds() {
    Keyboard.dismiss();
    if (!passwordText) {
      Alert.alert("Missing input", "Please enter your password");
      return;
    }

    try {
      setIsRequesting(true);
      const resp = await DeleteUserRequest(username.trim().toLowerCase(), passwordText, token);
      if (resp.success) {
        DeleteAccount();
      }
    } catch (e) {
      if (e === "timeout") {
        Alert.alert("Could not login", "Check your internet connection and try again");
      } else {
        console.error(e);
      }
    } finally {
      setIsRequesting(false);
    }
  }

  const DeleteAccount = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("username");
    await SecureStore.deleteItemAsync("password");

    Alert.alert(
      "Account Deleted",
      "Your account has benn deleted\nYou will be redirected to the home screen",
      [
        {
          text: "OK",
          onPress: () => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Home" }] })),
        },
      ],
      { cancelable: false }
    );
  };

  //------------------------------------------------------------------------//
  //-------------------------------Window-----------------------------------//
  //------------------------------------------------------------------------//
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: "#222222ee" }]}>
        <View style={styles.deleteContainer}>
          <Text style={styles.deleteTitle}>{"Delete Account?"}</Text>
          <Text style={styles.deleteSubTitle}>{"This action is irreversible\nTo confirm your account deletion enter your password"}</Text>

          <View style={styles.deleteElement}>
            <View style={{ flexDirection: "row", width: "100%", alignSelf: "flex-start" }}>
              <TextInput
                style={styles.deleteInput}
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

          <TouchableOpacity style={styles.deleteButton} onPress={() => CheckCreds()}>
            <Text style={styles.permissionButtonText}>{"Confirm"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBackButton} onPress={() => navigation.goBack()}>
            <Text style={styles.permissionButtonText}>{"Back"}</Text>
          </TouchableOpacity>
        </View>
        {isRequesting && (
          <SafeAreaView style={[styles.absoluteContainer, { backgroundColor: isRequesting ? "#00000055" : "#00000000" }]}>
            <ActivityIndicator size="large" style={{ transform: [{ scale: 1.5 }] }} />
          </SafeAreaView>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
