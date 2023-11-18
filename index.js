const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// ElWi9ERzHm4yATcs
// ZenTech

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.m7reiaq.mongodb.net/?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.m7reiaq.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.m7reiaq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

     const productCollection = client.db('BrandDB').collection("brands");
     const myCartCollection = client.db('BrandDB').collection("mycarts");

     app.get('/brands', async(req,res) => {
      const cursor = productCollection.find();
      const result  = await cursor.toArray();
      res.send(result);
     })
     app.get('/brands/:id',async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result);
     })
     app.post('/brands', async(req,res) => {
      const addProducts = req.body;
      const result = await productCollection.insertOne(addProducts);
      res.send(result);
     })
     app.put('/brands/:id', async(req,res) => {
      const updateProduct = req.body;
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert:true};
      const product = {
        $set:{
          brand:updateProduct.brand,
          productName:updateProduct.productName,
          type:updateProduct.type,
          price:updateProduct.price,
          description:updateProduct.description,
          rating:updateProduct.rating,
          photo:updateProduct.photo
        },
      };
      const result = await productCollection.updateOne(filter,product,options);
      res.send(result);

     })


    //myCart related database
    app.post('/mycarts', async(req,res) => {
      const addMyCart = req.body;
      const result = await myCartCollection.insertOne(addMyCart);
      res.send(result);
     })
   
     app.get('/mycarts', async(req,res) => {
      const cursor = myCartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
     })
     app.get('/mycarts/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await myCartCollection.findOne(query);
      res.send(result)
     })
     app.delete('/mycarts/:id', async(req,res) => {
      const id = req.params.id;
      // console.log(id)
      const query = {_id:id};
      const result = await myCartCollection.deleteOne(query);
      res.send(result);
     })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res) => {
    res.send('Zentech server is running');
})

app.listen(port, () => {
    console.log(`Zentech server is running on port: ${port}`);
})