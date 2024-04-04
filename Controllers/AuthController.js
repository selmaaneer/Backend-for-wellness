const User = require('../models/UserModel');
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");


{/*const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};*/}

module.exports.Signup = async (req, res) => {

  try {
    const body = req.body;
    const { email, password, username, age, gender, profilePicture,createdAt } = body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.send("User is already exist");
    }
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      email, 
      password: hashPassword, 
      username, 
      age, 
      gender, 
      profilePicture,
      createdAt
    });
    const newUserCreated = await newUser.save();
    if (!newUserCreated) {
      return res.send("user is not created");
    }
    const token = createSecretToken(newUserCreated._id);
    console.log(token);
    res.send({ token });
    //res.status(201).json({ message: "User registered successfully", user: newUser });


  } catch (error) {
    console.log(error, "Something wrong");
  }




  {/*try {
    const { email, password, username, age, gender, profilePicture,createdAt } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

   
    const hashedPassword = await hashPassword(password);

    
    const newUser = await User.create({ email, password: hashedPassword, username, age, gender, profilePicture,createdAt });

    
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: err.message });
  }*/}
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.json({message:'Incorrect password or email' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
     const token = createSecretToken(user._id);
     res.cookie("token", token, {
       withCredentials: true,
       httpOnly: false,
     });
     res.status(201).json({ message: "User logged in successfully", success: true });
     next()
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: err.message });
  }
}

