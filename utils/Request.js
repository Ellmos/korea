//const url = "https://korea.la-banquise.fr/";
const url = "http://192.168.200.181:8000/";

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
    resp = await fetch(url, {
      method: method,
      mode: "cors",
      headers: headers,
    });
  } else {
    resp = await fetch(url, {
      method: method,
      mode: "cors",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
  }

  const jsonResp = await resp.json();
  console.log(jsonResp);
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
    return resp;
  } catch (e) {
    console.error(e);
  }
}

export async function SignupRequest(username, password, email) {
  try {
    const request = handleRequest(url + "users/register", "POST", {
      username: username.toLowerCase().trim(),
      password: password,
      email: email.toLowerCase().trim(),
    });

    const resp = await timeout(request, 5000, "timeout");
    return resp;
  } catch (e) {
    console.error(e);
  }
}

export async function DeleteUserRequest(username, password, token) {
  try {
    const request = handleRequest(`${url}users/delete?username=${username}&password=${password}`, "DELETE", {}, { Authorization: "Bearer " + token });

    const resp = await timeout(request, 5000, "timeout");
    return resp;
  } catch (e) {
    console.error(e);
  }
}

//-------------------------------WORDS---------------------------------//

export async function CreateWordRequest(word, translation, username, token) {
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
    return resp;
  } catch (e) {
    console.error(e);
  }
}

export async function GetWordRequest(username, token) {
  try {
    const request = handleRequest(`${url}app/words?username=${username}`, "GET", {}, { Authorization: "Bearer " + token });

    const resp = await timeout(request, 5000, "timeout");
    return resp;
  } catch (e) {
    console.error(e);
  }
}
