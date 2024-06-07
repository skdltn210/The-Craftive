const { connectDB } = require("@/util/database");

export default async function handler(req, res) {
  const db = (await connectDB).db("craftive");
  const classes = await db.collection("class");
  const locations = await classes.find().toArray();

  res.status(200).json(locations);
}
