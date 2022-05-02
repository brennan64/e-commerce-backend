const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: "tag_products" }],
    });

    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async ({ params: { id } }, res) => {
  try {
    const product = await Tag.findByPk(id, {
      include: [{ model: Product, through: ProductTag, as: "tag_products" }],
    });

    if (!product) {
      return res.status(404).json({ message: "No tag found with this id." });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async ({ body }, res) => {
  try {
    const newTag = await Tag.create(body);
    res.status(200).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async ({ body: { tag_name }, params: { id } }, res) => {
  try {
    const updatedTag = await Tag.update({ tag_name }, { where: { id } });
    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async ({ params: { id } }, res) => {
  try {
    const deletedTag = await Tag.destroy({ where: { id } });
    res.status(200).json(deletedTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
