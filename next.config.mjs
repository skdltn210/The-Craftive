/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["craftiveproductimage.s3.ap-northeast-2.amazonaws.com"],
  },
  env: {
    PORTONE_IMP: process.env.PORTONE_IMP,
    KAKAOMAP_RESTKEY: process.env.KAKAOMAP_RESTKEY,
  },
};

export default nextConfig;
