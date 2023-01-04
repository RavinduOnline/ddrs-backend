
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
require ("dotenv").config();

//import routes
require("./models/admin")
require("./models/forum")
require("./models/reply")
require("./models/comment")
require("./models/profile")
require("./models/wordfilter")
require("./models/reply")





const PORT = process.env.PORT || "8000";   

//DB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("📚 DB is Connected"))
  .catch((err) => console.log("😨 DB Connection has error -> ",err));



//Middleware 
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use(express.json());

app.use(require("./routes/adminauth"));
app.use(require("./routes/forum"));
app.use(require("./routes/reply"));
app.use(require("./routes/comment"));
app.use(require("./routes/adminmanage"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});


app.use("/uploads", express.static(path.join(__dirname, "/../uploads")));
app.use(express.static(path.join(__dirname, "/../frontend/build")));


// Routes
app.get("/", (req, res, next) =>{
    res.send("<h1>❤️ DDRS Community Server</br> Developed By <a href='http://sliit.lk'>TEAM X</a></h1>");
    next();
});
 
app.use(cors());     

app.listen(PORT, () =>{
    console.log(`🚀 Server is UP and running on PORT ${PORT }`)
});

const userRouter=require("./routes/profileauth.js");
app.use("/user",userRouter)