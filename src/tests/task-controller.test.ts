import request from "supertest"
import { app } from "../app"

describe("TasksController", () => {
    
    
    it("should create a new task successfully", async () => {
        const sessionResponse = await request(app).post("/sessions").send({
            email: "nayara@email.com",
            password: "123456"
        })
                
        const token = sessionResponse.body.token

        const response = await request(app).post("/tasks").set("Authorization", `Bearer ${token}`).send({
            title: "Test Task",
            description: "This is a test task",
            user_id: null,
            team_id: null
        })

        expect(response.status).toBe(201)
    })

    it("should list all tasks", async () => {
        const sessionResponse = await request(app).post("/sessions").send({
            email: "nayara@email.com",
            password: "123456"
        })

        const token = sessionResponse.body.token

        const response = await request(app).get("/tasks").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
    })

    it("should update a task successfully", async () => {
        const sessionResponse = await request(app).post("/sessions").send({
            email: "nayara@email.com",
            password: "123456"
        })

        const token = sessionResponse.body.token

        const createResponse = await request(app).post("/tasks").set("Authorization", `Bearer ${token}`).send({
            title: "Task to Update",
            description: "This task will be updated",
            user_id: null,
            team_id: null
        })

        const taskId = createResponse.body.id

        console.log("Created Task ID:", taskId)

        const response = await request(app).patch(`/tasks/${taskId}`).set("Authorization", `Bearer ${token}`).send({
            title: "Updated Task Title",
            description: "Updated task description"
        })

        console.log("Update Response:", response.body)

        expect(response.status).toBe(200)
    })

    it("should delete a task successfully", async () => {
        const sessionResponse = await request(app).post("/sessions").send({
            email: "nayara@email.com",
            password: "123456"
        })
                
        const token = sessionResponse.body.token

        const response = await request(app).post("/tasks").set("Authorization", `Bearer ${token}`).send({
            title: "Test Task",
            description: "This is a test task",
            user_id: null,
            team_id: null
        })

        const taskId = response.body.id

        const deleteResponse = await request(app).delete(`/tasks/${taskId}`).set("Authorization", `Bearer ${token}`)

        expect(deleteResponse.status).toBe(200)
    })

    it("should list tasks by status", async () => {
        const sessionResponse = await request(app).post("/sessions").send({
            email: "nayara@email.com",
            password: "123456"
        })

        const token = sessionResponse.body.token

        const response = await request(app).get("/tasks/status/pending").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
    })

    it("should list tasks by priority", async () => {
        const sessionResponse = await request(app).post("/sessions").send({
            email: "nayara@email.com",
            password: "123456"
        })

        const token = sessionResponse.body.token

        const response = await request(app).get("/tasks/priority/low").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
    })

    it("should assign a task to a user successfully", async () => {
        const sessionResponse = await request(app).post("/sessions").send({
            email: "nayara@email.com",
            password: "123456"
        })

        const token = sessionResponse.body.token

        const userResponse = await request(app).post("/users").send({
            name: "Test User Member",
            email: "testusermember@example.com",
            password: "123456"
        })
        
        const userId = userResponse.body.id

        const teamResponse = await request(app).post("/teams").set("Authorization", `Bearer ${token}`).send({
            name: "test team member",
            description: "a test team for unit testing"
        })
        
        const teamId = teamResponse.body.id
        
        const teamMemberResponse = await request(app).post(`/team-members`).set("Authorization", `Bearer ${token}`).send({
            user_id: String(userId),
            team_id: String(teamId)
        })

        const createResponse = await request(app).post("/tasks").set("Authorization", `Bearer ${token}`).send({
            title: "Task to Assign",
            description: "This task will be assigned to a user",
            user_id: null,
            team_id: null
        })

        const taskId = createResponse.body.id

        const assignResponse = await request(app).patch(`/tasks/assign/${taskId}`).set("Authorization", `Bearer ${token}`).send({
            user_id: String(userId),
            team_id: String(teamId)
        })

        expect(assignResponse.status).toBe(200)
    })
})