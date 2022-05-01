const sequelize = require('../config/connection.js');

describe('Connection logic', () => {
  it('should yield the expected connection', () => {
    expect(sequelize?.config?.database).toEqual('ecommerce_db');
  });
});
