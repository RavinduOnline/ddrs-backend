const router = require("express").Router();
const mongoose = require('mongoose'); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/profile")



// Register user (Create)

router.post("/signup", async (req, res) => {
    const {fName, lName, email, interested, country, password, rePassword } = req.body;
  try {
        if(!fName || !lName || !email || !interested || !country || !password || !rePassword){
            return res.status(422).json({ error: "Please fill all the field" });
        }
        let user = await User.findOne({ email:email });
        if (user) {
          return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        newUser = {
            fName,
            lName,
            email,
            interested,
            country,
            password:hashedPassword,
            rePassword:hashedPassword,
         };
         const user1=new User(newUser);
         await user1.save();
             res
             .status(201)
             .send({ status: "User created successfully",user:user1 });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
  }
});





// login user (Post)

router.post('/signin', async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        res.status(422).json({error:"Please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                 //Generate User Token
                 const token = jwt.sign({_id:savedUser._id},process.env.JWT_SECRET, { expiresIn: '1d'}); 
                 const {_id,fName,lName,email} = savedUser
                 res.json({token , user:{_id,fName,lName,email } });  
            }
            else{
                return res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
});





// User details (Retrieve)

router.get('/usersetting/:id',(req, res) => {

    let userId = req.params.id;

    User.findById(userId,(err,user)=>{
        if(err){
            return res.status(400).json({success:false,err});
        }

        return res.status(200).json(
        user
        );
    });

});





// Reset password (Update)

router.put('/resetpassword/:id', async (req, res)=>{
    const {oldPassword, password, rePassword} = req.body;
    let user = await User.findOne({ id:req.params.id })

    if(!oldPassword || !password || !rePassword){
        res.status(422).json({error:"Please add all field"})
    }
    
    else if (user) {
        const oldhashedPassword = await bcrypt.hash(oldPassword, 10)

        if(oldhashedPassword){
        const hashedPassword = await bcrypt.hash(password, 10)
        User.findByIdAndUpdate(
            req.params.id,{
                password:hashedPassword,
                rePassword:hashedPassword,
            },
            (err,post)=>{
                if(err){
                    return res.status(400).json({
                        error:err 
                    });
                }

                return res.status(200).json({
                    success:"Password Update Successfully"
                });
            }
        );
        }
        else{res.status(422).json({error:"Old password doesn't match"})}
      }


});





// Update profile (Update)

router.put('/updateprofile/:id',(req, res)=>{
    User.findByIdAndUpdate(
    req.params.id,
    {
        $set:req.body
    },
    (err,user)=>{
        if(err){
        return res.status(400).json({error:err});
    }

    return res.status(200).json({
        success:"Updated Successfully"
        });
    }
);

});





// Disable profile (Delete)

router.delete('/disableprofile/:id',(req, res)=>{
    User.findByIdAndRemove(req.params.id).exec((err,deleteduser) =>{

    if (err) return res.status(400).json({
        message:"Delete Unsuccessful",err
    });

    return res.json({
        message:"Delete Successfull",deleteduser
        });
    });
});







module.exports = router