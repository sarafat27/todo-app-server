const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w2ezw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('todo_app').collection('tasks');

        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result)
        });

        app.get('/myTask', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks)
        })

        app.delete('/myTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(query)
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('server is running now and then')
});

app.listen(port, () => {
    console.log('listening to port', port)
})