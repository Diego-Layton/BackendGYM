import {Router} from 'express'
import httpCompras from '../controllers/compras.js'
import { check, checkExact } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersCompras from '../helpers/compras.js'
import {validarJWT} from '../middlewares/validar-jwt.js'

const router=Router()

router.get("/listar",[validarJWT],httpCompras.getCompras)
router.get("/listar",httpCompras.getCompras)
router.get("/listarid/:id",httpCompras.getComprasID)
router.get("/listarporproducto/:id",httpCompras.getComprasporproducto)
router.get("/listarporproveedor/:id",httpCompras.getComprasporproducto)
router.get("/listarporfecha",httpCompras.getComprasPorFecha)

router.post("/escribir", [
    check('idInventario', 'Debe ser un ID de Mongo válido').isMongoId(),
    check('idInventario').custom(helpersCompras.validarIdInventario),
    check('idProveedor', 'Debe ser un ID de Mongo válido').isMongoId(),
    check('idProveedor').custom(helpersCompras.validaridProveedor),
    check('valorUnitario', 'No puede estar vacío el valor unitario y debe ser un número.').notEmpty().isNumeric(),
    check('cantidad', 'No puede estar vacía la cantidad y debe ser un número.').notEmpty().isNumeric(),
    validarCampos
  ], httpCompras.postCompras);


router.put("/modificar/:id",[
    check('id').custom(helpersCompras.validarIdCompra),
    check('idInventario', 'Debe ser un ID de Mongo válido').isMongoId(),
    check('idInventario').custom(helpersCompras.validarIdInventario),
    check('idProveedor', 'Debe ser un ID de Mongo válido').isMongoId(),
    check('idProveedor').custom(helpersCompras.validaridProveedor),
    check('valorUnitario','no puede estar vacio el valor unitario y debe ser en numero.').notEmpty().isNumeric(),
check('cantidad','no puede estar vacio la cantidad y debe ser en numeros.').notEmpty().isNumeric(),
validarCampos
],httpCompras.putCompras)




export default router