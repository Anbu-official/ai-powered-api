const express = require("express");
const authenticate = require("./auth");
const { login, logout, extract } = require("./controller");

const router = express.Router();

router.post("/login", login);
router.get("/logout", authenticate, logout);
router.post("/extract", authenticate, extract);

module.exports = router;
