import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method == "POST") {
    let 바꿀거 = {
      name: req.body.name,
      mobile: req.body.mobile,
    };
    const db = (await connectDB).db("craftive");
    await db.collection("user").updateOne({ _id: new ObjectId(req.body._id) }, { $set: 바꿀거 });
    res.writeHead(302, { Location: "/mypage" });
    res.end();
  }
}
