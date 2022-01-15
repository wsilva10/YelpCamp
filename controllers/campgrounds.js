const Campground = require('../models/campground'); //Gets  camp grounds data structure from models
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);                             //Creates new campground
    campground.geometry = geoData.body.features[0].geometry;                            //Gets coordinates from location
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));     //Gets the image 
    campground.author = req.user._id;                                                   //Gets author name 
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.showCampground = async (req,res) =>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews', 
        populate: { //Shows review author
            path: 'author'
        }
    }).populate('author'); //Shows campground author
    if(!campground){
        req.flash('error',"Campground not found.")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}


module.exports.renderEditForm = async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error',"Campground not found.")
        return res.redirect('/campgrounds')
    }
  
    res.render('campgrounds/edit', { campground });
}

//Update Campground
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await campground.save()
    req.flash('success', 'Successfully updated campground!')         //Flashes this message
    res.redirect(`/campgrounds/${campground._id}`)
}

//Delete campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;                                          //Gets id from request
    await Campground.findByIdAndDelete(id);                             //Finds id in campgrounds database and deletes
    req.flash('success', 'Successfully deleted a campground.')         //Flashes this message
    res.redirect('/campgrounds')
}