import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import SessionProvider from "../util/SessionProvider";
import Script from "next/script";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const metadata = {
  title: "Craftive",
};

export default async function RootLayout({ children }) {
  let session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body suppressHydrationWarning={true}>
          <Navbar />
          <div className="mt-9">{children}</div>
          <Footer />
          <Script
            type="text/javascript"
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAOMAP_APPKEY}
&autoload=false`}
            strategy="beforeInteractive"
          />
        </body>
      </SessionProvider>
    </html>
  );
}
