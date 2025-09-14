const API_KEY = `4292070b11644f23be57ef24a388e762`;
let newsList = [];
let sideNavBar = document.querySelector('.menus');
let searchBar = document.querySelector('.search-news-bar');
let searchBtn = document.querySelector('.main-search');
const menus = document.querySelectorAll('.menus button');
// let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`);
let totalResults = 0;
let page = 1;
let pageSize = 10;
let groupSize = 5;

menus.forEach((menu) =>
	menu.addEventListener('click', (event) => {
		getNewsByCategory(event);
	})
);

const getNews = async () => {
	try {
		url.searchParams.set('page', page); // => &page = page
		url.searchParams.set('pageSize', pageSize);

		const response = await fetch(url);

		const data = await response.json();
		console.log(data);
		if (response.status === 200) {
			if (data.articles.length === 0) {
				throw new Error('No result for this search');
			}
			newsList = data.articles;
			totalResults = data.totalResults;
			render();
			paginationRender();
		} else {
			throw new Error(data.message);
		}
	} catch (error) {
		errorRender(error.message);
	}
};

const getLastestNews = async () => {
	// url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
	url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`);
	getNews();
};

const getNewsByCategory = async (event) => {
	const category = event.target.textContent.toLowerCase();
	// url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`);
	url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`);
	getNews();
};

const getNewsByKeyword = async () => {
	const keyword = document.getElementById('news-search').value;
	// url = new URL(`https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`);
	url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`);
	getNews();
};

