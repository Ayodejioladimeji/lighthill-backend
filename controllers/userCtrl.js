const Users = require('../models/userModel')


const userCtrl = {

    // The section that registers the users
    contact: async (req, res) => {
        try {
            const { name, email, phone, message } = req.body;

            if (!name || !email || !phone || !message)
                return res.status(400).json({ msg: "Please fill in all fields" })

            if (!validateEmail(email))
                return res.status(400).json({ msg: "Invalid email" })


            const newUser = new Users({
                name, email, phone, message
            })

            await newUser.save() 
            res.json({msg: "Thank you for contacting Us"})           

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


    // The section that gets all users
    // getUsersAllInfor: async (req, res) => {
    //     try {
    //         const users = await Users.find().select('-password')

    //         res.json(users)
    //     }
    //     catch (err) {
    //         return res.status(500).json({ msg: err.message })
    //     }
    // },


    // The section to delete a user
    // deleteUser: async (req, res) => {
    //     try {
    //         await Users.findByIdAndDelete(req.params.id)

    //         res.json({ msg: "Deleted Successfully" })
    //     }
    //     catch (err) {
    //         console.log("cannot delete")
    //     }
    // },

}


// The section validating the email address
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


module.exports = userCtrl