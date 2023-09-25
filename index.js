import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";


const app = express()
app.use(express.json()) // para procesar la información JSON

dotenv.config()

conectarDB()

// Configurar CORS
const whiteList = ['http://localhost:5173']

const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            // Puede consultar API
            callback(null, true)
        }else{
            // No esta permitido
            callback(new Error('Error de CORS'))
        }
    }
}
app.use(cors(corsOptions))


// Routing
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el Puerto ${PORT}`);
})

