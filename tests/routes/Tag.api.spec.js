const request = require('supertest');
const tagRoutes = require('../../routes/api/tag-routes');
const bodyParser = require('body-parser');
const express = require('express');
const { Tag } = require('../../models');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/tags', tagRoutes);
app.use((req, res) => {
  throw new Error('Wrong Route!');
});

describe('Tag api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const TEST_TAG = 'test tag';

  it('should respond correctly to a GET request at /api/tags', async () => {
    const { header, statusCode, body } = await request(app).get('/api/tags');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);

    body.forEach(({ id, tag_name, tag_products }) => {
      expect(id).toEqual(expect.any(Number));
      expect([null, expect.any(String)]).toContainEqual(tag_name);
      expect(tag_products).toEqual(expect.any(Array));
    });
  });

  it('should respond with a 500 when an error occurs during a GET request at /api/tags', async () => {
    jest.spyOn(Tag, 'findAll').mockImplementationOnce(() => {
      throw new Error();
    });

    const { header, statusCode } = await request(app).get('/api/tags');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(500);
  });

  it('should respond correctly to a valid GET request at /api/tags/:id', async () => {
    const {
      header,
      statusCode,
      body: { id, tag_name, tag_products },
    } = await request(app).get('/api/tags/1');

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);
    expect(id).toEqual(expect.any(Number));
    expect(tag_name).toEqual(expect.any(String));
    expect(tag_products).toEqual(expect.any(Array));
  });

  it('should respond with a 500 when an error occurs during a GET request at /api/tags/:id', async () => {
    jest.spyOn(Tag, 'findAll').mockImplementationOnce(() => {
      throw new Error();
    });

    const { header, statusCode } = await request(app).get('/api/tags/1');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(500);
  });

  it('should respond with a 404 code to an invalid GET request at /api/tags/:id', async () => {
    const { header, statusCode } = await request(app).get('/api/tags/999999999');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(404);
  });

  it('should respond correctly to a POST request at /api/tags', async () => {
    const {
      header,
      statusCode,
      body: { id, tag_name },
    } = await request(app).post('/api/tags').set('Content-Type', 'application/json').send({
      tag_name: TEST_TAG,
    });

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);
    expect(id).toEqual(expect.any(Number));
    expect(tag_name).toEqual(TEST_TAG);
  });

  it('should respond with a 400 code to an invalid POST request at /api/tags', async () => {
    const { header, statusCode } = await request(app)
      .post('/api/tags')
      .set('Content-Type', 'application/json')
      .send([]);

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(400);
  });

  it('should respond with a 200 code to a valid PUT request at /api/tags/:id', async () => {
    const { header, statusCode } = await request(app)
      .put('/api/tags/1')
      .set('Content-Type', 'application/json')
      .send({
        tag_name: TEST_TAG,
      });

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);
  });

  it('should respond with a 400 code to an invalid PUT request at /api/tags/:id', async () => {
    const { header, statusCode } = await request(app)
      .put('/api/tags/abcdefg')
      .set('Content-Type', 'application/json')
      .send({
        tag_name: TEST_TAG,
      });

    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(400);
  });

  it('should respond correctly to a valid DELETE request at /api/tags/:id', async () => {
    const { header, statusCode } = await request(app).delete('/api/tags/9');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(200);
  });

  it('should respond correctly to an invalid DELETE request at /api/tags/:id', async () => {
    const { header, statusCode } = await request(app).delete('/api/tags/abcdefg');
    expect(header['content-type']).toBe('application/json; charset=utf-8');
    expect(statusCode).toBe(400);
  });
});
