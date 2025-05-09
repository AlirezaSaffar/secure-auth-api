const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const PEPPER = process.env.PEPPER;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h"; 

const hashPassword = async (password, salt) => {
  return bcrypt.hash(password + salt + PEPPER, 10);  
};

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = await hashPassword(password, salt);

    await User.create({ username, passwordHash, salt });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { username } });
      
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      if (user.accountLocked) {
        return res.status(403).json({ message: "Your account is locked due to multiple failed login attempts" });
      }
  
      //const inputHash = await hashPassword(password, user.salt); 
      const isMatch = await bcrypt.compare(password + user.salt + PEPPER, user.passwordHash);

      if (!isMatch) {
        user.failedLoginAttempts += 1;
  
        if (user.failedLoginAttempts >= 5) {
          user.accountLocked = true;
        }
  
        await user.save();
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      user.failedLoginAttempts = 0;
      user.accountLocked = false;
      await user.save();
  
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      return res.status(200).json({ token });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

