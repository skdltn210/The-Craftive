import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    const db = (await connectDB).db("craftive");
    const user = await db.collection("user").findOne({
      email: session.user.email,
    });
    res.status(200).json(user.cart);
  }
  res.status(200).json("");
}
