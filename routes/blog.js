const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const fs = require('fs');
const Newsphoto = require('../middleware/totphoto');
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/createblog', ensureAuthenticated, async (req, res) =>{
    
res.render('createblog',{user:req.user});
});
router.get('/bloglist', ensureAuthenticated, async (req, res) =>{
const bloglist = await db.BLOG.findAll({})
res.render('bloglist',{user:req.user,bloglist:bloglist});
});
router.post('/createblog', ensureAuthenticated,Newsphoto.single('adsphoto') ,async function(req, res){
    const {adsdetail,adstitle,adsurl,readmore,blogby} =req.body;
   
     let errors =[];
   
    if(!req.file){
      errors.push({msg:'Please add Ads Image file '}) 
    }
  
     if(!adsdetail ||!adstitle ||!adsurl ||!readmore ||!blogby){
       errors.push({msg:'Please enter all required fields'}) 
     }
     if(errors.length>0){
       res.render('createblog',{errors,user:req.user});  
     }
     else{
       const newsData ={
      
        adsid: uuidv4(),
    
        adsimage: fs.readFileSync(
          path.join(__dirname,'../public/uploads/') + req.file.filename
        ),
    
      adstitle: adstitle,
  
      
      adsdetail:adsdetail,
  
      adsurl: adsurl,
      readmore: readmore,
      adscount: 0,
      blogby:blogby,
        isactive: 'Yes',
       
       }
       db.BLOG.create(newsData).then(usernew =>{
        if(usernew){
           res.render('createblog',{user:req.user,success_msg:'Successfully Created'});   }else{
           res.render('createblog',{user:req.user,error_msg:'Error while creating BLOG'});  }
          }).catch(err =>{
           res.render('createblog',{user:req.user,error_msg:'Cant BLOG now please try again'});  })
     }
   });

router.post('/deleteblog/(:adsid)', ensureAuthenticated, async function(req, res){
    const ads = await db.ADs.findAll({})
    db.ADs.findOne({where:{npid:req.params.adsid}}).then(npid =>{
   if(npid){
    db.ADs.destroy({where:{adsid:req.params.adsid}}).then(dtnew =>{
      if(dtnew){
       db.ADs.findAll({}).then(newsudt =>{
         res.render('bloglist',{success_msg:'BLOG updated successfully',user:req.user,ads:newsudt});
       }).catch(err =>{
           res.render('bloglist',{error_msg:'Cant find updated BLOG list',user:req.user,ads:ads});
         })
      }
     }).catch(err =>{
         res.render('bloglist',{error_msg:'Cant delete BLOG please try again',user:req.user,ads:ads});
       })
   }
    }).catch(err =>{
      console.log(err)
      res.render('bloglist',{error_msg:'Cant find BLOG with this id',user:req.user,ads:ads});
    })

    });
module.exports = router;