export default function Payment({ pg, deliveryInfo, totalPrice }) {
  function onClickPayment() {
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init(process.env.PORTONE_IMP);

    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: pg, // PG사
      pay_method: "card", // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: totalPrice, // 결제금액
      name: "test", // 주문명
      buyer_name: deliveryInfo.receiverName, // 구매자 이름
      buyer_tel: deliveryInfo.receiverMobile, // 구매자 전화번호
      buyer_addr: deliveryInfo.address + deliveryInfo.detailAddress, // 구매자 주소
      buyer_postcode: deliveryInfo.postcode, // 구매자 우편번호
    };

    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, callback);
  }

  /* 3. 콜백 함수 정의하기 */
  function callback(response) {
    const { success, merchant_uid, error_msg } = response;

    if (success) {
      alert("결제 성공");
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  }
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      onClick={onClickPayment}
    >
      결제하기
    </button>
  );
}
