const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister ) //Gets register page
    .post(catchAsync(users.register)) //Create a new user


router.route('/login')
    .get(users.renderLogin) //Gets login page
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login); //Logs in user using passport then redirect usings users.login

//Logsout user
router.get('/logout', users.logout);

module.exports = router;

