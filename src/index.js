const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routers = require("./route");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({ origin: "https://ai-powered-ui.vercel.app", credentials: true })
);
app.use(express.json());
app.use(cookieParser());

app.use("/v1", routers);

app.listen(PORT, () => {
  console.log("Server running successfully in" + PORT);
});
