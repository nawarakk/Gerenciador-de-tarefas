import { Request, Response, NextFunction } from "express"
import { prisma } from "../database/prisma"
import { AppError } from "../utils/AppError"

async function verifyTaskAccess(request: Request, response: Response, next: NextFunction) {

    if (!request.user) {
        throw new AppError("Unauthorized", 401)
    }

    const taskId = parseInt(request.params.id as string, 10)

    if (isNaN(taskId)) {
        throw new AppError("Invalid task ID", 400)
    }

    const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { assignedTo: true }
    })

    if (!task) {
        throw new AppError("Task not found", 404)
    }

    const userId = parseInt(request.user.id, 10)
    
    if (request.user.role === 'member' && task.assignedTo !== userId) {
        throw new AppError("You can only manage your own tasks", 401)
    }

    return next()
}

export { verifyTaskAccess }