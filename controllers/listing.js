const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing.js");
const mapToken = process.env.MAP_TOKEN; 
const geocodingClient = mbxGeocoding({accessToken: mapToken})
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings }); }

module.exports.renderNewForm = (req, res) => {  
    console.log(req.user)
    
    res.render("listings/new.ejs");
  }

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews" , populate: { path: "author", } ,}).populate("owner");
    if(!listing) { 
      req.flash("error" , "Listing you requested for does not exist !"); 
      res.redirect("/listings");
    } 
    console.log(listing)
    res.render("listings/show.ejs", { listing });
  }

// module.exports.createListing =async (req, res , next) => { 
//    let response = await geocodingClient 
//    .forwardGeocode({ 
//     query: req.body.listing.location,
//     limit: 1 ,
//    }) 
//    .send(); 
//     const newListing = new Listing(req.body.listing); 
//     newListing.owner = req.user._id; 

//     newListing.geometry = response.body.features[0].geometry;
    
//     let savedListing = await newListing.save(); 
//     console.log(savedListing)
//     req.flash("success" ,"New Listing Created ! ");
//     res.redirect("/listings");

//   } 

module.exports.createListing = async (req, res, next) => {
  try {
    const response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    if (!response || !response.body.features || response.body.features.length === 0) {
      // Handle the case where no geocoding result is found
      req.flash("error", "Location not found. Please provide a valid location.");
      return res.redirect("/listings/new");
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;

    const savedListing = await newListing.save();
    console.log(savedListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (error) {
    // Handle any errors that may occur during geocoding or listing creation
    console.error("Error creating listing:", error);
    req.flash("error", "Error creating listing. Please try again.");
    res.redirect("/listings/new");
  }
};


module.exports.renderEdit =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) { 
      req.flash("error" , "Listing you requested for does not exist !"); 
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => { 
    let { id } = req.params;  
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , "Lisitng Updated !")
    res.redirect(`/listings/${id}`);
  }

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing deleted")
    res.redirect("/listings");
  }