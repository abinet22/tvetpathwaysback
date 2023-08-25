const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/newjobapplications', ensureAuthenticated, async (req, res) =>{
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [newjobapp,metanewjob] = await db.sequelize.query(`
   select * from jobapplications inner join joblists on
   jobapplications.jobid = joblists.jobid 

    `);

    res.render('newjobapplications',{user:req.user,newjobapp:newjobapp});
    });
router.get('/filterapplicationcvs', ensureAuthenticated, async (req, res) =>{
    const [newjobapp,metanewjob] = await db.sequelize.query(`
    select * from jobapplications inner join joblists on
    jobapplications.jobid = joblists.jobid 
 
     `);
res.render('filterapplicationcvs',{user:req.user,newjobapp:newjobapp});
});

router.get('/alljobapplications', ensureAuthenticated, async (req, res) =>{
    const [newjobapp,metanewjob] = await db.sequelize.query(`
    select * from jobapplications inner join joblists on
    jobapplications.jobid = joblists.jobid 
 
     `);
res.render('alljobapplications',{user:req.user,newjobapp:newjobapp});
});
        
              

module.exports = router;