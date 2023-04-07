import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView, Image, BackHandler, Alert, ImageBackground, Keyboard } from "react-native";

import Dialog from "react-native-dialog";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";

import styles from "../Styles.js";
import { CreateWordRequest, GetWordsRequest, Sleep } from "../utils/Request.js";

export default function LearnScreen({ navigation, route }) {
  const currFriend = route.params?.friendUsername;
  const isFriend = currFriend ? true : false;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isFriend) return false;

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

  const [isRequesting, setIsRequesting] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [currentWords, setCurrentWords] = useState();
  const [allWords, setAllWords] = useState();

  useEffect(() => {
    const getUserData = async () => {
      setIsRequesting(true);
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
      } finally {
        setIsRequesting(false);
      }
    };

    const getFriendsData = async () => {
      try {
        const resp = await GetWordsRequest(route.params.username, route.params.token, currFriend);
        if (resp.success) {
          setCurrentWords(resp.words);
          setAllWords(resp.words);
        }
      } catch (e) {
        if (e === "timeout") Alert.alert("Could not retrieve words", "Check your internet connection and try again");
        else console.error(e);
      }
    };

    if (!isFriend) getUserData();
    else getFriendsData();
  }, []);

  //------------------------------------Words------------------------------------------------//

  const [selectedWords, setSelectedWords] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const selectionImages = {
    false: { image: require("../assets/images/notSelected.png") },
    true: { image: require("../assets/images/selected.png") },
  };

  const WordsDisplay = () => {
    if (!currentWords) return;

    return (
      <View style={{ width: "100%" }}>
        {currentWords.map((word, index) => {
          let bgColor;
          if (index % 2 == 0) bgColor = selectedWords.includes(word.word) ? "#02f9ba66" : "#02a9ea66";
          else bgColor = selectedWords.includes(word.word) ? "#02f9ba66" : "#42594a66";

          return (
            <TouchableOpacity
              key={index}
              delayPressIn={700}
              style={[styles.wordLine, { backgroundColor: bgColor }]}
              onPress={() => {
                Keyboard.dismiss();
                if (isSelecting) {
                  if (selectedWords.includes(word.word)) {
                    setSelectedWords(selectedWords.filter((w) => w !== word.word));
                  } else {
                    setSelectedWords([...selectedWords, word.word]);
                  }
                }
              }}
              onLongPress={() => {
                setIsSelecting(true);
                setSelectedWords([...selectedWords, word.word]);
              }}
            >
              {isSelecting && <Image source={selectionImages[selectedWords.includes(word.word)].image} style={{ width: 20, height: 20 }} />}

              <Text style={{ width: "50%", fontSize: 15, textAlign: "center" }}>{word.word}</Text>
              <Text style={{ width: "50%", fontSize: 15, textAlign: "center" }}>{word.translation}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  //------------------------------------Searching------------------------------------------//

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
      Keyboard.dismiss();
      setChangeUserVisible(false);
      navigation.push("Learn", { token, username, friendUsername });
    }
  }

  const topLeftButton = {
    false: { image: require("../assets/images/drawerButton.png") },
    true: { image: require("../assets/images/back_button.png") },
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
        <TouchableOpacity
          onPress={() => {
            setIsSelecting(false);
            isFriend ? navigation.goBack() : navigation.navigate("Drawer", { origin: "Learn" });
          }}
          hitSlop={styles.hitslop}
          style={[styles.backButton, { zIndex: 1 }]}
        >
          <Image source={topLeftButton[isFriend].image} style={styles.backButtonImage} />
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
          <Dialog.Button label="OK" onPress={() => LoadOtherUser(username)} />
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
            <Text style={[styles.subTitle, { color: "black", width: "auto" }]}>{isFriend ? currFriend : username}</Text>

            {!isFriend ? (
              <TouchableOpacity onPress={() => setChangeUserVisible(true)} hitSlop={styles.hitslop} style={{ width: 0, left: 10 }}>
                <Image source={require("../assets/images/exchange.png")} style={{ height: 25, width: 25 }} />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={{ width: "100%", padding: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <TouchableOpacity onPress={() => console.log("select / deselect all")} hitSlop={styles.hitslop} style={{ width: "5%", justifyContent: "center", alignItems: "center" }}>
              {isSelecting && <Image source={selectionImages[isSelecting].image} style={{ height: 25, width: 25 }} />}
            </TouchableOpacity>

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
                if (!isFriend) {
                  setCreateWordVisible(true);
                  setSearchText("");
                } else {
                  Alert.alert("Importing your friend's words", "To import you friend's words hold and select all the words you want to import");
                }
              }}
              hitSlop={styles.hitslop}
              style={{ width: "10%", justifyContent: "center", alignItems: "center" }}
            >
              <Image source={require("../assets/images/plus.png")} style={{ height: 30, width: 30 }} />
            </TouchableOpacity>
          </View>

          <WordsDisplay />
        </View>
        {isRequesting && (
          <SafeAreaView style={[styles.absoluteContainer, { backgroundColor: isRequesting ? "#00000055" : "#00000000" }]}>
            <ActivityIndicator size="large" style={{ transform: [{ scale: 1.5 }] }} />
          </SafeAreaView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
