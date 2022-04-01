const express = require("express");
const router = express.Router();

const controller = require("../controller/search");
const freeMiddleware = require('../middleware/free-middleware');


router.post("/search", freeMiddleware, controller.searchResults);



module.exports = router;