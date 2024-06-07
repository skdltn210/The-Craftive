"use client";

const CartModal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg">
        <p>장바구니에 담겼습니다.</p>
        <button
          onClick={closeModal}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default CartModal;
