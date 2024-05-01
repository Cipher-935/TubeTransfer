const Users = require("../models/user_model");
const bcrypt = require("bcryptjs");
const error_h = require("../middlewares/Error/error_class");
const jwt = require("jsonwebtoken");

const user_sign_in = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser = await Users.findOne({ email });
  if(existingUser){
    return next(new error_h(`User with this id exists`, 400));
  }
  else{
    try{
      const hashedPassword = await bcrypt.hash(password, 8);
      const added_user = await Users.create({name: name, email: email, password: hashedPassword})
      res.status(200).json({
        resp: "Successfully registered"
      });
    }
    catch(e){
        return next(new error_h(`Error registering the user`, 500));
    }
  }
};

const user_login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if(!user){
    return next(new error_h("Email is incorrect", 500));
  }
  else{
    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
        const pay = {u_id: user._id};
        const token = jwt.sign(pay, process.env.sessionKey, {expiresIn: "30m"});
        res.cookie("uid", token, {secure: true});
        res.status(200).json({
           resp: "Successfully logged in"
        });
    }
    else{
      return next(new error_h("Password was incorrect", 500));
    }
  }
};

module.exports = {
  user_sign_in,
  user_login
};
