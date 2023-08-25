const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const db = require("../models");
const path = require("path");
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid');
router.get('/createnewstagorcategroy', ensureAuthenticated, async (req, res) =>{
    const newscategory = await db.NewsCategory.findAll({})
    const newstag = await db.NewsTag.findAll({})
    res.render('createnewstagorcategroy',{user:req.user,newscategory:newscategory,newstag:newstag});
    });
    
router.get('/mainsubjobcategory', ensureAuthenticated, async (req, res) =>{  
    const jobmaincategory = await db.Category.findAll({})
    const jobsubcategory  = await db.Subcategory.findAll({})
    res.render('createmainsubjobcategory',{user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
    });
router.post('/addmainjobcategory',ensureAuthenticated,async function(req,res){
const {mainjobcategory} = req.body;
const jobmaincategory = await db.Category.findAll({})
const jobsubcategory  = await db.Subcategory.findAll({})
if(!mainjobcategory){
    res.render('createmainsubjobcategory',{error_msg:'Please add main job category name first.',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
}else{
    const catData ={
        catid: uuidv4(),
      catname: mainjobcategory,
      is_active:'Yes'
    }
        db.Category.findOne({where:{catname:mainjobcategory}}).then(subcat =>{
          if(subcat){
 res.render('createmainsubjobcategory',{error_msg:'Error  job main category already saved',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});

          }else{
                db.Category.create(catData).then(catdt =>{
     if(catdt){
    db. Category.findAll({}).then(newcat =>{
        res.render('createmainsubjobcategory',{success_msg:'Successfully add main job category',user:req.user,jobmaincategory:newcat,jobsubcategory:jobsubcategory});

    }).catch(err =>{
        res.render('createmainsubjobcategory',{error_msg:'Error while creating job main category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});

    })
     }
    }).catch(err =>{
        res.render('createmainsubjobcategory',{error_msg:'Error while creating job main category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});

    })
          }
        }).catch(err =>{
              res.render('createmainsubjobcategory',{error_msg:'Error while finding job main category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});


        })

  }

});
router.post('/addsubjobcategory',ensureAuthenticated,async function(req,res){
    const {mainjobcategory,subcatname} = req.body;
    const jobmaincategory = await db.Category.findAll({})
    const jobsubcategory  = await db.Subcategory.findAll({})
    if(!mainjobcategory ||!subcatname || mainjobcategory ==="0"){
        res.render('createmainsubjobcategory',{error_msg:'Please add all required fields',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
    }else{
        const catData ={
            subcatid: uuidv4(),
            catid: mainjobcategory,
          is_active:'Yes',
          subcatname:subcatname
        }
        db.Subcategory.findOne({where:{subcatname:subcatname}}).then(subcat =>{
            if(subcat){
                res.render('createmainsubjobcategory',{error_msg:'Error Sub category already register with this name',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
               
            }else{
                db.Subcategory.create(catData).then(catdt =>{
                    if(catdt){
                   db.Subcategory.findAll({}).then(newcat =>{
                       res.render('createmainsubjobcategory',{success_msg:'Successfully add sub job category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:newcat});
               
                   }).catch(err =>{
                       res.render('createmainsubjobcategory',{error_msg:'Error while creating job sub category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
               
                   })
                    }
                   }).catch(err =>{
                       res.render('createmainsubjobcategory',{error_msg:'Error while creating job sub category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
               
                   })
            }
        }).catch(err =>{
            res.render('createmainsubjobcategory',{error_msg:'Error while creating job sub category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
               
        })
      
      }
});
router.post('/addnewstag',ensureAuthenticated,async function(req,res){
    const {newstags} = req.body;
    const newscategory = await db.NewsCategory.findAll({})
    const newstag = await db.NewsTag.findAll({})
   if(!newstag){
    res.render('createnewstagorcategroy',{error_msg:'Please add all required fields',user:req.user,newscategory:newscategory,newstag:newstag});
  
    }else{
        const catData ={
        
            ncatid:uuidv4(),
          ntagname: newstags,
          is_active:'Yes'
        }
        db.NewsTag.create(catData).then(catdt =>{
         if(catdt){
        db.NewsTag.findAll({}).then(newcat =>{
            res.render('createnewstagorcategroy',{success_msg:'Successfully create NEWS tags',user:req.user,newscategory:newscategory,newstag:newstag});

        }).catch(err =>{
            res.render('createnewstagorcategroy',{error_msg:'Error while finding existing NEWS tags',user:req.user,newscategory:newscategory,newstag:newstag});

        })
         }
        }).catch(err =>{
            res.render('createnewstagorcategroy',{error_msg:'Error while creating NEWS tags',user:req.user,newscategory:newscategory,newstag:newstag});
 
        })
      }
});

router.post('/addnewscategroy',ensureAuthenticated,async function(req,res){
    const {newscategorys} = req.body;
    const newscategory = await db.NewsCategory.findAll({})
    const newstag = await db.NewsTag.findAll({})
   if(!newstag){
    res.render('createnewstagorcategroy',{error_msg:'Please add all required fields',user:req.user,newscategory:newscategory,newstag:newstag});
  
    }else{
        const catData ={
        
            ncatid:uuidv4(),
            ncatname: newscategorys,
            is_active:'Yes'
        }
        db.NewsCategory.create(catData).then(catdt =>{
         if(catdt){
        db.NewsCategory.findAll({}).then(newcat =>{
            res.render('createnewstagorcategroy',{success_msg:'Successfully create NEWS category',user:req.user,newscategory:newcat,newstag:newstag});

        }).catch(err =>{
            res.render('createnewstagorcategroy',{error_msg:'Error while finding existing NEWS tags',user:req.user,newscategory:newscategory,newstag:newstag});

        })
         }
        }).catch(err =>{
            res.render('createnewstagorcategroy',{error_msg:'Error while creating NEWS tags',user:req.user,newscategory:newscategory,newstag:newstag});

        })
      }
}); 

router.post('/deletsubjobcategory/(:subcatid)',ensureAuthenticated,async function (req,res){
    const jobmaincategory = await db.Category.findAll({})
    const jobsubcategory  = await db.Subcategory.findAll({})
 db.Subcategory.findOne({where:{subcatid:req.params.subcatid}}).then(subcat =>{
  if(subcat){
    db.Subcategory.destroy({where:{subcatid:req.params.subcatid}}).then(dt =>{
        db.Subcategory.findAll({}).then(newsc =>{
            res.render('createmainsubjobcategory',{success_msg:'Successfully delete job sub category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:newsc});
       
        }).catch(err =>{
        res.render('createmainsubjobcategory',{error_msg:'Error while deleting job sub category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
               
    })
               
    }).catch(err =>{
        res.render('createmainsubjobcategory',{error_msg:'Error while deleting job sub category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
               
    })
  }else{
    res.render('createmainsubjobcategory',{error_msg:'Error while finding job sub category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
       
  }
 }).catch(err =>{
    res.render('createmainsubjobcategory',{error_msg:'Error while finding job sub category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
       
 })
});
router.post('/deletemainjobcategory/(:maincatid)',ensureAuthenticated,async function (req,res){
    const jobmaincategory = await db.Category.findAll({})
    const jobsubcategory  = await db.Subcategory.findAll({})
 db.Category.findOne({where:{catid:req.params.maincatid}}).then(subcat =>{
  if(subcat){
    db.Category.destroy({where:{catid:req.params.maincatid}}).then(dt =>{
        db.Category.findAll({}).then(newcat =>{
            res.render('createmainsubjobcategory',{success_msg:'Successfully delete job main category',user:req.user,jobmaincategory:newcat,jobsubcategory:jobsubcategory});
       
        }).catch(err =>{
        res.render('createmainsubjobcategory',{error_msg:'Error while deleting job main category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
               
    })        
    }).catch(err =>{
        res.render('createmainsubjobcategory',{error_msg:'Error while deleting job main category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
               
    })
  }else{
    res.render('createmainsubjobcategory',{error_msg:'Error while finding job main category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
       
  }
 }).catch(err =>{
    res.render('createmainsubjobcategory',{error_msg:'Error while finding job main category',user:req.user,jobmaincategory:jobmaincategory,jobsubcategory:jobsubcategory});
       
 })
});
router.post('/deletnewscategory/(:ncatid)',ensureAuthenticated,async function (req,res){
    const newscategory = await db.NewsCategory.findAll({})
    const newstag = await db.NewsTag.findAll({})
 db.NewsCategory.findOne({where:{ncatid:req.params.ncatid}}).then(subcat =>{
  if(subcat){
    db.NewsCategory.destroy({where:{ncatid:req.params.ncatid}}).then(dt =>{
        db.NewsCategory.findAll({}).then(newcat =>{
            res.render('createnewstagorcategroy',{success_msg:'Successfully delete NEWS category',user:req.user,newscategory:newcat,newstag:newstag});

        }).catch(err =>{
            res.render('createnewstagorcategroy',{error_msg:'Error while new NEWS category',user:req.user,newscategory:newscategory,newstag:newstag});
  
    })        
    }).catch(err =>{
        res.render('createnewstagorcategroy',{error_msg:'Error while deleting NEWS category',user:req.user,newscategory:newscategory,newstag:newstag});
  
    })
  }else{
    res.render('createnewstagorcategroy',{error_msg:'Error cant find NEWS category with this ID',user:req.user,newscategory:newscategory,newstag:newstag});
  
  }
 }).catch(err =>{
    res.render('createnewstagorcategroy',{error_msg:'Error while finding NEWS category',user:req.user,newscategory:newscategory,newstag:newstag});
  
 })
});
router.post('/deletenewstagcategory/(:ncatid)',ensureAuthenticated,async function (req,res){
    const newscategory = await db.NewsCategory.findAll({})
    const newstag = await db.NewsTag.findAll({})
 db.NewsTag.findOne({where:{ncatid:req.params.ncatid}}).then(subcat =>{
  if(subcat){
    db.NewsTag.destroy({where:{ncatid:req.params.ncatid}}).then(dt =>{
        db.NewsTag.findAll({}).then(newcat =>{
            res.render('createnewstagorcategroy',{success_msg:'Successfully delete NEWS tag',user:req.user,newscategory:newcat,newstag:newstag});

        }).catch(err =>{
            res.render('createnewstagorcategroy',{error_msg:'Error while new NEWS tag',user:req.user,newscategory:newscategory,newstag:newstag});
  
    })        
    }).catch(err =>{
        res.render('createnewstagorcategroy',{error_msg:'Error while deleting NEWS tag',user:req.user,newscategory:newscategory,newstag:newstag});
  
    })
  }else{
    res.render('createnewstagorcategroy',{error_msg:'Error cant find NEWS tag with this ID',user:req.user,newscategory:newscategory,newstag:newstag});
  
  }
 }).catch(err =>{
    res.render('createnewstagorcategroy',{error_msg:'Error while finding NEWS tag',user:req.user,newscategory:newscategory,newstag:newstag});
  
 })
});
module.exports = router;