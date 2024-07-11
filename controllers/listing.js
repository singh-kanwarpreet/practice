const listing = require("../model/listing/listing");

module.exports.index = async (req, res) => {
    const data = await listing.find();
    res.render("listing/listing.ejs", { data });
}

module.exports.createForm = (req, res) => res.render("listing/create_new.ejs");

module.exports.postNew = async (req, res, next) => {
    const data = req.body.listing;
    data.image = {filename:req.file.filename,url:req.file.path}
    const re = new listing({ ...data, owner: req.user._id });
    await re.save();
    req.flash("success", "New Listing Added");
    res.redirect("/listing");
}

module.exports.updateDatabase = async (req, res) => {
    const { id } = req.params;
    const up = req.body.listing;
    let data = await listing.findByIdAndUpdate(id, { ...up });
    if (typeof req.file  !== "undefined") {
        data.image = {filename:req.file.filename,url:req.file.path}
    await data.save();
    }


    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
}

module.exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listing");
}

module.exports.showIndividual = async (req, res) => {
    const { id } = req.params;
    const data = await listing.findById(id)
        .populate({
            path: "review",
            populate: {
                path: "owner"
            }
        })
        .populate('owner');
    if (!data) {
        req.flash("error", "Listing you requested does not exist");
        res.redirect("/listing");
    } else {
        res.render("listing/individual_listing.ejs", { data });
    }
}

module.exports.updateForm = async (req, res) => {
    const { id } = req.params;
    const data = await listing.findById(id);
    
    if (!data) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listing");
    } else {
        let updatedurl = data.image.url
        updatedurl = updatedurl.replace("/upload","/upload/w_300,h_250/")
        res.render("listing/update_listing.ejs", { data,updatedurl });
    }
}
