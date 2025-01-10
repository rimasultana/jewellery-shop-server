const express = require("express");
const app = express();
const port = 5000;
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4hbah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const database = client.db("jewelleryShop");
    const jewelleryCollection = database.collection("jewellery");

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.get("/jewellery", async (req, res) => {
      const result = await jewelleryCollection.find().toArray();
      res.send(result);
    });
    app.post("/jewellery", async (req, res) => {
      const myData = req.body;
      const result = await jewelleryCollection.insertOne(myData);
      res.send(result);
    });
    app.get("/jewellery/:id", async (req, res) => {
      const id = req.params.id;
      const result = await jewelleryCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    app.put("/jewellery/:id", async (req, res) => {
      const myData = req.body;
      const id = req.params.id;
      const result = await jewelleryCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: myData }
      );
      res.send(result);
    });
    app.delete("/jewellery/:id", async (req, res) => {
      const id = req.params.id;
      const result = await jewelleryCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`jewellery shop listening on port ${port}`);
});
