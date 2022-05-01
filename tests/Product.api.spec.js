const request = require('supertest');
const productRoutes = require('../routes/api/product-routes');
const bodyParser = require('body-parser');
const express = require('express');
const { Product } = require('../models');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/products', productRoutes);
app.use((req, res) => {
  throw new Error('Wrong Route!');
});

describe('Product api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const TEST_PRODUCT = {
    product_name: 'Test Product',
    price: 100.0,
    stock: 20,
    category_id: 1,
  };

  it('should respond correctly to a GET request at /api/products', async () => {
    const res = await request(app).get('/api/products');

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);

    res.body.forEach((product) => {
      expect(product.id).toEqual(expect.any(Number));
      expect(product.product_name).toEqual(expect.any(String));
      expect(product.price).toEqual(expect.any(Number));
      expect(product.stock).toEqual(expect.any(Number));

      if (product?.Category) {
        expect(product.Category?.id).toEqual(expect.any(Number));
        expect(product.Category?.category_name).toEqual(expect.any(String));
      }

      if (product?.category_id) {
        expect(product.category_id).toEqual(expect.any(Number));
      }
    });
  });

  it('should respond with a 500 when an error occurs during a GET request at /api/products', async () => {
    jest.spyOn(Product, 'findAll').mockImplementationOnce(() => {
      throw new Error();
    });

    const res = await request(app).get('/api/products');

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(500);
  });

  it('should respond correctly to a valid GET request at /api/products/:id', async () => {
    const res = await request(app).get('/api/products/1');

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toEqual(expect.any(Number));
    expect(res.body.product_name).toEqual(expect.any(String));
    expect(res.body.price).toEqual(expect.any(Number));
    expect(res.body.stock).toEqual(expect.any(Number));

    if (res.body?.Category) {
      expect(res.body.Category?.id).toEqual(TEST_PRODUCT.category_id);
      expect(res.body.Category?.category_name).toEqual(expect.any(String));
    }

    if (res.body?.category_id) {
      expect(res.body.category_id).toEqual(TEST_PRODUCT.category_id);
    }
  });

  it('should respond with a 500 when an error occurs during a GET request at /api/products/:id', async () => {
    jest.spyOn(Product, 'findAll').mockImplementationOnce(() => {
      throw new Error();
    });

    const res = await request(app).get('/api/products/1');

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(500);
  });

  it('should respond with a 404 code to an invalid GET request at /api/products/:id', async () => {
    const res = await request(app).get('/api/products/999999999');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(404);
  });

  it('should respond correctly to a POST request at /api/products', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(TEST_PRODUCT);

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toEqual(expect.any(Number));
    expect(res.body.product_name).toEqual(TEST_PRODUCT.product_name);
    expect(res.body.price).toEqual(TEST_PRODUCT.price);
    expect(res.body.stock).toEqual(TEST_PRODUCT.stock);

    if (res.body?.Category) {
      expect(res.body.Category?.id).toEqual(TEST_PRODUCT.category_id);
      expect(res.body.Category?.category_name).toEqual('Test Category');
    }

    if (res.body?.category_id) {
      expect(res.body.category_id).toEqual(TEST_PRODUCT.category_id);
    }
  });

  it('should respond with a 400 code to an invalid POST request at /api/products', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send({});

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(400);
  });

  it('should respond with a 200 code to a valid PUT request at /api/products/:id', async () => {
    const res = await request(app)
      .put('/api/products/1')
      .set('Content-Type', 'application/json')
      .send(TEST_PRODUCT);

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  it('should respond with a 400 code to an invalid PUT request at /api/products/:id', async () => {
    const res = await request(app)
      .put('/api/products/abcdefg')
      .set('Content-Type', 'application/json')
      .send(TEST_PRODUCT);

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(400);
  });

  it('should respond correctly to a valid DELETE request at /api/products/:id', async () => {
    const res = await request(app).delete('/api/products/6');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  it('should respond correctly to an invalid DELETE request at /api/products/:id', async () => {
    const res = await request(app).delete('/api/products/abcdefg');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(400);
  });
});
