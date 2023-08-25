const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/createdirectory', ensureAuthenticated, async (req, res) =>{
  const subcategory = await db.Subcategory.findAll({}) 
res.render('createdirectory',{user:req.user,subcategory:subcategory});
});
router.get('/directorylist', ensureAuthenticated, async (req, res) =>{
const directory = await db.BusinessDirectory.findAll({});
const subcategory = await db.Subcategory.findAll({})
res.render('directorylist',{user:req.user,directory:directory,subcategory:subcategory});
});
router.post('/createdirectories', ensureAuthenticated, async (req, res) =>{
    const {bname,bplace,bcontact,boverview,baboutus,bservice,bwewurl,bworkinghours,directorycategory,latitude,logtiude,
      topoccupations,ratting,region
    } =req.body;
    const subcategory = await db.Subcategory.findAll({})
     let errors =[];
     if(directorycategory === "0"){
       errors.push({msg:'Please select directory type'}) 
     }
  
     if(!topoccupations ||!ratting ||!region || !bname ||!bplace ||!bcontact ||!boverview ||!latitude ||!logtiude ||!baboutus||!bservice ||!bwewurl||!bworkinghours||!directorycategory){
       errors.push({msg:'Please enter all required fields'}) 
     }
     if(errors.length>0){
       res.render('createdirectory',{errors,user:req.user,subcategory:subcategory});  
     }
     else{
       const dirData ={
        bdid: uuidv4(),
        topoccupations:topoccupations,ratting:ratting,region:region,
        bname:bname,
        bplace: bplace,
        lon:logtiude,
        lat:latitude,
        bimage: '',
        boverview: boverview,
        baboutus:baboutus,
        bservice: bservice,
        bcontact:bcontact,
        bwewurl: bwewurl,
        bworkinghours: bworkinghours,
        directorycategory: directorycategory
       }
       db.BusinessDirectory.create(dirData).then(usernew =>{
        if(usernew){
           res.render('createdirectory',{user:req.user,success_msg:'Successfully Created',subcategory:subcategory});   }else{
           res.render('createdirectory',{user:req.user,error_msg:'Error while creating business directory',subcategory:subcategory});  }
          }).catch(err =>{
           res.render('createdirectory',{user:req.user,error_msg:'Cant create directory now please try again',subcategory:subcategory});  })
     }
   });
   router.post('/deletedirectory/(:bdid)', ensureAuthenticated, async function(req, res){
    const directory = await db.BusinessDirectory.findAll({});
    const subcategory = await db.Subcategory.findAll({})
    db.BusinessDirectory.findOne({where:{bdid:req.params.bdid}}).then(npid =>{
   if(npid){
    db.BusinessDirectory.destroy({where:{bdid:req.params.bdid}}).then(dtnew =>{
      if(dtnew){
       db.BusinessDirectory.findAll({}).then(newsudt =>{
         res.render('directorylist',{success_msg:'Business directory updated successfully',user:req.user,directory:newsudt});
       }).catch(err =>{
           res.render('directorylist',{error_msg:'Cant find updated business directory list',user:req.user,directory:directory});
         })
      }
     }).catch(err =>{
         res.render('directorylist',{error_msg:'Cant delete business directory please try again',user:req.user,directory:directory});
       })
   }
    }).catch(err =>{
      console.log(err)
      res.render('directorylist',{error_msg:'Cant find business directory with this id',user:req.user,directory:directory});
    })

    });
module.exports = router;