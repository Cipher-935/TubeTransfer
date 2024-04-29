const Users = require("../models/user_model");
const bcrypt = require("bcryptjs");
const {v4: uuid} = require("uuid");
const error_h = require("../middlewares/Error/error_class");
const redis = require("../redis_client");

const { sendEmail } = require("../services/emailService");

const user_sign_in = async (req, res) => {
  const { name, email, password } = req.body;
  const u_id = uuid();
  let existingUser = await Users.findOne({ email });
  if(existingUser){
    return next(new error_h(`User with this id exists`, 400));
  }
  else{
        try{
            const hashedPassword = await bcrypt.hash(password, 8);
            const added_user = await Users.create({name: name, email: email, password: hashedPassword, user_id: u_id})
            res.status(200).json({
            resp: "Successfully registered"
            });
        }catch(e){
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
      const session_obj = {
        username: user.name,
      };
      const add_session = await redis.set(user.user_id, JSON.stringify(session_obj));
      const expire_session = redis.expire(user.user_id, 120);
      if(add_session && expire_session){
        res.status(200).json({
          resp: "Successfully logged in"
        });
      }
      else{
        return next(new error_h("Some error making the session", 500));
      }
    if (isMatch) {
      const data = {
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
        },
      };

      const token = jwt.sign(data, "secret_ecom", { expiresIn: "1h" });
      res.json({ success: true, token, id: user.user_id });
    } 
    else{
      return next(new error_h("Password was incorrect", 500));
    }
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
