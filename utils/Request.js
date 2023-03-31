//const url = "https://korea.la-banquise.fr/";
const url = "http://192.168.113.191:8000/";

export async function Sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const timeout = (prom, time, exception) => {
  let timer;
  return Promise.race([prom, new Promise((_r, rej) => (timer = setTimeout(rej, time, exception)))]).finally(() => clearTimeout(timer));
};

const handleRequest = async (url, method, body, headers = {}) => {
  const resp = await fetch(url, {
    method: method,
    mode: "cors",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

  const jsonResp = await resp.json();
  console.log(jsonResp);
  return jsonResp;
};

export async function LoginRequest(username, password) {
  try {
    const request = handleRequest(url + "auth/login", "POST", {
      username: username.toLowerCase().trim(),
      password: password,
    });

    const resp = await timeout(request, 5000, "timeout");
    return resp;
  } catch (e) {
    throw e;
  }
}

export async function SignupRequest(username, password, email) {
  try {
    const request = handleRequest(url + "auth/register", "POST", {
      username: username.toLowerCase().trim(),
      password: password,
      email: email.toLowerCase().trim(),
    });

    const resp = await timeout(request, 5000, "timeout");
    return resp;
  } catch (e) {
    throw e;
  }
}

export async function CreateWordRequest(word, translation, username, token) {
  try {
    const request = handleRequest(
      url + "app/createword",
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
    throw e;
  }
}
