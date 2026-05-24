# introductiontointernetandweb-termproject-26-1
인터넷과 웹기초 26년도 1학기 텀프로젝트
# 📚 카카오 도서 검색 웹 서비스 (Kakao Book Search Web)

카카오 Open API를 활용하여 도서를 검색하고, 상세 정보를 확인하며, 마음에 드는 책을 나만의 보관함에 저장할 수 있는 프론트엔드 웹 애플리케이션입니다. 

서버 없이 순수 바닐라 자바스크립트(Vanilla JS)와 웹 브라우저의 로컬 스토리지(Local Storage)를 활용하여 구현되었습니다.

## ✨ 주요 기능 (Features)

1. **도서 검색 기능**
   - 사용자가 키워드를 입력하여 관련 도서를 검색할 수 있습니다.
   - 검색어 미입력 및 특수문자 입력에 대한 유효성 검사 로직이 포함되어 있습니다.
   - API 통신 실패 시 사용자에게 친절한 에러 메시지를 제공합니다.
2. **도서 상세 정보 제공**
   - 검색 결과에서 특정 책을 클릭하면 ISBN 값을 기반으로 상세 페이지로 이동합니다.
   - 책 표지, 저자, 출판사, 가격, 줄거리 요약 등을 확인할 수 있습니다.
3. **내 관심 도서 보관함 (북마크)**
   - 상세 페이지에서 '관심 도서로 저장' 버튼을 눌러 나만의 보관함에 책을 저장할 수 있습니다.
   - `Local Storage`를 활용하여 브라우저를 종료해도 저장된 데이터가 유지됩니다.
   - 보관함 내에서 저장된 책을 다시 확인하고, 불필요해진 책은 삭제할 수 있습니다.
4. **반응형 웹 디자인 (Responsive UI)**
   - PC, 태블릿, 모바일 등 다양한 기기의 화면 크기에 맞춰 레이아웃이 자연스럽게 변경됩니다. (CSS Grid/Flexbox 활용)

## 🛠 기술 스택 (Tech Stack)

- **Language:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **API:** Kakao REST API (도서 검색)
- **Storage:** Browser Local Storage

## 📂 파일 구조 (File Structure)

```text
├── index.html        # 메인 도서 검색 페이지
├── detail.html       # 도서 상세 정보 페이지
├── favorites.html    # 내 관심 도서 관리 페이지
├── style.css         # 전역 반응형 스타일시트
└── app.js            # API 통신, 이벤트 처리, 로컬 스토리지 제어 로직