const render = () => {
	const newsHTML = newsList
		.map(
			(news) => `<div class="row news">
          <div class="col-lg-4">
            <img
              src=${news.urlToImage ? news.urlToImage : '../Assets/IMG/noPhoto.jpg'} 
              alt="..."
              class="news-img-size" 
            />
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>
              ${
								news.description //2중 삼항연산자 뉴스 내용이 있고, 200글자가 넘으면 value1 출력
									? // 있기는 한데 200글자가 안넘으면 기본 뉴스 내용 출력 뉴스 내용 자체가 없으면 내용없음 출력
									  news.description.length > 200
										? news.description.substring(0, 200) + '...'
										: news.description
									: '내용없음'
							}
            </p>
            <div>${news.source.name ? news.source.name : 'no source'} * ${moment().startOf('day').fromNow()};       
						
						</div>
          </div>
        </div>`
		)
		.join('');

	document.getElementById('news-board').innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
	const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
  </div>`;
	document.getElementById('news-board').innerHTML = errorHTML;
};

const paginationRender = () => {
	let totalPages = Math.ceil(totalResults / pageSize);
	const pageGroup = Math.ceil(page / groupSize);
	let lastpage = pageGroup * groupSize;
	console.log(lastpage);
	//마지막 페이지그룹이 그룹사이즈보다 작다? lastpage = totalpage
	if (lastpage > totalPages) {
		lastpage = totalPages;
	}
	console.log(lastpage);
	const firstpage = lastpage - (groupSize - 1) <= 0 ? 1 : lastpage - (groupSize - 1) <= 0;

	let paginationHTML = `<li class="page-item " onclick='moveToPage(${firstpage})'>
      <a class="page-link start" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>`;
	//이전으로 가는 버튼
	paginationHTML += `<li class="page-item " onclick='moveToPage(${page - 1})'>
      <a class="page-link start" href="#" aria-label="Previous">
        <span aria-hidden="true">&lsaquo;</span>
      </a>
    </li>`;
	console.log(firstpage);
	//페이지 그리는 것
	for (let i = firstpage; i <= lastpage; i++) {
		paginationHTML += `<li class="page-item ${i === page ? 'active' : ''}" onclick='moveToPage(${i})'><a class="page-link" href='#'>${i}</a></li>`;
	}
	console.log(firstpage);
	//다음으로 넘어가는 버튼
	paginationHTML += `<li class="page-item " onclick='moveToPage(${page + 1})'>
      <a class="page-link end" href="#" aria-label="Next">
        <span aria-hidden="true">&rsaquo;</span>
      </a>
    </li>`;
	paginationHTML += `<li class="page-item " onclick='moveToPage(${lastpage})'>
      <a class="page-link end" href="#" aria-label="Next">
        <span aria-hidden="true">	&raquo;</span>
      </a>
    </li>`;

	document.querySelector('.pagination').innerHTML = paginationHTML;

	let startPageBtn = document.querySelectorAll('.start');
	let endPageBtn = document.querySelectorAll('.end');

	if (page === firstpage) {
		startPageBtn.forEach((btn) => {
			// btn.style.opacity = 0.5;
			// btn.style.pointerEvents = 'none';
			// btn.classList.add('disabled');
			btn.style.display = 'none';
		});
	} else {
		startPageBtn.forEach((btn) => {
			// btn.style.opacity = 1;
			// btn.style.pointerEvents = '';
			// btn.classList.remove('disabled');
			btn.style.display = 'block';
		});
	}
	if (page === lastpage) {
		endPageBtn.forEach((btn) => {
			// btn.style.opacity = 0.5;
			// btn.style.pointerEvents = 'none';
			btn.style.display = 'none';
		});
	} else {
		endPageBtn.forEach((btn) => {
			// btn.style.opacity = 1;
			// btn.style.pointerEvents = '';
			btn.style.display = 'block';
		});
	}
};
const moveToPage = (pageNum) => {
	page = pageNum;

	getNews();
};

getLastestNews();

function openCloseNav(px) {
	sideNavBar.style.width = px;
}

searchBtn.addEventListener('click', () => {
	searchBar.classList.toggle('show');
	if (searchBar.classList.contains('show')) {
		searchBar.style.display = 'block';
	} else {
		searchBar.style.display = 'none';
	}
});

//버튼들에 클릭이벤트주기
//카테고리별 뉴스 가져오기
//그 뉴스를 보여주기

//페이지네이션 공부
//pagesize == 20
//page 현재 페이지 어디를 보고 있는지
//totalResults 전체 데이터 정보
//groupsize = 5 우리의 페이지는 5개
//page / groupsize = a  a/5 = 0...a 올림 = 1.a , 0.a  a의 값을 올림 ..내 현제 페이지를 찾아보는 법
//groupsize * pagegroup = 10 마지막 페이지를 구할 수 있음.
//마지막 페이지 값 - 4 = 6  4는 (groupsize-1)
//알아야하는값
//totalResults
//pagesize
//page
//groupsize
//구해야하는값
//totalpage = totalResults / pagesize 올림
//pagegroup = page / groupsize 올림
//마지막페이지 = pagegroup * groupsize
//첫번째 페이지 = 마지막페이지 - (groupsize - 1)
//첫번째부터 마지막까지 random

//추가 공부내용
//URL 함수 공부!! 인스턴스 https://developer.mozilla.org/en-US/docs/Web/API/URL
//fetch 함수 공부
//promise , 동기,비동기 , json, 콜백지옥, 자바스크립트 동작원리(queue, callstack , 쓰레드 등)
//join 공부하기
//자체 함수 공부 많이하기 2중 3항연산자 공부하기
//await, asysn 등등

// 도전 1🚀. << >> 버튼 추가하고 기능 추가하기

// << : 제일 처음으로 돌아간다
// >> : 제일 끝으로 간다

// 도전 2🚀. 처음 과 끝에 페이지그룹에서는 화살표 없애기

// 도전 3🚀. 페이지수가 5 이하일경우 또는 마지막 페이지그룹이 5개 이하일 경우
// 5이하일 경우 5개 페이지가 아닌 3개 페이지만 보여주기

// 마지막이 5개로 안떨어지는 경우 마지막 페이지 숫자에 맞춰서 5개 보여주기
