import express from 'express'
import { registrar } from '../controllers/usuarioController.js'

const router = express.Router()

// Autenticación, Registo y Confirmación de Usuarios

router.post('/', registrar) // Cear un nuevo usuario


export default router