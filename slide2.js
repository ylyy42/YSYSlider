const wrapper = document.querySelector('#slide_wrapper');
const container = document.querySelector('.slider_container');
const slideItems = document.querySelectorAll('.slide_item');
const dotsArea = document.querySelector('#dot_area');
let count = 1;

// 아이템 클론(한뱡향 무한루프를 위해)
const firstItem = slideItems[0];
const lastItem = slideItems[slideItems.length - 1];

const cloneFirstItems = firstItem.cloneNode(true);
const cloneLastItems = lastItem.cloneNode(true);

container.prepend(cloneLastItems);
container.append(cloneFirstItems);

// 이미지 슬라이더 사이즈조정
const itemWidth = slideItems[0].offsetWidth;
const itemLength = slideItems.length + 2;
const containerWidht = itemWidth*itemLength;

wrapper.style.width = itemWidth + 'px';
container.style.width = containerWidht + 'px';

// 클론아이템때문에 첫번째는 슬라이드의 맨마지막 아이템이 나타나는 이슈 해결
container.style.transform = 'translateX(' + (-itemWidth * count) + 'px)';

// next, prev, auto 버튼
const btnBox = document.querySelector('#slide_button');
const prevBtn = document.createElement('button');
const nextBtn = document.createElement('button');
const autoBtn = document.createElement('button');

prevBtn.setAttribute('id', 'prev_button');
nextBtn.setAttribute('id', 'next_button');
autoBtn.setAttribute('id', 'auto_button');
btnBox.append(prevBtn);
btnBox.append(nextBtn);
btnBox.append(autoBtn);

nextBtn.addEventListener('click', nextBtnHandler);
prevBtn.addEventListener('click', prevBtnHandler);
autoBtn.addEventListener('click', autoBtnHandler);

container.addEventListener('transitionend', moveFirstItem);
container.addEventListener('transitionend', moveLastItem);

// next 버튼 클릭시
function nextBtnHandler() {
    if(count >= itemLength - 1) return;
    container.style.transition = 'transform .4s ease-in-out';

    count++;

    let curIndex = count - 1;

    curDot.classList.remove('dot_active');
    curDot = dots[curIndex];
    if(count <= itemLength - 2) {
        // count - 1의 값이 curIndex값이니까, 이미지 갯수가 5개라고 했을때 count값이 5보다 같거나 작을때 curIndex값은 0,1,2,3,4가 된다.
        curDot.classList.add('dot_active');
    } else {
        // curIndex값이 4가 넘으면 active된 dot을 맨처음꺼로 초기화시킨다.
        curDot = dots[0];
        dots[0].classList.add('dot_active');
    }
    
    container.style.transform = 'translateX(' + (-itemWidth * count) + 'px)'
}

// prev 버튼 클릭시
function prevBtnHandler() {
    if(count <= 0) return;
    container.style.transition = 'transform .4s ease-in-out';

    count--;

    let curIndex = count - 1;

    curDot.classList.remove('dot_active');
    curDot = dots[curIndex];
    if(count >= 1) {
        curDot.classList.add('dot_active');
    } else {
        curDot = dots[dots.length - 1];
        dots[dots.length - 1].classList.add('dot_active');
    }

    container.style.transform = 'translateX(' + (-itemWidth * count) + 'px)'
}

//auto 버튼 클릭시
var pause = null;

function autoBtnHandler() {
    this.classList.toggle('on');

    if(pause != null){   //인터벌 담은 변수가 null이 아니면 ex) 현재 인터벌 중이면
       clearInterval(pause);   // 인터벌을 끝내라
       pause = null;    //변수 초기화
       return false;    // 함수나가기
    }

    pause = setInterval(nextBtnHandler, 3000); // 인터벌담은 변수가 null이면 반복실행해라
};

// 무한루프
function moveFirstItem() {
    if(count == itemLength - 1){
        container.style.transition = 'none';
        count = 1;
        container.style.transform = 'translateX(' + (-itemWidth * count) + 'px)';
    }
}

function moveLastItem() {
    if(count == 0){
        container.style.transition = 'none';
        count = itemLength - 2;
        container.style.transform = 'translateX(' + (-itemWidth * count) + 'px)';
    }
}

// pagination
let createDot = '';

for(let i = 0; i < itemLength - 2; i++){
    createDot += '<li class="dot';
    createDot += (i === count - 1) ? ' dot_active' : '';
    createDot += '" data-index="' + i + '"><a href="#"></a></li>'
}
dotsArea.innerHTML = createDot;
let dots = document.querySelectorAll('.dot');
let curDot = document.querySelector('.dot_active');

Array.prototype.forEach.call(dots, function(dot){
    dot.addEventListener('click', function(e){
        e.preventDefault();

        curDot.classList.remove('dot_active');

        curDot = this;
        curDot.classList.add('dot_active');
        
        curInex = curDot.getAttribute('data-index');
        count = Number(curInex) + 1

        container.style.transition = 'transform .4s ease-in-out';
        container.style.transform = 'translateX(' + (-itemWidth * count) + 'px)'
    });
});
