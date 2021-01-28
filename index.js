const express = require("express");

const bodyParser = require("body-parser");

const cors = require("cors");

const ObjectId = require("mongodb").ObjectId;
const MongoClient = require("mongodb").MongoClient;

require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4trjz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("rubix").collection("products");

  app.post("/addProduct", (req, res) => {
    const products = req.body;
    console.log(products);
    productsCollection.insertMany(products).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/product/:id", (req, res) => {
    console.log({ id: req.params.id });

    productsCollection.find({ id: req.params.id }).toArray((err, documents) => {
      console.log(documents[0]);

      res.send(documents[0]);
    });
  });


});

app.listen(process.env.PORT || port);
