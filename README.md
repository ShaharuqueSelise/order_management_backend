# API Documentation

## Overview
This API allows users to log in, add products, create promotions, and place orders.

---

## **1. User Login**
### **Endpoint:**
`POST http://localhost:3000/api/v1/login`

### **Request Payload:**
```json
{
  "email": "admin@gmail.com",
  "password": "admin"
}
```

### **Response Example:**
```json
{
  "token": "your_jwt_token",
  "user": {
    "id": 1,
    "email": "admin@gmail.com"
  }
}
```

---

## **2. Add Product**
### **Endpoint:**
`POST http://localhost:3000/api/v1/addproduct`

### **Request Payload:**
```json
{
  "name": "Duck",
  "description": "really yummy and tasty",
  "price": 12.74,
  "weight": 12,
  "image": "https://ibb.co.com/qMR8hX44"
}
```

### **Response Example:**
```json
{
  "message": "Product added successfully",
  "productId": 5
}
```

---

## **3. Create Promotion**
### **Endpoint:**
`POST http://localhost:3000/api/v1/create/promotion`

### **Request Payload (Percentage Discount Example):**
```json
{
  "title": "15% Off",
  "discountType": "percentage",
  "discountValue": 15,
  "startDate": "2023-07-01",
  "endDate": "2023-07-31",
  "productId": 3
}
```

### **Request Payload (Weighted Discount Example):**
```json
{
  "title": "Weight Discount",
  "discountType": "weighted",
  "startDate": "2023-07-01",
  "endDate": "2023-12-31",
  "productId": 2,            
  "slabs": [
    {
      "minWeight": 1000,
      "maxWeight": 5500,
      "discountPerUnit": 2
    },
    {
      "minWeight": 6000,
      "maxWeight": 8500,
      "discountPerUnit": 3
    },
    {
      "minWeight": 9000,
      "maxWeight": 11500,
      "discountPerUnit": 4
    },
    {
      "minWeight": 12000,
      "maxWeight": null,
      "discountPerUnit": 5
    }
  ]
}
```

### **Response Example:**
```json
{
  "message": "Promotion created successfully",
  "promotionId": 10
}
```

---

## **4. Create Order**
### **Endpoint:**
`POST http://localhost:3000/api/v1/create/order`

### **Request Payload (Percentage Discount Product):**
```json
{
  "customerInfo": {
    "name": "shaik",
    "email": "shaik@example.com",
    "address": "456 Oak Street"
  },
  "items": [
    {
      "productId": 3,
      "quantity": 4
    }
  ]
}
```

### **Request Payload (Weighted Discount Product):**
```json
{
  "customerInfo": {
    "name": "shaik",
    "email": "shaik@example.com",
    "address": "456 Oak Street"
  },
  "items": [
    {
      "productId": 2,
      "quantity": 4
    }
  ]
}
```

### **Response Example:**
```json
{
  "message": "Order placed successfully",
  "orderId": 25,
  "totalAmount": 48.50
}
```

---

## **Authentication**
- The `token` received from the **Login API** must be included in the **Authorization Header** for secure endpoints.
  
Example:
```text
Authorization: Bearer your_jwt_token
```

---

## **Notes**
- All dates should be in `YYYY-MM-DD` format.
- Weighted discounts require specifying discount slabs based on weight.
- Ensure proper authentication for protected routes.
- Handle validation errors in API responses.

---

## **Contact**
For any issues, reach out to the API team at `support@example.com`. 🚀

