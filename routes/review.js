const express = require("express");
const multer = require('multer');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { validateReview, isLoggedIn, isAuthor } = require('../middlewares.js');
const reviewController = require("../controllers/reviews.js")
const { uploadToCloudinary } = require('../cloudConfig.js');
const upload = multer({ storage: multer.memoryStorage() });

//Review Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

//Delete review route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router;