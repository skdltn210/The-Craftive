import { connectDB } from "@/util/database";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email } = req.body;

      const db = (await connectDB).db("craftive");
      const result = await db.collection("user").findOneAndUpdate({ email }, { $set: { authority: "artist" } });

      if (result.value) {
        res.status(200).json({ success: true, message: "작가 권한을 부여했습니다." });
      } else {
        res.status(404).json({ success: false, message: "해당 이메일에 해당하는 유저가 없습니다." });
      }
    } catch (error) {
      console.error("Error updating user authority:", error);
      res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
    }
  } else {
    res.status(405).json({ success: false, message: "허용되지 않은 메서드입니다." });
  }
}
