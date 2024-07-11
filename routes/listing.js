const express = require('express');
const router = express.Router({ mergeParams: true });
const asyncwrap = require("../utils/asyncwrap");
const { schema } = require("../utils/data_validate");
const ExpressError = require("../utils/ExpressError");
const listing = require("../model/listing/listing");
const { auth, authcheck } = require("../middleware/auth.js");
const listingCode = require("../controllers/listing.js");

const cloudinary = require('cloudinary').v2;
const multer  = require('multer')
const {storage} = require('../cloudconfig/cloudconfig.js');
const upload = multer({ storage })
const schemaValidate = async (req, res, next) => {
    const result = await schema.validate(req.body.listing);

    if (result.error) {
        next(new ExpressError(400, result.error.details[0].message));
    } else {
        next();
    }
};



// Root route - list all items
router.get("/", asyncwrap(listingCode.index));

router.route("/new")
.get(auth, asyncwrap(listingCode.createForm))
.post(
        upload.single('listing[image]'),schemaValidate, asyncwrap(listingCode.postNew)
     
    );

router.route("/:id/update")
.get(auth, asyncwrap(listingCode.updateForm))
.put(upload.single('listing[image]'),schemaValidate, authcheck, asyncwrap(listingCode.updateDatabase));

// Delete individual item
router.delete("/:id/delete", asyncwrap(listingCode.deleteItem));

// Show individual item
router.get("/:id", asyncwrap(listingCode.showIndividual));


module.exports = router;
