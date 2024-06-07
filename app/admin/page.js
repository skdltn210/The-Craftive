import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/database";
import { redirect } from "next/navigation";

import Link from "next/link";

export default async function Admin() {
  let session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const db = (await connectDB).db("craftive");
  const result = await db.collection("user").findOne({ email: session.user.email });
  const isAdmin = result.authority === "admin";

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div>
      <Link href="admin/productRegister" className="flex justify-center my-5">
        상품등록
      </Link>
      <Link href="" className="flex justify-center my-5">
        상품관리
      </Link>
      <Link href="admin/artistRegister" className="flex justify-center my-5">
        작가등록
      </Link>
      <Link href="" className="flex justify-center my-5">
        등등..
      </Link>
    </div>
  );
}
