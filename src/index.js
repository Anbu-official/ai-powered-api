const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routers = require("./route");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true,
    methods: "GET,PUT,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/v1", routers);

app.get("/", (req, res) => {
  res.status(200).send({ message: "Success" });
});

app.listen(PORT, () => {
  console.log("Server running successfully in" + PORT);
});
