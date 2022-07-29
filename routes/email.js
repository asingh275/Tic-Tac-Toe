const router = require('express').Router({mergeParams:true});
const {sendEmail} = require("../controller/emailController.js")


router.post('/', sendEmail)


    
module.exports = router;