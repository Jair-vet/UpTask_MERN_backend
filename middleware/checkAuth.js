import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'


// Revisar si el usuario es el correcto
const checkAuth = async (req, res, next) => {

    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        try {
            token = req.headers.authorization.split(' ')[1] // Extraemos el Token
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
           
            req.usuario = await Usuario.findById(decoded.id).select(
                "-password -confirmado -token -createdAt -updatedAt -__v") // extraer la info de usuario menos la contraseña

            return next() // realizar el siguiente middleware
        } catch (error) {
            return res.status(404).json({msg: 'Hubo un error'})
        }
    }
    // Si no hay un Token
    if(!token){
        const error = new Error('Token No Válido')
        res.status(401).json({msg: error.message})
    }
    next()
}

export default checkAuth