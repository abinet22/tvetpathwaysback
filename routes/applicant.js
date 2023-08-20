const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/createapplicant', ensureAuthenticated, async (req, res) =>{
    const jobmaincategory = await db.Category.findAll({})
    const jobsubcategory  = await db.Subcategory.findAll({})
res.render('createapplicant',{user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
});
router.get('/applicantlist', ensureAuthenticated, async (req, res) =>{
const applicantlist = await db.Applicant.findAll({})
res.render('applicantlist',{user:req.user,applicantlist:applicantlist});
});
router.post('/createapplicant', ensureAuthenticated,async function(req, res){
    const {fullname,gender,age,profession,experience,expertiseLevel,address,phonenumber,maincategory,subcategory} =req.body;
    console.log(req.body)
    const maincategorys = await db.Category.findAll({})
    const subcategorys = await db.Subcategory.findAll({})
     let errors =[];
     if(maincategory === "0"){
       errors.push({msg:'Please select main category'}) 
     }
     if(subcategory === "0"){
      errors.push({msg:'Please select sub category'}) 
    }
    console.log(req.body)
     if(!fullname ||!gender ||!age ||!profession ||!experience ||!expertiseLevel ||!address ||!phonenumber ||!maincategory ||!subcategory){
       errors.push({msg:'Please enter all required fields'}) 
     }
     if(errors.length>0){
       res.render('createapplicant',{errors,user:req.user,jobmaincategory:maincategorys,jobsubcategory:subcategorys});  
     }
     else{
       const newsData ={
      
        applicantId: uuidv4(),
        fullname:fullname,
        gender: gender,
        age: age,
        phoneNumber:phonenumber,
        address: address,
        experience: experience,
        profession: profession,
        expertiseLevel: expertiseLevel,
        maincategory: maincategory,
        subcategory: subcategory
       }
       db.Applicant.create(newsData).then(usernew =>{
        if(usernew){
           res.render('createapplicant',{user:req.user,success_msg:'Successfully Created',jobmaincategory:maincategorys,jobsubcategory:subcategorys});   }else{
           res.render('createapplicant',{user:req.user,jobmaincategory:maincategorys,jobsubcategory:subcategorys,error_msg:'Error while creating applicant'});  }
          }).catch(err =>{
           res.render('createapplicant',{user:req.user,jobmaincategory:maincategorys,jobsubcategory:subcategorys,error_msg:'Cant add applicant now please try again'});  })
     }
   });

router.post('/deleteapplicant/(:applicantid)', ensureAuthenticated, async function(req, res){
  const applicantlist = await db.Applicant.findAll({})
    db.Applicant.findOne({where:{applicantid:req.params.applicantid}}).then(npid =>{
   if(npid){
    db.Applicant.destroy({where:{applicantid:req.params.applicantid}}).then(dtnew =>{
      if(dtnew){
       db.Applicant.findAll({}).then(newsudt =>{
         res.render('applicantlist',{success_msg:'Applicant updated successfully',user:req.user,applicantlist:newsudt});
       }).catch(err =>{
           res.render('applicantlist',{error_msg:'Cant find updated applicant list',user:req.user,applicantlist:applicantlist});
         })
      }
     }).catch(err =>{
         res.render('applicantlist',{error_msg:'Cant delete applicant please try again',user:req.user,applicantlist:applicantlist});
       })
   }
    }).catch(err =>{
      console.log(err)
      res.render('applicantlist',{error_msg:'Cant find applicant with this id',user:req.user,applicantlist:applicantlist});
    })

    });
module.exports = router;