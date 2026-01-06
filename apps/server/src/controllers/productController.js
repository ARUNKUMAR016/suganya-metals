const prisma = require("../db");

const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { product_name: "asc" },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { product_name } = req.body;
    const product = await prisma.product.create({
      data: {
        product_name,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Product name already exists" });
    }
    res.status(500).json({ error: "Failed to create product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        product_name,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    // Check for dependencies
    const productionCount = await prisma.productionItem.count({
      where: { product_id: productId },
    });
    if (productionCount > 0) {
      return res.status(400).json({
        error: "Cannot delete product: Associated with production records.",
      });
    }

    await prisma.product.delete({
      where: { id: productId },
    });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
