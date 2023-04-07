//const url = "https://korea.la-banquise.fr/";
const url = "http://192.168.200.181:8000/";

import { Alert } from "react-native";

export async function Sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const timeout = (prom, time, exception) => {
  let timer;
  return Promise.race([prom, new Promise((_r, rej) => (timer = setTimeout(rej, time, exception)))]).finally(() => clearTimeout(timer));
};

const handleRequest = async (url, method, body, headers = {}) => {
  var resp;

  if (method === "GET") {
    resp = await fetch(url, { method: method, mode: "cors", headers: headers });
  } else {
    resp = await fetch(url, { method: method, mode: "cors", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
  }

  const jsonResp = await resp.json();
  //console.log(jsonResp);
  return jsonResp;
};

//-------------------------------USERS---------------------------------//
export async function LoginRequest(username, password) {
  try {
    const request = handleRequest(url + "users/login", "POST", {
      username: username.toLowerCase().trim(),
      password: password,
    });

    const resp = await timeout(request, 5000, "timeout");
    if (!resp.success) {
      switch (resp.error) {
        case "WRONG_PASSWORD":
          Alert.alert("Login failed", "Incorrect password");
          break;
        case "UNKNOWN_USER":
          Alert.alert("This username does not exist", "Try your email");
          break;
        case "UNKNOWN_EMAIL":
          Alert.alert("This email does not exist", "Try your username");
          break;
        default:
          Alert.alert("An error occured", "Please try again");
          break;
      }
    }
    return resp;
  } catch (e) {
    throw e;
  }
}

export async function SignupRequest(username, password, email, CallbackFunction) {
  try {
    const request = handleRequest(url + "users/register", "POST", {
      username: username.toLowerCase().trim(),
      password: password,
      email: email.toLowerCase().trim(),
    });
    const resp = await timeout(request, 5000, "timeout");

    if (!request.success) {
      switch (resp.error) {
        case "USERNAME_TOO_SHORT":
          CallbackFunction("Invalid input", "Username should be at least 3 characters long", { username: "red" });
          break;
        case "USERNAME_TOO_LONG":
          CallbackFunction("Invalid input", "Username should be at most 30 characters long", { username: "red" });
          break;
        case "INVALID_USERNAME":
          CallbackFunction("Invalid input", "Username contains illegal characters", { username: "red" });
          break;
        case "LOGIN_CANT_BE_EMAIL":
          CallbackFunction("Invalid input", "Login can't be an email", { username: "red" });
          break;
        case "INVALID_EMAIL":
          CallbackFunction("Invalid input", "Email malformed", { mail: "red" });
          break;
        case "PASSWORD_TOO_SHORT":
          CallbackFunction("Invalid input", "Password should be at least 8 characters long", { password: "red", passwordConfirm: "red" });
          break;
        case "PASSWORD_TOO_LONG":
          CallbackFunction("Invalid input", "Password should be at most 100 characters long", { password: "red", passwordConfirm: "red" });
          break;
        case "USERNAME_ALREADY_TAKEN":
          CallbackFunction("Could not create account", "This username is already taken", { username: "red" });
          break;
        case "EMAIL_ALREADY_TAKEN":
          CallbackFunction("Could not create account", "This email is already taken", { mail: "red" });
          break;
        default:
          CallbackFunction("An error occured", "Please try again", {});
          break;
      }
    }

    return resp;
  } catch (e) {
    console.error(e);
  }
}

export async function DeleteUserRequest(username, password, token) {
  try {
    const request = handleRequest(`${url}users/delete?username=${username}&password=${password}`, "DELETE", {}, { Authorization: "Bearer " + token });

    const resp = await timeout(request, 5000, "timeout");

    if (!resp.success) {
      switch (resp.error) {
        case "WRONG_PASSWORD":
          Alert.alert("Wrong password", "Please verify your password");
          break;
        default:
          Alert.alert("Error", "An error has occured");
          break;
      }
    }

    return resp;
  } catch (e) {
    console.error(e);
  }
}

//-------------------------------WORDS---------------------------------//

export async function CreateWordRequest(word, translation, username, token, CallbackFunction) {
  try {
    const request = handleRequest(
      url + "app/words",
      "POST",
      {
        word: word.trim(),
        translation: translation.trim(),
        username: username.toLowerCase().trim(),
      },
      { Authorization: "Bearer " + token }
    );

    const resp = await timeout(request, 5000, "timeout");

    if (!resp.success) {
      switch (resp.error) {
        case "SESSION_EXPIRED":
          CallbackFunction("Session expired ", "Please login again", {});
          break;
        case "WORD_ALREADY_EXISTS":
          CallbackFunction("Word already exists", "This word and translation are already in your list!", { newWord: "red", newWordTranslation: "red" });
          break;
        case "ER_DATA_TOO_LONG":
          CallbackFunction("Word too long", "The words must be less than 255 characters", { newWord: "red", newWordTranslation: "red" });
          break;
        default:
          CallbackFunction("An error occured", "Please try again", {});
          break;
      }
    }
    return resp;
  } catch (e) {
    console.error(e);
  }
}

export async function GetWordsRequest(username, token, owner) {
  username = username.toLowerCase().trim();
  owner = owner ? owner.toLowerCase().trim() : username;

  try {
    const request = handleRequest(`${url}app/words?username=${username}&owner=${owner}`, "GET", {}, { Authorization: "Bearer " + token });

    const resp = await timeout(request, 5000, "timeout");
    return resp;
  } catch (e) {
    console.error(e);
  }
}
