import {Router} from 'express'
import httpPlanes from '../controllers/planes.js'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersPlanes from '../helpers/planes.js'
import {validarJWT} from '../middlewares/validar-jwt.js'


const router=Router()

router.get("/listar",[validarJWT],httpPlanes.getPlanes)

router.get("/listarid/:id",httpPlanes.getPlanesID)
router.get("/listaractivos",httpPlanes.getPlanesactivados)
router.get("/listardesactivados",httpPlanes.getPlanesdesactivados)


router.post("/escribir",[
    check('descripcion','la descripcion no puede estar vacia.').notEmpty(),
  check('dias','dias no puede estar vacio.').notEmpty(),
    check('valor').custom(helpersPlanes.validarValor),
    validarCampos
],httpPlanes.postPlanes)

router.put("/modificar/:id",[
  check('descripcion','la descripcion no puede estar vacia.').notEmpty(),
  check('dias','dias no puede estar vacio.').notEmpty(),
  // check('total','Numeros.').isNumeric().notEmpty(),
  check('valor','Numeros.').isNumeric().notEmpty(),
  validarCampos
],httpPlanes.putPlanes)

router.put("/activar/activos/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersPlanes.validarIdPlan),
  validarCampos
],httpPlanes.putPlanesActivar)

router.put("/desactivar/desactivados/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersPlanes.validarIdPlan),
  validarCampos
],httpPlanes.putPlanesDesactivar)



export default router