const router = require('express').Router({mergeParams:true});
const { addMatch, getAllMatches, getMatchById } = require("../controller/matchController.js")


router.post('/', addMatch)
router.get('/', getAllMatches)
router.get('/:gameID', getMatchById)
    
module.exports = router;