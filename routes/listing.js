const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middlewares.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const { uploadToCloudinary } = require('../cloudConfig.js');
const upload = multer({ storage: multer.memoryStorage() });

router.route("/")
        .get(wrapAsync(listingController.index))
        .post(isLoggedIn, validateListing, upload.single("listing[image]"),
                uploadToCloudinary, wrapAsync(listingController.create));



//New Route
router.get("/new", isLoggedIn, listingController.new);


router.route("/:id")
        .get(wrapAsync(listingController.show))
        .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing,
                uploadToCloudinary, wrapAsync(listingController.update))
        .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete))

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, isLoggedIn,
        wrapAsync(listingController.edit))


module.exports = router;