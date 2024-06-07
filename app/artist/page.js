import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/database";
import { redirect } from "next/navigation";
import Link from "next/link";

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

  return (
    <>
      <Link href="artist/classRegister" className="flex justify-center my-5">
        원데이클래스 등록
      </Link>
      <Link href="artist/classManagement" className="flex justify-center my-5">
        원데이클래스 관리
      </Link>
    </>
  );
}
