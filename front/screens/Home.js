import React, { useCallback } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Image, ImageBackground, BackHandler, Alert, Platform } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import styles from "../Styles.js";

export default function HomeScreen({ navigation }) {
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

  //------------------------------------------------------------------------------------//
  //------------------------------------WINDOW------------------------------------------//
  //------------------------------------------------------------------------------------//
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require("../assets/images/background.png")} resizeMode="cover" style={[styles.background, { justifyContent: "space-evenly" }]}>
        {/* --------------------------------HOME------------------------------ */}
        <View style={[styles.container, { justifyContent: "space-evenly" }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Drawer", { origin: "Home" })} hitSlop={styles.hitslop}>
            <Image source={require("../assets/images/drawerButton.png")} style={styles.backButtonImage} />
          </TouchableOpacity>
          <View
            style={[
              styles.container,
              {
                flex: 0,
                opacity: Platform.OS == "ios" ? (currentPage.includes("Signup") ? test : 1) : 1,
                height: "auto",
              },
            ]}
          >
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subTitle}>Learn Korean now bitch</Text>
          </View>

          <View style={styles.homeButtonContainer}>
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.homeButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.homeButtonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
