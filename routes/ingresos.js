import {Router} from 'express'
import httpIngresos from '../controllers/ingresos.js'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersIngresos from '../helpers/ingresos.js'
import {validarJWT} from '../middlewares/validar-jwt.js'

const router=Router()

router.get("/listar",[validarJWT],httpIngresos.getIngresos)
router.get("/listarnombre",httpIngresos.getIngresosNombre)
router.get("/listar",httpIngresos.getIngresos)

// router.get("/listar",httpIngresos.getIngresos)
router.get("/listarid/:id",httpIngresos.getIngresosID)
router.get("/listarfecha",httpIngresos.getIngresosPorFecha)

router.post("/escribir",[
    check('idSede','Se necesita un mongoId valido').isMongoId(),
    check('idSede').custom(helpersIngresos.validarIdSede),
    check('idCliente','Se necesita un mongoId valido').isMongoId(),
    check('idCliente').custom(helpersIngresos.validarIdCliente),
    validarCampos
],httpIngresos.postIngresos)

router.put("/modificar/:id",[
    check('id','Se necesita un mongoId valido').isMongoId(),
    check('id','Se necesita un mongoId de ingreso valido').custom(helpersIngresos.validarIdIngreso),
    validarCampos
],httpIngresos.putIngresos)



export default router