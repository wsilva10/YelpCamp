const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync'); //Imports catchAsync error async error handling function
const Campground = require('../models/campground'); //Gets  camp grounds data structure from models
const {isLoggedIn , isAuthor, validateCampground }= require('../middleware')
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.index)) //Gets campground Index
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)) //Create a new campground
  
//Create a New Campground Page
router.get('/new', isLoggedIn, campgrounds.renderNewForm)


router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))  //Shows an individual campground
    .put(isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground)) //Update campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))  //Lets you delete a campground



//Shows an edit page of a campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))









module.exports = router;