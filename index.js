const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    //for bid
    const bidsCollection = db.collection('bids');
   // for users collection
   const usersCollection = db.collection('users');

   //insert for user
    
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const email = req.body.email;
            const query = { email: email }
            const existingUser = await usersCollection.findOne(query);
            
            if (existingUser) {
                res.send({message: 'user already exits. do not need to insert again'})
            }
            else {
                const result = await usersCollection.insertOne(newUser);
                res.send(result);
            }
        })
  


    //insert
    app.post('/products', async(req,res)=>{
      const newProduct = req.body;
      const result =await productsCollection.insertOne(newProduct);
      res.send(result);
    })

    //get all data
    // limit dara bojhay koyta eliment porjonto nite hobe
    // skip dara bojhay koyta skip kore ami data dakhabo
    app.get('/products',async(req,res)=>{
      // const projectFields = {title:1 , price_min:1, price_max:1, image:1}     //jgulo show korabo shegula 1 dite hbe r 0 hole sheta dakhabe na hardly  r aita use na korle shob element dakhabe
      // const cursor = productsCollection.find().sort({price_min:-1}).skip(2).limit(2).project(projectFields);

      //emailaddress die filter kore data dakhar jonno  address like http://localhost:3000/products?email=john.smith@example.com
      console.log(req,res)
      const email = req.query.email;
      const query = {}
      if (email){
        query.email=email;
      }
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    // get specific data

    app.get('/products/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await productsCollection.findOne(query);
      res.send(result)
    })

  //update
  
  app.patch('/products/:id', async(req,res)=>{
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = {_id: new ObjectId(id)}
      const update={
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price
        }
      }
      const result = await productsCollection.updateOne(query,update)
      res.send(result);
  })


    app.delete('/products/:id', async(req,res)=>{
      const id =req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    })

    //bisc related api
    app.get('/bids', async(req,res)=>{
      //for check email  http://localhost:3000/bids?email=ahnaf.rahman@example.com
      const email = req.query.email;
      const query={};
      if(email){
        query.buyer_email=email;
      }
      const cursor = bidsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    //for bids
    app.post('/bids', async(req,res)=>{
      const newBid = req.body;
      const result =await bidsCollection.insertOne(newBid);
      res.send(result);
    })

    // for bid
     app.delete('/bids/:id', async(req,res)=>{
      const id =req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await bidsCollection.deleteOne(query);
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
