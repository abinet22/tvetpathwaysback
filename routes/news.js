const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
const Newsphoto = require('../middleware/totphoto');
router.get('/createnews', ensureAuthenticated, async (req, res) =>{
    const newstag = await db.NewsTag.findAll({})
    const newscategory = await db.NewsCategory.findAll({})
res.render('createnews',{user:req.user,newstag:newstag,newscategory:newscategory});
});
router.get('/newslist', ensureAuthenticated, async (req, res) =>{
const news = await db.NewsAndPrograms.findAll({})
res.render('newslist',{user:req.user,news:news});
});
router.post('/createnews', ensureAuthenticated,Newsphoto.single('newsphoto') ,async function(req, res){
    const {npcategory,nptag,npdescription,npdetail,npheadline,readmore,npurl} =req.body;
    const newstag = await db.NewsTag.findAll({})
    const newscategory = await db.NewsCategory.findAll({})
     let errors =[];
     if(newscategory === "0"){
       errors.push({msg:'Please select NEWS category'}) 
     }
     if(nptag === "0"){
      errors.push({msg:'Please select NEWS category'}) 
    }
    if(!req.file){
      errors.push({msg:'Please add NEWS Image file '}) 
    }
  
     if(!npcategory ||!nptag ||!npdescription ||!npdetail ||!npheadline ||!readmore ||!npurl){
       errors.push({msg:'Please enter all required fields'}) 
     }
     if(errors.length>0){
       res.render('createnews',{errors,user:req.user});  
     }
     else{
       const newsData ={
      
        npid: uuidv4(),
    
        npcategory: npcategory,
        nptag:nptag,
      
        npheadline: npheadline,
        npimage: fs.readFileSync(
          path.join(__dirname,'../public/uploads/') + req.file.filename
        ),
        npdetail: npdetail,
        npdescription: npdescription,
        npurl: npurl,
        readmore:readmore,
        npcount: 0,
        isactive: 'Yes',
        isnewsorprogram: 'NEWS'
       }
       db.NewsAndPrograms.create(newsData).then(usernew =>{
        if(usernew){
           res.render('createnews',{user:req.user,success_msg:'Successfully Created',newstag:newstag,newscategory:newscategory});   }else{
           res.render('createnews',{user:req.user,newstag:newstag,newscategory:newscategory,error_msg:'Error while creating NEWS'});  }
          }).catch(err =>{
           res.render('createnews',{user:req.user,newstag:newstag,newscategory:newscategory,error_msg:'Cant NEWS now please try again'});  })
     }
   });

router.post('/deletenews/(:npid)', ensureAuthenticated, async function(req, res){
    const news = await db.NewsAndPrograms.findAll({})
    db.NewsAndPrograms.findOne({where:{npid:req.params.npid}}).then(npid =>{
   if(npid){
    db.NewsAndPrograms.destroy({where:{npid:req.params.npid}}).then(dtnew =>{
      if(dtnew){
       db.NewsAndPrograms.findAll({}).then(newsudt =>{
         res.render('newslist',{success_msg:'NEWS updated successfully',user:req.user,news:newsudt});
       }).catch(err =>{
           res.render('newslist',{error_msg:'Cant find updated news list',user:req.user,news:news});
         })
      }
     }).catch(err =>{
         res.render('newslist',{error_msg:'Cant delete news please try again',user:req.user,news:news});
       })
   }
    }).catch(err =>{
      console.log(err)
      res.render('newslist',{error_msg:'Cant find news with this id',user:req.user,news:news});
    })

    });
module.exports = router;