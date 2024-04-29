const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
    user_id:{
      type: String,
      required:true,
      unique: true
    },
    name:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
<<<<<<< Updated upstream
=======
        unique: true,
        required: true
>>>>>>> Stashed changes
    },
    password:
    {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Users', userSchema);