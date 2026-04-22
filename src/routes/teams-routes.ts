import { Router } from "express"
import { TeamController } from "../controllers/teams-controller"
import { verifyUserAuthorization } from "../middlewares/verify-user-auth"
import { ensureAuthenticated } from "../middlewares/ensure-authentication"

const teamRoutes = Router()
const teamController = new TeamController()

teamRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]))
teamRoutes.post("/", teamController.create)
teamRoutes.get("/", teamController.index)
teamRoutes.patch("/:id", teamController.update)
teamRoutes.delete("/:id", teamController.delete)

export { teamRoutes }