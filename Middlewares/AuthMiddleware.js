const User = require("../models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: false });
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.json({ status: false });
        } else {
            try {
                const user = await User.findById(data.id);
                if (user) {

                    res.json({
                        status: true,
                        user: {
                            userId: user._id,
                            username: user.username,
                            email: user.email,
                            age: user.age,
                            gender: user.gender,
                            profilePicture: user.profilePicture
                        }
                    });
                } else {
                    res.json({ status: false });
                }
            } catch (error) {
                console.error(error);
                res.json({ status: false });
            }
        }
    });

    

};


