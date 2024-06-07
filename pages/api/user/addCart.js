import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  req.body = JSON.parse(req.body);

  const { productId, productImage, productName, price, artist } = req.body;

  const db = (await connectDB).db("craftive");
  const user = await db.collection("user").findOne({
    email: session.user.email,
  });

  let updatedCart;
  const existingProductIndex = user.cart.findIndex((item) => item.productId.toString() === productId);

  if (existingProductIndex !== -1) {
    updatedCart = [...user.cart];
    updatedCart[existingProductIndex].quantity += 1;
  } else {
    const newProduct = {
      productId: new ObjectId(productId),
      productImage,
      productName,
      price,
      artist,
      quantity: 1,
    };
    updatedCart = [...user.cart, newProduct];
  }

  await db.collection("user").updateOne({ email: session.user.email }, { $set: { cart: updatedCart } });

  res.status(200).json(updatedCart);
}
