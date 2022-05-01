const request = require('supertest');
const categoryRoutes = require('../routes/api/category-routes');
const bodyParser = require('body-parser');
const express = require('express');
const { Category } = require('../models');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/categories', categoryRoutes);
app.use((req, res) => {
  throw new Error('Wrong Route!');
});

describe('Category api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const TEST_CATEGORY = 'Test Category';

  it('should respond correctly to a GET request at /api/categories', async () => {
    const res = await request(app).get('/api/categories');

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);

    res.body.forEach((category) => {
      expect(category.id).toEqual(expect.any(Number));
      expect(category.category_name).toEqual(expect.any(String));

      if (category?.Products) {
        expect(category.Products).toEqual(expect.any(Array));
      }
    });
  });

  it('should respond with a 500 when an error occurs during a GET request at /api/categories', async () => {
    jest.spyOn(Category, 'findAll').mockImplementationOnce(() => {
      throw new Error();
    });

    const res = await request(app).get('/api/categories');

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(500);
  });

  it('should respond correctly to a valid GET request at /api/categories/:id', async () => {
    const res = await request(app).get('/api/categories/1');

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toEqual(expect.any(Number));
    expect(res.body.category_name).toEqual(expect.any(String));

    if (res.body?.Products) {
      expect(res.body.Products).toEqual(expect.any(Array));
    }
  });

  it('should respond with a 500 when an error occurs during a GET request at /api/categories/:id', async () => {
    jest.spyOn(Category, 'findAll').mockImplementationOnce(() => {
      throw new Error();
    });

    const res = await request(app).get('/api/categories/1');

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(500);
  });

  it('should respond with a 404 code to an invalid GET request at /api/categories/:id', async () => {
    const res = await request(app).get('/api/categories/999999999');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(404);
  });

  it('should respond correctly to a POST request at /api/categories', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Content-Type', 'application/json')
      .send({
        category_name: TEST_CATEGORY,
      });

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toEqual(expect.any(Number));
    expect(res.body.category_name).toEqual(TEST_CATEGORY);
  });

  it('should respond with a 400 code to an invalid POST request at /api/categories', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Content-Type', 'application/json')
      .send({});

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(400);
  });

  it('should respond with a 200 code to a valid PUT request at /api/categories/:id', async () => {
    const res = await request(app)
      .put('/api/categories/1')
      .set('Content-Type', 'application/json')
      .send({
        category_name: 'Test Category',
      });

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  it('should respond with a 400 code to an invalid PUT request at /api/categories/:id', async () => {
    const res = await request(app)
      .put('/api/categories/abcdefg')
      .set('Content-Type', 'application/json')
      .send({
        category_name: 'Test Category',
      });

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(400);
  });

  it('should respond correctly to a valid DELETE request at /api/categories/:id', async () => {
    const res = await request(app).delete('/api/categories/6');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  it('should respond correctly to an invalid DELETE request at /api/categories/:id', async () => {
    const res = await request(app).delete('/api/categories/1');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(400);
  });
});
