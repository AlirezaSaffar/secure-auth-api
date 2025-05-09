const express = require("express");
const router = express.Router();
const controller = require("../controllers/sensitiveData.controller");
const authenticate = require("../middleware/auth.middleware");

router.post("/data", authenticate, controller.saveData);
router.get("/data", authenticate, controller.getData);

module.exports = router;
