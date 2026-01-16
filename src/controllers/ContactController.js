const Contact = require('../model/ContactModel')
const nodemailer = require('nodemailer')

const createContactController = async (req,res) => {
    try {
        const {name,email,subject,message} = req.body
        const allowedFields = ['name','email','subject','message']
        const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key))
        
        if(extraFields.length > 0){
            return res.status(400).json({
                status:400,
                message:`Invalid fields: ${extraFields.join(', ')}`
            })
        }
        
        if(!name || !email || !subject || !message){
            return res.status(400).json({
                status:400,
                message:"Please provide all required fields"
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json({
                status:400,
                message:"Invalid email format"
            })
        }

        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        })

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOptions = {
            from: email,
            to: 'kunalthakur306@gmail.com',
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        }

        await transporter.sendMail(mailOptions)

        res.status(201).json({
            status:201,
            message:"Contact form submitted successfully",
            response:contact
        })

    } catch (error) {
        console.error('Contact Error:', error)
        res.status(500).json({
            status:500,
            message:"Internal server error"
        })
    }
}

module.exports = {createContactController}
