async function Login() {
    const username = document.getElementById("usernameLogin").value;
    const password = document.getElementById("passwordLogin").value;

    /*  const resp = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            mode: "no-cors",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });
    */
        try {
            const resp = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    mode: "no-cors",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const jsonResp = await resp.json();
            console.log(jsonResp);
            if (jsonResp.success){
                //document.location.href = "http://localhost:8000/";
                document.getElementById("currentUser").innerText = username;
                document.getElementById("token").innerText = jsonResp.token;
            } 
            else{
                document.getElementById("passwordLogin").value = "";
                alert("Error loging in:\n" + jsonResp.error);
            }
        } catch (err){
            console.log(err);
            return err;
        }
}


async function CreateUser() {
    const username = document.getElementById("usernameSignup").value;
    const email = document.getElementById("emailSignup").value;
    const password = document.getElementById("passwordSignup").value;

    const resp = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            mode: "no-cors",
        },
        body: JSON.stringify({
            username: username,
            password: password,
            email: email,
        }),
    });

    const jsonResp = await resp.json();
    console.log(jsonResp);
    if (jsonResp.success){
        document.getElementById("usernameSignup").value = "";
        document.getElementById("passwordSignup").value = "";
        document.getElementById("emailSignup").value = "";
        document.getElementById("currentUser").innerText = username;
        document.getElementById("token").innerText = jsonResp.token;
    } 
    alert(jsonResp.success ? "User successfully created" : "Error creating a user:\n" + jsonResp.error);
}


async function ValidateToken() {
    const username = document.getElementById("currentUser").innerText;
    const token = document.getElementById("token").innerText;

    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIzNCIsImlhdCI6MTY3OTkwMDg0OCwiZXhwIjoxNjgwNTA1NjQ4fQ.ebBE-e09PRf_Yg_mW5SXQUCFG8Nxlm98w6cKs98z8SQ"

    const resp = await fetch("http://localhost:8000/auth/validate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + token,
            mode: "no-cors",
        },
        body: JSON.stringify({ username: username }),
    });

    const jsonResp = await resp.json();
    if (resp.status == 403)
        alert("Error checking token\n" + jsonResp.error);
    else
        alert(jsonResp.success ? "Token is valid" : "Token is invalid");
}
