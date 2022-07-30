const router = require('express').Router({mergeParams:true});
const { addUser } = require("../controller/userController.js")


router.post('/', addUser)
    
module.exports = router;