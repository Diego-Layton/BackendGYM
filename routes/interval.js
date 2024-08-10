import {Router} from 'express'
import httpInterval from '../controllers/interval.js'


const router=Router()

router.get("/listar",httpInterval.getInterval)

export default router