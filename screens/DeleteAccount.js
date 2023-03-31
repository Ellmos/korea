import React, { useState, useRef } from "react";
import { SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, TextInput, View, Keyboard, Image, Alert, Animated, BackHandler } from "react-native";

import * as SecureStore from "expo-secure-store";
import { CommonActions } from "@react-navigation/native";

import styles from "../Styles.js";

import { LoadingPopup } from "../components/LoadingPopup.js";
import { DeleteRequest } from "../utils/Request.js";

export default function DeleteAccount({ route, navigation }) {
  const username = route.params.username;

  const [passwordText, setPasswordText] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);

  const CheckCreds = async () => {
    Keyboard.dismiss();
    if (!passwordText) {
      Alert.alert("missingInput", "pleaseEnterPassword");
      return;
    }
  };

  const DeleteAccount = async () => {
    popupRef.current?.HidePopup();
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("username");
    await SecureStore.deleteItemAsync("password");
    await SecureStore.deleteItemAsync("form");

    Alert.alert(
      "accountDeleted",
      "accountDeletedMessage",
      [
        {
          text: "OK",
          onPress: () => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Home" }] })),
        },
      ],
      { cancelable: false }
    );
  };

  const popupRef = useRef(null);
  //------------------------------------------------------------------------//
  //-------------------------------Window-----------------------------------//
  //------------------------------------------------------------------------//
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: "#222222ee" }]}>
        <View style={styles.deleteContainer}>
          <Text style={styles.deleteTitle}>{"deleteAccount?"}</Text>
          <Text style={styles.deleteSubTitle}>{"deleteAccountWarning"}</Text>

          <View style={styles.deleteElement}>
            <View style={{ flexDirection: "row", width: "100%", alignSelf: "flex-start" }}>
              <TextInput
                style={styles.deleteInput}
                placeholder={"enterPassword"}
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
            <Text style={styles.permissionButtonText}>{"confirm"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBackButton} onPress={() => navigation.goBack()}>
            <Text style={styles.permissionButtonText}>{"back"}</Text>
          </TouchableOpacity>
        </View>

        <LoadingPopup ref={popupRef} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
