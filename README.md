# TheCraftive
공예 중계 플랫폼 The Craftive 
<br>
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white) ![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white) ![KakaoMap](https://img.shields.io/badge/KakaoMap-FFCD00?style=for-the-badge&logo=kakaotalk&logoColor=white) ![PortOne](https://img.shields.io/badge/PortOne-000000?style=for-the-badge&logo=portone&logoColor=white)

## 프로젝트 소개
* 입점 작가의 작품을 판매하는 창작자 및 소비자 친화적인 공예 중계 플랫폼 
* 자체 PB상품의 개발 및 판매, 공예 오프라인 클래스 정보 제공 및 예약기능
* ThreeJS를 활용한 PB상품 전시

## 기능
### Home화면

https://github.com/skdltn210/TheCraftive/assets/113167709/a84a9aaa-a131-4147-9412-9031bbf446f9

https://github.com/skdltn210/TheCraftive/assets/113167709/cbad6ae6-2add-42c6-a6c8-e4b71b0b2c94

## 로그인, 회원가입

|커스텀 로그인|네이버 로그인|카카오 로그인|
|-----|-----|-----|
|![image](https://github.com/skdltn210/TheCraftive/assets/113167709/f0510128-f3bb-4fe9-8bd0-e6df24c5f26f)|![image](https://github.com/skdltn210/TheCraftive/assets/113167709/d0f89764-b994-401e-8274-80839ea08580)|![image](https://github.com/skdltn210/TheCraftive/assets/113167709/d7d4baf2-11cb-447e-8fd6-838abf45d0ad)

* NextAuth이용, JWT 방식 이용하여 인증, bcrypt 이용하여 비밀번호 해싱 
* 커스텀, 네이버, 카카오 로그인은 email이 같으면 같은 유저로 관리

## 관리자 페이지
<img width="621" alt="Admin" src="https://github.com/skdltn210/TheCraftive/assets/113167709/0be186f5-e4b8-4093-bc7c-a69cb97ddb62">

<img width="1240" alt="image" src="https://github.com/skdltn210/TheCraftive/assets/113167709/d344599a-d844-40b6-8672-31b20c51135a">


* 관리자 권한 부여하여 상품등록
* 이미지는 aws s3에 저장, 데이터베이스엔 이미지 경로 저장

### 장바구니

https://github.com/skdltn210/TheCraftive/assets/113167709/1f3e1705-3b75-4679-80d0-a7198ec3f91e

### 결제

https://github.com/skdltn210/TheCraftive/assets/113167709/4404dd19-2452-4b61-8a7a-818cd27e44af

|kg이니시스|카카오페이|토스페이|
|-----|-----|-----|
|<img width="962" alt="image" src="https://github.com/skdltn210/TheCraftive/assets/113167709/96fbb432-20b9-4096-95b4-fa863884202d">|<img width="951" alt="image" src="https://github.com/skdltn210/TheCraftive/assets/113167709/0642a035-f241-4747-9409-d2895fb6e8b2">|<img width="1343" alt="image" src="https://github.com/skdltn210/TheCraftive/assets/113167709/2b68fcac-8be8-48ad-8ab3-4e28445bdd21">|

* daum postcode, portone 이용

### 원데이클래스

<img width="620" alt="image" src="https://github.com/skdltn210/TheCraftive/assets/113167709/c0e7d311-ad00-4e48-b861-f01f08b0d6a6">



https://github.com/skdltn210/TheCraftive/assets/113167709/2c0b9aae-281b-46d6-905f-ed4ca5908479



* 관리자가 유저에게 작가 권한 부여 후 원데이클래스 등록
* 사용자의 현재 위치로 지도 위치 설정
* 공방 이름, 작가 이름, 지역 등으로 검색
* 지도 위의 마커나 공방 정보 클릭 후 예약

## Todos
UX/UI 개발, ThreeJS 활용한 작품 모델링 전시
