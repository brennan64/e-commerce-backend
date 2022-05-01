const { Category } = require('../models');

describe('Category model', () => {
  it('props should be valid', () => {
    expect(Object.keys(Category.fieldRawAttributesMap).sort()).toEqual(['category_name', 'id']);
  });
});
