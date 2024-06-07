import { connectDB } from "@/util/database";
import Product from "./product";

export default async function Shop() {
  const db = (await connectDB).db("craftive");
  let result = await db.collection("product").find().toArray();

  return (
    <div>
      <Product result={JSON.parse(JSON.stringify(result))} />
    </div>
  );
}
