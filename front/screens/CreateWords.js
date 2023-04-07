import React, { useState, useRef } from "react";
import { SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, TextInput, View, Keyboard, Alert } from "react-native";

import { CreateWordRequest } from "../utils/Request.js";
import * as SecureStore from "expo-secure-store";

import { useDispatch } from "react-redux";
import { changeWords } from "../src/actions/wordsSlice.js";

import styles from "../Styles.js";

export default function CreateWordsScreen({ route, navigation }) {
  const dispatch = useDispatch();

  const username = route.params.username;
  const token = route.params.token;

  const [words, setWords] = useState(route.params.words);
  const [newWordText, setNewWordText] = useState("");
  const [newWordTranslationText, setNewWordTranslationText] = useState("");
  const [inputColors, setInputColors] = useState({
    newWord: "black",
    newWordTranslation: "black",
  });

  const newWordInput = useRef(null);
  const newWordTranslationInput = useRef(null);

  function CheckInputs() {
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
      const resp = await CreateWordRequest(newWordText, newWordTranslationText, username, token, InvalidInputAlert);
      if (resp.success) {
        setInputColors({ newWord: "black", newWordTranslation: "black" });
        setNewWordText("");
        setNewWordTranslationText("");
        newWordInput.current?.focus();

        const newWords = [{ word: newWordText, translation: newWordTranslationText }, ...words];
        await SecureStore.setItemAsync("cache", JSON.stringify(newWords));
        setWords(newWords);
        dispatch(changeWords(newWords));
      }
    } catch (e) {
      if (e === "timeout") {
        Alert.alert("Could not contact server", "Check your internet connection and try again");
      } else {
        Alert.alert("Error", "An error has occurred, please try again later");
        console.error(e);
      }
    }
  }
  const InvalidInputAlert = (title, message, invalidInputs) => {
    Alert.alert(title, message);
    setInputColors({ ...inputColors, ...invalidInputs });
  };

  //------------------------------------------------------------------------//
  //-------------------------------Window-----------------------------------//
  //------------------------------------------------------------------------//
  return (
    <TouchableWithoutFeedback onPress={() => (Keyboard.isVisible() ? Keyboard.dismiss() : navigation.goBack())} style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: "#222222aa", justifyContent: "center", paddingBottom: 100 }]}>
        <View style={styles.createContainer}>
          <TouchableWithoutFeedback style={styles.container} onPress={() => Keyboard.dismiss()}>
            <View style={[styles.container, { justifyContent: "space-around" }]}>
              <View style={styles.createElement}>
                <Text style={[styles.loginText, { color: inputColors.newWord }]}>New word</Text>
                <TextInput
                  ref={newWordInput}
                  style={styles.createInput}
                  placeholder={"Enter a new word"}
                  placeholderTextColor="grey"
                  autoCapitalize="sentences"
                  autoCorrect={false}
                  blurOnSubmit={false}
                  clearTextOnFocus={false}
                  multiline={false}
                  onChangeText={(text) => setNewWordText(text)}
                  onFocus={() => setInputColors({ ...inputColors, newWord: "black" })}
                  onSubmitEditing={() => newWordTranslationInput.current?.focus()}
                  value={newWordText}
                />
              </View>

              <View style={styles.createElement}>
                <Text style={[styles.loginText, { color: inputColors.newWordTranslation }]}>Korean translation</Text>
                <TextInput
                  ref={newWordTranslationInput}
                  style={styles.createInput}
                  placeholder={"Enter the translation"}
                  placeholderTextColor="grey"
                  autoCapitalize="sentences"
                  autoCorrect={false}
                  blurOnSubmit={false}
                  clearTextOnFocus={false}
                  multiline={false}
                  onChangeText={(text) => setNewWordTranslationText(text)}
                  onFocus={() => setInputColors({ ...inputColors, newWordTranslation: "black" })}
                  onSubmitEditing={() => CheckInputs()}
                  value={newWordTranslationText}
                />
              </View>

              <TouchableOpacity style={styles.createButton} onPress={() => CheckInputs()}>
                <Text style={styles.createButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
