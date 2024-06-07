import "./footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="inner">
        <ul className="menu">
          <li>
            <a>개인정보처리방침</a>
          </li>
          <li>
            <a>영상정보처리기기 운영관리 방침</a>
          </li>
          <li>
            <a>홈페이지 이용약관</a>
          </li>
          <li>
            <a>위치정보 이용약관</a>
          </li>
          <li>
            <a>스타벅스 카드 이용약관</a>
          </li>
          <li>
            <a>윤리경영 핫라인</a>
          </li>
        </ul>

        <div className="btn-group">
          <a className="btn btn--white">찾아오시는 길</a>
          <a className="btn btn--white">신규입점제의</a>
          <a className="btn btn--white">사이트 맵</a>
        </div>

        <div className="info">
          <span>사업자등록번호 201-81-21515</span>
          <span>(주)스타벅스 코리아 대표이사 이석구</span>
          <span>TEL : 02) 3015-1100 / FAX : 02) 3015-1106</span>
          <span>개인정보 책임자 : 강기원</span>
        </div>

        <p className="copyright">
          &copy; <span className="this-year"></span> Starbucks Coffee Company. All Rights Reseved.
        </p>
      </div>
    </footer>
  );
}
