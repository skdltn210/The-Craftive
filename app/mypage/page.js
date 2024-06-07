import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/database";
import Link from "next/link";

export default async function MyPage() {
  let session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const db = (await connectDB).db("craftive");
  let result = await db.collection("user").findOne({ email: session.user.email });
  let myReservations = await db.collection("reservation").find({ userId: result._id }).toArray();

  return (
    <div className="my-5 mx-auto max-w-lg">
      <h1 className="text-3xl font-bold text-center mb-5">나의 정보</h1>
      <div className="bg-white shadow-md rounded px-8 py-6 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">이름: {result.name}</label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">이메일: {result.email}</label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">전화번호: {result.mobile}</label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">예약정보</label>
          {myReservations.map((reservation) => (
            <div key={reservation._id} className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-gray-900 font-bold">날짜: {new Date(reservation.date).toLocaleDateString()}</p>
              <p className="text-gray-900 font-bold">시간: {reservation.time}</p>
              <p className="text-gray-900 font-bold">공방명: {reservation.workshopName}</p>
              <p className="text-gray-900 font-bold">작가: {reservation.artistName}</p>
              <p className="text-gray-900 font-bold">주소: {reservation.address}</p>
              <p className="text-gray-900 font-bold">상세주소: {reservation.detailAddress}</p>
              <p className="text-gray-900 font-bold">인원: {reservation.numPeople}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <Link href={`/mypage/edit/${result._id}`} className={"text-blue-500 hover:text-blue-700"}>
          화원정보수정
        </Link>
      </div>
    </div>
  );
}
