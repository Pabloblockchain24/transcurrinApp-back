import {Router} from "express"
import { authRequired } from "../middlewares/validateToken.js"
import {getService,getServices,createService,deleteService,updateService} from "../controllers/intranet.controller.js"
import { validateSchema } from "../middlewares/validator.middleware.js"
import { createServiceSchema } from "../schemas/service.schema.js"

const router = Router()
router.get("/intranet", getServices)
// router.get("/intranet/:id", authRequired, getService)
// router.post("/intranet", authRequired, validateSchema(createServiceSchema), createService)
// router.delete("/intranet/:id", authRequired, deleteService)
// router.put("/intranet", authRequired, updateService)



export default router
