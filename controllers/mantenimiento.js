import Mantenimiento from "../models/mantenimiento.js"

const httpMantenimiento = {

    getMantenimiento: async (req, res) => {
        const {busqueda} = req.query
        const mantenimiento = await Mantenimiento.find(
            {
                $or: [
                    { descripcion: new RegExp(busqueda, "i") },
                ]
            }
        )
        res.json({mantenimiento})
    },

getMantenimientoID: async (req, res) => {
        const { id } = req.params
        const mantenimiento = await Mantenimiento.findById(id)
        res.json({ mantenimiento })
    },

    getMantenimientoPorMaquina :async (req, res) => {
        try {
            const { id } = req.params;
            const mantenimiento = await Mantenimiento.find({ idMantenimiento: id });
            res.json({ mantenimiento });
        } catch (error) {
            console.error("Error al obtener mantenimientos por ID de maquina:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getMantenimientoPorFecha: async (req, res) => {
        try {
            const { fecha } = req.query;

            const fechaInicio = new Date(fecha);
            const fechaFin = new Date(fecha);
            fechaFin.setDate(fechaFin.getDate() + 1);

            const mantenimiento = await Mantenimiento.find({
                fecha: {
                    $gte: fechaInicio,
                    $lt: fechaFin
                }});
            res.json({ mantenimiento });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener los mantenimientos por fecha' });
        }
    },


    postMantenimiento: async (req, res) => {
        try {
        const {idMantenimiento,fecha,descripcion,responsable,valor} = req.body
        const mantenimiento = new Mantenimiento({idMantenimiento,fecha,descripcion,responsable,valor})
        await mantenimiento.save()
        res.json({ mantenimiento })
    }catch (error) {
        res.status(400).json({ error: "No se pudo crear el registro" })
    }
    },

    putMantenimiento: async (req, res) => {
        const { id } = req.params
        const { _id,  ...resto } = req.body
        console.log(resto);

        const mantenimiento = await Mantenimiento.findByIdAndUpdate(id, resto, { new: true })
        res.json({ mantenimiento })
    },

}
export default httpMantenimiento