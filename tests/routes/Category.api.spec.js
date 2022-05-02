const request = require('supertest');
const categoryRoutes = require('../../routes/api/category-routes');
const bodyParser = require('body-parser');
const express = require('express');
const { Category } = require('../../models');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/categories', categoryRoutes);
app.use(() => {
  throw new Error('Wrong Route!');
});

describe('Category api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const TEST_CATEGORY = 'Test Category';

  it('should respond correctly to a GET request at /api/categories', async () => {
    const { header, statusCode, body } = await request(app).get('/api/categories');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);

    body.forEach(({ id, category_name, Products }) => {
      expect(id).toEqual(expect.any(Number));
      expect(category_name).toEqual(expect.any(String));
      expect(Products).toEqual(expect.any(Array));
    });
  });

  it('should respond with a 500 when an error occurs during a GET request at /api/categories', async () => {
    jest.spyOn(Category, 'findAll').mockImplementationOnce(() => {
      throw new Error();
    });

    const { header, statusCode } = await request(app).get('/api/categories');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(500);
  });

  it('should respond correctly to a valid GET request at /api/categories/:id', async () => {
    const {
      header,
      statusCode,
      body: { id, category_name, Products },
    } = await request(app).get('/api/categories/1');

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);
    expect(id).toEqual(expect.any(Number));
    expect(category_name).toEqual(expect.any(String));
    expect(Products).toEqual(expect.any(Array));
  });

  it('should respond with a 500 when an error occurs during a GET request at /api/categories/:id', async () => {
    jest.spyOn(Category, 'findAll').mockImplementationOnce(() => {
      throw new Error();
    });

    const { header, statusCode } = await request(app).get('/api/categories/1');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(500);
  });

  it('should respond with a 404 code to an invalid GET request at /api/categories/:id', async () => {
    const { header, statusCode } = await request(app).get('/api/categories/999999999');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(404);
  });

  it('should respond correctly to a POST request at /api/categories', async () => {
    const {
      header,
      statusCode,
      body: { id, category_name },
    } = await request(app).post('/api/categories').set('Content-Type', 'application/json').send({
      category_name: TEST_CATEGORY,
    });

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);
    expect(id).toEqual(expect.any(Number));
    expect(category_name).toEqual(TEST_CATEGORY);
  });

  it('should respond with a 400 code to an invalid POST request at /api/categories', async () => {
    const { header, statusCode } = await request(app)
      .post('/api/categories')
      .set('Content-Type', 'application/json')
      .send({});

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(400);
  });

  it('should respond with a 200 code to a valid PUT request at /api/categories/:id', async () => {
    const { header, statusCode } = await request(app)
      .put('/api/categories/1')
      .set('Content-Type', 'application/json')
      .send({
        category_name: 'Test Category',
      });

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);
  });

  it('should respond with a 400 code to an invalid PUT request at /api/categories/:id', async () => {
    const { header, statusCode } = await request(app)
      .put('/api/categories/abcdefg')
      .set('Content-Type', 'application/json')
      .send({
        category_name: 'Test Category',
      });

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(400);
  });

  it('should respond correctly to a valid DELETE request at /api/categories/:id', async () => {
    const { header, statusCode } = await request(app).delete('/api/categories/6');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);
  });

  it('should respond correctly to an invalid DELETE request at /api/categories/:id', async () => {
    const { header, statusCode } = await request(app).delete('/api/categories/1');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(400);
  });
});
