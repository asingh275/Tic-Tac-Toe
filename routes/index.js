const router = require('express').Router({mergeParams:true});


const emailRouter = require("./email.js");
const userRouter = require("./user.js");


router.use('/sharegameid', emailRouter);
router.use('/user', userRouter);

module.exports = router;