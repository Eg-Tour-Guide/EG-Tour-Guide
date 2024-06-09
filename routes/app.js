const router = require('express').Router()
const authController = require('../controllers/authController');
const appController = require('../app/home');

router.get('/home' ,authController.protect,appController.getHome);

router.get('/landmarks',authController.protect,appController.getLandMarks);

router.get('/landmark/:placeId',authController.protect,appController.getLandMark);

router.get('/artifacs',authController.protect,appController.getArtifacts);

router.get('/artifac/:artifacId',authController.protect,appController.getArtifac)

router.get('/search',authController.protect,appController.search)

module.exports = router