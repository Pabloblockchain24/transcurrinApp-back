import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    company: String,
    email: String,
    password: String,
    rol:String,
    verificado: Boolean,
    resetToken: String
    // roles seran cliente(yerko), admin(yo), choferes(mjimenez), depot(andres)
})

const User = mongoose.model("user", userSchema)

export default User