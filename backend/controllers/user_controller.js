const Users = require("../models/user_model");
const bcrypt = require("bcryptjs");
const error_h = require("../middlewares/Error/error_class");
const jwt = require("jsonwebtoken");

const { sendEmail } = require("../services/emailService");

const user_sign_in = async (req, res) => {
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
        return next(new error_h("Some error making the session", 500));
      }
  
}
};

const send_recovery_email = async (req, res) => 
{
    const { recipient_email, OTP } = req.body;
    try 
    {
      const response = await sendEmail({ recipient_email, OTP });
      res.status(200).json({ success: true, message: response.message });
    } 
    catch (error) 
    {
      res.status(500).json({ success: true, message: error.message});
    }
};

// const get_user_data = (req, res) =>
// {
//     try
//     {
//         // Extracting the token from the authorization header
//         const token = req.headers.authorization?.split(" ")[1];
//         if (!token)
//         {
//             return res.status(401).json({success: false, message: 'No token provided'});
//         }

//         const decoded = jwt.verify(token, 'secret_ecom');
//         res.status(200).json(
//         {
//             success: true,
//             name: decoded.user.name,
//             email: decoded.user.email
//         });
//     }
//     catch (error)
//     {
//         res.status(401).json({ success: false, message: 'Invalid or expired token' });
//     }
// }

module.exports = {
  user_sign_in,
  user_login,
  get_user_data,
  send_recovery_email
};
