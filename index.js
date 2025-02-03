import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoute from './routes/auth.js'
import productRoute from './routes/products.js'
import promotionRoute from './routes/promotions.js'
import orderRoute from './routes/orders.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(
    cors({
      origin: "*",
    })
  );

// Routes
app.get("/test",(req,res)=>{
    res.send('This is test')
  })

app.use("/api/v1", authRoute); 
app.use("/api/v1",productRoute); 
app.use("/api/v1",promotionRoute);
app.use("/api/v1",orderRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));