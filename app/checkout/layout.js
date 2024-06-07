import Script from "next/script";

export default function CheckoutLayout({ children }) {
  return (
    <>
      <Script src="https://cdn.iamport.kr/v1/iamport.js" />
      {children}
    </>
  );
}
