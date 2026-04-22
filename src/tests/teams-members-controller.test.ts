import request from "supertest"
import { app } from "../app"
import { prisma } from "../database/prisma"

describe("TeamsMembersController", () => {
    let createdUserId: number | null = null
    let createdTeamId: number | null = null

    afterEach(async () => {
        if (createdUserId || createdTeamId) {
            await prisma.teamMembers.deleteMany({
                where: {
                    OR: [
                        { userId: createdUserId ?? undefined },
                        { teamId: createdTeamId ?? undefined }
                    ]
                }
            })

            if (createdTeamId) {
                await prisma.teams.delete({
                    where: { id: createdTeamId }
                })
            }

            if (createdUserId) {
                await prisma.users.delete({
                    where: { id: createdUserId }
                })
            }

            createdUserId = null
            createdTeamId = null
        }
    })

    it("should add a member to a team successfully", async () => {
        const userResponse = await request(app).post("/users").send({
            name: "Test User Member",
            email: "testusermember@example.com",
            password: "123456"
        })

        createdUserId = userResponse.body.id

        const sessionResponse = await request(app).post("/sessions").send({
            email: "nayara@email.com",
            password: "123456"
        })
        
        const token = sessionResponse.body.token
        
        const teamResponse = await request(app).post("/teams").set("Authorization", `Bearer ${token}`).send({
            name: "test team member",
            description: "a test team for unit testing"
        })

        createdTeamId = teamResponse.body.id

        const response = await request(app).post(`/team-members`).set("Authorization", `Bearer ${token}`).send({
            user_id: String(createdUserId),
            team_id: String(createdTeamId)
        })

        expect(response.status).toBe(201)
    })
})