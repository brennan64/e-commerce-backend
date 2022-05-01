const { ProductTag } = require('../models');

describe('ProductTag model', () => {
  it('props should be valid', () => {
    expect(Object.keys(ProductTag.fieldRawAttributesMap).sort()).toEqual([
      'id',
      'product_id',
      'tag_id',
    ]);
  });
});
