const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  // TODO: include associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [Category],
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // TODO: include associated Category and Tag data
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category],
    });

    if (!product) {
      return res.status(404).json({ message: 'No product found with this id.' });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(200).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(
      {
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        category_id: req.body.category_id,
      },
      { where: { id: req.params.id } }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
