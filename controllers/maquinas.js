import Maquina from "../models/maquinas.js"
import ContadorM from "../models/contadorm.js";

const obtenerSiguienteCodigo = async () => {
    const nombreContador = 'ventas';
    const contadorm = await ContadorM.findOneAndUpdate(
      { nombre: nombreContador },
      { $inc: { valor: 1 } },
      { new: true, upsert: true }
    );
    return contadorm.valor;
  };

const httpMaquinas = {

    getMaquinas: async (req, res) => {
        const {busqueda} = req.query
        const maquina = await Maquina.find(
            {
                $or: [
                    { descripcion: new RegExp(busqueda, "i") },
                    {codigo: new RegExp(busqueda, "i")},
                ]
            }
        )
        res.json({maquina})
    },

    getMaquinasID: async (req, res) => {
        try {
        const { id } = req.params
        const maquina = await Maquina.findById(id)
        res.json({ maquina })
    }catch (error) {
        res.status(400).json({ error: "no se pudo listar la maquina" })
    }
    },

    postMaquinas: async (req, res) => {
        try {
        const {idSede,descripcion,estado} = req.body
        const codigo = await obtenerSiguienteCodigo();

        const maquina = new Maquina({idSede,codigo,descripcion,estado})
        await maquina.save()
        res.json({ maquina })
    }catch (error) {
        res.status(400).json({ error: "No se pudo crear el registro" })
    }
    },

    putMaquinas: async (req, res) => {
        const { id } = req.params
        const { _id,codigo,fechaIngreso, ...resto } = req.body
        console.log(resto);

        const maquina = await Maquina.findByIdAndUpdate(id, resto, { new: true })
        res.json({ maquina })
    },

    putMaquinasActivar: async (req, res) => {
        const { id } = req.params;
        try {
            const maquina = await Maquina.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!maquina) {
                return res.status(404).json({ error: "maquina no encontrado" });
            }
            res.json({ maquina });
        } catch (error) {
            console.error("Error al activar maquina", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putMaquinasDesactivar: async (req, res) => {
        const { id } = req.params;
        try {
            const maquina = await Maquina.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!maquina) {
                return res.status(404).json({ error: "maquina no encontrado" });
            }
            res.json({ maquina });
        } catch (error) {
            console.error("Error al desactivar maquina", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    getMaquinasDesactivadas: async (req, res) => {
        try {
        const desactivadas = await Maquina.find({ estado: 0 })
        res.json({ desactivadas })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener maquinas desactivadas' });
    }
    },
    getMaquinasactivadas: async (req, res) => {
        try {
        const activadas = await Maquina.find({ estado: 1 })
        res.json({ activadas })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener maquinas activadas' });
    }
    },

}
export default httpMaquinas