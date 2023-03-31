import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, SafeAreaView, ImageBackground } from "react-native";

import * as SecureStore from "expo-secure-store";
import { CommonActions } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import * as WebBrowser from "expo-web-browser";

import styles from "../Styles.js";

export default function DrawerScreen({ route, navigation }) {
  const isLearn = route.params.origin == "Learn";

  const [username, setUsername] = useState(null);
  useEffect(() => {
    const getUsername = async () => {
      try {
        const username = await SecureStore.getItemAsync("username");
        setUsername(username);
      } catch (e) {
        throw e;
      }
    };
    if (isLearn) getUsername();
  }, []);

  const LogOut = () => {
    try {
      SecureStore.deleteItemAsync("password");
      SecureStore.deleteItemAsync("token");
      SecureStore.deleteItemAsync("form");
    } catch (e) {
      throw e;
    }
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "Home" }] }));
  };

  //------------------------------------------------------------------------------------//
  //------------------------------------WINDOW------------------------------------------//
  //------------------------------------------------------------------------------------//

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#222222" }]}>
      <TouchableOpacity style={[styles.backButton, { zIndex: 1 }]} onPress={() => navigation.goBack()} hitSlop={styles.hitslop}>
        <Image source={require("../assets/images/closeDrawer.png")} style={styles.backButtonImage} />
      </TouchableOpacity>

      {isLearn && (
        <SelectDropdown
          buttonStyle={styles.accountButton}
          dropdownStyle={styles.accountDropdown}
          rowTextStyle={styles.accountDropdownItemText}
          dropdownOverlayColor="#44444470"
          data={["Account", "Log out", "Delete account"]}
          renderCustomizedButtonChild={() => {
            return (
              <View style={{ width: "100%", justifyContent: "flex-end", alignItems: "center", flexDirection: "row" }}>
                <Text style={styles.logoutButtonText}>{username}</Text>
                <Image source={require("../assets/images/user.png")} style={{ marginLeft: 3, width: 40, height: 40 }} />
              </View>
            );
          }}
          onSelect={(_, index) => {
            if (index == 0) WebBrowser.openBrowserAsync("https://sharedfolder.dynedoc.fr/wordpress/index.php/compte/" + username);
            else if (index == 1) LogOut();
            else navigation.navigate("DeleteAccount", { username: username });
          }}
          buttonTextAfterSelection={(selectedItem) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />
      )}

      <View style={[styles.container, { zIndex: -1 }]}>
        <View style={[styles.container, { flex: 0, height: "40%" }]}>
          <Text style={[styles.title, { color: "white" }]}>Bonzoir</Text>
        </View>
        <View style={[styles.container, { flex: 0, height: "30%", justifyContent: "flex-start" }]}>
          <View style={styles.drawerItem}>
            <Text style={styles.drawerText}>Visit the </Text>
            <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync("https://korea.la-banquise.fr")}>
              <Text style={styles.drawerLink}>Website</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
