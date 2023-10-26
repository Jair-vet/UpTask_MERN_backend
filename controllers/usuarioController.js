import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarId.js'
import generarJWT from '../helpers/generarJWT.js'
import { emailOlvidePassword, emailRegistro } from '../helpers/email.js'


const registrar = async (req, res) => {
    // Evitar registros duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email });

    // Si existe mandamos el error
    if (existeUsuario) {
        const error = new Error("User is already registered");
        return res.status(400).json({ msg: error.message });
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        await usuario.save() // almacenarlo en la DB

        // Enviar Email de Confirmación
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })


        res.json({msg: 'User Successfully Created, Check Your Email to Confirm Your Account'})
    } catch (error) {
        console.log(error);
    }

}

const autenticar = async(req, res) =>   {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email})
    if (!usuario) {
        const error = new Error("User does not exist");
        return res.status(404).json({ msg: error.message });
    }

    
    // Comprobar si el usuario esta autenticado
    if (!usuario.confirmado) {
        const error = new Error("Your account has not been confirmed");
        return res.status(403).json({ msg: error.message });
    }


    // Comprobar su  password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else {
        const error = new Error("Password incorrect");
        return res.status(404).json({ msg: error.message });
    }

}


const confirmar = async(req, res) =>   {
    const { token } = req.params;

    const usuarioConfirmar = await Usuario.findOne({ token }); // Encontrar el token de la DB
    // Confirmar si Existe el token
    if (!usuarioConfirmar) {
        const error = new Error("Invalid token");
        return res.status(403).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";  // Eliminar el Token, porque es solo de un uso
        await usuarioConfirmar.save();
        res.json({ msg: "Successfully Confirmed User" });

      } catch (error) {
        console.log(error);
    }

}

const  olvidePassword = async( req, res) => {
    const { email } = req.body;     // extraer el email
    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email }); 
    if (!usuario) {
      const error = new Error("User does not exist");
      return res.status(404).json({ msg: error.message });
    }
    
    // Si existe el usuario
    try {
        usuario.token = generarId();  // generar un nuevo token
        await usuario.save();
    
        //   Enviar el email
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
        });
    
        res.json({ msg: "We have sent an email with instructions" });
    } catch (error) {
      console.log(error);
    }

}

const comprobarToken = async (req, res) => {
    const { token } = req.params;     // extraer el token

    const tokenValido = await Usuario.findOne({ token });
    if (tokenValido) {
        res.json({ msg: "Valid token and User exists" });
    }else {
        const error = new Error("Invalid Token");
        return res.status(404).json({ msg: error.message });
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const usuario = await Usuario.findOne({ token });
    if (usuario) {
        usuario.password = password  // reseteamos el password
        usuario.token = ''
        await usuario.save()
        res.json({ msg: "Password Modified Correctly"})
    }else {
        const error = new Error("Could not update password");
        return res.status(404).json({ msg: error.message });
    }
}


const perfil = async (req, res) => {
    const { usuario } = req

    res.json(usuario)
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}