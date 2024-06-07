"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import DaumPostCode from "react-daum-postcode";
import Timetable from "@/app/components/timetable";
import useFetch from "@/hooks/useFetch";

export default function Page() {
  const { data: session } = useSession();

  if (!session) {
    redirect("/");
  }

  const [classInfo, setClassInfo] = useState({
    artistId: "",
    artistName: "",
    name: "",
    description: "",
    postcode: "",
    address: "",
    detailAddress: "",
    x: "",
    y: "",
    timeSlots: {},
    isAddressModalOpen: false,
    isRegisterModalOpen: false,
  });

  // 세션 확인을 위한 useFetch 훅 호출
  const artistData = useFetch("/api/artist/artistCheck");

  // artistData가 변경될 때마다 classInfo 업데이트
  useEffect(() => {
    if (artistData && artistData.artistId && artistData.artistName) {
      setClassInfo((prevClassInfo) => ({
        ...prevClassInfo,
        artistId: artistData.artistId,
        artistName: artistData.artistName,
      }));
    }
  }, [artistData]);

  // 주소 정보를 가져오는 비동기 동작을 useFetch로 변경
  const getAddressInfo = async (address) => {
    try {
      const response = await fetch(`https://dapi.kakao.com/v2/local/search/address.JSON?query=${encodeURI(address)}`, {
        method: "GET",
        headers: {
          Authorization: "KakaoAK " + process.env.KAKAOMAP_RESTKEY,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      if (data.documents && data.documents.length > 0) {
        const { x, y } = data.documents[0];
        setClassInfo((prev) => ({ ...prev, x, y }));
      }
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  };

  // 주소 변경 시 호출되도록 useEffect 수정
  useEffect(() => {
    if (classInfo.address) {
      getAddressInfo(classInfo.address);
    }
  }, [classInfo.address]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassInfo((prevClassInfo) => ({
      ...prevClassInfo,
      [name]: value,
    }));
  };

  const handleAddressComplete = (data) => {
    setClassInfo((prevClassInfo) => ({
      ...prevClassInfo,
      postcode: data.zonecode,
      address: data.address,
      isAddressModalOpen: false,
    }));
  };

  const updateTimeSlots = (slots) => {
    setClassInfo((prev) => ({
      ...prev,
      timeSlots: slots,
    }));
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("/api/artist/classRegister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classInfo),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      openRegisterModal();
    } catch (error) {
      console.error("Error registering class:", error);
    }
  };

  const openRegisterModal = () => {
    setClassInfo((prevClassInfo) => ({
      ...prevClassInfo,
      isRegisterModalOpen: true,
    }));
  };

  const closeRegisterModal = () => {
    setClassInfo((prevClassInfo) => ({
      ...prevClassInfo,
      isRegisterModalOpen: false,
    }));
  };

  return (
    <div className="my-8 max-w-md mx-auto bg-white shadow-md p-8 rounded-md">
      <h2 className="text-2xl font-bold mb-4">원데이클래스 등록</h2>
      <div className="mb-4">
        <div className="mb-4">
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                name="name"
                placeholder="공방이름"
                value={classInfo.name}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
                style={{ resize: "vertical" }}
              />
              <textarea
                type="text"
                name="description"
                placeholder="설명"
                value={classInfo.description}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500 h-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="우편번호"
                value={classInfo.postcode}
                className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
                readOnly
              />
              <button
                onClick={() => setClassInfo((prev) => ({ ...prev, isAddressModalOpen: true }))}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                주소 찾기
              </button>
            </div>
            <input
              type="text"
              placeholder="주소"
              value={classInfo.address}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
              readOnly
            />
            <input
              type="text"
              name="detailAddress"
              placeholder="상세주소"
              value={classInfo.detailAddress}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="my-2">
            <Timetable timeSlots={classInfo.timeSlots} updateTimeSlots={updateTimeSlots} />{" "}
          </div>
        </div>
        <button
          onClick={handleRegister}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          등록하기
        </button>
      </div>
      {classInfo.isAddressModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-md relative" style={{ width: "30%" }}>
            <button
              onClick={() => setClassInfo((prev) => ({ ...prev, isAddressModalOpen: false }))}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              닫기
            </button>
            <DaumPostCode className="mt-3" onComplete={handleAddressComplete} />
          </div>
        </div>
      )}
      {classInfo.isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <p className="text-xl font-bold mb-4">클래스가 성공적으로 등록되었습니다.</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2"
              onClick={closeRegisterModal}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
