import React, { useEffect, useState, useRef, useCallback } from "react";
import { SafeAreaView, Text, TouchableOpacity, ImageBackground, Image, Linking, Platform, AppState, Animated, BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

import styles from "../Styles.js";
import trad from "../translations/i18n.js";
import { useSelector } from "react-redux";

import { Animate } from "../utils/Animation.js";
import Drawer from "../components/Drawer.js";

export default function PermissionDenied({ route, navigation }) {
  const [width, _] = useSelector((state) => state.dimensions);

  const { title, type } = route.params;
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        var perm;
        switch (type) {
          case "camera":
            const camPerm = await Camera.getCameraPermissionsAsync();
            const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            perm = camPerm.status === "granted" && galleryPerm.status === "granted" ? "granted" : "denied";
            break;

          case "gallery":
            await ImagePicker.getMediaLibraryPermissionsAsync().then((result) => (perm = result.status));
            break;

          default:
            await Location.getForegroundPermissionsAsync().then((result) => (perm = result.status));
            break;
        }
        if (perm === "granted") {
          navigation.goBack();
        }
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  //------------------------------------------------------------------------------------//
  //----------------------------------ANIMATION-----------------------------------------//
  //------------------------------------------------------------------------------------//
  //Effect to refresh the page and realignes every components when the screen rotation changes
  const [currentPage, setCurrentPage] = useState("Home");
  useEffect(() => {
    if (currentPage == "Drawer") ToDrawer();
  }, [width]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (currentPage == "Drawer") FromDrawer();
        else navigation.goBack();
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [currentPage])
  );

  //------------------------------DRAWER-----------------------------------//
  const drawerPosX = useRef(new Animated.Value(0)).current;
  function ToDrawer() {
    setCurrentPage("Drawer");
    Animate(drawerPosX, width, 400);
  }
  function FromDrawer() {
    setCurrentPage("Home");
    Animate(drawerPosX, 0, 400);
  }

  //------------------------------------------------------------------------//
  //-------------------------------Window-----------------------------------//
  //------------------------------------------------------------------------//
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require("../assets/images/background.png")} resizeMode="cover" style={[styles.background, { justifyContent: "center", alignItems: "center", width: "100%" }]}>
        <TouchableOpacity onPress={() => ToDrawer()} style={styles.backButton}>
          <Image source={require("../assets/images/drawerButton.png")} style={styles.backButtonImage} />
        </TouchableOpacity>

        <Text style={styles.permissionTitle}>{title}</Text>

        <TouchableOpacity style={styles.permissionButton} onPress={openAppSettings}>
          <Text style={styles.permissionButtonText}>{"settings"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.permissionButton} onPress={() => navigation.goBack()}>
          <Text style={styles.permissionButtonText}>{"back"}</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
}
