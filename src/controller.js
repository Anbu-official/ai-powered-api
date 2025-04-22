const cheerio = require("cheerio");
const jwt = require("jsonwebtoken");
const { ChatGroq } = require("@langchain/groq");
const { HumanMessage } = require("@langchain/core/messages");
const {
  aiKey,
  aiModel,
  prompt,
  user,
  jwtKey,
  somethingWrong,
} = require("./constant");
const { default: axios } = require("axios");
const puppeteer = require("puppeteer");

const chat = new ChatGroq({
  apiKey: aiKey,
  model: aiModel,
});

async function fetchHTML(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const content = await page.content();
  await browser.close();
  return content;
}

const jwtToken = async (res) => {
  const payload = {
    userid: 1,
    appName: "Ai-powered",
  };
  const token = jwt.sign(payload, jwtKey, { expiresIn: "10h" });
  return token;
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const validUser = user.find(
      (x) => x.username === username && x.password === password
    );
    if (validUser) {
      const token = await jwtToken(res);
      res
        .cookie("jwt-token", token, {
          httpOnly: true,
          sameSite: "Lax",
          secure: false,
          maxAge: 3600000,
        })
        .send({ message: "Login Successfully" });
    } else {
      res.status(401).send({ message: "Please check you credentials." });
    }
  } catch (error) {
    res.status(400).send({ message: somethingWrong, error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {});
    res.json({ message: "Logout successfully" });
  } catch (error) {
    res.status(400).send({ message: somethingWrong });
  }
};

const extract = async (req, res) => {
  const { url, keySearch } = req.body;
  if (!url) return res.status(400).json({ message: "URL is required" });

  try {
    let htmlContent = "";
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
          Accept: "text/html",
        },
      });
      htmlContent = response.data;
    } catch {
      htmlContent = await fetchHTML(url);
    }
    console.log(htmlContent);
    const $ = cheerio.load(htmlContent);
    $("script, style, nav, footer, header").remove();
    const bodyText = $("body").text();
    const cleanText = bodyText.replace(/\s+/g, " ").trim();

    const result = await chat.invoke([
      new HumanMessage(
        `
        ${
          keySearch
            ? `The user is specifically interested in the topic: **"${keySearch}"** `
            : ""
        }
        Here is the content from a webpage:\n\n"${cleanText}, \n\n '` +
          prompt +
          " ' "
      ),
    ]);
    let values = [];
    try {
      console.log("1");
      values = JSON.parse(result.text);
    } catch {
      console.log("2");
      values = result.text;
    }
    res.status(200).send({ result: values });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: somethingWrong, error: error.message });
  }
};

module.exports = {
  login,
  logout,
  extract,
};
