const Users = require("../models/user_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const user_sign_in = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: "Existing user found with the same email address",
      });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new Users({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ success: true });
  } 
  catch (error) {
    console.error("Signup Error: ", error);
    res.status(500).json({ success: false, errors: "Server Error" });
  }
};

const user_login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, errors: "User not found" });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const data = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };

      const token = jwt.sign(data, "secret_ecom", { expiresIn: "1h" });
      res.json({ success: true, token, id: user.id });
    } else {
      res.status(401).json({ success: false, errors: "Server Error" });
    }
  } 
  catch (error) {
    console.error("Login Error: ", error);
    res.status(500).json({ success: false, errors: "Server Error" });
  }
};

const get_user_data = (req, res) =>
{
    try
    {
        // Extracting the token from the authorization header
        const token = req.headers.authorization?.split(" ")[1];

        if (!token)
        {
            return res.status(401).json({success: false, message: 'No token provided'});
        }

        const decoded = jwt.verify(token, 'secret_ecom');
        res.status(200).json(
        {
            success: true,
            name: decoded.user.name,
            email: decoded.user.email
        });
    }
    catch (error)
    {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

module.exports = {
  user_sign_in,
  user_login,
  get_user_data
};
