import { Router } from "express"
import { usersRoutes } from "./users-routes"
import { sessionRoutes } from "./sessions-routes"
import { teamRoutes } from "./teams-routes"
import { teamMembersRoutes } from "./teams-members-routes"
import { taskRoutes } from "./task-routes"
import { tasksHistoryRoutes } from "./tasks-history-routes"

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionRoutes)
routes.use("/teams", teamRoutes)
routes.use("/team-members", teamMembersRoutes)
routes.use("/tasks", taskRoutes)
routes.use("/tasks-history", tasksHistoryRoutes)

export { routes }