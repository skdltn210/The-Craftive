"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import useFetch from "@/hooks/useFetch";

export default function Product() {
  let file, filename;
  const [previewURL, setPreviewURL] = useState();
  const { data: session } = useSession();
  const checkAdmin = useFetch("/api/admin/adminCheck");

  if (!session) {
    redirect("/");
  }

  useEffect(() => {
    if (checkAdmin && !checkAdmin.isAdmin) {
      throw new Error("Network response was not ok");
    }
  }, [checkAdmin]);

  return (
    <div className="flex justify-center h-screen my-5">
      <img src={previewURL} className="w-1/3" />
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3"
        action="/api/admin/productRegister"
        method="POST"
      >
        <div className="mb-4" style={{ position: "relative" }}>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product-image">
            상품 이미지
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="file"
            name="productImage"
            accept="image/*"
            onChange={async (e) => {
              file = e.target.files[0];
              filename = encodeURIComponent(file.name);
              setPreviewURL(URL.createObjectURL(file));
            }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product-name">
            상품명
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="productName"
            placeholder="상품명을 입력하세요"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="artist">
            작가
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="artist"
            placeholder="작가를 입력하세요"
          ></input>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product-description">
            상품 설명
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="productDescription"
            placeholder="상품 설명을 입력하세요"
            rows="6"
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product-price">
            가격(원)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            inputMode="numeric"
            name="productPrice"
            placeholder="가격을 입력하세요"
          />
        </div>
        <input type="hidden" name="uploadTime" value={new Date().toISOString()} />
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            onClick={async () => {
              let res = await fetch("/api/admin/image?file=" + filename);
              res = await res.json();

              const formData = new FormData();
              Object.entries({ ...res.fields, file }).forEach(([key, value]) => {
                formData.append(key, value);
              });
              await fetch(res.url, {
                method: "POST",
                body: formData,
              });
            }}
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
}
