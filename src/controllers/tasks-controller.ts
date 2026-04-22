import { Request, Response } from "express"
import z from "zod"
import { prisma } from "../database/prisma"
import { TaskStatus } from "@prisma/client"
import { TaskPriority } from "@prisma/client"

class TaskController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            title: z.string().min(3).trim(),
            description: z.string().nullable().optional(),
            user_id: z.string().nullable(),
            team_id: z.string().nullable(),
        }).transform(({ user_id, team_id, title, description }) => ({ user_id: user_id ? parseInt(user_id, 10) : null, team_id: team_id ? parseInt(team_id, 10) : null, title, description }))

        const { title, description, user_id, team_id } = bodySchema.parse(request.body)

        if (user_id && team_id) {
            const isTeamMember = await prisma.teamMembers.findFirst({
                where: {
                    userId: user_id,
                    teamId: team_id
                }
            })

            if(!isTeamMember) {
                return response.status(403).json({ message: `User is not a member of team` })
            }
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                assignedTo: user_id,
                teamId: team_id
            }
        })

        return response.status(201).json({ message: "Task created successfully", id: task.id })
    }

    async index(request: Request, response: Response) {
        let tasks;

        if (request.user?.role === 'admin') {
            tasks = await prisma.task.findMany({})  
        } else {
            const userId = parseInt(request.user!.id, 10)
            tasks = await prisma.task.findMany({
                where: {
                    assignedTo: userId
                }
            });
        }

        return response.json(tasks)
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string(),
        }).transform(({ id }) => ({ id: parseInt(id, 10) }))

        const bodySchema = z.object({
            title: z.string().min(3).trim().optional(),
            description: z.string().nullable().optional()
        })

        const { id } = paramsSchema.parse(request.params)
        const { title, description } = bodySchema.parse(request.body)

        await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
            }
        })

        return response.json({ message: "Task updated successfully" })
    }

    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string(),
        }).transform(({ id }) => ({ id: parseInt(id, 10) }))

        const { id } = paramsSchema.parse(request.params)

        await prisma.task.delete({
            where: { id }
        })

        return response.json({ message: "Task deleted successfully" })

    }
    
    async status(request: Request, response: Response) {
        const paramsSchema = z.object({
            status: z.enum(TaskStatus),
        })

        const { status } = paramsSchema.parse(request.params)

        let tasks;

        if (request.user?.role === 'admin') {
            tasks = await prisma.task.findMany({
                where: { status }
            });
        } else {
            const userId = parseInt(request.user!.id, 10)

            tasks = await prisma.task.findMany({
                where: {
                    status,
                    assignedTo: userId
                }
            });
        }

        return response.json(tasks)
    }

    async priority(request: Request, response: Response) {
        const paramsSchema = z.object({
            priority: z.enum(TaskPriority),
        })

        const { priority } = paramsSchema.parse(request.params)

        let tasks;

        if (request.user?.role === 'admin') {
            tasks = await prisma.task.findMany({
                where: { priority }
            });
        } else {
            const userId = parseInt(request.user!.id, 10)

            tasks = await prisma.task.findMany({
                where: {
                    priority,
                    assignedTo: userId
                }
            });
        }
        return response.json(tasks)
    }

    async assign(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string(),
        }).transform(({ id }) => ({ id: parseInt(id, 10) }))

        const bodySchema = z.object({
            user_id: z.string(),
            team_id: z.string(),
        }).transform(({ user_id, team_id }) => ({ user_id: parseInt(user_id, 10), team_id: parseInt(team_id, 10) }))

        const { id } = paramsSchema.parse(request.params)
        const { user_id, team_id } = bodySchema.parse(request.body)

        const isTeamMember = await prisma.teamMembers.findFirst({
            where: {
                userId: user_id,
                teamId: team_id
            }
        })

        if(!isTeamMember) {
            return response.status(403).json({ message: `User is not a member of team` })
        }

        await prisma.task.update({
            where: { id },
            data: {
                assignedTo: user_id,
                teamId: team_id
            }
        })

        return response.json({ message: "Task assigned successfully" })

    }
}

export { TaskController }