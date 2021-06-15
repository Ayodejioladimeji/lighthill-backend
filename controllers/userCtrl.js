const Users = require('../models/userModel')
const Auth = require('../models/authModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userCtrl = {

    // The section the contact
    contact: async (req, res) => {
        try {
            const { name, email, phone, message } = req.body;

            if (!name || !email || !phone || !message)
                return res.status(400).json({ msg: "Please fill in all fields" })

            if (!validateEmail(email))
                return res.status(400).json({ msg: "Invalid email" })
            
            const user = await Auth.findOne({ email })
            if (user) return res.status(400).json({ msg: "Thank you for Reaching Out to us once again" })
    


            const newUser = new Users({
                name, email, phone, message
            })

            await newUser.save() 
            res.json({msg: "Thank you for contacting Us"})           

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


    // The section that registers the admin
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password)
                return res.status(400).json({ msg: "Please fill in all fields" })

            if (!validateEmail(email))
                return res.status(400).json({ msg: "Invalid email" })

            const user = await Auth.findOne({ email })
            if (user) return res.status(400).json({ msg: "The email already exists." })

            if (password.length < 6)
                return res.status(400).json({ msg: "Password must at least 6 characters long." })

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 12)

            
            const newUser = new Auth({
                name, email, password:passwordHash
            })

            await newUser.save()

            res.json({ msg: "Account has been created" })
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

     // The section of thelogin
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Auth.findOne({ email })
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password." })

            // If login success , create refresh token
            const refresh_token = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            })

            res.json({ msg: "Login success!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


     // The section of the logout
     logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


    // The section that gets all contact
    allContacts: async (req, res) => {
        try {
            const users = await Users.find();

            res.json(users)
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


    // The section to delete a user
    deleteUser: async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id)

            res.json({ msg: "Deleted Successfully" })
        }
        catch (err) {
            console.log("cannot delete")
        }
    },


     // The section of the refresh token
     refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register first" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register" })

                const accesstoken = createAccessToken({ id: user.id })

                res.json({ accesstoken })
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message }, console.log("main eror"))
        }

    },



    // The section of the Get Access token
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register" })

                const access_token = createAccessToken({ id: user.id })

                res.json({ access_token })
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message }, console.log("main eror"))
        }

    },

}


// The section validating the email address
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' })
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl