const express =require('express');
const mongoose=require('mongoose');
const router = express.Router();
const Forum = mongoose.model('Forum');
const Reply = require("../models/reply");


router.get('/forum', (req, res)=>{
    res.send("Hi I'm Forum Get Method")  
 });

// Create
router.post("/forumcreate", async (req, res) => {
    const {Title, FCategory, Description, Body, Pic, User} = req.body;
  try {
        if(!Title || !FCategory || !Description || !Body || !User){
            return res.status(422).json({ error: "Please fill all the field" });
        }

        newForum = new Forum({
            Title,
            FCategory,
            Description,
            Body,
            Pic,
            User,
         });
        const forumCreated = await newForum.save()
        if(forumCreated){
            return res.status(201).json({ message: "Forum created successfully" });
        } 

    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
  }
});

//update 
router.put('/forum/update/:id', async (req,res)=>{

    const {Title, FCategory, Description, Body} = req.body;
  try {
        if(!Title || !FCategory || !Description || !Body){
            return res.status(422).json({ error: "Please fill all the field" });
        }

        else{
            Forum.findByIdAndUpdate(
                req.params.id,{
                    Title,
                    FCategory,
                    Description,
                    Body,
                },
                (err,post)=>{
                    if(err){
                        return res.status(400).json({
                            error:err 
                        });
                    }

                    return res.status(200).json({
                        success:"Forum Updated Successfully"
                    });
                }
            );
        }

  }catch{

  }
});

//retrieve
router.get("/forumget", async (req, res) => {
  try{
    Forum.find().sort('-createdAt')
    .then((ForumList)=>{
        res.status(200).json(ForumList)
    }).catch((err)=>{
        console.log(err);
    })
}catch{
    return res.status(400).json({ error: "Can't Find the top forum data" });
} 
});


//retrieve without newest order
router.get("/forum/normal/get", async (req, res) => {
    try{
      Forum.find()
      .then((ForumList)=>{
          res.status(200).json(ForumList)
      }).catch((err)=>{
          console.log(err);
      })
  }catch{
      return res.status(400).json({ error: "Can't Find the top forum data" });
  } 
  });
  

  router.get("/forumget/one/:id", async (req, res) => {
        
      try{
        Forum.findById(req.params.id).then((Forum)=>{
              res.status(200).json(Forum)
          }).catch((err)=>{
              console.log(err);
              return res.status(400).json({ error: "Something has error" });
          })
      }catch{
          return res.status(400).json({ error: "Something has error" });
      }


  });


  
//Get Specific Forum for User
router.get('/forum/user/:id', async (req,res)=>{
    
    try{
        const id = req.params.id;
        Forum.find({User:id})
        .sort('created_at')
        .then((ReplyData)=>{
            res.status(200).json(ReplyData)
        }).catch((err)=>{
            console.log(err);
            return res.status(400).json({ error: "Something has error" });
        })
    }catch{
        return res.status(400).json({ error: "Something has error" });
    }

});


//delete 
router.delete('/forum/delete/:id',(req,res)=>{
    Reply.deleteMany({forum_id:req.params.id}).exec((err,deletedReply) =>{
        
        if(err){
            return res.status(400).json({
                message:"Forum Deleting Process has Error" ,err
            });
        }

        Forum.findByIdAndRemove(req.params.id).exec((err,deletedForum) =>{

            if(err){
                return res.status(400).json({
                    message:"forum Deleting Process has Error" ,err
                });
            }
    
            return res.status(200).json({
                message:"Forum Deleted Successfully",deletedReply
            });
        });


    });
}); 

module.exports = router;