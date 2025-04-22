"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const request = tslib_1.__importDefault(require("supertest")).default;
process.env.NODE_ENV = 'test';
const app_1 = require("../../app");
const mongo_1 = require("../../mongo");
const newCat = { name: 'Fluffy', weight: 4, age: 2, breed: 'Bengal'};
let catId = '';
let userId = '';
const user = {
    firstName: 'Backend',
    lastName: 'Test',
    username: 'backendtest',
    email: 'test1234@example.com',
    password: 'password123'
  };

beforeAll(async () => {
    await (0, mongo_1.connectToMongo)();
    const userRes = await request(app_1.app).post('/api/user').send(user);
    const loginRes = await request(app_1.app).post('/api/login').send({
        email: user.email,
        password: user.password
      });
      userId = loginRes.body.user.id;
});
afterAll(async () => {
    await (0, supertest_1.default)(app_1.app).delete('/api/cats/delete');
    await (0, supertest_1.default)(app_1.app).delete('/api/users/delete');
    await (0, mongo_1.disconnectMongo)();
});
(0, globals_1.describe)('Cat tests', () => {
    (0, globals_1.test)('should get all cats', async () => {
        const res = await (0, supertest_1.default)(app_1.app).get('/api/cats');
        (0, globals_1.expect)(res.statusCode).toBe(200);
        (0, globals_1.expect)(res.body).toStrictEqual([]);
    });
    (0, globals_1.test)('should count all cats', async () => {
        const res = await (0, supertest_1.default)(app_1.app).get('/api/cats/count');
        (0, globals_1.expect)(res.statusCode).toBe(200);
        (0, globals_1.expect)(res.body).toStrictEqual(0);
    });
    (0, globals_1.test)('should create a new cat', async () => {
        const newCat = { name: 'Fluffy', weight: 4, age: 2, breed: 'Bengal', userId };
        const res = await (0, supertest_1.default)(app_1.app).post('/api/cats').send(newCat);
        console.log(res.statusCode, res.body);
        (0, globals_1.expect)(res.statusCode).toBe(201);
        (0, globals_1.expect)(res.body).toMatchObject(newCat);
        catId = res.body._id;
    });
    (0, globals_1.test)('should get a cat by id', async () => {
        const res = await (0, supertest_1.default)(app_1.app).get(`/api/cat/${catId}`);
        (0, globals_1.expect)(res.statusCode).toBe(200);
        (0, globals_1.expect)(res.body).toMatchObject(newCat);
    });
    (0, globals_1.test)('should update a cat by id - weight', async () => {
        const res = await (0, supertest_1.default)(app_1.app).put(`/api/cat/${catId}`).send({ weight: 5 });
        (0, globals_1.expect)(res.statusCode).toBe(200);
    });
    (0, globals_1.test)('should update a cat by id - name', async () => {
        const res = await (0, supertest_1.default)(app_1.app).put(`/api/cat/${catId}`).send({ name: 'Whiskers' });
        (0, globals_1.expect)(res.statusCode).toBe(200);
    });
    (0, globals_1.test)('should delete a cat by id', async () => {
        const res = await (0, supertest_1.default)(app_1.app).delete(`/api/cat/${catId}`);
        (0, globals_1.expect)(res.statusCode).toBe(200);
    });
});
//# sourceMappingURL=cats.spec.js.map