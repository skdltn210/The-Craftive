import { connectDB } from "@/util/database";

export default async function handler(req, res) {
  if (req.method == "POST") {
    let db = (await connectDB).db("craftive");
    await db.collection("product").insertOne(req.body);
    res.status(200).redirect("/admin/product");
  }
}
