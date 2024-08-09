import { MongoClient, ServerApiVersion } from 'mongodb';
const username = 'mhakeem';
const password = 'r2dgkM9IaHZUwrVe';
const uri = `mongodb+srv://${username}:${password}@cluster0.5kjg8nz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;mongodb+srv://${username}:${password}@cluster0.5kjg8nz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });


test_connection = async function() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } finally {
        console.log("may or may not have worked")
        // Ensures that the client will close when you finish/error
        await client.close();
      }
}

export { test_connection };