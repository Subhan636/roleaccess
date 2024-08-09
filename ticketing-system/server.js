const { MongoClient, ServerApiVersion } = require('mongodb');
const username = 'mhakeem';
const password = 'r2dgkM9IaHZUwrVe';
const uri = `mongodb+srv://${username}:${password}@cluster0.5kjg8nz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
const db = client.db('ApprovedTicket');

const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
const app = express();
const port = 3000; // or any other port you prefer

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json())

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// Route to serve the index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve the roles.html
app.get('/roles', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'roles.html'));
});

// roles API
app.get('/api/roles', async (req, res) => {
  try {
    const db = client.db('ApprovedTicket');
    const roles = await db.collection('roles').find({}).toArray();
    res.json(roles);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/tickets', async (req, res) => {
  const ticket = req.body;
  console.log(req.headers);
  console.log(req.body);
  try {
    console.log(ticket);
    const result = await db.collection('tickets').insertOne(ticket);
    console.log(result);
    res.json(result);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/tickets/:id', async (req, res) => {
  const ticketId = req.params.id;
  const newTicket = req.body;
  console.log(newTicket);
  try {
    const result = await db.collection('tickets').replaceOne(
      { _id: ticketId },
      newTicket
    );
    res.json(result);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/tickets', async (req, res) => {
  try {
    const db = client.db('ApprovedTicket');
    const tickets = await db.collection('tickets').find({}).toArray();
    res.json(tickets);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/tickets/:id', async (req, res) => {
  const ticketId = req.params.id;
  try {
    const ticket = await db.collection('tickets').findOne({
      id: ticketId
    });
    res.json(ticket);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
);


// Route to serve the overview.html
app.get('/overview', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'overview.html'));
});

// Route to serve the review.html
app.get('/review', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'review.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
