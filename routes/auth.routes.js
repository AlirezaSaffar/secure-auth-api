const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: "Too many login attempts, please try again later",
});


router.post("/login", loginLimiter, authController.login);

router.post("/register", authController.register);
//router.post("/login", authController.login);

module.exports = router;
