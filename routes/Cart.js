// const express = require('express')
// const Cart = express.Router()
// const jwt = require('jsonwebtoken')
// const CartItem = require('../models/CartItem')

// Cart.post('/addItem', async (req, res) => {
//     let decoded

//     try {
//         decoded = jwt.verify(req.body.token, "secret")
//     } catch (error) {
//         res.send("Session expired")
//         console.log(error)
//     }

//     if (decoded) {

//         let itemAlreadyPresent = await CartItem.findOne({
//             where: {
//                 userId: decoded.id,
//                 roomId: req.body.roomId,
//             }
//         })

//         if (itemAlreadyPresent) {
//             console.log("item already exists -", itemAlreadyPresent)

//             CartItem.update({
//                 quantity: itemAlreadyPresent.quantity + 1
//             }, {
//                 where: {
//                     userId: decoded.id,
//                     roomId: req.body.roomId,
//                 }
//             })

//             res.send("Updated Item")

//         } else {

//             let newItem = {
//                 userId: decoded.id,
//                 roomId: req.body.roomId,
//                 quantity: 1,
//             }

//             try{
//                 await CartItem.create(newItem)
//                 res.send("Added Item")

//             } catch (error) {
//                 console.log(error)
//                 res.send("Error")
//             }

            

//         }
//     }
// })

// Cart.post('/removeItem', async (req, res) => {
//     let decoded

//     try {
//         decoded = jwt.verify(req.body.token, "secret")
//     } catch (error) {
//         res.send("Session expired")
//         console.log(error)
//     }

//     if (decoded) {
//         let itemAlreadyPresent = await CartItem.findOne({
//             where: {
//                 userId: decoded.id,
//                 roomId: req.body.roomId,
//             }
//         })

//         if (itemAlreadyPresent) {

//             if(itemAlreadyPresent.quantity === 1){
//                CartItem.destroy({
//                    where: {
//                         userId: decoded.id,
//                         roomId: req.body.roomId,
//                    }
//                })

//                res.send("Item removed")

//             } else if (itemAlreadyPresent.quantity > 1) {

//                 CartItem.update({
//                     quantity: itemAlreadyPresent.quantity - 1
//                 }, {
//                     where: {
//                         userId: decoded.id,
//                         roomId: req.body.roomId,
//                     }
//                 })

//                 res.send("Updated Item")

//             }

//         } else {
//             res.send("Error")
//         }
//     }
        
// }) 


// Cart.post('/allItems', async (req, res) => {
//     let decoded

//     try {
//         decoded = jwt.verify(req.body.token, "secret")
//     } catch (error) {
//         res.send("Session expired")
//         console.log(error)
//     }

//     if (decoded) {
//         let allItems = await CartItem.findAll({
//             where: {
//                 userId: decoded.id,
//             }
//         })

//         //console.log(allItems)
//         res.send(allItems)
//     }

// })


// module.exports = Cart