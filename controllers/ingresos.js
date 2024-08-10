import Ingreso from "../models/ingresos.js"
import Cliente from "../models/clientes.js"

const httpIngresos = {

    getIngresos: async (req, res) => {
        const ingreso = await Ingreso.find()
        res.json({ingreso})
    },


    getIngresosNombre: async (req, res) => {
        try {
            const {busqueda} = req.query

            const clientes = await Cliente.find({$or: [ { nombre: new RegExp(busqueda, "i")}, {documento:new RegExp(busqueda, "i")}]});

            const clienteIds = clientes.map(cliente => cliente._id);

            const ingresos = await Ingreso.find({ idCliente: { $in: clienteIds } });

            res.json({ ingresos });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error del servidor" });
          }},


    getIngresosPorFecha: async (req, res) => {
        try {
            const { fecha } = req.query;

            const fechaInicio = new Date(fecha);
            const fechaFin = new Date(fecha);
            fechaFin.setDate(fechaFin.getDate() + 1);

            const ingresos = await Ingreso.find({
                fecha: {
                    $gte: fechaInicio,
                    $lt: fechaFin
                }});
            res.json({ ingresos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener los ingresos por fecha' });
        }
    },



    getIngresosID: async (req, res) => {
        const { id } = req.params
        const ingresos = await Ingreso.findById(id)
        res.json({ ingresos })
    },

    postIngresos: async (req, res) => {
        try {
        const {idSede, idCliente} = req.body
        const ingreso = new Ingreso({idSede ,idCliente})
        await ingreso.save()
        res.json({ ingreso })
    }catch (error) {
        res.status(400).json({ error: "No se pudo crear el registro" })
    }
    },

    putIngresos: async (req, res) => {
        const { id } = req.params
        const { _id, fecha, ...resto } = req.body
        console.log(resto);

        const ingreso = await Ingreso.findByIdAndUpdate(id, resto, { new: true })
        res.json({ ingreso })
    },

}
export default httpIngresos