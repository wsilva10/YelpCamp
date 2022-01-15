if(process.env.NODE_ENV !== 'production'){      //Checks if in development  
   require('dotenv').config();                 //Gets variables from .env         
}

const express = require ('express');        //Imports express
const app = express();                      //Use of express 
const path = require('path');               //Pathing
const mongoose = require('mongoose');       //Imports mongoose 
const ejsMate = require('ejs-mate');        //Use of ejs in html
const session = require('express-session');
const ExpressError = require('./utils/ExpressError'); //Imports express error handling class
const methodOverride = require('method-override');  //Imports method override
const flash = require('connect-flash');             //Imports flash. Ex: Review Successfully made show on page. Disappears after refresh.
const passport = require('passport');               //Passport for authentication
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const { initialize } = require('passport');
const mongoSanitize = require('express-mongo-sanitize');        //Protects against mongo injection
const helmet = require("helmet");
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';   

// process.env.DB_URL                                //Mongo atlas database
//'mongodb://127.0.0.1:27017/yelp-camp'              //Local mongoDB database

const MongoStore = require('connect-mongo');








mongoose.connect(dbUrl)   //Connects to MongoDB database 
.then(()=> {                                              //Connection to mongodb succeed 
    console.log("MongoDB connected.")
}).catch(err => {                                         //Connection to mongodb failed
console.log("ERROR: MongoDB not connected")
console.log(err)
})
 
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');                       //ejs used as views engine 
app.set('views', path.join(__dirname, 'views'))      //looks into views folders for templates


///////////////Middleware//////////////
app.use(express.urlencoded({extended: true}))   //Parses body of request
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on("error", function(e){
    console.log("STORE ERROR")
})


const sessionConfig = {
    store,
    name:'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,      //expiration of cookie. ms seconds minutes hours days week
        maxAge: 1000 * 60 * 60 * 24 * 7                     //max age if cookie a week 
    }
}
app.use(session(sessionConfig));
app.use(flash());
//app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dqydftxkg/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dqydftxkg/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dqydftxkg/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dqydftxkg/" ];
 
app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dqydftxkg/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/"
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/dqydftxkg/" ],
            childSrc   : [ "blob:" ]
        }
    })
);



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));       //Passport uses localstrategy to use authenticate in User model

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
////Middleware//////////////


app.get('/fakeUser', async(req,res) =>{
    const user = new User({ email: 'will@gmail.com', username: 'will34'});
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})

 //Routes
 app.use('/', userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


//Gets home page of yelp camp
app.get('/', (req,res) => {
    res.render('home.ejs')
})


//Runs if a page isnt found for any type of HTTP request
app.all('*',(req,res, next) =>{
    next(new ExpressError('Page Not Found', 404))
})


//Catches errors 
app.use((err,req,res,next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(statusCode).render('error.ejs', { err })
})


const port = process.env.PORT || 3000;

//Server listens for requests on port 
//Print statement in terminal to indicate server is listening 
app.listen(port,() => {
    console.log(`Serving on port ${port}`);
})