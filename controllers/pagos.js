import Pago from "../models/pagos.js"
import Plan from "../models/planes.js"
import Cliente from "../models/clientes.js"



const httpPagos = {

    getPagos: async (req, res) => {
        const pago = await Pago.find()
        res.json({pago})
    },

     getPagosNombre: async (req, res) => {
        try {
            const {busqueda} = req.query

            const clientes = await Cliente.find({$or: [ { nombre: new RegExp(busqueda, "i")}, {documento:new RegExp(busqueda, "i")}]});

            const clienteIds = clientes.map(cliente => cliente._id);

            const pago = await Pago.find({ idCliente: { $in: clienteIds } });

            res.json({ pago });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error del servidor" });
          }},

          getPagosPorFecha: async (req, res) => {
            try {
                const { fecha } = req.query;

                const fechaInicio = new Date(fecha);
                const fechaFin = new Date(fecha);
                fechaFin.setDate(fechaFin.getDate() + 1);

                const pago = await Pago.find({
                    fecha: {
                        $gte: fechaInicio,
                        $lt: fechaFin
                    }});
                res.json({ pago });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error al obtener los pagos por fecha' });
            }
        },



    getPagosactivados: async (req, res) => {
        try {
            const activados = await Pago.find({ estado: 1 });
            res.json({ activados });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener Pago activados' });
        }
    },

    getPagosdesactivados: async (req, res) => {
        try {
        const desactivados = await Pago.find({ estado: 0 })
        res.json({ desactivados })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener Pago activados' });
    }
    },

    getPagosID: async (req, res) => {
        const { id } = req.params
        const pago = await Pago.findById(id)
        res.json({ pago })
    },

    // postPagos: async (req, res) => {
    //     try {
    //         const { idCliente, idPlan, estado } = req.body;

    //         const plan = await Plan.findById(idPlan);
    //         if (!plan) {
    //             return res.status(404).json({ error: "Plan no encontrado" });
    //         }

    //         const valor = plan.valor;

    //         const pago = new Pago({ idCliente, idPlan, valor, estado });
    //         await pago.save();
    //         res.json({ pago });
    //     } catch (error) {
    //         res.status(400).json({ error: "No se pudo crear el registro" });
    //     }
    // },

    postPagos: async (req, res) => {
        try {
          const { idCliente, idPlan, estado } = req.body;

          const plan = await Plan.findById(idPlan);
          if (!plan) {
            return res.status(404).json({ error: "Plan no encontrado" });
          }

          const valor = plan.valor;
          const dias = plan.dias;

          // Calcular la fecha de vencimiento
          const fechaVencimiento = new Date();
          fechaVencimiento.setDate(fechaVencimiento.getDate() + dias);

          const pago = new Pago({ idCliente, idPlan, valor, estado });
          await pago.save();

          // Actualizar la fecha de vencimiento del cliente
          const cliente = await Cliente.findById(idCliente);
          if (!cliente) {
            return res.status(404).json({ error: "Cliente no encontrado" });
          }
          cliente.fechavencimiento = fechaVencimiento;
          await cliente.save();
console.log(pago,"este es el pagooooooooooooooooooooooooooooooooo")
          res.json({ pago, cliente });
        } catch (error) {
          res.status(400).json({ error: "No se pudo crear el registro" });
        }
      },

 putPagos: async (req, res) => {
        const { id } = req.params;
        const { _id, estado, ...resto } = req.body;

        try {
          const pago = await Pago.findByIdAndUpdate(id, resto, { new: true });
          if (!pago) {
            return res.status(404).json({ msg: 'Pago no encontrado' });
          }
          res.json({ pago });
        } catch (error) {
          console.error('Error al actualizar el pago:', error);
          res.status(500).json({ msg: 'Error al actualizar el pago' });
        }
      },
    putPagosActivar: async (req, res) => {
        const { id } = req.params;
        try {
            const pago = await Pago.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!pago) {
                return res.status(404).json({ error: "pago no encontrado" });
            }
            res.json({ pago });
        } catch (error) {
            console.error("Error al activar pago", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putPagosDesactivar: async (req, res) => {
        const { id } = req.params;
        try {
            const pago = await Pago.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!pago) {
                return res.status(404).json({ error: "pago no encontrado" });
            }
            res.json({ pago });
        } catch (error) {
            console.error("Error al desactivar pago", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
}
export default httpPagos