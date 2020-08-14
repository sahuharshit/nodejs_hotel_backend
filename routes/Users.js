const express = require('express')
const users = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const models  = require('../models');
const User = models.User


//*** CHANGE THIS ***//
process.env.SECRET_KEY = 'secret' 

// Register
users.post('/register', async (req, res) => {
    
    
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (!user) {

                bcrypt.hash(req.body.password, 10, (err, hash) => {

                    let userData = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        contactNumber: req.body.contactNumber,
                        created: new Date(),
                    }

                    User.create(userData)
                        .then(user => {
                            console.log("Success: Registration successful")
                            res.send("Success: Registration successful")
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                })
            } else {
                console.log("Error: User already exists")
                res.send("Error: User already exists")
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})


//Login
users.post('/login', (req, res) => {

    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    let userObject = { id: user.id, name: user.name, email: user.email, contactNumber: user.contactNumber }
                    let token = jwt.sign(userObject, process.env.SECRET_KEY)
                    // res.send(token)

                    res.json({
                        userObject:{name:user.name, email:user.email},
                        "message": "Logged in",
                        "token": token
                    })
                } else {
                    console.log('Wrong Password')
                    res.send('Error: Wrong Email/Password')
                }
            } else {
                console.log('User does not exist')
                res.send('Error: Wrong Email/Password')
               
            }
        })
        .catch(err => {
                    //  res.send('Error: Wrong Email/Password')          
            res.status(400).json({ error: err }) 
        })
})


//User Details
users.get('/profile', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (user) {
                res.json({
                    name: user.name,
                    email: user.email,
                })
            } else {
                res.send('User does not exist')
            }
        })
        .catch(err => {
            res.send('Error: ' + err)
        })
})

users.post('/changePassword', (req, res) => {
    //Request must have email, password and new password fields
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {

                    bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                        user.update({
                            password: hash
                        })
                    })
                    console.log("Correct Password")
                    res.send('Success: Password Changed')

                } else {
                    console.log("WRONG PASSWORD")
                    res.send('Error: Wrong Password')
                }
            }
        })
})
module.exports = users