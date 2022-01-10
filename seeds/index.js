//Populates database with data from cities and seedHelpers
const mongoose = require('mongoose');
const cities = require('./cities');                         //Imported array of cities
const { places, descriptors } = require('./seedHelpers');   //Imported places and descriptors
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then(() => {
    console.log("MongoDB database connected.");
}).catch(err => {
    console.log("MongoDB connection error")
    console.log(err)
})

const sample = array => array[Math.floor(Math.random() * array.length)];

//Fills data base with camps location {city, state} and the title of the campgrounds
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 400; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //TIM ID 
            author: '61d755ab4f46c51d8e8a11d2',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus ducimus atque enim eius tenetur voluptatum pariatur a aut voluptas, aperiam nobis, provident vitae, inventore necessitatibus optio! Iure delectus culpa dolore.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dqydftxkg/image/upload/v1641679983/YelpCamp/k0vppvisumfu4fdugrqr.jpg',
                    filename: 'YelpCamp/k0vppvisumfu4fdugrqr'
                },
                {
                    url: 'https://res.cloudinary.com/dqydftxkg/image/upload/v1641679983/YelpCamp/y7ih1wmqjlnhrxwqcmc2.jpg',
                    filename: 'YelpCamp/y7ih1wmqjlnhrxwqcmc2'
                },
                {
                    url: 'https://res.cloudinary.com/dqydftxkg/image/upload/v1641679988/YelpCamp/ldogzitq1awuv8plcbku.jpg',
                    filename: 'YelpCamp/ldogzitq1awuv8plcbku'
                },
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})




