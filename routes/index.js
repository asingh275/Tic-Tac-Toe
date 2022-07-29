const router = require('express').Router({mergeParams:true});


const emailRouter = require("./email.js");


router.use('/sharegameid', emailRouter);

module.exports = router;