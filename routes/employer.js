const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/createnewemployer', ensureAuthenticated, async (req, res) =>{
     const category = await db.Category.findAll({})

    res.render('createnewemployer',{user:req.user,category:category});
    });
router.post('/createnewemployer', ensureAuthenticated, async (req, res) =>{
    const {companyname,email,phonenumber,contactperson,address,businesssector} =req.body;
    const category = await db.Category.findAll({})
    if(!companyname ||!email||!phonenumber||!contactperson||!address||!businesssector){
        res.render('createnewemployer',{error_msg:'Error please enter all required fields',user:req.user,category:category});
    
    }else{
        const empData ={
            employerid:uuidv4(),
            companyname: companyname,
            email:email,
            contactperson: contactperson,
          
            address: address,
            phonenumber:phonenumber,
            businesssector: businesssector,
        }
        db.Employer.findOne({where:{companyname:companyname}}).then(emp =>{
          if(emp){
            res.render('createnewemployer',{error_msg:'Error company already registered',user:req.user,category:category});
   
          }else{
        db.Employer.create(empData).then(empdt =>{
            res.render('createnewemployer',{success_msg:'Successfully create company info',user:req.user,category:category});
        }).catch(err =>{
            res.render('createnewemployer',{error_msg:'Error while creating company info',user:req.user,category:category});
        })
          }
        }).catch(err =>{
            console.log(err)
            res.render('createnewemployer',{error_msg:'Error while finding existing company info',user:req.user,category:category});
        })
    }

});

router.get('/allemployerlist', ensureAuthenticated, async (req, res) =>{
    const [employerlist,metanewjob] = await db.sequelize.query(`
    select * from employers
 
     `);
res.render('allemployerlist',{user:req.user,employerlist:employerlist});
});
        
              

module.exports = router;