import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

import CartBtn from "@/app/components/cartBtn";
import Image from "next/image";
import Link from "next/link";

export default async function Detail(props) {
  const db = (await connectDB).db("craftive");
  let product = await db.collection("product").findOne({ _id: new ObjectId(props.params.id) });

  return (
    <div className="flex justify-center">
      <Image
        src={`https://craftiveproductimage.s3.ap-northeast-2.amazonaws.com/${product.productImage}`}
        alt="image"
        width={400}
        height={400}
      />
      <div className="mt-20">
        <p>{product.productName}</p>
        <br />
        <p>{product.artist}</p>
        <p>{product.productPrice}원</p>
        <p>{product.productDescription}</p>
        <div className="mt-3">
          <CartBtn
            productId={product._id.toString()}
            productImage={product.productImage}
            productName={product.productName}
            price={product.productPrice}
            artist={product.artist}
          />
          <Link href="/checkout" className="mr-3 bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded">
            구매
          </Link>
        </div>
      </div>
    </div>
  );
}
