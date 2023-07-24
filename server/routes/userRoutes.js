const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const AppError = require("../utils/AppError");
const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => { if (err) return next(err); })
        res.send('User created with success')
    } catch (err) {
        return next(new AppError('Username with this e-mail already exist', 500))
    }
})

router.post('/login', passport.authenticate('local', { keepSessionInfo: true }), (req, res, next) => {
    try {
        res.send(req.user)
    } catch (err) {
        return next(new AppError('Username or password wrong', 500))
    }
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.send('User logout')
    });
})

router.get('/getuser', (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.send('Is need to be signin')
    } else {
        res.send(req.user)
    }
})



module.exports = router