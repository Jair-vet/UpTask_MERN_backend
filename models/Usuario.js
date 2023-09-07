import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const usuaioSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            require: true,
            trim: true,
        },
        password: {
            type: String,
            require: true,
            trim: true,
        },
        email: {
            type: String,
            require: true,
            trim: true,
            unique: true,
        },
        token: {
            type: String,
        },
        confirmado: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true
    }
)

usuaioSchema.pre('save', async function(next){
    
    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)   // Almacenar en el password
    this.password = await bcrypt.hash(this.password, salt)   // Hasheando el password
}) 

const Usuario = mongoose.model("Usuario", usuaioSchema)
export default Usuario