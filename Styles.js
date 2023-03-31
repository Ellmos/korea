import { StyleSheet } from "react-native";

export default StyleSheet.create({
  //-----------------------------Useful-----------------------------
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },

  absoluteContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: -1,
  },

  //-----------------------------Back Button-----------------------------
  backButtonImage: {
    width: 25,
    height: 25,
  },

  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },

  hitslop: {
    top: 10,
    left: 10,
    bottom: 10,
    right: 10,
  },

  //-----------------------------------------------------------------------//
  //-------------------------------All Screens-----------------------------//
  //-----------------------------------------------------------------------//
  title: {
    fontSize: 30,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    color: "white",
  },

  subTitle: {
    fontSize: 27,
    width: "100%",
    fontFamily: "Poppins-SemiBold",
    color: "white",
    textAlign: "center",
  },

  //-----------------------------------------------------------------------//
  //-----------------------------Home Screen-------------------------------//
  //-----------------------------------------------------------------------//
  homeButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  homeButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: "55%",
    maxWidth: 350,
    backgroundColor: "#4298fe",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 50,
  },

  homeButtonText: {
    fontSize: 25,
    fontFamily: "Poppins-SemiBold",
    color: "white",
    textAlign: "center",
  },

  //-----------------------------------------------------------------------//
  //-----------------------------Login Screen------------------------------//
  //-----------------------------------------------------------------------//
  loginContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  loginElement: {
    marginBottom: 20,
    width: "90%",
    maxWidth: 350,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  loginText: {
    paddingLeft: 5,
    fontSize: 15,
  },

  loginInput: {
    height: 40,
    width: "100%",
    fontSize: 16,
    backgroundColor: "#fbfafd",
    fontWeight: "500",
    borderRadius: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "grey",
  },

  passwordImage: {
    width: 30,
    height: 30,
  },

  checkBox: {
    color: "white",
  },

  loginButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: "80%",
    maxWidth: 300,
    backgroundColor: "#4298fe",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
  },

  loginButtonText: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },

  loginLinkerText: {
    fontSize: 13,
    fontWeight: "600",
    alignSelf: "flex-start",
    color: "#79837e",
    marginBottom: 15,
  },

  //-----------------------------------------------------------------------//
  //-----------------------------Signup Screen------------------------------//
  //-----------------------------------------------------------------------//
  signupElement: {
    marginBottom: 20,
    width: "80%",
    maxWidth: 350,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  signupText: {
    paddingLeft: 5,
    fontSize: 15,
  },

  signupInput: {
    height: 35,
    width: "100%",
    fontSize: 14,
    backgroundColor: "#fbfafd",
    fontWeight: "500",
    borderRadius: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "grey",
  },

  signupDropdownButton: {
    backgroundColor: "white",
    borderColor: "grey",

    width: "100%",
    height: 35,
    borderBottomWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 0,
  },

  signupDropdownText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
    textAlignVertical: "top",
    color: "black",
  },
  //-----------------------------------------------------------------------//
  //-------------------------Permission Screens----------------------------//
  //-----------------------------------------------------------------------//

  permissionTitle: {
    width: "90%",
    maxWidth: 500,
    color: "black",
    fontSize: 23,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 70,
  },

  permissionButton: {
    width: "55%",
    maxWidth: 300,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#4298fe",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    paddingVertical: 2,
  },

  permissionButtonText: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: "white",
    textAlign: "center",
  },

  //-----------------------------------------------------------------------//
  //-----------------------------Drawer Screen-----------------------------//
  //-----------------------------------------------------------------------//

  //------------------------Account-----------------------------

  accountButton: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    right: 0,
    maxWidth: 200,
    justifyContent: "center",
    alignItems: "center",
  },

  accountDropdown: {
    backgroundColor: "white",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 7,
  },

  accountDropdownItemText: {
    color: "black",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },

  logoutButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    textAlignVertical: "center",
  },

  //------------------------Items-----------------------------
  drawerLine: {
    borderColor: "grey",
    borderTopWidth: 1,
    width: "60%",
    marginVertical: 15,
  },

  drawerItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  drawerText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },

  drawerLink: {
    fontSize: 18,
    fontWeight: "500",
    color: "orange",
  },

  //------------------------Dropdown-----------------------------
  languageDropdownContainer: {
    flexDirection: "row",
    width: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  languageTitle: {
    color: "white",
    width: 118,
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
    marginRight: 10,
  },

  languageDropdownButton: {
    backgroundColor: "#222222",
    borderColor: "grey",
    width: "60%",
    height: 35,
    borderWidth: 1,
    borderRadius: 5,
  },

  languageDropdown: {
    backgroundColor: "#222222",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 15,
    color: "white",
  },

  languageDropdownItemText: {
    fontSize: 17,
    fontWeight: "500",
    color: "white",
  },

  languageDropdownIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
    top: 2,
  },

  //-----------------------------------------------------------------------//
  //------------------------Delete Account Screen--------------------------//
  //-----------------------------------------------------------------------//

  deleteContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: "70%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
  },

  deleteTitle: {
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    color: "black",
    marginBottom: 30,
  },

  deleteSubTitle: {
    width: "100%",
    maxWidth: 500,
    color: "black",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },

  deleteElement: {
    width: "80%",
    maxWidth: 350,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteText: {
    marginBottom: 5,
    alignSelf: "flex-start",
    fontWeight: "500",
  },

  deleteInput: {
    height: 40,
    width: "100%",
    fontSize: 15,
    backgroundColor: "#dddddd",
    fontWeight: "500",
    borderRadius: 7,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: 30,
  },

  deleteButton: {
    width: "55%",
    maxWidth: 300,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#c00000",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    paddingVertical: 2,
  },

  deleteBackButton: {
    width: "55%",
    maxWidth: 300,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#4298fe",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    paddingVertical: 2,
  },
});
