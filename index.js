const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port =process.env.PORT || 3000 ;

// middleware
app.use(cors()) // to send request from frontend to server
app.use(express.json());   //to help handle json data on server site

//9ZShLd9UDhHK34G7
//smartdbUser


const uri = "mongodb+srv://smartdbUser:9ZShLd9UDhHK34G7@cluster0.ztnzz8f.mongodb.net/?appName=Cluster0";

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

    await client.connect();

    const db = client.db('smart_db')
    const productsCollection = db.collection('products');

    app.post('/poducts', async(req,res)=>{
      const newProduct = req.body;
      const result =await productsCollection.insertOne(newProduct);
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




app.get('/', (req, res) => {
  res.send('Smart server is running!')
})

app.listen(port, () => {
  console.log(`Smart server is running on port ${port}`)
})
