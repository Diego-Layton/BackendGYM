import {Router} from 'express'
import httpInventario from '../controllers/inventario.js'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersInventario from '../helpers/inventario.js'
import {validarJWT} from '../middlewares/validar-jwt.js'

const router=Router()

router.get("/listar",[validarJWT],httpInventario.getInventario)

router.get("/listarid/:id",httpInventario.getInventarioID)
router.get("/listaractivados",httpInventario.getInventarioactivado)
router.get("/listardesactivados",httpInventario.getInventariodesactivado)

router.post("/escribir",[
    check('descripcion','la descripcion no puede estar vacio.').notEmpty(),
    check('descripcion','Minimo 2 caracteres.').isLength({min:2}),
    check('valor','solo numeros').isNumeric(),
    // check('cantidad','solo numeros').isNumeric(),
    validarCampos
],httpInventario.postInventario)

router.put("/modificar/:id",[
    check('id','Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersInventario.validarExistaId),    
    check('descripcion','la descripcion no puede estar vacio.').notEmpty(),
check('descripcion','Minimo 4 caracteres.').isLength({min:6}),
check('valor','solo numeros').isNumeric(),
// check('cantidad','solo numeros').isNumeric(),
validarCampos
],httpInventario.putInventario)

router.put("/activar/activados/:id",[
    check('id','Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersInventario.validarExistaId),
    validarCampos
  ],httpInventario.putInventarioActivar)
  
  router.put("/desactivar/desactivados/:id",[
    check('id','Se necesita un mongoid valido').isMongoId(),
    check('id').custom(helpersInventario.validarExistaId),
    validarCampos
  ],httpInventario.putInventarioDesactivar)
  


export default router