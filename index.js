const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvmax46.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    const usersCollection = client.db('AirCncDB').collection('users');


    // Save user Email and role in DB
    app.put('/users/:email', async(req, res)=>{
        const email = req.params.email;
        const user = req.body;
        const query = {email: email}
        const options = {upsert: true};
        const updateDoc ={
            $set: user
        };
        const result = await usersCollection.updateOne(query, updateDoc,options);
        console.log(result)
        res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Air CNC Server is Running')
})

app.listen(port, () => {
  console.log(`Air CNC Server is Running on port ${port}`)
})