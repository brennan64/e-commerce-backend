const request = require('supertest');
const productRoutes = require('../../routes/api/product-routes');
const bodyParser = require('body-parser');
const express = require('express');
const { Product } = require('../../models');

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
    const { header, statusCode, body } = await request(app).get('/api/products');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);

    body.forEach(({ id, product_name, price, stock, product_tags, category_id, Category }) => {
      expect(id).toEqual(expect.any(Number));
      expect(product_name).toEqual(expect.any(String));
      expect(price).toEqual(expect.any(Number));
      expect(stock).toEqual(expect.any(Number));
      expect(product_tags).toEqual(expect.any(Array));

      // category_id must be either null or an integer
      expect([null, expect.any(Number)]).toContainEqual(category_id);

      // Category must be either null or an object like { id: Number, category_name: String }
      expect([null, { id: expect.any(Number), category_name: expect.any(String) }]).toContainEqual(
        Category
      );
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
    const {
      header,
      statusCode,
      body: { id, product_name, price, product_tags, stock, category_id, Category },
    } = await request(app).get('/api/products/1');

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);
    expect(id).toEqual(expect.any(Number));
    expect(product_name).toEqual(expect.any(String));
    expect(price).toEqual(expect.any(Number));
    expect(product_tags).toEqual(expect.any(Array));
    expect(stock).toEqual(expect.any(Number));

    // category_id must be either null or an integer
    expect([null, expect.any(Number)]).toContainEqual(category_id);

    // Category must be either null or an object like { id: Number, category_name: String }
    expect([null, { id: expect.any(Number), category_name: expect.any(String) }]).toContainEqual(
      Category
    );
  });

  it('should respond with a 500 when an error occurs during a GET request at /api/products/:id', async () => {
    jest.spyOn(Product, 'findAll').mockImplementationOnce(() => {
      throw new Error();
    });

    const { header, statusCode } = await request(app).get('/api/products/1');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(500);
  });

  it('should respond with a 404 code to an invalid GET request at /api/products/:id', async () => {
    const { header, statusCode } = await request(app).get('/api/products/999999999');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(404);
  });

  it('should respond correctly to a POST request at /api/products', async () => {
    const {
      header,
      statusCode,
      body: { id, product_name, price, stock },
    } = await request(app)
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(TEST_PRODUCT);

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);
    expect(id).toEqual(expect.any(Number));
    expect(product_name).toEqual(TEST_PRODUCT.product_name);
    expect(price).toEqual(TEST_PRODUCT.price);
    expect(stock).toEqual(TEST_PRODUCT.stock);
  });

  it('should respond with a 400 code to an invalid POST request at /api/products', async () => {
    const { header, statusCode } = await request(app)
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send({});

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(400);
  });

  it('should respond with a 200 code to a valid PUT request at /api/products/:id', async () => {
    const { header, statusCode } = await request(app)
      .put('/api/products/1')
      .set('Content-Type', 'application/json')
      .send(TEST_PRODUCT);

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);
  });

  it('should respond with a 400 code to an invalid PUT request at /api/products/:id', async () => {
    const { header, statusCode } = await request(app)
      .put('/api/products/abcdefg')
      .set('Content-Type', 'application/json')
      .send(TEST_PRODUCT);

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(400);
  });

  it('should respond correctly to a valid DELETE request at /api/products/:id', async () => {
    const { header, statusCode } = await request(app).delete('/api/products/6');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);
  });

  it('should respond correctly to an invalid DELETE request at /api/products/:id', async () => {
    const { header, statusCode } = await request(app).delete('/api/products/abcdefg');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(400);
  });
});
