import {Router} from 'express'
import httpSedes from '../controllers/sedes.js'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersSedes from '../helpers/sedes.js'
import {validarJWT} from '../middlewares/validar-jwt.js'

const router=Router()

router.get("/listar",[validarJWT],httpSedes.getSedes)

router.get("/listarid/:id",httpSedes.getSedesID)
router.get("/listaractivados",httpSedes.getSedesactivadas)
router.get("/listardesactivados",httpSedes.getSedesdesactivadas)


router.post("/escribir",[
    check('nombre','El nombre no puede estar vacio.').notEmpty(),
    check('direccion','La direccion no puede estar vacia.').notEmpty(),
    check('telefono','nueve digitos.').isMobilePhone(),
    check('ciudad','debe ir la ubicacion de la sede.').notEmpty(),
    check('telefono','nueve digitos.').isLength({min:9}),
    check('horario','escribir el horario de la sede.').isString(),
    validarCampos
],httpSedes.postSedes)

router.put("/modificar/:id",[
  check('nombre','El nombre no puede estar vacio.').notEmpty(),
  check('direccion','La direccion no puede estar vacia.').notEmpty(),
  check('telefono','nueve digitos.').isMobilePhone(),
  check('ciudad','debe ir la ubicacion de la sede.').notEmpty(),
  // check('codigo','no puede ir vacio el codigo.').notEmpty(),
  check('telefono','nueve digitos.').isLength({min:9}),
  check('horario','escribir el horario de la sede.').isString(),
  validarCampos
],httpSedes.putSedes)

router.put("/activar/activos/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersSedes.validarExistaId),
  validarCampos
],httpSedes.putSedesActivar)

router.put("/desactivar/desactivados/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersSedes.validarExistaId),
  validarCampos
],httpSedes.putSedesDesactivar)



export default router