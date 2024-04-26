const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express()

// config 
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json()) 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hjmc0vt.mongodb.net/?retryWrites=true&w=majority`;

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
      
      const spotsCollections = client.db("spotsDB").collection("spots")

    app.get('/spots', async(req, res) => {
        const result = await spotsCollections.find().toArray()
        res.send(result)
    })
      
    app.get('/spot/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await spotsCollections.findOne(query)
        res.send(result)
    })
      
    app.get('/spots/:email', async (req, res) => {
        const email = req.params.email;
        console.log(email);
        const query = { email: email }
        const result = await spotsCollections.find(query).toArray()
        res.send(result)
    })
      
    app.post('/spots', async (req, res) => {
        const spots = req.body;

        const result = await spotsCollections.insertOne(spots)
        res.send(result);
    })

    app.patch('/spot/:id', async(req, res) => {
        const id = req.params.id;
        const spotInfo = req.body;
        const filter = { _id: new ObjectId(id) }
        const updateDoc = {
            $set: {
                spotName: spotInfo.spotName, 
                AVGCost: spotInfo.AVGCost,
                seasonality: spotInfo.seasonality,
                visitors: spotInfo.visitors,
                travel_time: spotInfo.travel_time,
                countryName: spotInfo.countryName,
                location: spotInfo.location,
                image: spotInfo.image,
                description: spotInfo.description,
            }
        }
        const result = await spotsCollections.updateOne(filter,updateDoc)
        res.send(result)
    })
      
    app.delete('/spot/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await spotsCollections.deleteOne(query)
        res.send(result)
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
    res.send("JourneyJoy server perfectly running")
})

app.listen(port, () => {
    console.log(`joy server running port, ${port}`);
})