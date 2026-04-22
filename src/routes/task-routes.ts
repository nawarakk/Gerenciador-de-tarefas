import { Router } from "express"
import { TaskController } from "../controllers/tasks-controller"
import { verifyUserAuthorization } from "../middlewares/verify-user-auth"
import { ensureAuthenticated } from "../middlewares/ensure-authentication"
import { verifyTaskAccess } from "../middlewares/verify-task-access"

const taskRoutes = Router()
const taskController = new TaskController()

taskRoutes.post("/", ensureAuthenticated, taskController.create)
taskRoutes.get("/", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), taskController.index)
taskRoutes.patch("/:id", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), verifyTaskAccess, taskController.update)
taskRoutes.delete("/:id", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), verifyTaskAccess, taskController.delete)
taskRoutes.get("/status/:status", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), taskController.status)
taskRoutes.get("/priority/:priority", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), taskController.priority)
taskRoutes.patch("/assign/:id", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), verifyTaskAccess, taskController.assign)

export { taskRoutes }