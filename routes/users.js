const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
router.get('/createuser', ensureAuthenticated, async (req, res) =>{
    
res.render('createuser',{user:req.user});
});
router.get('/userlist', ensureAuthenticated, async (req, res) =>{
const users = await db.User.findAll({});
res.render('userlist',{user:req.user,users:users});
});
router.post('/activateuser/(:userid)', ensureAuthenticated, async (req, res) =>{
  const users = await db.User.findAll({});
  db.User.findOne({where:{staffid:req.params.userid}}).then(userex =>{
    if(userex){
       db.User.update({is_active:'Yes'},{where:{staffid:req.params.userid}}).then(udtusr =>{
        if(udtusr){
          db.User.findAll({}).then(udtnewuser =>{
            res.render('userlist',{success_msg:'User status updated account is activated',user:req.user,users:udtnewuser});

          }).catch(err =>{
            res.render('userlist',{error_msg:'Error while finding updated user list',user:req.user,users:users});
          })
        }
       }).catch(err =>{
        res.render('userlist',{error_msg:'Error while updating existing user',user:req.user,users:users});
      })
    }else{
      res.render('userlist',{error_msg:'Existing user cant be found',user:req.user,users:users});

    }
  }).catch(err =>{
    res.render('userlist',{error_msg:'Error while finding existing user',user:req.user,users:users});
  })

  });
  router.post('/diactivateuser/(:userid)', ensureAuthenticated, async (req, res) =>{
    const users = await db.User.findAll({});
    db.User.findOne({where:{staffid:req.params.userid}}).then(userex =>{
      if(userex){
         db.User.update({is_active:'No'},{where:{staffid:req.params.userid}}).then(udtusr =>{
          if(udtusr){
            db.User.findAll({}).then(udtnewuser =>{
              res.render('userlist',{success_msg:'User status updated account is deactivated',user:req.user,users:udtnewuser});
  
            }).catch(err =>{
              res.render('userlist',{error_msg:'Error while finding updated user list',user:req.user,users:users});
            })
          }
         }).catch(err =>{
          res.render('userlist',{error_msg:'Error while updating existing user',user:req.user,users:users});
        })
      }else{
        res.render('userlist',{error_msg:'Existing user cant be found',user:req.user,users:users});
  
      }
    }).catch(err =>{
      res.render('userlist',{error_msg:'Error while finding existing user',user:req.user,users:users});
    })
  
    });
router.post('/createuser', ensureAuthenticated, async (req, res) =>{
 const {password,username,phonenumber,email,fullname,repassword,userroll} =req.body;
 
  let errors =[];
  if(userroll === "0"){
    errors.push({msg:'Please select user roll'}) 
  }
  if(password != repassword){
    errors.push({msg:'Password and retype password must be the same'}) 
  }
  if(!password |!repassword ||!username ||!email ||!fullname ||!repassword ||!userroll){
    errors.push({msg:'Please enter all required fields'}) 
  }
  if(errors.length>0){
    res.render('createuser',{errors,user:req.user});  
  }
  else{
    const userData ={
      staffid: uuidv4(),
    fullname: fullname,
    email:email,
  
    phone_number: phonenumber,
    username: username,
    password:password,
    user_roll: userroll,
    is_active: 'Yes'
    }
    bcrypt.hash(password, 10, (err, hash) => {
      userData.password = hash;
  
  
      db.User.create(userData).then(usernew =>{
       if(usernew){
          res.render('createuser',{user:req.user,success_msg:'Successfully Created'});   }else{
          res.render('createuser',{user:req.user,error_msg:'Error while creating users credentials'});  }
         }).catch(err =>{
          res.render('createuser',{user:req.user,error_msg:'Cant create user now please try again'});  })
      }); // 
  }
});
module.exports = router;