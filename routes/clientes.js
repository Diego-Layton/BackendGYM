import {Router} from 'express'
import httpClientes from '../controllers/clientes.js'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersClientes from '../helpers/clientes.js'
import {validarJWT} from '../middlewares/validar-jwt.js'


const router=Router()


router.get("/listar",[validarJWT],httpClientes.getClientes)
router.get("/listar",httpClientes.getClientes)
router.get("/listar",httpClientes.getClientes)
router.get("/listarid/:id",httpClientes.getClientesID)
router.get("/seguimiento",httpClientes.getSeguimientoCliente)
router.get("/porplan/:id",httpClientes.getClientesPorPlan)
router.get("/cumpleanos",httpClientes.getClientesPorCumpleanos);
router.get("/listaractivados",httpClientes.getClientesactivados)
router.get("/listardesactivados",httpClientes.getClientesdesactivados)


router.post("/escribir",[
    check('nombre','El documento no puede estar vacio.').notEmpty(),
    check('documento','Minimo 6 caracteres.').isLength({min:6}),
    check('documento').custom(helpersClientes.validarDocumentoUnico),
    check('idPlan','Se necesita un mongoid valido').isMongoId(),
    check('idPlan').custom(helpersClientes.validaridPlan),
    check('telefono', 'minimo 9 caracteres.').isLength({min:9}),
    validarCampos
],httpClientes.postClientes)


router.put("/modificar/:id",[
  check("documento").custom((documento, { req }) => helpersClientes.documentoExisteExceptoPropio(documento, req.params.id)),
    check('nombre','El documento no puede estar vacio.').notEmpty(),
    check('observaciones','las observaciones no puede estar vacias.').notEmpty(),
    check('documento','Minimo 6 caracteres.').isLength({min:6}),
    check('telefono', 'minimo 9 caracteres.').isLength({min:9}),
    check('telefono', 'en digitos.').isNumeric().notEmpty(),
    validarCampos
]
,httpClientes.putClientes)

router.put("/modificar/seguimiento/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersClientes.validarExistaIdcliente),
  validarCampos
],httpClientes.putClienteSeguimiento)

router.put("/editar/seguimiento/:id/:seguimientoId", [
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('seguimientoId','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersClientes.validarExistaIdcliente),
  validarCampos
],httpClientes.putEditaSeguimiento);


router.put("/activar/activados/:id",[
    check('id','Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersClientes.validarExistaIdcliente),
    validarCampos
  ],httpClientes.putClienteActivar)

  router.put("/desactivar/desactivados/:id",[
    check('id','Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersClientes.validarExistaIdcliente),
    validarCampos
  ],httpClientes.putClienteDesactivar)




export default router
