import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = (await connectDB).db("craftive");
  const session = await getServerSession(req, res, authOptions);
  const user = await db.collection("user").findOne({
    email: session.user.email,
  });
  const { artistName, workshopName, address, detailAddress, date, time, numPeople } = req.body;

  const newReservation = {
    userId: new ObjectId(user._id),
    artistName,
    workshopName,
    address,
    detailAddress,
    numPeople,
    date,
    time,
  };

  try {
    await db.collection("reservation").insertOne(newReservation);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("예약 처리 중 오류:", error);
  }
}
