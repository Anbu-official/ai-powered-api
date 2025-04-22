require("dotenv").config();
const envValue = process.env;

const constant = {
  user: [{ username: "admin", password: "admin" }],
  signedKey: envValue.SIGNED_KEY,
  jwtKey: envValue.JWT_SECRET_KEY,
  aiKey: envValue.AI_SECRET_KEY,
  aiModel: envValue.AI_MODEL,
  prompt: `
  Analyze the following webpage content and provide three things:
  
  1. Extracted Content: A cleaned and concise version of the main content.
  2. Summary: A short summary in 2–3 sentences.
  3. Key Points: A list of minimum 3 key points as an array of strings.
  
  Please return your response in the following **exact Array of Objects** format:
  [{
    Extracted Content: {string},
    Summary: {string},
    Key Points: [string, string]
  }]
  `,
  somethingWrong: "Something went wrong, Try again later.",
};

module.exports = constant;
