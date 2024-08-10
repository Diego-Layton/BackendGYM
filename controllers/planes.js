import Plan from "../models/planes.js"
import ContadorP from "../models/contadorp.js";

const obtenerSiguienteCodigo = async () => {
  const nombreContador = 'ventas';
  const contadorp = await ContadorP.findOneAndUpdate(
    { nombre: nombreContador },
    { $inc: { valor: 1 } },
    { new: true, upsert: true }
  );
  return contadorp.valor;
};
const httpPlanes = {

    getPlanes: async (req, res) => {
        const {busqueda} = req.query
        const plan = await Plan.find(
            {
                $or: [
                    { descripcion: new RegExp(busqueda, "i") },
                    {codigo: new RegExp(busqueda, "i")},
                ]
            }
        )
        res.json({plan})
    },

    getPlanesID: async (req, res) => {
        const { id } = req.params
        const plan = await Plan.findById(id)
        res.json({ plan })
    },

    postPlanes: async (req, res) => {
        try {
        const {descripcion,valor,dias,estado} = req.body
        const codigo = await obtenerSiguienteCodigo();

        const plan = new Plan({codigo,descripcion,valor,dias,estado})
        await plan.save()
        res.json({ plan })
    }catch (error) {
        console.log(error);
        res.status(400).json({ error: "No se pudo crear el registro" })
    }
    },

    getPlanesactivados: async (req, res) => {
        try {
            const activados = await Plan.find({ estado: 1 });
            res.json({ activados });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener planes activados' });
        }
    },

    getPlanesdesactivados: async (req, res) => {
        try {
        const desactivados = await Plan.find({ estado: 0 })
        res.json({ desactivados })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener planes desactivados' });
    }
    },

    putPlanes: async (req, res) => {
        const { id } = req.params
        const { _id, codigo,estado,  ...resto } = req.body
        console.log(resto);

        const plan = await Plan.findByIdAndUpdate(id, resto, { new: true })
        res.json({ plan })
    },

    putPlanesActivar: async (req, res) => {
        const { id } = req.params;
        try {
            const plan = await Plan.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!plan) {
                return res.status(404).json({ error: "plan no encontrado" });
            }
            res.json({ plan });
        } catch (error) {
            console.error("Error al activar plan", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putPlanesDesactivar: async (req, res) => {
        const { id } = req.params;
        try {
            const plan = await Plan.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!plan) {
                return res.status(404).json({ error: "plan no encontrado" });
            }
            res.json({ plan });
        } catch (error) {
            console.error("Error al desactivar plan", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
}
export default httpPlanes