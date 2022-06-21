const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const URI = "mongodb://localhost:27017/seram";

const app = express();
const client = new MongoClient(URI);

const port = 5000;

app.use(express.json());

// public html files
app.use(express.static("public"));

// routes
app.get("/notes", async (req, res) => {
  const docs = await client.db("seram").collection("notes").find().toArray();
  res.json(docs);
});

app.get("/notes/:id", async (req, res) => {
  const note = await client
    .db("seram")
    .collection("notes")
    .findOne({ _id: new ObjectId(req.params.id) });
  res.json(note);
});

app.post("/notes", async (req, res) => {
  console.log(req.body);
  if (!req.body.selectedNoteID) {
    const doc = req.body;
    const insertedDoc = await client
      .db("seram")
      .collection("notes")
      .insertOne({ title: doc.title, body: doc.body });

    res.json({ inserted: insertedDoc.insertedId });
  } else {
    const updatedDoc = await client
      .db("seram")
      .collection("notes")
      .updateOne(
        { _id: new ObjectId(req.body.selectedNoteID) },
        { $set: { title: req.body.title, body: req.body.body } }
      );

    res.json({ updated: true });
  }
});

app.delete("/notes/:key", async (req, res) => {
  await client
    .db("seram")
    .collection("notes")
    .deleteOne({ _id: new ObjectId(req.params.key) });
  res.json({ deleted: req.params.key });
});

app.listen(port, async () => {
  await client.connect();

  console.log(`Server started at http://localhost:${port}`);
});
