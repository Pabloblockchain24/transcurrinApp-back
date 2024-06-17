import userService from "../models/user.model.js"
import bcrypt from "bcrypt"
import {createAccessToken, createResetToken} from "../libs/jwt.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import config from "../config/config.js"

export const register = async (req, res) => {
    const { name, company, email, password,role } = req.body
    console.log(name, company, email, password,role)
    try{
        const userFound = await userService.findOne({email})
        if (userFound) return res.status(400).json(["El email ya esta registrado"])
        const hash = await bcrypt.hash(password, 10)
        const newUser = await userService.create({ name, company, email, password: hash, role, verificado:false, resetToken:"" })
        const token = await createAccessToken({ id: newUser._id })
        res.cookie("token", token)
        res.json({
            id: newUser._id,
            name: newUser.name,
            company: newUser.company,
            email: newUser.email,
            verificado: newUser.verificado
        })
    }catch(error){
        console.log(error)
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body   
    console.log(email)
    console.log(password)
    const userFound = await userService.findOne({ email })
    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" })
    const isMatch = await bcrypt.compare(password, userFound.password)
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" })
    jwt.sign({ id: userFound._id }, config.TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
        if (err){
            reject(err)
        } else{
            res.cookie("token", token,{sameSite:"none", secure:true}).json(userFound)
        }
        }
    )
}

export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0)
    })
    return res.sendStatus(200)
}

export const profile = async (req, res) => {
    const userFound = await userService.findById(req.user.id)

    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" })

    return res.json({
        id: userFound._id,
        name: userFound.name,
        company: userFound.company,
        email: userFound.email,
        verificado: userFound.verificado
    })
}

export const verifyToken =  async(req,res)=>{
    const {token} = req.cookies
    if(!token) return res.status(401).json({message: "unauthorized "})

    jwt.verify(token, config.TOKEN_SECRET, async (err,user)=>{
        if(err) return res.status(401).json({message: "unauthorized"})

        const userFound = await userService.findById(user.id)
        if (!userFound) return res.status(401).json({message: "unauthorized"})
   
        return res.json({
            id: userFound._id,
            name: userFound.name,
            email: userFound.email,
            company: userFound.company
        })

    })
}

const transporter = nodemailer.createTransport({
    service:"gmail",
    port:587,
    auth:{
        user:"parcepaiva@gmail.com",
        pass:"yydj uzct rbyg bluz"
    }
})

export const sendMail = async(req,res)=>{
    const {nombre,apellido,telefono,correo,empresa,servicio,mensaje} = req.body

    const mailOptions = {
        from: "Transcurrin.cl Contacto <parcepaiva@gmail.com>",
        to: "transportescurrin@gmail.com",
        subject: `Solicitud ${empresa}`,
        html: `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    p {
                        margin-bottom: 15px;
                        line-height: 1.6;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1> ¡ Tienes una nueva solicitud de contacto !  </h1>
                    <p>Nombre Completo: ${nombre} ${apellido}</p>
                    <p>Teléfono: ${telefono}</p>
                    <p>Correo: ${correo}</p>
                    <p>Empresa: ${empresa}</p>
                    <p>Servicio: ${servicio}</p>
                    <p>Mensaje: ${mensaje}</p>
                </div>
            </body>
        </html>`
    }

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error)
            res.send("Error al enviar correo")
        }else{
            console.log("Correo enviado")
            res.send(`Correo enviado`)
        }
    })
}

export const sendMailReset = async(req,res) => {
    const {email} = req.body

    let user = await userService.findOne({ email:email })
    if (!user) return res.status(404).json({ message: "Email ingresado no existe" });

    const resetToken = await createResetToken({id: user._id})
    user.resetToken = resetToken;
    await userService.updateOne({_id: user._id}, user)
    const resetLink = `http://localhost:8080/api/passwordRequestResetPassword/${resetToken}`
    // const resetLink = `https://server-transcurrin.vercel.app/api/passwordRequestResetPassword/${resetToken}`


    const mailOptions = {
        from: "Transcurrin.cl Contacto <parcepaiva@gmail.com>",
        to: `${email}`,
        subject: `Recuperacion contraseña ${email}`,
        html: `
        <html>
            <head>
            </head>
            <body>
                <div> Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetLink} </div>
            </body>
        </html>`
    }
    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error)
            res.send("Error al enviar correo")
        }else{
            res.send(`Correo enviado`)
        }
    })

}