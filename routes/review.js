const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const controller = require("../controller/review");


// 리뷰등록
router.post("/detail/:postId/link", authMiddleware, controller.createReview);
// 리뷰삭제
router.delete("/review/delete", authMiddleware, controller.deleteReview)


module.exports = router;
