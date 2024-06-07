import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/database";

export default async function Page() {
  let session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const db = (await connectDB).db("craftive");
  const result = await db.collection("user").findOne({ email: session.user.email });
  const isAdmin = result.authority === "artist";
  if (!isAdmin) {
    redirect("/");
  }

  const classInfo = await db.collection("class").findOne({ artistId: result._id });

  const classExists = !!classInfo;

  const sortTimes = (times) => {
    return times.sort((a, b) => {
      return new Date("1970/01/01 " + a) - new Date("1970/01/01 " + b);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center my-5 mx-auto max-w-4xl bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">공방 정보</h1>
      {classExists ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-semibold text-gray-800">공방이름: {classInfo.name}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">작가이름: {classInfo.artistName}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">설명: {classInfo.description}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">주소: {classInfo.address}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">상세주소: {classInfo.detailAddress}</p>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">예약 가능 시간표</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(classInfo.timeSlots).map(([day, times]) => (
                <div key={day} className="p-4 bg-gray-100 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">{day}</h3>
                  <ul className="list-disc ml-4">
                    {sortTimes(times).map((time, index) => (
                      <li key={index} className="text-base text-gray-900">
                        {time}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-600">클래스가 없습니다.</p>
      )}
    </div>
  );
}
