const router = require("express").Router();
const mongoose = require('mongoose'); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = mongoose.model('Admin');
const requireAdminLogin = require('../middleware/requireAdminLogin');


router.get('/adminprotected', requireAdminLogin , (req, res)=>{

    res.send("Admin Verified")
  
 });

// Register Admin
router.post("/adminsignup", async (req, res) => {
    const {fName, lName, email, password } = req.body;
  try {
        if(!fName || !lName || !email || !password){
            return res.status(422).json({ error: "Please fill all the field" });
        }
        let admin = await Admin.findOne({ email:email });
        if (admin) {
          return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        newUser = new Admin({
            fName,
            lName,
            email,
            password:hashedPassword,
         });
        const adminCreated = await newUser.save()
        if(adminCreated){
            return res.status(201).json({ message: "User created successfully" });
        } 

    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
  }
});


//SignIn(Login) Admin
router.post("/adminlogin", async (req, res) => {

  const {email, password } = req.body;

  if(!email || !password){

    return res.status(422).json({ error: "Please enter email or password"});

  }

  let savedAdmin = await Admin.findOne({ email:email });
  if(!savedAdmin){

    return res.status(422).json({ error: "Invalid Email or Password"});

  }
  else{
    let doMatch = await bcrypt.compare(password,savedAdmin.password);
    try{
      if(doMatch){
        const token = jwt.sign({_id:savedAdmin._id},process.env.JWT_SECRET);
        const {_id,fName,lName,email} = savedAdmin
        res.json({token,admin:{_id,fName,lName,email}})
      }
      else{
        return res.status(400).json({ error: "Invalid Email or Password"});
      }
    }catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Something is Wrong. Please try again later"  });
    }
  }

});

//SignIn(Login) Admin
router.get("/admindashboard", async (req, res) => {

  const {email, password } = req.body;

  if(!email || !password){

    return res.status(422).json({ error: "Please enter email or password"});

  }

  let savedAdmin = await Admin.findOne({ email:email });
  if(!savedAdmin){

    return res.status(422).json({ error: "Invalid Email or Password"});

  }
  else{
    let doMatch = await bcrypt.compare(password,savedAdmin.password);
    try{
      if(doMatch){

        const token = jwt.sign({_id:savedAdmin._id},process.env.JWT_SECRET);
        res.json({token});        

      }
      else{
        return res.json({ error: "Invalid Email or Password"});
      }
    }catch (err) {
      console.log(err);
      return res.status(400).json({ error: "Something is Wrong. Please try again later"  });
    }
  }

});


module.exports = router;