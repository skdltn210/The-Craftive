import HomeImgSlider from "./components/homeImgSlider";
import HomeBanner from "./components/homeBanner";

export default function Home() {
  const examples = [
    "/examples/0.jpeg",
    "/examples/1.jpeg",
    "/examples/2.jpeg",
    "/examples/3.jpeg",
    "/examples/4.jpeg",
    "/examples/5.jpeg",
    "/examples/6.jpeg",
    "/examples/7.jpeg",
    "/examples/8.jpeg",
    "/examples/9.jpeg",
  ];
  return (
    <>
      <HomeImgSlider images={examples} />
      <HomeBanner />
    </>
  );
}
