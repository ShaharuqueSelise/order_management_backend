import express from "express";
import Product from "../models/product.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/addproduct", [authMiddleware], async (req, res) => {
  try {
    const { name, description, price, weight, image } = req.body;
    const { user } = req;
    console.log("User:", user);

    if (user.userType !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      // Validate input
      if (!name || !description || !price || !weight) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Create product
      const product = await Product.create({
        name,
        description,
        price,
        weight,
        image,
        isEnabled: true,
      });
      res.json({ message: "Product created successfully", product });
    }
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//edit single product
router.put("/editproduct/:id", [authMiddleware], async (req, res) => {
  try {
    const { name, description, price, weight, image, isEnabled } = req.body;
    const { user } = req;
    const { id } = req.params;

    if (user.userType !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      // Validate input
      if (!name || !price || !weight) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Update product after update need full details of product 
      const product = await Product.update(
        {
          name,
          description,
          price,
          weight,
          image,
          isEnabled,
        },
        { where: { id } }
      );
      const updatedProduct = await Product.findOne({ where: { id } });

      res.json({ message: "Product updated successfully",
        updatedProduct
       });
    }
  } catch (error) {
    console.error("Edit product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
