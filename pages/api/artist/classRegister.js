import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const db = (await connectDB).db("craftive");
      const { artistId, isAddressModalOpen, ...classData } = req.body;
      const newClassData = { ...classData, artistId: new ObjectId(artistId) };
      await db.collection("class").insertOne(newClassData);
      res.status(200).json("등록성공");
    } catch (error) {
      res.status(500).json({ error: "클래스 등록 중 오류가 발생했습니다." });
    }
  } else {
    res.status(405).json({ error: "허용되지 않은 메소드" });
  }
}
