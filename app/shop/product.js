"use client";

import Image from "next/image";
import Link from "next/link";

export default function Product({ result }) {
  return (
    <div className="flex justify-center mt-5">
      {result.map((a, i) => (
        <Link href={`/shop/${result[i]._id}`} key={i}>
          <Image
            src={`https://craftiveproductimage.s3.ap-northeast-2.amazonaws.com/${result[i].productImage}`}
            alt={i}
            width={300}
            height={300}
          />
          <h4>{result[i].productName}</h4>
          <h4>{result[i].productPrice}원</h4>
        </Link>
      ))}
    </div>
  );
}
