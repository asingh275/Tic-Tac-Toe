const router = require('express').Router({mergeParams:true});


const emailRouter = require("./email.js");
const userRouter = require("./user.js");
const matchRouter = require("./match.js");


router.use('/sharegameid', emailRouter);
router.use('/user', userRouter);
router.use('/match', matchRouter);


module.exports = router;