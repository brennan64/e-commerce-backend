const router = require("express").Router();
const { Category, Product } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: Product,
    });

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async ({ params: { id } }, res) => {
  try {
    const category = await Category.findByPk(id, { include: Product });

    if (!category) {
      return res
        .status(404)
        .json({ message: "No category found with this id" });
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async ({ body }, res) => {
  try {
    const newCategory = await Category.create(body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async ({ body: { category_name }, params: { id } }, res) => {
  try {
    const updatedCategory = await Category.update(
      { category_name },
      { where: { id } }
    );
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async ({ params: { id } }, res) => {
  try {
    const deletedCategory = await Category.destroy({ where: { id } });
    res.status(200).json(deletedCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
