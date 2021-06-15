const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')


router.post('/contact', userCtrl.contact)

router.post('/register', userCtrl.register)

router.post('/login', userCtrl.login)

router.get('/logout', userCtrl.logout)

router.get('/refresh_token', userCtrl.refreshToken)

router.get('/all_contacts', userCtrl.allContacts)

router.delete('/delete/:id', userCtrl.deleteUser)

module.exports = router