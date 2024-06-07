const { connectDB } = require("@/util/database");

export default async function handler(req, res) {
  const db = (await connectDB).db("craftive");
  const reservations = await db.collection("reservation").find().toArray();
  res.status(200).json(reservations);
}
