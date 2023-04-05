import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView, SafeAreaView, Image, BackHandler, Alert, ImageBackground, Keyboard } from "react-native";

import Dialog from "react-native-dialog";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";

import styles from "../Styles.js";
import { CreateWordRequest } from "../utils/Request.js";

export default function LearnScreen({ navigation }) {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Korea", "Do you want to leave the app?", [
          { text: "Stay", onPress: () => null, style: "destructive" },
          { text: "Leave", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [currentWords, setCurrentWords] = useState();
  const [allWords, setAllWords] = useState();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const username = await SecureStore.getItemAsync("username");
        const token = await SecureStore.getItemAsync("token");
        const cache = await SecureStore.getItemAsync("cache");
        setCurrentWords(JSON.parse(cache));
        setAllWords(JSON.parse(cache));
        setToken(token);
        setUsername(username);
      } catch (e) {
        if (e === "timeout") Alert.alert("Could not retrieve words", "Check your internet connection and try again");
        else console.error(e);
      }
    };

    getUserData();
  }, []);

  //------------------------------------------------------------------------------------//

  const WordsDisplay = () => {
    if (!currentWords) return;

    return (
      <View style={{ width: "100%" }}>
        {currentWords.map((word, index) => {
          return (
            <TouchableOpacity
              key={index}
              delayPressIn={700}
              style={[styles.wordLine, { backgroundColor: index % 2 == 0 ? "#02a9ea55" : "#02191a55" }]}
              onPress={() => Keyboard.dismiss()}
              onLongPress={() => Alert.alert("Long press on:", word.word)}
            >
              <Text style={{ width: "50%", fontSize: 15, textAlign: "center" }}>{word.word}</Text>
              <Text style={{ width: "50%", fontSize: 15, textAlign: "center" }}>{word.translation}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!currentWords) return;
    if (!searchText) return setCurrentWords(allWords);

    var filteredWords = allWords.filter((word) => {
      return word.word.toLowerCase().includes(searchText.toLowerCase()) || word.translation.toLowerCase().includes(searchText.toLowerCase());
    });
    setCurrentWords(filteredWords);
  }, [searchText]);

  //------------------------------------Creating new words------------------------------------------//
  const [createWordVisible, setCreateWordVisible] = useState(false);
  const newWordInput = useRef(null);
  const newWordTranslationInput = useRef(null);

  const [newWordText, setNewWordText] = useState("");
  const [newWordTranslationText, setNewWordTranslationText] = useState("");
  const [inputColors, setInputColors] = useState({
    newWord: "grey",
    newWordTranslation: "grey",
  });

  function CheckInputs() {
    if (!(newWordText && newWordTranslationText)) {
      InvalidInputAlert("Missing input", "Fill all the required fields", {
        newWord: newWordText ? "grey" : "red",
        newWordTranslation: newWordTranslationText ? "grey" : "red",
      });
    } else {
      CreateWord();
    }
  }

  async function CreateWord() {
    try {
      const resp = await CreateWordRequest(newWordText, newWordTranslationText, username, token, InvalidInputAlert);
      if (resp.success) {
        setInputColors({ newWord: "grey", newWordTranslation: "grey" });
        setNewWordText("");
        setNewWordTranslationText("");
        newWordInput.current?.focus();

        const newWords = [{ word: newWordText, translation: newWordTranslationText }, ...currentWords];
        await SecureStore.setItemAsync("cache", JSON.stringify(newWords));
        setCurrentWords(newWords);
        setAllWords(newWords);
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

  //------------------------------------Changing user------------------------------------------//
  const [changeUserVisible, setChangeUserVisible] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");

  function LoadOtherUser() {
    if (friendUsername) {
      navigation.navigate("Learn", { username: friendUsername });
    }
  }

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

        {/*--------------------------CHANGE USER---------------------------*/}
        <Dialog.Container visible={changeUserVisible} useNativeDriver={true} onBackdropPress={() => (Keyboard.isVisible() ? Keyboard.dismiss() : setChangeUserVisible(false))}>
          <Dialog.Title>Load friend's words?</Dialog.Title>
          <Dialog.Description>Enter a friend's username to load his words</Dialog.Description>
          <TextInput
            style={styles.changeUserInput}
            placeholder={"Enter a username"}
            placeholderTextColor="grey"
            autoCapitalize="sentences"
            autoCorrect={false}
            blurOnSubmit={true}
            clearTextOnFocus={false}
            multiline={false}
            onChangeText={(text) => setFriendUsername(text)}
            onSubmitEditing={() => {}}
            value={friendUsername}
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => {
              Keyboard.dismiss();
              setChangeUserVisible(false);
            }}
          />
          <Dialog.Button label="OK" onPress={() => {}} />
        </Dialog.Container>

        {/*--------------------------CREATE WORD---------------------------*/}
        <Dialog.Container visible={createWordVisible} useNativeDriver={true} onBackdropPress={() => (Keyboard.isVisible() ? Keyboard.dismiss() : setCreateWordVisible(false))}>
          <Dialog.Title>Add a new word</Dialog.Title>
          <Dialog.Description>Enter a word and its translation to add it to your database</Dialog.Description>
          <TextInput
            ref={newWordInput}
            style={styles.changeUserInput}
            placeholder={"Enter a new word"}
            placeholderTextColor={inputColors.newWord}
            autoCapitalize="sentences"
            autoCorrect={false}
            blurOnSubmit={false}
            clearTextOnFocus={false}
            multiline={false}
            onChangeText={(text) => setNewWordText(text)}
            onFocus={() => setInputColors({ ...inputColors, newWord: "grey" })}
            onSubmitEditing={() => newWordTranslationInput.current?.focus()}
            value={newWordText}
          />
          <TextInput
            ref={newWordTranslationInput}
            style={styles.changeUserInput}
            placeholder={"Enter the translation"}
            placeholderTextColor={inputColors.newWordTranslation}
            autoCapitalize="sentences"
            autoCorrect={false}
            blurOnSubmit={false}
            clearTextOnFocus={false}
            multiline={false}
            onChangeText={(text) => setNewWordTranslationText(text)}
            onFocus={() => setInputColors({ ...inputColors, newWordTranslation: "grey" })}
            onSubmitEditing={() => CheckInputs()}
            value={newWordTranslationText}
          />
          <Dialog.Button
            label="Quit"
            onPress={() => {
              Keyboard.dismiss();
              setCreateWordVisible(false);
            }}
          />
          <Dialog.Button label="Add" onPress={() => CheckInputs()} />
        </Dialog.Container>

        {/*--------------------------WINDOW---------------------------*/}
        <View style={styles.learnContainer}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Text style={[styles.subTitle, { color: "black", width: "auto" }]}>{username}</Text>
            <TouchableOpacity onPress={() => setChangeUserVisible(true)} hitSlop={styles.hitslop} style={{ width: 0, left: 10 }}>
              <Image source={require("../assets/images/exchange.png")} style={{ height: 25, width: 25 }} />
            </TouchableOpacity>
          </View>
          <View style={{ width: "100%", padding: 10, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
            <TextInput
              style={styles.searchInput}
              placeholder={"Search a word"}
              placeholderTextColor="grey"
              autoCapitalize="sentences"
              autoCorrect={false}
              blurOnSubmit={true}
              clearTextOnFocus={false}
              multiline={false}
              onChangeText={(text) => setSearchText(text)}
              value={searchText}
            />
            <TouchableOpacity
              onPress={() => {
                setCreateWordVisible(true);
                setSearchText("");
              }}
              hitSlop={styles.hitslop}
              style={{ width: "10%" }}
            >
              <Image source={require("../assets/images/plus.png")} style={{ height: 30, width: 30 }} />
            </TouchableOpacity>
          </View>
          <WordsDisplay />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
