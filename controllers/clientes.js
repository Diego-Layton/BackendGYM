import Cliente from "../models/clientes.js"
import helpersClientes from "../helpers/clientes.js";

const httpClientes = {


    getClientes: async (req, res) => {

        const {busqueda} = req.query
        const cliente = await Cliente.find(
            {
                $or: [
                    { nombre: new RegExp(busqueda, "i") },
                    {documento:new RegExp(busqueda, "i")},
// {seguimiento: { peso: new RegExp(busqueda, "i")}}

                ]
            }
        )
        res.json({cliente})
    },

    getClientesID: async (req, res) => {
        const { id } = req.params
        const clientes = await Cliente.findById(id)
        res.json({ clientes })
    },


    getSeguimientoCliente: async (req, res) => {
        const { id } = req.params;
        try {
            const cliente = await Cliente.findById(id);
            if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }
            const seguimiento = cliente.seguimiento;
            res.json({ seguimiento });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getClientesPorPlan :async (req, res) => {
        try {
            const { id } = req.params;
            const clientes = await Cliente.find({ idPlan: id });
            res.json({ clientes });
        } catch (error) {
            console.error("Error al obtener clientes por ID de plan:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getClientesPorCumpleanos: async (req, res) => {
        try {
            const { dia, mes } = req.query;

            console.log(`Recibida solicitud para día ${dia} y mes ${mes}`);

            const day = parseInt(dia);
            const month = parseInt(mes);

            console.log(`Valores parseados: día=${day}, mes=${month}`);

            if (isNaN(day) || isNaN(month) || day < 1 || day > 31 || month < 1 || month > 12) {
                console.log(`Valores inválidos: día=${day}, mes=${month}`);
                return res.status(400).json({ error: "Día y mes inválidos" });
            }

            console.log(`Buscando clientes nacidos el día ${day} del mes ${month}`);

            const clientes = await Cliente.find({
                $expr: {
                    $and: [
                        { $eq: [{ $dayOfMonth: "$fechaNacimiento" }, day] },
                        { $eq: [{ $month: "$fechaNacimiento" }, month] }
                    ]
                }
            });

            console.log(`Encontrados ${clientes.length} clientes`);

            // Imprimir detalles de los clientes encontrados
            clientes.forEach(cliente => {
                console.log(`Cliente: ${cliente._id}, Nombre: ${cliente.nombre}, Fecha de nacimiento: ${cliente.fechaNacimiento}`);
            });

            res.json({ clientes });
        } catch (error) {
            console.error("Error al obtener clientes por día y mes de cumpleaños:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    getClientesactivados: async (req, res) => {
        try {
            const activados = await Cliente.find({ estado: 1 });
            res.json({ activados });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener clientes activados' });
        }
    },

    getClientesdesactivados: async (req, res) => {
        try {
        const desactivados = await Cliente.find({ estado: 0 })
        res.json({ desactivados })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener clientes activados' });
    }
    },

    // postClientes: async (req, res) => {
    //     try {
    //     const {nombre, fechaIngreso, documento,direccion,fechaNacimiento,telefono,observaciones,estado,idPlan,fechavencimiento,foto, seguimiento} = req.body
    //     const cliente = new Cliente({nombre, fechaIngreso, documento,direccion,fechaNacimiento,telefono,observaciones,estado,idPlan,fechavencimiento,foto, seguimiento})
    //     await cliente.save()
    //     res.json({ cliente })
    // }catch (error) {
    //     console.log(error);
    //     res.status(400).json({ error: "No se pudo crear el registro" })
    // }
    // },

    postClientes: async (req, res) => {
        try {
          const { nombre, fechaIngreso, documento, direccion, fechaNacimiento, telefono, observaciones, estado, idPlan, fechavencimiento, foto, seguimiento } = req.body;

          // Verificar si el documento ya existe usando el helper
          await helpersClientes.validarDocumentoUnico(documento);

          // Si no existe, proceder a crear el cliente
          const cliente = new Cliente({ nombre, fechaIngreso, documento, direccion, fechaNacimiento, telefono, observaciones, estado, idPlan, fechavencimiento, foto, seguimiento });
          await cliente.save();

          res.json({ cliente });
        } catch (error) {
          console.log(error);
          res.status(400).json({ error: error.message || "Documento duplicado" });
        }
      },

      putClientes: async (req, res) => {
        try {
          const { id } = req.params;
          const { _id, estado, ...resto } = req.body;

          // Verificar si el documento ya existe y no es el del cliente actual
        //   if (resto.documento) {
        //     await helpersClientes.validarDocumentoUnico(resto.documento, id);
        //   }

          const clienteActualizado = await Cliente.findByIdAndUpdate(id, resto, { new: true });

          res.json({ cliente: clienteActualizado });
        } catch (error) {
          console.error("Error updating cliente:", error);
          res.status(400).json({ error: error.message || "No se pudo actualizar el cliente" });
        }
      },


    putClienteSeguimiento: async (req, res) => {
        const { id } = req.params;
        const { seguimiento } = req.body;

        try {
            console.log("ID del cliente recibido:", id);
            console.log("Datos de seguimiento recibidos:", JSON.stringify(req.body, null, 2));
            console.log("Tipo de seguimiento:", typeof seguimiento);
            console.log("¿Es seguimiento un array?:", Array.isArray(seguimiento));

            if (!Array.isArray(seguimiento)) {
              console.log("Formato recibido no es un array");
              return res.status(400).json({ error: "Formato de seguimiento incorrecto" });
            }

            const cliente = await Cliente.findById(id);
            if (!cliente) {
              return res.status(404).json({ error: "Cliente no encontrado" });
            }

            const seguimientoConIMC = seguimiento.map(entry => {
              const alturaEnMetros = entry.altura / 100;
              const imc = entry.peso / (alturaEnMetros * alturaEnMetros);
              return { ...entry, imc: imc.toFixed(2) };
            });

            cliente.seguimiento.push(...seguimientoConIMC);

            await cliente.save();

            res.status(200).json({ message: "Seguimiento actualizado", cliente });
          } catch (error) {
            console.error("Error al actualizar el seguimiento", error);
            res.status(500).json({ error: "Error interno del servidor" });
          }
        },
        putEditaSeguimiento: async (req, res) => {
            const { id, seguimientoId } = req.params;
            const { seguimiento } = req.body;

            console.log("Datos recibidos:", seguimiento);

            if (!seguimiento || !Array.isArray(seguimiento) || seguimiento.length === 0) {
              return res.status(400).json({ error: "Formato de seguimiento incorrecto" });
            }

            const { peso, altura, brazo, edad } = seguimiento[0];

            try {
              const cliente = await Cliente.findById(id);
              if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado" });
              }

              const seguimientoItem = cliente.seguimiento.id(seguimientoId);
              if (!seguimientoItem) {
                return res.status(404).json({ error: "Seguimiento no encontrado" });
              }

              // Verificar que los valores de peso y altura sean válidos
              if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
                console.log("Valores de peso o altura no válidos:", { peso, altura });
                return res.status(400).json({ error: "Valores de peso o altura no válidos" });
              }

              // Calcular el IMC
              const alturaEnMetros = altura / 100;
              const imc = peso / (alturaEnMetros * alturaEnMetros);

              // Verificar que el IMC calculado sea un número válido
              if (isNaN(imc)) {
                console.log("Error en el cálculo del IMC:", { imc });
                return res.status(400).json({ error: "Error en el cálculo del IMC" });
              }

              // Actualizar los campos del seguimiento encontrado
              seguimientoItem.peso = peso;
              seguimientoItem.altura = altura;
              seguimientoItem.brazo = brazo;
              seguimientoItem.edad = edad;
              seguimientoItem.imc = imc.toFixed(2);

              await cliente.save();

              res.status(200).json({ message: "Seguimiento actualizado", cliente });
            } catch (error) {
              console.error("Error al actualizar el seguimiento", error);
              res.status(500).json({ error: "Error interno del servidor" });
            }
          },

    putClienteActivar: async (req, res) => {
        const { id } = req.params;
        try {
            const cliente = await Cliente.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }
            res.json({ cliente });
        } catch (error) {
            console.error("Error al activar cliente", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putClienteDesactivar: async (req, res) => {
        const { id } = req.params;
        try {
            const cliente = await Cliente.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!cliente) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }
            res.json({ cliente });
        } catch (error) {
            console.error("Error al desactivar cliente", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    actualizarEstados: async () => {
        try {
            const now = new Date();
            const result = await Cliente.updateMany(
                { fechavencimiento: { $lt: now } },
                { $set: { estado: 0 } }
            );
            console.log(`Clientes actualizados: ${result.nModified}`);
        } catch (error) {
            console.error('Error al actualizar estados de los clientes:', error);
        }
    },

}
export default httpClientes