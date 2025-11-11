const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
     
        try {
        const email = req.query.email;
        const sortBy = req.query.sortBy || 'createAt';
         const sortOrder = req.query.order === 'asc' ? 1 : -1;

        const result = await managementCollection.find({userEmail: email}).sort({[sortBy]: sortOrder}).toArray();
        res.send(result)
        } catch (error) {
          console.log(error);
        }
    })

    // delete transaction
    app.delete('/transactions/:id', async(req,res)=>{
        const {id} = req.params
        const objectId = new ObjectId(id)
        const filter = {_id: objectId}
        
        const result = await managementCollection.deleteOne(filter);
        res.send ({
            success: true,
            result
        })
    })

    // User update
    app.put('/transactions/:id', async(req, res)=>{
      const {id} = req.params;
      const data = req.body;
      const objectId =  new ObjectId(id)
      const filter = {_id: objectId}
      const update = {
        $set: data
      }
      const result = await managementCollection.updateOne(filter, update)
      res.send({
        success: true,
        result
      })
    })

    // transaction by id
    app.get('/transactions/:id', async(req, res)=>{
      const {id} = req.params;
      const objectId =  new ObjectId(id)
      const filter = {_id: objectId}
      const result = await managementCollection.findOne(filter)
      res.send({
        success: true,
        result
      })
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