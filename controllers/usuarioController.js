import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarId.js'


const registrar = async (req, res) => {
    // Evitar registros duplicados
    const { email } = req.body
    const existeUsuario = await Usuario.findOne({ email })

    // Si existe mandamos el error
    if (existeUsuario){
        const error = new Error('El Usuario Ya Esta Registrado')
        return res.status(400).json({ msg: error.message })
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        const usuarioAlmacenado = await usuario.save() // almacenarlo en la DB
        res.json(usuarioAlmacenado)

    } catch (error) {
        console.log(error);
    }

}

const autenticar = async(req, res) =>   {
    const { email, password } = req.body

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email})
    // Si el usuario no existe
    if(!usuario){
        const error = new Error('El usuario no existe')
        return res.status(404).json({ msg: error.message })
    }

    
    // Comprobar si el usuario esta autenticado
    if(!usuario.confirmado){
        const error = new Error('Tu Cuenta no ha sido Confirmada')
        return res.status(404).json({ msg: error.message })
    }


    // Comprobar su  password


}


export {
    registrar,
    autenticar,
}