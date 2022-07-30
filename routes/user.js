const router = require('express').Router({mergeParams:true});
const { addUser, getUserById } = require("../controller/userController.js")


router.post('/', addUser)
router.get('/:userID', getUserById)
module.exports = router;