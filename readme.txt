create promotion payload example:
{
  "title": "15% Off",
  "discountType": "percentage",
  "discountValue": 15,
  "startDate": "2023-07-01",
  "endDate": "2023-07-31",
  "productId": null            //applicable for all products
}

{
  "title": "Weight Discount",
  "discountType": "weighted",
  "startDate": "2023-07-01",
  "endDate": "2023-12-31",
  "productId": 2,            //applicable for productId 2
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