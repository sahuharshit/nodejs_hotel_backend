const express = require('express')
const History = express.Router()
const jwt = require('jsonwebtoken')
const models  = require('../models');
const Transaction = models.Transaction

History.post('/transactionHistory', async (req, res) => {

    let decoded

    try {
        decoded = jwt.verify(req.body.token, "secret")
    } catch (error) {
        res.send("Session expired")
        console.log(error)
    }

    if (decoded) {
        const result = await Transaction.findAll({
            attributes:['refNo', 'totalRate', 'currency', 'status'],
            where: {
                UserId: decoded.id,
            }
        })

        res.send(result)

    }

})

History.post('/bookingHistory', async (req, res) => {

    let decoded

    try {
        decoded = jwt.verify(req.body.token, "secret")
    } catch (error) {
        res.send("Session expired")
        console.log(error)
    }

    if (decoded) {
        const result = await Transaction.findAll({
            attributes:['refNo', 'totalRate', 'currency', 'status'],
            where: {
                UserId: decoded.id,
                status: "Success",
            }
        })

        res.send(result)

    }
})


module.exports = History