const express = require("express");
const router = express.Router();

// import routers
const getData = require('./router/getData')

// create routers
router.get('/', getData)

module.exports = router;