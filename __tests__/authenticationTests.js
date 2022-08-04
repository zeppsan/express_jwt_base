const request = require("supertest");
const app = require('../app');
const models = require('../lib/models/index')
const authService = require('../lib/services/authService')


beforeAll(async() => {
    await models.User.destroy({
        where: {
            email: "testregistrator@apiBase.com"
        }
    })
})

/* Registration */
describe("Given a username, email and password", () => {
    it("Should return status 200 when data is correct", async() => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                username: "testregistrator",
                email: "testregistrator@apiBase.com",
                password: "Sodastream123!!"
            })
            .set('accept', 'application/json')
            .set('content-type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(201)
                expect(JSON.parse(response.text)).toBeDefined()
                expect(JSON.parse(response.text).username).toBeDefined()
                expect(JSON.parse(response.text).email).toBeDefined()
                expect(JSON.parse(response.text).id).toBeDefined()
                expect(JSON.parse(response.text).password).toBeUndefined()
            })
    })

    it("Should return status 400 when password is weak", async() => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                username: "testregistrator2",
                email: "testregistrator2@apiBase.com",
                password: "123123"
            })
            .set('accept', 'application/json')
            .set('content-type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(400)
                expect(JSON.parse(response.text).message).toBeDefined()
            })
    })

    it("Should return 400 when email is invalid", async() => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                username: "testregistrator3",
                email: "testregistraapiBase.com",
                password: "Sodastream123!!"
            })
            .set('accept', 'application/json')
            .set('content-type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(400)
                expect(JSON.parse(response.text).message).toBeDefined()
            })
    })
})

/* Login */
describe("Given an email and password", () => {
    it("Authtoken and user should be returned when correct credentials are provided", async() => {
        await request(app)
            .post('/auth/login')
            .send({
                email: "testregistrator@apiBase.com",
                password: "Sodastream123!!"
            })
            .set('accept', 'application/json')
            .set('content-type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(200)
                expect(JSON.parse(response.text).token).toBeDefined()
                expect(JSON.parse(response.text).user).toBeDefined()
            })
    })

    it("sensitive credentials is not going to be returned.", async() => {
        await request(app)
            .post('/auth/login')
            .send({
                email: "testregistrator@apiBase.com",
                password: "Sodastream123!!"
            })
            .set('accept', 'application/json')
            .set('content-type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(200)
                expect(JSON.parse(response.text).user.email_verified).toBeUndefined()
                expect(JSON.parse(response.text).user.updatedAt).toBeUndefined()
                expect(JSON.parse(response.text).user.password).toBeUndefined()
            })
    })

    it("Should return 401 when credentials is wrong", async() => {
        await request(app)
            .post('/auth/login')
            .send({
                email: "testregistrator@apiBase.com",
                password: "Sodastream345!!" // Wrong password
            })
            .set('accept', 'application/json')
            .set('content-type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(401)
                expect(JSON.parse(response.text).message).toBeDefined()
            })
    })

    it("Should return 400 when email is missing", async() => {
        await request(app)
            .post('/auth/login')
            .send({
                password: "Sodastre23!!"
            })
            .set('accept', 'application/json')
            .set('content-type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(400)
                expect(JSON.parse(response.text).message).toBeDefined()
            })
    })

    it("Should return 400 when password is missing", async() => {
        await request(app)
            .post('/auth/login')
            .send({
                email: "asdasd@asd.se"
            })
            .set('accept', 'application/json')
            .set('content-type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(400)
                expect(JSON.parse(response.text).message).toBeDefined()
            })
    })

    it("Should return 400 when email is invlaid", async() => {
        await request(app)
            .post('/auth/login')
            .send({
                email: "asdasasd.se",
                password: "Aasdasd123!!"
            })
            .set('accept', 'application/json')
            .set('content-type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(400)
                expect(JSON.parse(response.text).message).toBeDefined()
            })
    })
})