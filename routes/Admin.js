const express = require('express')
const Admin = express.Router()
const models  = require('../models');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const main=require('../Invoice');
//const fs =require('fs');
const adminmodel=models.Admin;
process.env.SECRET_KEY = 'secret' ;


Admin.get("/allUsers", async (req, res) => {
    try {
        let data = await models.User.findAll({
            attributes: ['id', 'name', 'email', 'contactNumber']
        })

        res.send(data)
    } catch (e) {
        console.log(e)
        console.log("Error in Admin - /allUsers")
    }
})
Admin.get('/finduser/:id',async(req,res)=>{
    try{
        let id =req.params.id;
        let data =await models.User.findByPk(id);
        let userdata= {
            id:data.id,
            name:data.name,
            email:data.email,
            contactNumber:data.contactNumber,
            created:data.created

        }
        res.status(200).json(userdata);
        console.log(data);
    }
    catch(e){
        console.log(e);
    }
})

Admin.put("/editUser", async (req, res) => {
    try {
       
        let user = await models.User.findOne({
            where: {
                id: req.body.id
            }
        })

        if(user === null) {
            res.send({
                status: "faliure",
                error: "No user found with userId - " + req.body.id
            })

            return
        } else {

            let newUserData = {}
        
            for (let key in req.body) {
                if (req.body.hasOwnProperty(key) && req.body[key] !== "") {
                    newUserData[key] = req.body[key]
                }
            }

            if(newUserData.hasOwnProperty("password")){
                let hash = await bcrypt.hash(newUserData.password, 10)
                newUserData.password = hash
            }


            const user1=await user.update(newUserData)
            console.log(user1);
            res.send({ status: "success" })
        }        
    } catch(e) {
        res.send({
            status: "faliure",
            error: e.message
        })
        console.log("Error in Edit user")
        console.log(e.message)
    }
})

Admin.post("/addUser", async (req, res) => {
    try {
        

        let user = await models.User.findOne({
            where: {
                email: req.body.email
            }
        })

        if(user !== null) {
            res.send({
                status: "faliure",
                error: "User with this email already exists - " + req.body.email
            })
            return

        } else  {
            let newUserData = {}
        
            for (let key in req.body) {
                if (req.body.hasOwnProperty(key) && req.body[key] !== "") {
                    newUserData[key] = req.body[key]
                }
            }
            if(newUserData.hasOwnProperty("password")){
                let hash = await bcrypt.hash(newUserData.password, 10)
                newUserData.password = hash
            }

            await models.User.create({ ...newUserData, created: new Date() })
            res.send({ status: "success" })
        }
             
    } catch(e) {
        res.send({
            status: "faliure",
            error: e.message
        })
        console.log("Error in Add user")
        console.log(e)
    }
})

Admin.post("/deleteUser", async (req, res) => {
    try {
        let user = await models.User.findOne({
            where: {
                id: req.body.id
            }
        })

        if(user !== null) {
            await models.User.destroy({
                where: {
                    id: user.id
                }
            })

            res.send({
                status: "success"
            })

        }
    } catch (e) {
        res.send({
            status: "faliure",
            error: e.message
        })
        console.log("Error in Delete user")
        console.log(e)
    }
})

Admin.get("/allTransactions", async (req, res) => {
    console.log("transaction done")
    const users = await models.Transaction.findAll({ include: [models.Commission, models.Tax] })
    res.send(users)
})


Admin.post("/cancelTransaction", async (req, res) => {
    try {
        let transaction = await models.Transaction.findOne({
            where: {
                refNo: req.body.refNo
            }
        })

        

        if(transaction !== null) {
            await transaction.update({ status: "Cancelled" })

            res.send({
                status: "success"
            })

        }
    } catch (e) {
        res.send({
            status: "faliure",
            error: e.message
        })
        console.log("Error in Delete user")
        console.log(e)
    }
})
Admin.post('/Login', (req, res) => {

    adminmodel.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(admin => {
        //    if (admin){
        //     if (bcrypt.compareSync(req.body.password, admin.password)) {
        //         res.status(201).json({admin});}
        //    }
            if (admin) {
                if (bcrypt.compareSync(req.body.password, admin.password)) {
                    let adminObject = { id: admin.id, name: admin.name, email: admin.email }
                    let token = jwt.sign(adminObject, process.env.SECRET_KEY)
                    // res.send(token)

                    res.json({
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
Admin.post('/register', async (req, res) => {
    
    
    adminmodel.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (!user) {

                bcrypt.hash(req.body.password, 10, (err, hash) => {

                    let userData = {
                        name: 'Krishna',
                        email: req.body.email,
                        password: hash,
                        created: new Date(),
                    }

                    adminmodel.create(userData)
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
Admin.get('/invoice/:refNo',async(req,res)=>{
    try{
    let pdf=await main(req.params.refNo);
    //let stat=fs.statSync(pdf);
    //res.setHeader('Content-Length', stat.size);
     res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition','attachment', "filename.jpg");
    res.send(pdf); 
    console.log(pdf);
    }
    catch(e){
        res.send(e);
    }
})
module.exports = Admin