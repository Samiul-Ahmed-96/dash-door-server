const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());
//Database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iy3km.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    console.log("db connected");
    const database = client.db("dash-door");
    const products = database.collection("products");

    //Get All Products
    app.get("/products", async (req, res) => {
      const cursor = await products.find({});
      const allProducts = await cursor.toArray();
      res.send(allProducts);
    });
   
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Dash-Door Server Running");
});

app.listen(port, () => {
  console.log("Dash-Door Server Running", port);
});
