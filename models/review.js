const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Reviews data blue print 
//One to many data as a campground could have many reviews
const reviewSchema = new Schema({
    body: String, 
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Review', reviewSchema);

