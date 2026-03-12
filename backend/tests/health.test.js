process.env.REDIS_URL = "redis://localhost:6379"
jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        quit: jest.fn().mockResolvedValue('OK'),
        status: 'ready'
    }));
});

const app = require('../app')
const request = require('supertest')


describe("Health endpoint test",()=>{
    it("GET / return 200",async()=>{
        const res = await request(app).get("/");

        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success")
        expect(res.body.message).toBe("urBackend API is running 🚀")
    })
})