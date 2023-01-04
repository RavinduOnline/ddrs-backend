const express = require("express");

const router = express.Router();
const CommentDB = require("../models/comment");
const { param } = require("./comment");



router.get('/comment' , (req, res)=>{

    res.send("Commment Verified")
  
 });



router.post('/comment/:id', async (req,res) => {

    const {comment, user } = req.body;

    
        try{

            newComment = new CommentDB({
                forum_id : req.params.id,
                comment, 
                user,
            })
        
            const commentCreate = await  newComment.save();
            
            if(commentCreate){
                return res.status(201).json({ message: "Comment created successfully" });
            } 
        }catch{
            return res.status(400).json({ error : "Comment not cerated"});
            }
        
        })


module.exports =  router;