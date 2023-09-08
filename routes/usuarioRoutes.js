import express from 'express'
import { registrar, autenticar } from '../controllers/usuarioController.js'

const router = express.Router()

// Autenticación, Registo y Confirmación de Usuarios

router.post('/', registrar) // Cear un nuevo usuario
router.post('/login', autenticar) // Cear un nuevo usuario


export default router