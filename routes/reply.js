const express = require("express");

const router = express.Router();
const Reply = require("../models/reply");




router.get('/reply' , (req, res)=>{
    try{
        Reply.find().then((ReplyList)=>{
            res.status(200).json(ReplyList)
        }).catch((err)=>{
            console.log(err);
        })
    }catch{
        return res.status(400).json({ error: "Can't Find the top Reply data" });
    } 
  
 });


router.post('/replycreate',async (req,res) => {


    const { forum_id, reply, name, user } = req.body;

    try{

    newReply = new Reply({
        forum_id,
        reply,
        name,
        user,
    })

    const replyCreate = await  newReply.save();
    
    if(replyCreate){
        return res.status(201).json({ message: "Reply created successfully" });
    } 
}catch{
    return res.status(400).json({ error : "Reply not cerated"});
    }

})


//Get Specific Reply for uniq forum
router.get('/reply/single/:id', async (req,res)=>{
    
    try{
        const id = req.params.id;
        Reply.find({forum_id:id})
        .populate("user","_id fName lName")
        .sort('-createdAt')
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


//Get Specific Reply for User
router.get('/reply/user/:id', async (req,res)=>{
    
    try{
        const id = req.params.id;
        Reply.find({user:id})
        .populate("forum_id","_id Title")
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


//Get Single Reply
router.get('/reply/one/:id', async (req,res)=>{
    
    try{
        const id = req.params.id;
        Reply.findById(id)
        .populate("user","_id fName lName")
        .populate("forum_id","_id Title")
        .sort('-createdAt')
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

//update Reply
router.put('/reply/update/:id', async (req,res)=>{

    const {reply} = req.body;
  try {
        if(!reply){
            return res.status(422).json({ error: "Please fill all the field" });
        }

        else{
            Reply.findByIdAndUpdate(
                req.params.id,{
                    reply,
                },
                (err,post)=>{
                    if(err){
                        return res.status(400).json({
                            error:err 
                        });
                    }

                    return res.status(200).json({
                        success:"Reply Updated Successfully"
                    });
                }
            );
        }

  }catch{

  }
});

//delete Reply
router.delete('/reply/delete/:id',(req,res)=>{
    Reply.findByIdAndRemove(req.params.id).exec((err,deletedReply) =>{

        if(err){
            return res.status(400).json({
                message:"Reply Deleting Process has Error" ,err
            });
        }

        return res.status(200).json({
            message:"Reply Deleted Successfully",deletedReply
        });
    });
}); 

module.exports = router;