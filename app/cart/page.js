"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/util/useCartStore";
import useFetch from "@/hooks/useFetch";

export default function Cart() {
  const { items, setItems } = useCartStore();
  const [totalPrice, setTotalPrice] = useState(0);

  const cartData = useFetch("/api/user/cart");

  useEffect(() => {
    if (cartData) {
      setItems(cartData);
      calculateTotalPrice(cartData);
    }
  }, [cartData]);

  const calculateTotalPrice = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.quantity * item.price;
    });
    setTotalPrice(total);
  };

  const addToCart = async (productId, currentQuantity) => {
    const response = await fetch("/api/user/addCart", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        quantity: currentQuantity + 1,
      }),
    });
    if (response.ok) {
      const updatedCart = await response.json();
      setItems(updatedCart);
      calculateTotalPrice(updatedCart);
    } else {
      console.error("쇼핑백에 상품을 추가하는데 실패했습니다.");
    }
  };

  const subtractFromCart = async (productId, currentQuantity) => {
    const response = await fetch("/api/user/subtractCart", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        quantity: currentQuantity - 1,
      }),
    });
    if (response.ok) {
      const updatedCart = await response.json();
      setItems(updatedCart);
      calculateTotalPrice(updatedCart);
    } else {
      console.error("쇼핑백에서 상품을 제거하는데 실패했습니다.");
    }
  };

  return (
    <div className="flex justify-center my-5">
      <div className="flex flex-col">
        <h1>쇼핑백</h1>
        {items.length > 0 ? (
          <div>
            {items.map((item, i) => (
              <div className="flex items-center border-b border-gray-300 py-4" key={i}>
                <div className="flex-shrink-0 mr-4">
                  <Image
                    src={`https://craftiveproductimage.s3.ap-northeast-2.amazonaws.com/${item.productImage}`}
                    alt="image"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{item.productName}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => subtractFromCart(item.productId, item.quantity)}
                      className="bg-gray-200 text-gray-700 py-1 px-2 rounded-md mr-2"
                    >
                      -
                    </button>
                    <span className="text-gray-700 mr-2">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item.productId, item.quantity)}
                      className="bg-gray-200 text-gray-700 py-1 px-2 rounded-md"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-gray-700 mt-2">가격: {item.quantity * item.price} 원</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>쇼핑백에 상품이 없습니다.</p>
        )}
        <p className="text-gray-700 mt-4">총 가격: {totalPrice} 원</p>
        <Link
          href="/checkout"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md ml-4 mt-2 text-center w-32"
        >
          결제하기
        </Link>
      </div>
    </div>
  );
}
