const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const fs = require('fs');
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
const Newsphoto = require('../middleware/totphoto');
router.get('/createnewads', ensureAuthenticated, async (req, res) =>{
  
res.render('createads',{user:req.user,});
});
router.get('/adslist', ensureAuthenticated, async (req, res) =>{
const ads = await db.ADs.findAll({})
res.render('adslist',{user:req.user,ads:ads});
});
router.post('/createads', ensureAuthenticated,Newsphoto.single('adsphoto') ,async function(req, res){
    const {adsdetail,adstitle,adsurl,readmore} =req.body;
   
     let errors =[];
   
    if(!req.file){
      errors.push({msg:'Please add Ads Image file '}) 
    }
  
     if(!adsdetail ||!adstitle ||!adsurl ||!readmore){
       errors.push({msg:'Please enter all required fields'}) 
     }
     if(errors.length>0){
       res.render('createads',{errors,user:req.user});  
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
       
        isactive: 'Yes',
       
       }
       db.ADs.create(newsData).then(usernew =>{
        if(usernew){
           res.render('createads',{user:req.user,success_msg:'Successfully Created'});   }else{
           res.render('createads',{user:req.user,error_msg:'Error while creating ADs'});  }
          }).catch(err =>{
           res.render('createads',{user:req.user,error_msg:'Cant ADs now please try again'});  })
     }
   });

router.post('/deleteads/(:adsid)', ensureAuthenticated, async function(req, res){
    const ads = await db.ADs.findAll({})
    db.ADs.findOne({where:{npid:req.params.adsid}}).then(npid =>{
   if(npid){
    db.ADs.destroy({where:{adsid:req.params.adsid}}).then(dtnew =>{
      if(dtnew){
       db.ADs.findAll({}).then(newsudt =>{
         res.render('createads',{success_msg:'ADs updated successfully',user:req.user,ads:newsudt});
       }).catch(err =>{
           res.render('createads',{error_msg:'Cant find updated ADs list',user:req.user,ads:ads});
         })
      }
     }).catch(err =>{
         res.render('createads',{error_msg:'Cant delete ADs please try again',user:req.user,ads:ads});
       })
   }
    }).catch(err =>{
      console.log(err)
      res.render('createads',{error_msg:'Cant find ADs with this id',user:req.user,ads:ads});
    })

    });
module.exports = router;