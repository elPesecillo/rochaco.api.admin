const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

//routes
const apiRoutes = require("./apiRoutes");

router.use("/api/*", auth.checkApiAuth);
router.all("/api/*", apiRoutes);

module.exports = router;
