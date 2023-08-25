const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/applicantreport', ensureAuthenticated, async (req, res) =>{
    
res.render('applicantreport',{user:req.user});
});
router.get('/newsreport', ensureAuthenticated, async (req, res) =>{

res.render('newsreport',{user:req.user});
});
router.get('/jobreport', ensureAuthenticated, async (req, res) =>{

    res.render('jobreport',{user:req.user});
    });
    
    router.get('/jobapplication', ensureAuthenticated, async (req, res) =>{

        res.render('jobapplication',{user:req.user});
        });
        router.get('/adsreport', ensureAuthenticated, async (req, res) =>{

            res.render('adsreport',{user:req.user});
            }); 

module.exports = router;