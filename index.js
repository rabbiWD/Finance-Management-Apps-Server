const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

// ManagementDBUser
// V3qRSd4dj6hg98Vq

const uri = "mongodb+srv://ManagementDBUser:V3qRSd4dj6hg98Vq@cluster0.vuj5cyn.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res)=>{
    res.send('hello world!')
})

async function run() {
  try {
    await client.connect();

    const db = client.db('ManagementDBUser')
    const managementCollection = db.collection('transactions')


    app.post('/transactions', async(req,res)=>{
        const data = req.body
        console.log(data);
        const result = await managementCollection.insertOne(data)
        res.send({
            success: true,
            result
        })
    })

    // user transaction
    app.get('/my-transaction', async(req, res)=>{
        const email = req.query.email;
        const result = await managementCollection.find({userEmail: email}).toArray()
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

app.listen(port, ()=>{
    console.log(`Server is Running on port ${port}`);
})