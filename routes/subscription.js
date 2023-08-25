const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/sendmemessagelist', ensureAuthenticated, async (req, res) =>{

    const [smsmsg ,smsmsgmeta] = await db.sequelize.query(`
    select * from sendsmsmessages inner join subcategories on
    sendsmsmessages.subcatname = subcategories.subcatid
    `)
    res.render('sendmemessagelist',{smsmsg:smsmsg,user:req.user});
});
router.get('/contactuslist', ensureAuthenticated, async (req, res) =>{
    db.ContactUs.findAll({}).then(contactus =>{
        res.render('contactuslist',{contactus:contactus,user:req.user});
    }).catch(err =>{
        res.render('contactuslist',{contactus:'',user:req.user});
    })
 });
              

module.exports = router;