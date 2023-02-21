const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/refresh-controller");

router.get('/', refreshTokenController);

module.exports = router;