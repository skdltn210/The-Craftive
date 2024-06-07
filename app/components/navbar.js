"use client";

import Link from "next/link";
import Image from "next/image";
import LoginBtn from "./loginBtn";
import LogoutBtn from "./logoutBtn";
import useCartStore from "@/util/useCartStore";
import useFetch from "@/hooks/useFetch";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CgClose } from "react-icons/cg";
import { GrInstagram } from "react-icons/gr";
import { CgChevronDown } from "react-icons/cg";
import { BsBag } from "react-icons/bs";
import { LuMenu } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";

import "./navbar.css";

export default function Navbar() {
  const { data: session } = useSession();
  const { items, setItems } = useCartStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [isMenuBarVisible, setIsMenuBarVisible] = useState(false);
  const [isAccountVisible, setIsAccountVisible] = useState(false);
  const [isBagVisible, setIsBagVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isIconRotated, setIsIconRotated] = useState(false);
  const [windowWidth, setWindowWidth] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const closeTimeoutRef = useRef(null);

  const fetchCartData = useFetch("/api/user/cart");
  const fetchIsAdmin = useFetch("api/user/isAdmin");
  const fetchIsArtist = useFetch("api/user/isArtist");

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (fetchCartData) {
      setItems(fetchCartData);
      calculateTotalPrice(fetchCartData);
    }
  }, [fetchCartData]);

  const calculateTotalPrice = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.quantity * item.price;
    });
    setTotalPrice(total);
  };

  const addToCart = async (productId, currentQuantity) => {
    const response = await fetch("/api/user/addCart", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        quantity: currentQuantity + 1,
      }),
    });
    if (response.ok) {
      const updatedCart = await response.json();
      setItems(updatedCart);
      calculateTotalPrice(updatedCart);
    } else {
      console.error("쇼핑백에 상품을 추가하는데 실패했습니다.");
    }
  };

  const subtractFromCart = async (productId, currentQuantity) => {
    const response = await fetch("/api/user/subtractCart", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        quantity: currentQuantity - 1,
      }),
    });
    if (response.ok) {
      const updatedCart = await response.json();
      setItems(updatedCart);
      calculateTotalPrice(updatedCart);
    } else {
      console.error("쇼핑백에서 상품을 제거하는데 실패했습니다.");
    }
  };

  useEffect(() => {
    if (fetchIsAdmin !== null) {
      setIsAdmin(fetchIsAdmin);
    }
  }, [fetchIsAdmin]);

  useEffect(() => {
    if (fetchIsArtist !== null) {
      setIsArtist(fetchIsArtist);
    }
  }, [fetchIsArtist]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      const accountElement = document.querySelector(".account");
      const bagElement = document.querySelector(".bag");

      if (accountElement && !accountElement.contains(event.target) && isAccountVisible) {
        setIsAccountVisible(false);
        setIsOverlayVisible(false);
      }
      if (bagElement && !bagElement.contains(event.target) && isBagVisible) {
        setIsBagVisible(false);
        setIsOverlayVisible(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isAccountVisible, isBagVisible]);

  const handleMenuMouseOver = () => {
    if (!closeTimeoutRef.current) {
      setIsMenuBarVisible(true);
    }
  };

  const handleMenuMouseLeave = () => {
    setIsMenuBarVisible(false);
    setIsIconRotated(false);
  };

  const handleAccountclick = () => {
    setIsAccountVisible(true);
    setIsOverlayVisible(true);
  };

  const handleBagClick = () => {
    setIsBagVisible(true);
    setIsOverlayVisible(true);
    calculateTotalPrice(items);
  };

  const handleOverlayClick = () => {
    setIsMenuBarVisible(false);
    setIsAccountVisible(false);
    setIsBagVisible(false);
    setIsOverlayVisible(false);
  };

  const handleIconClick = () => {
    setIsIconRotated(!isIconRotated);
  };

  const handleMenuClick = () => {
    setIsMenuBarVisible(true);
  };

  const handleMenuClose = () => {
    setIsMenuBarVisible(false);
    closeTimeoutRef.current = setTimeout(() => {
      closeTimeoutRef.current = null;
    }, 300);
  };

  const closeMenus = () => {
    setIsMenuBarVisible(false);
    setIsAccountVisible(false);
    setIsBagVisible(false);
    setIsOverlayVisible(false);
    setIsIconRotated(false);
  };

  if (windowWidth >= 1200) {
    return (
      <div id="navbar" className="grid grid-cols-3 gap-4 py-1 relative">
        {isOverlayVisible && <div className="overlay" onClick={handleOverlayClick}></div>}
        <nav className="flex justify-start ml-5">
          <div className="mr-6" onMouseOver={handleMenuMouseOver}>
            MENU
          </div>
        </nav>
        <div className="flex justify-center">
          <Link href="/" className="font-mono text-2xl">
            Craftive
          </Link>
        </div>
        <nav className="flex justify-end">
          <div className="mr-6" onClick={handleAccountclick}>
            ACCOUNT
          </div>
          <div className="mr-6" onClick={handleBagClick}>
            BAG ({items ? items.length : 0})
          </div>
        </nav>
        {isMenuBarVisible && (
          <div onMouseLeave={handleMenuMouseLeave} className="menu-bar">
            <button onClick={handleMenuClose}>
              <CgClose />
            </button>
            <div>
              <Link href="/about">ABOUT</Link>
            </div>
            <div className="sub-menu">
              <div onClick={handleIconClick}>
                SHOP
                <motion.span
                  style={{ display: "inline-block", marginLeft: "5px", transformOrigin: "center" }}
                  animate={{ rotate: isIconRotated ? 180 : 0 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <div className="svg">
                    <CgChevronDown size={20} />
                  </div>
                </motion.span>
              </div>
              <motion.div
                className="sub-menu-content"
                initial={{ height: 0 }}
                animate={{ height: isIconRotated ? "auto" : 0 }}
              >
                <Link href="/shop">SHOW ALL</Link>
                <Link href="#none">금속</Link>
                <Link href="#none">도예</Link>
                <Link href="#none">목공</Link>
                <Link href="#none">유리</Link>
                <Link href="#none">페브릭</Link>
                <Link href="#none">가죽</Link>
              </motion.div>
            </div>
            <div>
              <Link href="/notice">NOTICE</Link>
            </div>
            <div>
              <Link href="/class">CLASS</Link>
            </div>
            <div>
              <Link href="/store">STORE</Link>
            </div>
            <div>
              <Link href="https://www.naver.com">
                <GrInstagram />
              </Link>
            </div>
          </div>
        )}
        <AnimatePresence>
          {isAccountVisible && (
            <motion.div
              className="account"
              initial={{ x: "400px" }}
              animate={{ x: isAccountVisible ? "0px" : "400px" }}
              exit={{ x: "400px" }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="right"
                onClick={() => {
                  setIsAccountVisible(false);
                  setIsOverlayVisible(false);
                }}
              >
                <CgClose />
              </button>
              <h1>ACCOUNT</h1>
              <div>{session ? <LogoutBtn /> : <LoginBtn />}</div>
              <div>주문조회</div>
              <div>위시리스트</div>
              <div>최근 본 상품</div>
              <div>쿠폰</div>
              <div>
                <Link href="/mypage">회원정보</Link>
              </div>
              <div>
                {isAdmin ? (
                  <Link href="/admin" className="mr-6">
                    관리자
                  </Link>
                ) : (
                  ""
                )}
                {isArtist ? (
                  <Link href="/artist" className="mr-6">
                    작가관리
                  </Link>
                ) : (
                  ""
                )}
              </div>
              <div>배송주소록</div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isBagVisible && (
            <motion.div
              className="bag"
              initial={{ x: "400px" }}
              animate={{ x: isBagVisible ? "0px" : "400px" }}
              exit={{ x: "400px" }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="right"
                onClick={() => {
                  setIsBagVisible(false);
                  setIsOverlayVisible(false);
                }}
              >
                <CgClose />
              </button>
              {items.length == 0 ? (
                <div className="mt-5">쇼핑백이 비어 있습니다.</div>
              ) : (
                <div>
                  {items.map((item, i) => (
                    <div className="flex items-center border-b border-gray-300 py-4" key={i}>
                      <div className="flex-shrink-0 mr-4">
                        <Image
                          src={`https://craftiveproductimage.s3.ap-northeast-2.amazonaws.com/${item.productImage}`}
                          alt="image"
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{item.productName}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => subtractFromCart(item.productId, item.quantity)}
                            className="bg-gray-200 text-gray-700 py-1 px-2 rounded-md mr-2"
                          >
                            -
                          </button>
                          <span className="text-gray-700 mr-2">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item.productId, item.quantity)}
                            className="bg-gray-200 text-gray-700 py-1 px-2 rounded-md"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-gray-700 mt-2">가격: {item.quantity * item.price} 원</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-gray-700 mt-4">총 가격: {totalPrice} 원</p>
              <Link href="/cart">쇼핑백으로 이동</Link>
              <Link href="/checkout">결제하기</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  } else {
    return (
      <div id="navbar" className="grid grid-cols-2 py-1 relative">
        <div className="flex items-center">
          <Link href="/" className="font-mono text-2xl ml-4" onClick={closeMenus}>
            Craftive
          </Link>
        </div>
        <nav className="flex justify-end items-center">
          <div className="mr-3 mt-2" onClick={handleAccountclick}>
            <IoPersonOutline size={18} />
          </div>
          <div className="mr-3 mt-2" onClick={handleBagClick}>
            <div className="flex items-center">
              <BsBag size={18} />
              <span>{items ? items.length : 0}</span>
            </div>
          </div>
          <div className="mr-3 mt-2 " onClick={handleMenuClick}>
            <LuMenu size={20} />
          </div>
        </nav>
        <AnimatePresence>
          {isMenuBarVisible && (
            <motion.div
              className="menu-bar"
              initial={{ x: "100%" }}
              animate={{ x: isMenuBarVisible ? "0px" : "100%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            >
              <button
                className="right"
                onClick={() => {
                  setIsMenuBarVisible(false);
                  setIsOverlayVisible(false);
                  setIsIconRotated(false);
                }}
              >
                <CgClose />
              </button>
              <div>
                <Link href="/about" onClick={closeMenus}>
                  ABOUT
                </Link>
              </div>
              <div className="sub-menu">
                <div onClick={handleIconClick}>
                  SHOP
                  <motion.span
                    style={{ display: "inline-block", marginLeft: "5px", transformOrigin: "center" }}
                    animate={{ rotate: isIconRotated ? 180 : 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <div className="svg">
                      <CgChevronDown />
                    </div>
                  </motion.span>
                </div>
                <motion.div
                  className="sub-menu-content"
                  initial={{ height: 0 }}
                  animate={{ height: isIconRotated ? "auto" : 0 }}
                >
                  <Link href="/shop" onClick={closeMenus}>
                    SHOW ALL
                  </Link>
                  <Link href="#none" onClick={closeMenus}>
                    금속
                  </Link>
                  <Link href="#none" onClick={closeMenus}>
                    도예
                  </Link>
                  <Link href="#none" onClick={closeMenus}>
                    목공
                  </Link>
                  <Link href="#none" onClick={closeMenus}>
                    유리
                  </Link>
                  <Link href="#none" onClick={closeMenus}>
                    페브릭
                  </Link>
                  <Link href="#none" onClick={closeMenus}>
                    가죽
                  </Link>
                </motion.div>
              </div>
              <div>
                <Link href="/notice" onClick={closeMenus}>
                  NOTICE
                </Link>
              </div>
              <div>
                <Link href="/class" onClick={closeMenus}>
                  CLASS
                </Link>
              </div>
              <div>
                <Link href="/store" onClick={closeMenus}>
                  STORE
                </Link>
              </div>
              <div>
                <Link href="https://www.instagram.com/kim_silver.star/" onClick={closeMenus}>
                  <GrInstagram />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isAccountVisible && (
            <motion.div
              className="account"
              initial={{ x: "100%" }}
              animate={{ x: isAccountVisible ? "0px" : "100%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            >
              <button
                className="right"
                onClick={() => {
                  setIsAccountVisible(false);
                  setIsOverlayVisible(false);
                }}
              >
                <CgClose />
              </button>
              <h1>ACCOUNT</h1>
              <div>{session ? <LogoutBtn /> : <LoginBtn />}</div>
              <div>주문조회</div>
              <div>위시리스트</div>
              <div>최근 본 상품</div>
              <div>쿠폰</div>
              <Link href="/mypage" onClick={closeMenus}>
                회원정보
              </Link>
              <div>
                {isAdmin ? (
                  <Link href="/admin" className="mr-6" onClick={closeMenus}>
                    관리자
                  </Link>
                ) : (
                  ""
                )}
                {isArtist ? (
                  <Link href="/artist" className="mr-6" onClick={closeMenus}>
                    작가관리
                  </Link>
                ) : (
                  ""
                )}
              </div>
              <div>배송주소록</div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isBagVisible && (
            <motion.div
              className="bag"
              initial={{ x: "100%" }}
              animate={{ x: isBagVisible ? "0px" : "100%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            >
              <button
                className="right"
                onClick={() => {
                  setIsBagVisible(false);
                  setIsOverlayVisible(false);
                }}
              >
                <CgClose />
              </button>
              {items.length == 0 ? (
                <div className="mt-5">쇼핑백이 비어 있습니다.</div>
              ) : (
                <div>
                  {items.map((item, i) => (
                    <div className="flex items-center border-b border-gray-300 py-4" key={i}>
                      <div className="flex-shrink-0 mr-4">
                        <Image
                          src={`https://craftiveproductimage.s3.ap-northeast-2.amazonaws.com/${item.productImage}`}
                          alt="image"
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{item.productName}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => subtractFromCart(item.productId, item.quantity)}
                            className="bg-gray-200 text-gray-700 py-1 px-2 rounded-md mr-2"
                          >
                            -
                          </button>
                          <span className="text-gray-700 mr-2">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item.productId, item.quantity)}
                            className="bg-gray-200 text-gray-700 py-1 px-2 rounded-md"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-gray-700 mt-2">가격: {item.quantity * item.price} 원</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-gray-700 mt-4">총 가격: {totalPrice} 원</p>
              <Link href="/cart">쇼핑백으로 이동</Link>
              <Link href="/checkout">결제하기</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
}
