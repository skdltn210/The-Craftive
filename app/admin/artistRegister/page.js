"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import useFetch from "@/hooks/useFetch";

export default function Page() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const checkAdmin = useFetch("/api/admin/adminCheck");

  useEffect(() => {
    if (checkAdmin && !checkAdmin.isAdmin) {
      throw new Error("Network response was not ok");
    }
  }, [checkAdmin]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setMessage("이메일을 입력하세요.");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("올바른 이메일을 입력하세요.");
      return;
    }

    try {
      const response = await fetch("/api/admin/artistRegister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("API 요청 에러:", error);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold">작가 등록</h1>
        {message && (
          <div className={message == "작가 권한을 부여했습니다." ? "text-green-600" : "text-red-600"}>{message}</div>
        )}{" "}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="text" className="block mb-1">
              이메일:
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            제출
          </button>
        </form>
      </div>
    </div>
  );
}
