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
    const productsCollection = database.collection("products");
    const usersCollection = database.collection("users");
    const feedbackCollection = database.collection("feedback");

    //Get All Products
    app.get("/products", async (req, res) => {
      const cursor = await productsCollection.find({});
      const allProducts = await cursor.toArray();
      res.send(allProducts);
    });
    //Get Single single
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleProduct = await productsCollection.findOne(query);
      res.json(singleProduct);
    });
    //Delete single item from Products Api
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });

    //Update Single Product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedItem = req.body;
      console.log(updatedItem);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedItem.name,
          price: updatedItem.price,
          brand: updatedItem.brand,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //Get All Users
    app.get("/users", async (req, res) => {
      const cursor = await usersCollection.find({});
      const allUsers = await cursor.toArray();
      res.send(allUsers);
    });
    //Get All Reviews
    app.get("/feedback", async (req, res) => {
      const cursor = await feedbackCollection.find({});
      const allReviews = await cursor.toArray();
      res.send(allReviews);
    });
    //Add Product Api
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const product = await productsCollection.insertOne(newProduct);
      res.json(product);
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
