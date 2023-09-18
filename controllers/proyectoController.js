import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";


const obtenerProyectos = async (req, res) => {
     // trae todos los proyectos en la DB que creo el usuario
    const proyectos = await Proyecto.find().where('creador').equals(req.usuario)

    res.json(proyectos)

}

const nuevoProyecto = async (req, res) => {
    
    const proyecto = new Proyecto(req.body)
    proyecto.creador = req.usuario._id
    
    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    
    } catch (error) {
        console.log(error);
    }

}

const obtenerProyecto = async (req, res) => {

}

const editarProyecto = async (req, res) => {

}

const eliminarProyecto = async (req, res) => {

}

const agregarColaborador = async (req, res) => {

}

const eliminarColaborador = async (req, res) => {

}

const obtenerTareas = async (req, res) => {

}


export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    // buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
    obtenerTareas,
}