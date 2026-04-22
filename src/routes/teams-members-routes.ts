import { Router } from "express"
import { TeamMembersController } from "../controllers/teams-members-controller"
import { verifyUserAuthorization } from "../middlewares/verify-user-auth"
import { ensureAuthenticated } from "../middlewares/ensure-authentication"

const teamMembersRoutes = Router()
const teamMembersController = new TeamMembersController()

teamMembersRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(["admin"]), teamMembersController.create)
teamMembersRoutes.delete("/:id", ensureAuthenticated, verifyUserAuthorization(["admin"]), teamMembersController.delete)
teamMembersRoutes.get("/", teamMembersController.index)

export { teamMembersRoutes }