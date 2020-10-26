const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const Users = require('./models/user');
const adminLog = require('./models/adminLog');
const movies = require('./models/movie');
const rating = require('./models/rating');
const review = require('./models/review');
const {ensureAuthenticated} = require('./config/auth');

const app = express();

require('./config/passport')(passport);

app.use(express.static(__dirname+"./public/"));

const Storage=multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
})

const upload = multer({
  storage : Storage
}).single('image');

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(session({
  secret: "Yo Yo Yo",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/websiteDB",{useNewUrlParser:true});
mongoose.set("useCreateIndex",true);


app.get("/",function(req,res){
  res.render("signIn");
});

app.get("/admin",function(req,res){
  res.render("adminsignIn");
});

app.get("/signUp",function(req,res){
  res.render("signUp");
});

app.get("/adminPage",function(req,res){
  res.render("adminPage");
});

app.get("/search",function(req,res){
  res.render("search");
});

app.get("/viewUser",function(req,res){
  Users.find({},function(err,foundItems){
    res.render("viewUser",{items: foundItems});
  });
});

app.get("/addMovies",function(req,res){
  res.render("addMovies");
});

app.get("/moviedetail",async (req,res) => {
  var name = req.params.movieName
  console.log(name);
  movies.findOne({movieName : name},function(err,foundItems){
    if (err) {
      console.log(err);
    }else {
      res.render("moviedetail",{movies : foundItems})
    }
  });
});

app.get('/home',ensureAuthenticated,function(req, res, next) {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search),'gi');
    movies.find({movieName: regex },function(err,totalItems){
      if (err) {
        console.log(err);
      }else {
        res.render("home",{name : req.user.name, movies: totalItems});
      }
    });
  }else {
    movies.find({}, function (err, totalItems) {
        if(err) {
            console.log(err);
        }else{
        res.render('home', {name : req.user.name, movies: totalItems});
      }
    });
  }

});

app.post('/home', function(req, res, next) {
    const regex = new RegExp(escapeRegex(req.body.search),'gi');
    movies.find({movieName: regex },function(err,totalItems){
      if (err) {
        console.log(err);
      }else {
        res.render("home",{movies: totalItems});
      }
    });
  });

app.post("/moviedetail",function(req,res){
  const newComment = new review({
    comment : req.body.comm
  });
  const newRating = new rating({
    rating : req.body.rate
  });
  var name = req.params.movieName
  movies.findOneAndUpdate(
    {movieName : name},
    {$push : {comment : comment}},
  )
  movies.findOneAndUpdate(
    {movieName : name},
    {$push : {rating : rating}},
  )
});

app.post("/signUp",function(req,res){
  const {name,username,password } = req.body;
  Users.findOne({username:username })
    .then(user => {
      if (user) {
        errors.push({msg: 'username is already registered'});
        res.render('signUp',{
          name,
          username,
          password
        });
      }else {
        const newUser = new Users({
          name,
          username,
          password
        });
        bcrypt.genSalt(10,(err,salt) =>
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
          if (err) {
            console.log(err);
          }
          newUser.password = hash;

          newUser.save()
            .then( Users => {
              res.render("/");
            })
            .catch(err => console.log(err));
        }))
      }
    });
});

app.post("/signIn",function(req,res,next){
  passport.authenticate('local',{
    successRedirect: '/home',
    failureRedirect: '/'
  })(req,res,next);
  // const username = req.body.username;
  // const password = req.body.password;
  // Users.findOne({username: username},function(err,foundUser){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     if (foundUser){
  //       if (foundUser.password === password) {
  //         movies.find({},function(err,foundItems){
  //           res.render("home",{movies:foundItems})
  //         });
  //       }
  //     }else {
  //       res.redirect("signUp");
  //     }
  //   }
  // });

});

app.post("/adminsignIn",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  adminLog.findOne({username: username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if (foundUser){
        if (foundUser.password === password) {
          res.render("adminPage");
        }
      }else {
        console.log("kya");
        res.redirect("admin");
      }
    }
  });

});

app.post("/addMovies",upload,function(req,res){
  const newmovies = new movies({
    movieName : req.body.mname,
    movieCategory : req.body.mcat,
    director : req.body.director,
    language : req.body.mlang,
    summary : req.body.summary,
    img : req.file.filename,
  });

  newmovies.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("addMovies");
    }
  });
});

function escapeRegex(text){
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
};


app.listen(3000,function(){
  console.log("Server Up and running at port 3000");
});
