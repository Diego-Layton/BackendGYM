import {Router} from 'express'
import httpMaquinas from '../controllers/maquinas.js'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersMaquinas from '../helpers/maquinas.js'
import {validarJWT} from '../middlewares/validar-jwt.js'

const router=Router()

router.get("/listar",[validarJWT],httpMaquinas.getMaquinas)
router.get("/listarid/:id",httpMaquinas.getMaquinasID)
router.get("/listaractivadas",httpMaquinas.getMaquinasactivadas)
router.get("/listardesactivadas",httpMaquinas.getMaquinasDesactivadas)


router.post("/escribir",[
  check('idSede','Se necesita un mongoId valido').isMongoId(),
  check('idSede').custom(helpersMaquinas.validarIdSede),
  check('descripcion','la descripcion no puede estar vacia.').notEmpty(),
  validarCampos
],httpMaquinas.postMaquinas)

router.put("/modificar/:id",[
  check('idSede','Se necesita un mongoId valido').isMongoId(),
  check('idSede').custom(helpersMaquinas.validarIdSede),
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersMaquinas.validarIdMaquina),
  check('descripcion','la descripcion no puede estar vacia.').notEmpty(),
  validarCampos
],httpMaquinas.putMaquinas)


router.put("/activar/activos/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersMaquinas.validarIdMaquina),
  validarCampos
],httpMaquinas.putMaquinasActivar)

router.put("/desactivar/desactivos/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersMaquinas.validarIdMaquina),
  validarCampos
],httpMaquinas.putMaquinasDesactivar)




export default router