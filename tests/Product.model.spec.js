const { Product } = require('../models');

describe('Product model', () => {
  it('props should be valid', () => {
    expect(Object.keys(Product.fieldRawAttributesMap).sort()).toEqual([
      'category_id',
      'id',
      'price',
      'product_name',
      'stock',
    ]);
  });
});
