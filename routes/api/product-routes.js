const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag, as: "product_tags" },
      ],
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async ({ params: { id } }, res) => {
  try {
    const product = await Product.findByPk(id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag, as: "product_tags" },
      ],
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "No product found with this id." });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async ({ body }, res) => {
  try {
    const newProduct = await Product.create(body);
    res.status(200).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put(
  "/:id",
  async (
    { body: { product_name, price, stock, category_id }, params: { id } },
    res
  ) => {
    try {
      const updatedProduct = await Product.update(
        {
          product_name,
          price,
          stock,
          category_id,
        },
        { where: { id } }
      );

      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

router.delete("/:id", async ({ params: { id } }, res) => {
  try {
    const deletedProduct = await Product.destroy({ where: { id } });
    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
