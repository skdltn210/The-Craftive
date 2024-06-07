"use client";

import Slider from "react-slick";
import styled from "styled-components";
import { useEffect, useState } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const StyledSlider = styled(Slider)`
  line-height: 0;
  *:focus {
    outline: 0;
    outline: none;
  }
`;

export default function HomeImgSlider({ images }) {
  const [ImgWidth, setImgWidth] = useState(0);
  const [ImgHeight, setImgHeight] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const updateScreenSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight - 35;
      setImgWidth(screenWidth);
      setImgHeight(screenHeight);
    };

    updateScreenSize();

    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 1200) {
        setImgWidth(screenWidth);
        setImgHeight(screenWidth);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <StyledSlider {...settings} style={{ overflowX: "hidden" }}>
      {images.map((image, index) => (
        <div key={index}>
          <img src={image} alt={index} style={{ width: ImgWidth, height: ImgHeight, objectFit: "cover" }} />
        </div>
      ))}
    </StyledSlider>
  );
}
