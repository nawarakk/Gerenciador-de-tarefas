import { Request, Response } from "express"
import z from "zod"
import { prisma } from "../database/prisma"

class TasksHistoryController {
    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string(),
        }).transform(({ id }) => ({ id: parseInt(id, 10) }))

        const bodySchema = z.object({
            status: z.enum(["pending", "in_progress", "completed"])
        })

        const { id } = paramsSchema.parse(request.params)
        const { status } = bodySchema.parse(request.body)
        const userId = parseInt(request.user!.id, 10)

        const currentTask = await prisma.task.findUnique({
            where: { id }
        })

        if (!currentTask) {
            return response.status(404).json({ message: "Task not found" })
        }

        if(currentTask.status === status) {
            return response.status(400).json({ message: "Task is already in this status" })
        }

        await prisma.task.update({
            where: { id },
            data: { status }
        })

        await prisma.taskHistory.create({
            data: {
                taskId: id,
                changedBy: userId,
                oldStatus: currentTask.status,
                newStatus: status,
            }
        })

        return response.json({ message: "Task status updated and history recorded" })
    }

    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string(),
        }).transform(({ id }) => ({ id: parseInt(id, 10) }))

        const { id } = paramsSchema.parse(request.params)

        const history = await prisma.taskHistory.findMany({
            where: { taskId: id }
        })

        return response.json(history)
    }
}

export { TasksHistoryController }