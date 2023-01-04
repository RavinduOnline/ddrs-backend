const router = require("express").Router();
const mongoose = require('mongoose'); 
const User = mongoose.model('User');
const Forum = mongoose.model('Forum');
const Reply = mongoose.model('Reply');
const WordFilter = mongoose.model('WordFilter');


// *************** Admin Dashboard REST Methods **************

//Get User Count / Forum Count & Comment Count
router.get('/admindashboard/countdata', async (req, res)=>{

        try{
            const userCount = await User.countDocuments();
            const forumCount = await Forum.countDocuments();
            const replyCount = await Reply.countDocuments();
            return res.status(200).json({ 
                      userCount, 
                      forumCount,
                      replyCount,
            });

        }catch{
            return res.status(400).json({ error: "Can't calculate the counting data" });
        }
  
 });


 router.get('/admindashboard/toptable', async (req,res)=>{
    
        try{
            //Display the date in descending order in using commenting count
            const forumData = await Forum.find().sort ( { "Body" : 1 } );
                
                return res.status(200).json({
                    success:true,
                    existingForum:forumData
                });

        }catch{
            return res.status(400).json({ error: "Can't Find the top forum data" });
        }

});



// *************** Admin Dashboard REST Methods End **************

// *************** Admin Manage WordFiltering REST Methods **************

//Create WordFilter
router.post("/adminmanage/wordfilter/create", async (req, res) => {
    const {word, wcategory} = req.body;
  try {
        if(!word || !wcategory){
            return res.status(422).json({ error: "Please fill all the field" });
        }
        const lowerCaseWord = word.toLowerCase();
        let findWord = await WordFilter.findOne({ word:lowerCaseWord });
        if (findWord) {
          return res.status(400).json({ error: "This Word already exists" });
        }

        newWordFilter = new WordFilter({
            word:lowerCaseWord,
            wcategory,
         });
        const WordFilterCreated = await newWordFilter.save()
        if(WordFilterCreated){
            return res.status(201).json({ message: "Word Filter created successfully" });
        } 

    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
  }
});


//Get WordFilter
router.get('/adminmanage/wordfilter', async (req,res)=>{
    
    try{
        WordFilter.find().sort('-createdAt').then((WordsList)=>{
            res.status(200).json(WordsList)
        }).catch((err)=>{
            console.log(err);
        })
    }catch{
        return res.status(400).json({ error: "Can't Find the top forum data" });
    }

});


//update wordfilter
router.put('/adminmanage/wordfilter/update/:id', async (req,res)=>{

    const {word, wcategory} = req.body;
  try {
        if(!word || !wcategory){
            return res.status(422).json({ error: "Please fill all the field" });
        }

        const lowerCaseWord = word.toLowerCase();
        let findWord = await WordFilter.findOne({ word:lowerCaseWord});
        if (findWord) {
          return res.status(400).json({ error: "This Word already exists with Same Category" });
        }

        else{
            WordFilter.findByIdAndUpdate(
                req.params.id,{
                    word:lowerCaseWord,
                    wcategory,
                },
                (err,post)=>{
                    if(err){
                        return res.status(400).json({
                            error:err 
                        });
                    }

                    return res.status(200).json({
                        success:"Word Filter Updated Successfully"
                    });
                }
            );
        }

  }catch{

  }
});


//delete wordfilter
router.delete('/adminmanage/wordfilter/delete/:id',(req,res)=>{
    WordFilter.findByIdAndRemove(req.params.id).exec((err,deletedWordfilter) =>{

        if(err){
            return res.status(400).json({
                message:"Word Deleting Process has Error" ,err
            });
        }

        return res.status(200).json({
            message:"Word Deleted Successfully",deletedWordfilter
        });
    });
}); 

//Get Specific Word
router.get('/adminmanage/word/:id', async (req,res)=>{
    
    try{
        WordFilter.findById(req.params.id).then((Word)=>{
            res.status(200).json(Word)
        }).catch((err)=>{
            console.log(err);
            return res.status(400).json({ error: "Something has error" });
        })
    }catch{
        return res.status(400).json({ error: "Something has error" });
    }

});

// *************** Admin Manage WordFiltering REST Methods End **************

// *************** Admin Manage Topic REST Methods **************


//retrieve
router.get("/adminmanage/forum/get", async (req, res) => {
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

  //delete 
router.delete('/adminmanage/topic/delete/:id',(req,res)=>{

    Reply.deleteMany({forum_id:req.params.id}).exec((err,deletedReply) =>{
        
        if(err){
            return res.status(400).json({
                message:"Topic Deleting Process has Error" ,err
            });
        }

        Forum.findByIdAndRemove(req.params.id).exec((err,deletedTopic) =>{

            if(err){
                return res.status(400).json({
                    message:"Topic Deleting Process has Error" ,err
                });
            }
    
            return res.status(200).json({
                message:"Topic Deleted Successfully",deletedTopic
            });
        });


    });
}); 


  // *************** Admin Manage Topic REST Methods End **************


module.exports = router;