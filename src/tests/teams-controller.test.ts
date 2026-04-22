import request from "supertest"
import { app } from "../app"
import { prisma } from "../database/prisma"

describe("TeamsController", () => {
    const createdTeamIds: number[] = []

    afterAll(async () => {
        for (const id of createdTeamIds) {
            await prisma.teams.delete({ where: { id } }).catch(() => {})
        }
    })
    it("should create a new team successfully", async () => {
        const sessionResponse = await request(app).post("/sessions").send({
            email: "nayara@email.com",
            password: "123456"
        })

        const token = sessionResponse.body.token

        const response = await request(app).post("/teams").set("Authorization", `Bearer ${token}`).send({
            name: "test team",
            description: "a test team for unit testing"
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
        expect(response.body.name).toBe("test team")

        createdTeamIds.push(response.body.id)
    })

    it("should list all teams", async () => {
        const sessionResponse = await request(app).post("/sessions").send({
            email: "nayara@email.com",
            password: "123456"
        })

        const token = sessionResponse.body.token

        const response = await request(app).get("/teams").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
    })

    it("should update a team successfully", async () => {
        const sessionResponse = await request(app).post("/sessions").send({
            email: "nayara@email.com",
            password: "123456"
        })

        const token = sessionResponse.body.token

        const createResponse = await request(app).post("/teams").set("Authorization", `Bearer ${token}`).send({
            name: "team to update",
            description: "a team that will be updated in the test"
        })

        createdTeamIds.push(createResponse.body.id)

        const teamId = createResponse.body.id

        const updateResponse = await request(app).patch(`/teams/${teamId}`).set("Authorization", `Bearer ${token}`).send({
            name: "updated team name",
            description: "updated description"
        })

        expect(updateResponse.status).toBe(200)
        expect(updateResponse.body.message).toBe("Team updated successfully")
    })

    it("should delete a team successfully", async () => {
        const sessionResponse = await request(app).post("/sessions").send({
            email: "nayara@email.com",
            password: "123456"
        })

        const token = sessionResponse.body.token

        const createResponse = await request(app).post("/teams").set("Authorization", `Bearer ${token}`).send({
            name: "team to update",
            description: "a team that will be updated in the test"
        })

        createdTeamIds.push(createResponse.body.id)

        const teamId = createResponse.body.id

        const deleteResponse = await request(app).delete(`/teams/${teamId}`).set("Authorization", `Bearer ${token}`)

        expect(deleteResponse.status).toBe(200)
        expect(deleteResponse.body.message).toBe("Team deleted successfully")


    })
})