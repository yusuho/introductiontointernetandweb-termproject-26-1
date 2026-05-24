// app.js
const KAKAO_API_KEY = '43e50eccb57955d7b206403b44ab5a18'; // 카카오 디벨로퍼스에서 발급받은 키 입력
const BASE_URL = 'https://dapi.kakao.com/v3/search/book';

// 에러 메시지 출력 공통 함수
const displayError = (elementId, message) => {
    const element = document.getElementById(elementId);
    if (element) element.innerHTML = `<p style="color:red; text-align:center;">${message}</p>`;
};

// 1. 도서 검색 페이지 로직 (index.html)
if (document.getElementById('searchBtn')) {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const bookList = document.getElementById('bookList');

    const searchBooks = async () => {
        const query = searchInput.value.trim();
        
        // [예외 처리] 사용자 입력 검증
        if (!query) {
            alert("검색어를 입력해주세요.");
            return;
        }
        if (/^[^a-zA-Z0-9가-힣]+$/.test(query)) {
            alert("특수문자만으로는 검색할 수 없습니다. 의미 있는 단어를 입력해주세요.");
            return;
        }

        bookList.innerHTML = '<p>검색 중...</p>';

        try {
            // [API 호출] 카카오 도서 검색
            const response = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}&size=12`, {
                headers: { 'Authorization': `KakaoAK ${KAKAO_API_KEY}` }
            });

            // [예외 처리] API 통신 실패
            if (!response.ok) throw new Error('API 통신 에러가 발생했습니다.');

            const data = await response.json();
            if (data.documents.length === 0) {
                bookList.innerHTML = '<p>검색 결과가 없습니다.</p>';
                return;
            }

            // 검색 결과 출력 및 상세 페이지 링크 연동
            bookList.innerHTML = data.documents.map(book => `
                <div class="book-item" onclick="location.href='detail.html?isbn=${book.isbn.split(' ')[0]}'" style="cursor:pointer;">
                    <img src="${book.thumbnail || 'https://via.placeholder.com/120x170?text=No+Image'}" alt="표지">
                    <h3>${book.title}</h3>
                    <p>${book.authors.join(', ')}</p>
                </div>
            `).join('');

        } catch (error) {
            console.error(error);
            displayError('bookList', '데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    searchBtn.addEventListener('click', searchBooks);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBooks();
    });
}

// 2. 도서 상세 정보 페이지 로직 (detail.html)
if (document.getElementById('bookDetail')) {
    const bookDetail = document.getElementById('bookDetail');
    const urlParams = new URLSearchParams(window.location.search);
    const isbn = urlParams.get('isbn');

    const loadDetail = async () => {
        if (!isbn) {
            displayError('bookDetail', '잘못된 접근입니다.');
            return;
        }

        try {
            // ISBN 기준으로 도서 상세 검색
            const response = await fetch(`${BASE_URL}?query=${isbn}&target=isbn`, {
                headers: { 'Authorization': `KakaoAK ${KAKAO_API_KEY}` }
            });

            if (!response.ok) throw new Error('상세 정보를 불러올 수 없습니다.');

            const data = await response.json();
            const book = data.documents[0];

            if (!book) throw new Error('도서 정보가 없습니다.');

            bookDetail.innerHTML = `
                <img src="${book.thumbnail || 'https://via.placeholder.com/200x300?text=No+Image'}" alt="표지">
                <div>
                    <h2>${book.title}</h2>
                    <p><strong>저자:</strong> ${book.authors.join(', ')}</p>
                    <p><strong>출판사:</strong> ${book.publisher}</p>
                    <p><strong>가격:</strong> ${book.price}원</p>
                    <p><strong>소개:</strong> ${book.contents}...</p>
                    <button id="saveBtn" style="margin-top:1rem; padding:0.5rem 1rem; background:#28a745; color:#fff; border:none; cursor:pointer;">❤️ 관심 도서로 저장</button>
                </div>
            `;

            // [데이터 저장] Local Storage를 활용한 북마크 기능
            document.getElementById('saveBtn').addEventListener('click', () => {
                let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                if (!favorites.some(fav => fav.isbn === book.isbn)) {
                    favorites.push(book);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    alert('관심 도서에 저장되었습니다!');
                } else {
                    alert('이미 저장된 도서입니다.');
                }
            });

        } catch (error) {
            displayError('bookDetail', error.message);
        }
    };
    loadDetail();
}

// 3. 내 관심 도서 페이지 로직 (favorites.html)
if (document.getElementById('favoriteList')) {
    const favoriteList = document.getElementById('favoriteList');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        favoriteList.innerHTML = '<p>저장된 관심 도서가 없습니다.</p>';
    } else {
        // 저장된 목록 출력 및 삭제 버튼
        favoriteList.innerHTML = favorites.map(book => `
            <div class="book-item">
                <img src="${book.thumbnail || 'https://via.placeholder.com/120x170?text=No+Image'}" alt="표지">
                <h3>${book.title}</h3>
                <p>${book.authors.join(', ')}</p>
                <button onclick="removeFavorite('${book.isbn}')" style="margin-top:10px; background:#dc3545; color:white; border:none; padding:5px 10px; cursor:pointer;">삭제</button>
            </div>
        `).join('');
    }

    // 삭제 기능 처리
    window.removeFavorite = (isbn) => {
        let updatedFavorites = favorites.filter(book => book.isbn !== isbn);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        location.reload(); 
    };
}