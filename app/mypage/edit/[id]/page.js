import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function EditMyPage(props) {
  let session = await getServerSession(authOptions);
  const db = (await connectDB).db("craftive");
  let result = await db.collection("user").findOne({ _id: new ObjectId(props.params.id) });
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">회원정보수정</h2>
        </div>
        <form className="mt-8 space-y-6" action="/api/user/edit" method="POST">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <p>Name</p>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={result.name}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div>
              <p>Mobile</p>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                required
                defaultValue={result.mobile}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <input style={{ display: "none" }} name="_id" defaultValue={result._id.toString()} />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2-2a1 1 0 00-1 1v8a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              회원정보수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
