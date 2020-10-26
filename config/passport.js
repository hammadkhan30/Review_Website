const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Users = require('../models/user');

module.exports = function(passport){
  passport.use(
    new LocalStrategy({usernameField:'username'},(username,password,done)=>{
      Users.findOne({username: username })
        .then(user =>{
          if (!user) {
            return done(null,false,{message:'That username is not registered'});
          }
          bcrypt.compare(password,user.password,(err,isMatch) =>{
            if (err) {
              console.log(err);
            }
            if(isMatch){
              return done(null,user);
            }else{
              return done(null,false,{message:'Password Incorrect'});
            }
          });
        })
        .catch(err => console.log(err));

    })
  );
  passport.serializeUser((user, done) => {
     done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
     Users.findById(id,(err, user) => {
        done(err, user);
     });
  });
}
