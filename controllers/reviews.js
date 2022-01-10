const Campground = require('../models/campground'); //Gets  camp grounds data structure from models
const Review = require('../models/review')

module.exports.createReview = async(req,res) => {
    console.log(req.params)
    const campground = await Campground.findById(req.params.id);     //Gets campground
    const review = new Review(req.body.review);                      //Creates a new review
    review.author = req.user._id;
    campground.reviews.push(review);   
    await review.save();                                             //Pushes review intro reviews array in the campground
    await campground.save();
    req.flash('success', 'Created a new review!')         //Flashes this message
    res.redirect(`/campgrounds/${campground._id}`);
 
 }

 module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')         //Flashes this message
    res.redirect(`/campgrounds/${id}`);
}