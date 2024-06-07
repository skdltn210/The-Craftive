"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useCartStore from "@/util/useCartStore";
import DaumPostCode from "react-daum-postcode";
import Payment from "../components/payment";

export default function Checkout() {
  const { items } = useCartStore();
  const [totalPrice, setTotalPrice] = useState(0);
  const [userData, setUserData] = useState({ name: "", mobile: "" });
  const [deliveryInfo, setDeliveryInfo] = useState({
    receiverName: "",
    receiverMobile: "",
    postcode: "",
    address: "",
    detailAddress: "",
    sameAsSender: false,
    isAddressModalOpen: false,
  });
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    fetch("/api/user/user")
      .then((response) => response.json())
      .then((data) => {
        setUserData({ name: data.name, mobile: data.mobile });
        setDeliveryInfo((prevDeliveryInfo) => ({
          ...prevDeliveryInfo,
        }));
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  useEffect(() => {
    calculateTotalPrice(items);
  }, [items]);

  const calculateTotalPrice = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.quantity * item.price;
    });
    setTotalPrice(total);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prevDeliveryInfo) => ({
      ...prevDeliveryInfo,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setDeliveryInfo((prevDeliveryInfo) => ({
      ...prevDeliveryInfo,
      sameAsSender: e.target.checked,
      receiverName: e.target.checked ? userData.name : "",
      receiverMobile: e.target.checked ? userData.mobile : "",
    }));
  };

  const handleAddressComplete = (data) => {
    setDeliveryInfo((prevDeliveryInfo) => ({
      ...prevDeliveryInfo,
      postcode: data.zonecode,
      address: data.address,
      isAddressModalOpen: false,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div className="my-8 max-w-md mx-auto bg-white shadow-md p-8 rounded-md">
      <h2 className="text-2xl font-bold mb-4">주문 정보 입력</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">주문자 정보</h3>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="이름"
            value={userData.name}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            readOnly
          />
          <input
            type="tel"
            placeholder="전화번호"
            value={userData.mobile}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            readOnly
          />
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">배송 정보</h3>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={deliveryInfo.sameAsSender}
              onChange={handleCheckboxChange}
            />
            주문자 정보와 동일
          </label>
        </div>
        <div className="mb-4">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              name="receiverName"
              placeholder="수취인 이름"
              value={deliveryInfo.receiverName}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              type="tel"
              name="receiverMobile"
              placeholder="수취인 전화번호"
              value={deliveryInfo.receiverMobile}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="우편번호"
                value={deliveryInfo.postcode}
                className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
                readOnly
              />
              <button
                onClick={() => setDeliveryInfo((prev) => ({ ...prev, isAddressModalOpen: true }))}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                주소 찾기
              </button>
            </div>
            <input
              type="text"
              placeholder="주소"
              value={deliveryInfo.address}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
              readOnly
            />
            <input
              type="text"
              name="detailAddress"
              placeholder="상세주소"
              value={deliveryInfo.detailAddress}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">상품 정보</h3>
          <div>
            {items.map((item, index) => (
              <div key={index} className="flex items-center border-b border-gray-300 py-4">
                <div className="flex-shrink-0 mr-4">
                  <Image
                    src={`https://craftiveproductimage.s3.ap-northeast-2.amazonaws.com/${item.productImage}`}
                    width={100}
                    height={100}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{item.productName}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-gray-700 mr-2">수량 : {item.quantity}</span>
                  </div>
                  <p className="text-gray-700 mt-2">가격: {item.quantity * item.price} 원</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-700 my-4">총 가격: {totalPrice} 원</p>
        <div className="mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            주문금액 정보제공에 동의합니다.
          </label>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">결제 수단 선택</h3>
          <div className="flex flex-col space-y-2">
            <div className="inline-block">
              <button className="text-left">무통장 입금</button>
            </div>
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="html5_inicis"
                className="mr-2"
                checked={paymentMethod === "html5_inicis"}
                onChange={handlePaymentMethodChange}
              />
              카드결제
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="kakaopay"
                className="mr-2"
                checked={paymentMethod === "kakaopay"}
                onChange={handlePaymentMethodChange}
              />
              카카오페이
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="tosspay"
                className="mr-2"
                checked={paymentMethod === "tosspay"}
                onChange={handlePaymentMethodChange}
              />
              토스페이
            </label>
          </div>
        </div>
        <Payment pg={paymentMethod} deliveryInfo={deliveryInfo} totalPrice={totalPrice} />
      </div>
      {deliveryInfo.isAddressModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-md relative" style={{ width: "30%" }}>
            <button
              onClick={() => setDeliveryInfo((prev) => ({ ...prev, isAddressModalOpen: false }))}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              닫기
            </button>
            <DaumPostCode className="mt-3" onComplete={handleAddressComplete} />
          </div>
        </div>
      )}
    </div>
  );
}
