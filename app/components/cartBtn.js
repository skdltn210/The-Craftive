"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CartModal from "./cartModal";
import useCartStore from "@/util/useCartStore";

export default function CartBtn({ productId, productImage, productName, price, artist }) {
  const { data: session } = useSession();
  const { items, setItems } = useCartStore();
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timer;
    if (modalOpen) {
      timer = setTimeout(() => {
        setModalOpen(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [modalOpen]);

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/login");
    } else {
      await addToCart();
    }
  };

  const addToCart = async () => {
    const response = await fetch("/api/user/addCart", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        productImage: productImage,
        productName: productName,
        price: price,
        artist: artist,
      }),
    });
    if (response.ok) {
      const updatedCart = await response.json();
      setItems(updatedCart);
      setModalOpen(true);
    } else {
      console.error("장바구니에 상품을 추가하는데 실패했습니다.");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button
        className="mr-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
        onClick={handleAddToCart}
      >
        ADD CART
      </button>
      <CartModal isOpen={modalOpen} closeModal={closeModal} />
    </>
  );
}
