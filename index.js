const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors')
const app = express()
const port = process.env.PORT||5000
require('dotenv').config();

app.use(cors())
app.use(express.json())
//RecipeMaster
//5YcpAhSaQH44ci9z
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5qjioco.mongodb.net/?retryWrites=true&w=majority`;
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
    const recipeCollection = client.db('recipeDB').collection('recipe');

    app.get('/recipes', async (req, res) => {
        const result = await recipeCollection.find().toArray();
        res.send(result)
      })
      app.get('/recipes/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await recipeCollection.findOne(query)
        res.send(result)
      })
      app.put('/recipes/:id', async (req, res) => {
        const id = req.params.id;
        const recipe = req.body;
        console.log(recipe)
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            title:recipe.title,
            ingredients:recipe.ingredients,
            instruction:recipe.instruction
          },
        };
        const result = await recipeCollection.updateOne(filter, updateDoc, options);
        res.send(result)
      })
      app.post('/recipes', async (req, res) => {
        const newRecipe = req.body;
        const result = await recipeCollection.insertOne(newRecipe);
        res.send(result)
      })
      app.delete('/recipes/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await recipeCollection.deleteOne(query);
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
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})