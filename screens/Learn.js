import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard, SafeAreaView, Image, BackHandler, Alert, ImageBackground, ActivityIndicator } from "react-native";

import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";

import styles from "../Styles.js";
import { CreateWordRequest, GetWordRequest } from "../utils/Request.js";

export default function LearnScreen({ navigation }) {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("RE-MED", "leaveApp", [
          { text: "stay", onPress: () => null, style: "destructive" },
          { text: "leave", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const username = await SecureStore.getItemAsync("username");
        const token = await SecureStore.getItemAsync("token");
        setToken(token);
        setUsername(username);
      } catch (e) {
        console.error(e);
      }
    };

    getUserData();
  }, []);

  //------------------------------------------------------------------------------------//
  const [newWordText, setNewWordText] = useState("");
  const [newWordTranslationText, setNewWordTranslationText] = useState("");
  const [inputColors, setInputColors] = useState({
    newWord: "black",
    newWordTranslation: "black",
  });

  const [isRequesting, setIsRequesting] = useState(false);

  function CheckInputs() {
    Keyboard.dismiss();
    if (!(newWordText && newWordTranslationText)) {
      InvalidInputAlert("Missing input", "Fill all the required fields", {
        newWord: newWordText ? "black" : "red",
        newWordTranslation: newWordTranslationText ? "black" : "red",
      });
    } else {
      CreateWord();
    }
  }

  async function CreateWord() {
    try {
      setIsRequesting(true);
      const resp = await CreateWordRequest(newWordText, newWordTranslationText, username, token);
      setIsRequesting(false);
      if (resp.success) {
        Alert.alert("Success", "Word created successfully");
        setInputColors({ newWord: "black", newWordTranslation: "black" });
      } else {
        switch (resp.error) {
          case "SESSION_EXPIRED":
            InvalidInputAlert("Session expired ", "Please login again", {});
            break;
          case "WORD_ALREADY_EXISTS":
            InvalidInputAlert("Word already exists", "This word and translation are already in your list!", { newWord: "red", newWordTranslation: "red" });
            break;
          default:
            InvalidInputAlert("An error occured", "Please try again", {});
            break;
        }
      }
    } catch (e) {
      if (e === "timeout") {
        Alert.alert("Could not login", "Check your internet connection and try again");
      } else {
        console.error(e);
      }
    }
  }
  const InvalidInputAlert = (title, message, invalidInputs) => {
    Alert.alert(title, message);
    setInputColors({ ...inputColors, ...invalidInputs });
  };

  const WordsDisplay = () => {
    const [words, setWords] = useState([]);
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
      const getWords = async () => {
        try {
          setIsRequesting(true);
          const resp = await GetWordRequest(username, token);
          setIsRequesting(false);
          if (resp.success) {
            setWords(resp.words);
          } else {
            switch (resp.error) {
              case "SESSION_EXPIRED":
                InvalidInputAlert("Session expired ", "Please login again", {});
                break;
              default:
                InvalidInputAlert("An error occured", "Please try again", {});
                break;
            }
          }
        } catch (e) {
          if (e === "timeout") {
            Alert.alert("Could not login", "Check your internet connection and try again");
          } else {
            console.error(e);
          }
        }
      };

      getWords();
    }, []);

    return (
      <View style={{ width: "100%", padding: 20, backgroundColor: "#444444" }}>
        {isRequesting ? (
          <ActivityIndicator size="large" color="#02a9ea" />
        ) : (
          words.map((word, index) => {
            return (
              <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, borderBottomWidth: 1, borderBottomColor: "grey" }}>
                <Text style={{ color: "white", fontSize: 20 }}>{word.word}</Text>
                <Text style={{ color: "white", fontSize: 20 }}>{word.translation}</Text>
              </View>
            );
          })
        )}
      </View>
    );
  };

  //------------------------------------------------------------------------------------//
  //------------------------------------WINDOW------------------------------------------//
  //------------------------------------------------------------------------------------//
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={require("../assets/images/background.png")} style={styles.background} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: "transparent" }}
        listViewDisplayed={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Drawer", { origin: "Learn" })} hitSlop={styles.hitslop} style={[styles.backButton, { zIndex: 1 }]}>
          <Image source={require("../assets/images/drawerButton.png")} style={styles.backButtonImage} />
        </TouchableOpacity>

        <View style={styles.learnContainer}>
          <View style={{ width: "100%", padding: 20, paddingTop: 50, backgroundColor: "#444444" }}>
            <TextInput
              style={styles.loginInput}
              placeholder={"Search a word"}
              placeholderTextColor="grey"
              autoCapitalize="sentences"
              autoCorrect={false}
              blurOnSubmit={true}
              clearTextOnFocus={false}
              multiline={false}
              onChangeText={(text) => setNewWordText(text)}
              onFocus={() => setInputColors({ ...inputColors, newWord: "black" })}
              value={newWordText}
            />
          </View>
          <WordsDisplay />
          <View style={{ width: "100%", padding: 10, backgroundColor: "#02a9ea55", flexDirection: "row", justifyContent: "space-around" }}>
            <Text>ENGLISH</Text>
            <Text>TRAD</Text>
          </View>
          <View style={{ width: "100%", padding: 10, backgroundColor: "#02191a22", flexDirection: "row", justifyContent: "space-around" }}>
            <Text>OTHER</Text>
            <Text>UWU</Text>
          </View>

          <View style={styles.loginElement}>
            <Text style={[styles.loginText, { color: inputColors.newWord }]}>New word</Text>
            <TextInput
              style={styles.loginInput}
              placeholder={"Enter a new word"}
              placeholderTextColor="grey"
              autoCapitalize="sentences"
              autoCorrect={false}
              blurOnSubmit={true}
              clearTextOnFocus={false}
              multiline={false}
              onChangeText={(text) => setNewWordText(text)}
              onFocus={() => setInputColors({ ...inputColors, newWord: "black" })}
              value={newWordText}
            />
          </View>

          <View style={styles.loginElement}>
            <Text style={[styles.loginText, { color: inputColors.newWordTranslation }]}>Korean translation</Text>
            <TextInput
              style={styles.loginInput}
              placeholder={"Enter the translation"}
              placeholderTextColor="grey"
              autoCapitalize="sentences"
              autoCorrect={false}
              blurOnSubmit={true}
              clearTextOnFocus={false}
              multiline={false}
              onChangeText={(text) => setNewWordTranslationText(text)}
              onFocus={() => setInputColors({ ...inputColors, newWordTranslation: "black" })}
              value={newWordTranslationText}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={() => CheckInputs()}>
            <Text style={styles.loginButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={() => GetWordRequest(username.trim().toLowerCase(), token)}>
            <Text style={styles.loginButtonText}>Get words</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isRequesting && (
        <SafeAreaView style={[styles.absoluteContainer, { backgroundColor: isRequesting ? "#00000055" : "#00000000" }]}>
          <ActivityIndicator size="large" style={{ transform: [{ scale: 1.5 }] }} />
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}
