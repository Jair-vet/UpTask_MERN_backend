import express from 'express'
import { registrar, 
    autenticar, 
    confirmar,  
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
} from '../controllers/usuarioController.js'
import checkAuth from '../middleware/checkAuth.js'


const router = express.Router()

// Autenticación, Registo y Confirmación de Usuarios

router.post('/', registrar) // Cear un nuevo usuario
router.post('/login', autenticar) // Cear un nuevo usuario
router.get('/confirmar/:token', confirmar) // Cear un nuevo usuario
router.post('/olvide-password/',  olvidePassword) // Cear un nuevo usuario
router.route("/olvide-password/:token")
    .get(comprobarToken) // Cear un nuevo usuario
    .post(nuevoPassword)  // Cear un nuevo password

router.get('/perfil', checkAuth, perfil)

export default router