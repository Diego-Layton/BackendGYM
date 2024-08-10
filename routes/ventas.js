import {Router} from 'express'
import httpVentas from '../controllers/ventas.js'
import { check, checkExact } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersVentas from '../helpers/ventas.js'
import {validarJWT} from '../middlewares/validar-jwt.js'

const router=Router()

router.get("/listar",[validarJWT],httpVentas.getVentas)
router.get("/listar",httpVentas.getVentas)
router.get("/listarid/:id",httpVentas.getVentasID)
router.get("/listarporproducto/:id",httpVentas.getVentasporproducto)
router.get("/listarporfecha",httpVentas.getVentasPorFecha)

// router.post("/escribir",[
//   check('idInventario', 'mongo id').isMongoId(),
//   check('idInventario').custom(helpersVentas.validarIdInventario),
//     check('valorUnitario','no puede estar vacio el valor unitario y debe ser en numero.').notEmpty(),
//     check('cantidad','no puede estar vacio la cantidad y debe ser en numeros.').notEmpty().isNumeric(),
//     check("cantidad", 'no puede superar la cantidad establecida en inventario').custom(async (value, { req }) => {
//         try {
//           await helpersVentas.validarCantidadDisponible(req.body.idInventario, req.body.cantidad);
//           return true;
//         } catch (error) {
//           throw new Error(error.message);
//         }
//       }),
//     validarCampos
// ],httpVentas.postVentas)

router.post("/escribir", [
    check('idInventario', 'Debe ser un ID de Mongo válido').isMongoId(),
    check('idInventario').custom(helpersVentas.validarIdInventario),
    check('valorUnitario', 'No puede estar vacío el valor unitario y debe ser un número.').notEmpty().isNumeric(),
    check('cantidad', 'No puede estar vacía la cantidad y debe ser un número.').notEmpty().isNumeric(),
    check('cantidad', 'No puede superar la cantidad establecida en inventario').custom(async (cantidad, { req }) => {
      await helpersVentas.validarCantidadDisponible(req.body.idInventario, cantidad);
      return true;
    }),
    validarCampos
  ], httpVentas.postVentas);


router.put("/modificar/:id",[
    check('id').custom(helpersVentas.validarIdVentas),
    check('idInventario').custom(helpersVentas.validarIdInventario),
check('valorUnitario','no puede estar vacio el valor unitario y debe ser en numero.').notEmpty().isNumeric(),
check('cantidad','no puede estar vacio la cantidad y debe ser en numeros.').notEmpty().isNumeric(),
check('cantidad', 'No puede superar la cantidad establecida en inventario').custom(async (cantidad, { req }) => {
    await helpersVentas.validarCantidadDisponible(req.body.idInventario, cantidad);
    return true;
  }),validarCampos
],httpVentas.putVentas)




export default router