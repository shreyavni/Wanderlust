const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn,isOwner,validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, validateListing,upload.single("listing[image][url]"),
        wrapAsync(listingController.create));
    


//New Route
router.get("/new", isLoggedIn, listingController.new);


router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn, isOwner, upload.single("listing[image][url]"), validateListing,
        wrapAsync(listingController.update))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.delete))

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, isLoggedIn,
    wrapAsync(listingController.edit))


module.exports=router;