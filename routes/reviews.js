const express = require('express');
const router = express.Router( { mergeParams: true } );
const catchAsync = require('../utils/catchAsync'); //Imports catchAsync error async error handling function
const Campground = require('../models/campground'); //Gets  camp grounds data structure from models
const Review = require('../models/review')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews');                          //Reviews controller





//Lets user create a review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))
 //Lets user delete a reiview
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

 module.exports = router;