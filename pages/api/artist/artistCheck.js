import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  let session = await getServerSession(req, res, authOptions);
  if (session) {
    const db = (await connectDB).db("craftive");
    const result = await db.collection("user").findOne({ email: session.user.email });
    if (result.authority === "artist") {
      const { _id, name } = result;
      res.status(200).json({ isArtist: true, artistId: _id, artistName: name });
    } else {
      res.status(200).json({ isArtist: false, redirect: "/" });
    }
  }
  res.status(200).json({ isArtist: false, redirect: "/" });
}
