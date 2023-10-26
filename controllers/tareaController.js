import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";


const agregarTarea = async (req, res) => {
  const { proyecto } = req.body;

  // Validar que el proyecto si exista
  const existeProyecto = await Proyecto.findById(proyecto);
  
  if (!existeProyecto) {
      const error = new Error('El proyecto no existe');
      return res.status(404).json({
          msg: error.message
      });
  }

  // Validar que la persona que esta dando de alta sea la creadora del proyecto
  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error('No tienes los permisos adecuados para añadir tareas');
      return res.status(403).json({
          msg: error.message
      });
  }

  try {
      const tareaAlmacenada = await Tarea.create(req.body);
      // Almacenar el id en el proyecto
      // el push ira agregando la tareas al arreglo en la posición final
      existeProyecto.tareas.push(tareaAlmacenada._id);
      await existeProyecto.save();
      res.json(tareaAlmacenada);
  } catch (error) {
      console.log(error);
  }
}


const obtenerTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  res.json(tarea);
};


const actualizarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.nombre = req.body.nombre || tarea.nombre;
  tarea.descripcion = req.body.descripcion || tarea.descripcion;
  tarea.prioridad = req.body.prioridad || tarea.prioridad;
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

  try {
    const tareaAlmacenada = await tarea.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};


const eliminarTarea = async (req, res) => {

  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  try {
    await tarea.deleteOne()
    res.json({msg: 'La Tarea se Eliminó'})

  } catch (error) {
    console.log(error);
  }
  
}


const cambiarEstado = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (
    tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
    !tarea.proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.estado = !tarea.estado;
  tarea.completado = req.usuario._id;
  await tarea.save();

  const tareaAlmacenada = await Tarea.findById(id)
    .populate("proyecto")
    .populate("completado");

  res.json(tareaAlmacenada);
}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}