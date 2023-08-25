const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/', forwardAuthenticated, async (req, res) =>{
res.render('login',{});
});
router.get('/dashboard', ensureAuthenticated, async (req, res) =>{

    const [jobappn,metajoball] = await db.sequelize.query (`
    select subcategories.subcatname,count(appid) as count from jobapplications inner join subcategories 
    on jobapplications.subcategory = subcategories.subcatid
    group by subcategories.subcatname
 
    `)
    const [subscriber,submeta] = await db.sequelize.query (`
    select subcategories.subcatname,count(subcategories.id) as count from sendsmsmessages inner join subcategories 
    on sendsmsmessages.subcatname = subcategories.subcatid
    group by subcategories.subcatname
 
    `)
    const [applicant,appmeta] = await db.sequelize.query (`
    select subcategories.subcatname,count(applicantid) as count from applicants inner join subcategories 
    on applicants.subcategory = subcategories.subcatid
    group by subcategories.subcatname
 
    `)
    res.render('index',{user:req.user,jobappn:jobappn,subscriber:subscriber,applicant:applicant});
    });
              
                                
router.get('/login', forwardAuthenticated, async (req, res) =>{
res.render('login');
});

    
// Logout
router.get('/logout', (req, res) => {
req.logout();
req.flash('success_msg', 'You are logged out');
res.redirect('/login')

})

// Post Routers 
router.post('/login', (req, res, next) => {


passport.authenticate('local', {
successRedirect: '/dashboard',
failureRedirect: '/login',
failureFlash: true

})(req, res, next);
});
module.exports = router;