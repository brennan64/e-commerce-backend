const { Tag } = require('../../models');

describe('Tag model', () => {
  it('props should be valid', () => {
    expect(Object.keys(Tag.fieldRawAttributesMap).sort()).toEqual(['id', 'tag_name']);
  });
});
