const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');


router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
        .then(user => {
            if (!user) {
                res.status(404).json({ msg: 'User not found' });
            } else {
                res.json(user);
            }
        })
        .catch(err => console.log(err));
});


router.put('/:userId', (req, res) => {
    const { userId } = req.params;
    const { username, email, age, profilePicture, gender } = req.body;

    
    if (!username || !email || !age || !profilePicture || !gender) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    User.findByIdAndUpdate(userId, { username, email, age, profilePicture, gender }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

module.exports = router;
