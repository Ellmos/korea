require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("./db");

const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use("/", express.static("public"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile("./public/index.html");
});

//-------------------------------Function YAS---------------------------------//

function generateAccessToken(username, id) {
  return jwt.sign({ username, id }, process.env.TOKEN_SECRET, { expiresIn: "7d" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, tokenData) => {
    if (err) {
      if (err.message == "jwt expired") return res.status(403).send({ success: false, error: "JWT_EXPIRED" });
      else return res.status(403).send({ success: false, error: "TOKEN_ERROR" });
    }

    if (req.method == "POST" && req.body.username != tokenData.username) return res.status(403).send({ success: false, error: "INVALID_USER" });
    else if (req.method == "GET" && req.query.username != tokenData.username) return res.status(403).send({ success: false, error: "INVALID_USER" });

    req.tokenData = tokenData;
    next();
  });
}

function ParseWords(words) {
  for (let i = 0; i < words.length; i++) {
    words[i].word = decodeURI(words[i].word);
    words[i].translation = decodeURI(words[i].translation);
  }
  return words;
}

//-----------------------------------USERS------------------------------------------//
app.post("/users/login", async (req, res) => {
  const body = req.body;

  let conn;
  try {
    conn = await pool.getConnection();
    const isMail = body.username.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/);
    var query = await conn.query(`SELECT * FROM users WHERE ${isMail ? "email" : "username"} = '${body.username}';`);
    if (query.length < 1) throw { code: isMail ? "UNKNOWN_EMAIL" : "UNKNOWN_USER" };

    const match = await bcrypt.compare(body.password, query[0].password);
    if (!match) throw { code: "WRONG_PASSWORD" };
    const token = generateAccessToken(query[0].username, query[0].id);

    query = await conn.query(`SELECT word, translation FROM words WHERE ownerID = '${query[0].id}';`);

    res.status(200).send({ success: true, token: token, words: ParseWords(query) });
  } catch (err) {
    console.error(err);
    res.status(409).send({ success: false, error: err.code });
  } finally {
    if (conn) return conn.release();
  }
});

app.post("/users/register", async (req, res) => {
  const body = req.body;

  let conn;
  try {
    conn = await pool.getConnection();

    //Checking the inputs in backend to prevent spamming
    if (body.username.length < 3) {
      throw { code: "USERNAME_TOO_SHORT" };
    } else if (body.username.length > 30) {
      throw { code: "USERNAME_TOO_LONG" };
    } else if (!body.username.match(/^(?=.{3,24}$)[a-zA-Z0-9._\-\@]+$/)) {
      throw { code: "INVALID_USERNAME" };
    } else if (body.username.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/)) {
      throw { code: "LOGIN_CANT_BE_MAIL" };
    } else if (!body.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/)) {
      throw { code: "INVALID_EMAIL" };
    } else if (body.password.length < 8) {
      throw { code: "PASSWORD_TOO_SHORT" };
    } else if (body.password.length > 100) {
      throw { code: "PASSWORD_TOO_LONG" };
    }

    //Check for duplicate entry
    var query = await conn.query(`SELECT username FROM users WHERE username = '${body.username}';`);
    if (query.length > 0) throw { code: "USERNAME_ALREADY_TAKEN" };

    query = await conn.query(`SELECT email FROM users WHERE email = '${body.email}';`);
    if (query.length > 0) throw { code: "EMAIL_ALREADY_TAKEN" };

    //Creating user
    const hash = await bcrypt.hash(body.password, 15);
    query = await conn.query(`INSERT INTO users(username, password, email) VALUES ('${body.username}', '${hash}', '${body.email}');`);
    query = await conn.query(`SELECT id FROM users WHERE username = '${body.username}';`);
    res.status(200).send({ success: true, token: generateAccessToken(body.username, query[0].id) });
  } catch (err) {
    console.error(err);
    res.status(409).send({ success: false, error: err.code });
  } finally {
    if (conn) return conn.release();
  }
});

app.delete("/users/delete", authenticateToken, async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    var query = await conn.query(`SELECT * FROM users WHERE username = '${req.query.username}';`);
    if (query.length < 1) throw { code: "UNKNOWN_USER" };

    const match = await bcrypt.compare(req.query.password, query[0].password);
    if (!match) throw { code: "WRONG_PASSWORD" };

    query = await conn.query(`DELETE FROM words WHERE ownerID = '${req.tokenData.id}';`);
    query = await conn.query(`DELETE FROM users WHERE username = '${req.query.username}';`);
    res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(409).send({ success: false, error: err.code });
  } finally {
    if (conn) return conn.release();
  }
});

app.post("/users/validate", authenticateToken, (req, res) => {
  res.status(200).send({ success: true });
});

//-----------------------------------APP------------------------------------------//

app.post("/app/words", authenticateToken, async (req, res) => {
  const body = req.body;

  const word = encodeURI(body.word).replaceAll("'", "''");
  const translation = encodeURI(body.translation).replaceAll("'", "''");

  let conn;
  try {
    conn = await pool.getConnection();
    var query = await conn.query(`SELECT id FROM users WHERE username = '${req.tokenData.username}';`);
    const id = query[0].id;

    query = await conn.query(`SELECT * FROM words WHERE word = '${word}' AND translation = '${translation}' AND ownerID = '${id}';`);
    if (query.length > 0) throw { code: "WORD_ALREADY_EXISTS" };

    query = await conn.query(`INSERT INTO words VALUES ('${id}', '${word}', '${translation}');`);
    res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(409).send({ success: false, error: err.code });
  } finally {
    if (conn) return conn.release();
  }
});

app.get("/app/words", authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = await conn.query(`SELECT word, translation FROM words WHERE ownerID = (SELECT id FROM users WHERE username = '${req.query.owner}');`);

    res.status(200).send({ success: true, words: ParseWords(query) });
  } catch (err) {
    console.error(err);
    res.status(409).send({ success: false, error: err.code });
  } finally {
    if (conn) return conn.release();
  }
});

app.delete("/app/words", authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = await conn.query(`DELETE FROM words WHERE word = '${req.query.word}' AND translation = '${req.translation}' AND ownerID = '${req.tokenData.id}';`);

    res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(409).send({ success: false, error: err.code });
  } finally {
    if (conn) return conn.release();
  }
});

app.get("/app/users", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = await conn.query(`SELECT * FROM words WHERE ownerID = '${req.tokenData.id}';`);

    res.status(200).send({ success: true, words: query });
  } catch (err) {
    console.error(err);
    res.status(409).send({ success: false, error: err.code });
  } finally {
    if (conn) return conn.release();
  }
});

app.get("/app/users", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = await conn.query(`SELECT username FROM users WHERE username = '${query.username}';`);

    res.status(200).send({ success: true, user: query });
  } catch (err) {
    console.error(err);
    res.status(409).send({ success: false, error: err.code });
  } finally {
    if (conn) return conn.release();
  }
});

//-----------------------------------SERVER------------------------------------------//

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
