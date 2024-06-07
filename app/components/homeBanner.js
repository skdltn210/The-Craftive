import "./HomeBanner.css";

export default function HomeBanner() {
  return (
    <div id="container">
      <div className="box first">
        <div>
          <p>ARTISTS</p>
        </div>
        <dib>
          <p>VIEW ALL STORIES</p>
        </dib>
      </div>
      <div className="box">
        <img src="/examples/a.avif" />
        <div className="largebox">
          <p>KILLER CUTIES WITH SEAN-KIERRE LYONS</p>
        </div>
        <div className="smallbox">
          <p>Art</p>
        </div>
      </div>
      <div className="box">
        <img src="/examples/b.avif" />
        <div className="largebox">
          <p>KILLER CUTIES WITH SEAN-KIERRE LYONS</p>
        </div>
        <div className="smallbox">
          <p>Art</p>
        </div>
      </div>
      <div className="box">
        <img src="/examples/c.avif" />
        <div className="largebox">
          <p>KILLER CUTIES WITH SEAN-KIERRE LYONS</p>
        </div>
        <div className="smallbox">
          <p>Art</p>
        </div>
      </div>
      <div className="box">
        <img src="/examples/d.avif" />
        <div className="largebox">
          <p>KILLER CUTIES WITH SEAN-KIERRE LYONS</p>
        </div>
        <div className="smallbox">
          <p>Art</p>
        </div>
      </div>
    </div>
  );
}
