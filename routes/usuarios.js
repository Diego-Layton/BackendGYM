import {Router} from 'express'
import httpUsuarios from '../controllers/usuarios.js'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersUsuarios from '../helpers/usuarios.js'
import {validarJWT} from '../middlewares/validar-jwt.js'
import httpClientes from '../controllers/clientes.js';  // Asegúrate de que la ruta sea correcta

const router=Router()

router.get("/listar",[validarJWT],httpUsuarios.getUsuarios)
// router.get("/listar",httpUsuarios.getUsuarios)


router.get("/listarid/:id",httpUsuarios.getUsuariosID)
router.get("/listaractivados",httpUsuarios.getUsuariosactivados)
router.get("/listardesactivados",httpUsuarios.getUsuariosdesactivados)
router.get("/email", [
  check('email', 'El email debe estar bien escrito.').isEmail(),
  check('email').custom(helpersUsuarios.Noexisteelcorreo),
  validarCampos
], httpUsuarios.getemail);

router.post("/escribir",[
  check('idSede').custom(helpersUsuarios.validarIdSede),
    check('nombre','El nombre no puede estar vacio.').notEmpty(),
    check('email','El email no puede estar vacio.').notEmpty(),
    check('email','El email debe estar bien escrito.').isEmail(),
    check("email").custom(helpersUsuarios.emailExiste),
    check('telefono','Minimo 9 caracteres.').isLength({min:9}),
    check('email','El email debe estar bien escrito.').custom(helpersUsuarios.validarEmail),
    check('rol','debe especificar un rol').isString(),
    check('password', 'La contraseña debe contener al menos tres letras y tres números').custom(helpersUsuarios.validarPassword),
    validarCampos
],httpUsuarios.postUsuarios)

router.post("/login",[
  check('email','El email debe estar bien escrito.').isEmail(),
  check('email').custom(helpersUsuarios.Noexisteelcorreo),
  validarCampos
],httpUsuarios.login
)
router.post("/recuperar-password", [
  check('email', 'El email debe estar bien escrito.').isEmail(),
  validarCampos
], httpUsuarios.recuperarPassword);

router.post('/pruebaActualizarEstados', async (req, res) => {
  try {
      await httpClientes.actualizarEstados();
      res.status(200).json({ message: 'Estados actualizados correctamente' });
  } catch (error) {
      res.status(500).json({ error: 'Error al actualizar estados' });
  }
});

router.put("/modificar/:id",[
  check('id').custom(helpersUsuarios.validarIdUsuario),
  check('idSede').custom(helpersUsuarios.validarIdSede),
  check('nombre','El nombre no puede estar vacio.').notEmpty(),
  check('email','El email no puede estar vacio.').notEmpty(),
  check('email','El email debe estar bien escrito.').isEmail(),
  check('email','El email debe estar bien escrito.').isEmail(),
  check("email").custom((email, { req }) => helpersUsuarios.emailExisteExceptoPropio(email, req.params.id)),
  check('telefono','Minimo 9 caracteres.').isLength({min:9}),
  check('rol','debe especificar un rol').isString(),
  // check('password', 'La contraseña debe contener al menos tres letras y tres números').custom(helpersUsuarios.validarPassword),
  validarCampos
],httpUsuarios.putUsuarios)


router.put("/password/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersUsuarios.validarIdUsuario),
  check('password', 'La contraseña debe contener al menos tres letras y tres números').custom(helpersUsuarios.validarPassword),
  validarCampos
],httpUsuarios.putUsuariospassword)

router.put("/activar/activos/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersUsuarios.validarIdUsuario),
  validarCampos
],httpUsuarios.putUsuariosActivar)

router.put("/desactivar/desactivados/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersUsuarios.validarIdUsuario),
  validarCampos
],httpUsuarios.putUsuariosDesactivar)


export default router