const express = require('express')
const Payment = express.Router()
const sha = require('../security/sha256.js')
const jwt = require('jsonwebtoken')
const path = require('path');
const models  = require('../models');



const Transaction = models.Transaction
const Tax = models.Tax
const Commission = models.Commission

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

Payment.post("/getReference", async (req, res) => {
    


    try {
        
        decoded = jwt.verify(req.body.token, "secret") // on faliure throws error

        
        let merchantKey = "gBzekIE174" //process.env.MERCHANT_KEY 
        let merchantCode = "M05252"
        
        let currency = req.body.data.currency
        let data = req.body.data.hotel.rates[0]
        let rateId = data.hasOwnProperty('id') ? data.id : null
        let baseRate = data.hasOwnProperty('baseRate') ? data.baseRate : null
        let depositRequired = data.hasOwnProperty('depositRequired') ? data.depositRequired : null
        let guaranteeRequired = data.hasOwnProperty('guaranteeRequired') ? data.guaranteeRequired : null
        let onlineCancellable = data.hasOwnProperty('onlineCancellable') ? data.onlineCancellable : null
        let payAtHotel = data.hasOwnProperty('payAtHotel') ? data.payAtHotel : null
        let providerId = data.hasOwnProperty('providerId') ? data.providerId : null
        let refundable = data.hasOwnProperty('refundable') ? data.refundable : null

        // let amountSignature = Math.round((data.totalRate + Number.EPSILON) * 100)  //gets the numebr required for signature
        let amountSignature = Math.round((1.00 + Number.EPSILON) * 100)  //testing


        let totalRate = (amountSignature/100).toFixed(2)

        let transactionData = {
            currency,
            rateId,
            totalRate,
            baseRate,
            depositRequired,
            guaranteeRequired,
            onlineCancellable,
            payAtHotel,
            providerId,
            refundable,
            totalRate,
            UserId: decoded.id,
            timestamp: new Date(),
            status: "Processing",
        }
        

        let amountRequest = numberWithCommas(totalRate)

        console.log(totalRate, " ",amountSignature, " ", amountRequest)

        const result = await models.sequelize.transaction(async (t) => {

            let newTransaction = await Transaction.create(transactionData, { transaction: t })
            
            if(data.taxes && data.taxes.length > 0){

                let temp = data.taxes 
                for(let i in temp){
                    temp[i].TransactionRefNo = newTransaction.refNo
                }
                let taxData = await Tax.bulkCreate(temp, { transaction: t })
                newTransaction.setTaxes(taxData)
            }

            if(data.commission && data.commission.length > 0){
                let temp = data.commission 
                for(let i in temp){
                    temp[i].TransactionRefNo = newTransaction.refNo
                }
                let commissionData = await Commission.bulkCreate(temp, { transaction: t })
                newTransaction.setCommissions(commissionData)
            } else if( typeof(data.commission) === 'object' && data.commission !== null ){
                let newCommissionData = {
                    amount: data.commission.hasOwnProperty("amount") ? data.commission.amount : null,
                    description: data.commission.hasOwnProperty("description") ? data.commission.description : null,
                    type: data.commission.hasOwnProperty("type") ? data.commission.type : null,
                    TransactionRefNo: newTransaction.refNo
                }

                let newCommission = await Commission.create(newCommissionData, { transaction: t })
                await newTransaction.addCommission(newCommission)
            }

            return newTransaction
        })

        let signature = merchantKey + merchantCode + result.refNo + amountSignature + currency

        console.log(signature)
        let hash = sha.sha256(signature)
        let userInfo = await models.User.findOne({ where: { id: decoded.id }})
        res.send({
            status: "success",
            data: {
                MerchantCode: merchantCode,
                RefNo: result.refNo,
                Amount: amountRequest,
                Currency: result.currency,
                ProdDesc: "Book Hotels",
                UserName: userInfo.name,
                UserEmail: userInfo.email,
                // UserContact: userInfo.contactNumber,  
                UserContact: "9999887766", //testing
                SignatureType: "SHA256",
                Signature: hash,
                ResponseURL: "https://www.visitorsdeals.com/payment/response",
                BackendURL: "https://www.visitorsdeals.com/payment/backendResponse",
            }
        })

    } catch (err) {
        console.log(err)
        console.log('Error: error in get reference')
        res.send('Error: error in getting reference')
    }

})

Payment.post("/response", async (req, res) => {
    if(req.body.Status === "0"){

        try {
    
            const result = await Transaction.update({
                status: "Failed",
                timestamp: new Date()
            },{ 
                where:{ 
                    refNo: req.body.RefNo 
                }
            })


            const redirect = path.join(__dirname, '/../static', 'redirectOnFail.html');
            res.sendFile(redirect);

        } catch (error) {
            console.log("Error in faliure /response")
            console.log(error)
        }

    } else if (req.body.Status === "1"){

        try {

            let merchantKey = "gBzekIE174" //process.env.MERCHANT_KEY 

            //(MerchantKey & MerchantCode & PaymentId & RefNo & Amount & Currency & Status)

            formattedAmount = (req.body.amount).replace(/(,)|(\.)/g, "") // to remove , and .


            let checkString = merchantKey+req.body.MerchantCode+req.body.PaymentId+req.body.RefNo+formattedAmount+req.body.Currency+req.body.Status
            
            let generatedHash = sha.sha256(checkString)

            if(req.body.Signature === generatedHash){
                //matching credentials, approve payment

                await Transaction.update({
                    status: "Success",
                    timestamp: new Date()
                },{ 
                    where:{ 
                        refNo: req.body.RefNo 
                    }
                })
    
                const redirect = path.join(__dirname, '/../static', 'redirectOnSuccess.html');
                res.sendFile(redirect);

            }
            
        } catch (error) {
            console.log("Error in success /response")
            console.log(error)
        } 
    }
})


Payment.post("/backendResponse", async (req, res) => {

    try {

        let merchantKey = "gBzekIE174" //process.env.MERCHANT_KEY 

        //(MerchantKey & MerchantCode & PaymentId & RefNo & Amount & Currency & Status)

        formattedAmount = (req.body.amount).replace(/(,)|(\.)/g, "") // to remove , and .


        let checkString = merchantKey+req.body.MerchantCode+req.body.PaymentId+req.body.RefNo+formattedAmount+req.body.Currency+req.body.Status
        
        let generatedHash = sha.sha256(checkString)

        if(req.body.Signature === generatedHash){
            //matching credentials, approve payment

            await Transaction.update({
                status: "Success",
                timestamp: new Date()
            },{ 
                where:{ 
                    refNo: req.body.RefNo 
                }
            })

            res.send("RECEIVEOK")

        }

    } catch (error) {
        console.log("Error in success /backendResponse")
        console.log(error)
    }  
})

module.exports = Payment