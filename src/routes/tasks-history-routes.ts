import { Router } from "express"
import { TasksHistoryController } from "../controllers/tasks_history-controller"
import { verifyUserAuthorization } from "../middlewares/verify-user-auth"
import { ensureAuthenticated } from "../middlewares/ensure-authentication"
import { verifyTaskAccess } from "../middlewares/verify-task-access"


const tasksHistoryRoutes = Router()
const tasksHistoryController = new TasksHistoryController()

tasksHistoryRoutes.patch("/:id", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), verifyTaskAccess, tasksHistoryController.update)
tasksHistoryRoutes.get("/:id", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), verifyTaskAccess, tasksHistoryController.show)

export { tasksHistoryRoutes }