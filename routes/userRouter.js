const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')



router.post('/contact', userCtrl.contact)


module.exports = router