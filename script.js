let books = [];
let inventory = [null, null, null, null, null];
let selectedSlot = null;
let currentZone = 0; // 0: 1~250, 1: 251~500, 2: 501~750, 3: 751~1000

// [책 정리 시작] 버튼을 누를 때 실행
function startGame() {
    // 1~1000번 책 데이터 생성 (의미 있는 책들만 특별 텍스트 부여)
    books = [];
    for (let i = 1; i <= 1000; i++) {
        let title = `${i}번째 책`;
        let desc = `조용히 먼지가 쌓여 있는 평범한 책이다.`;

        if (i === 1) {
            title = "시작의 서";
            desc = "이 서재의 모든 역사가 시작된 첫 번째 책. 완벽한 정렬을 향해 나아가자.";
        } else if (i === 500) {
            title = "반환점의 기록";
            desc = "절반까지 왔다. 잠시 숨을 고르며 지금까지의 여정을 돌아보자.";
        } else if (i === 1000) {
            title = "마지막 장의 방정식";
            desc = "서재의 끝이자 완성을 알리는 1,000번째 책. 수고하셨습니다.";
        }

        books.push({ id: i, title: title, desc: desc });
    }

    // 🌟 실행할 때마다 책들을 완전히 무작위로 섞기!
    for (let i = books.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [books[i], books[j]] = [books[j], books[i]];
    }

    // 화면 전환 (시작 화면 숨기고 게임 메인 화면 보이기)
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');

    render();
}

// 구역 변경 (하단 4개 버튼)
function changeZone(zoneIndex) {
    currentZone = zoneIndex;
    render();
}

// 인벤토리 슬롯 선택
function selectSlot(index) {
    selectedSlot = index;
    renderInventory();
}

// 책장 칸 클릭 (인벤토리에 든 책과 교체하거나 내용 보기)
function clickBook(globalIndex) {
    let shelfBook = books[globalIndex];

    if (selectedSlot !== null) {
        let temp = inventory[selectedSlot];
        inventory[selectedSlot] = shelfBook;
        books[globalIndex] = temp;
        selectedSlot = null;
        render();
    } else {
        showModal(shelfBook);
    }
}

// 팝업창 관리
function showModal(book) {
    document.getElementById('modal-title').innerText = book ? book.title : "빈 칸";
    document.getElementById('modal-desc').innerText = book ? book.desc : "책이 없습니다.";
    document.getElementById('modal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// 화면 렌더링
function render() {
    renderInventory();
    renderShelf();
}

function renderInventory() {
    let invDiv = document.getElementById('inventory-slots');
    invDiv.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        let slot = document.createElement('div');
        slot.className = `inv-slot ${selectedSlot === i ? 'selected' : ''}`;
        slot.onclick = () => selectSlot(i);
        if (inventory[i]) {
            slot.innerText = `#${inventory[i].id}`;
        } else {
            slot.innerText = "빈칸";
        }
        invDiv.appendChild(slot);
    }
}

function renderShelf() {
    let shelfArea = document.getElementById('shelf-area');
    shelfArea.innerHTML = '';

    let startIdx = currentZone * 250;
    
    for (let row = 0; row < 5; row++) {
        let rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.innerText = `--- ${row + 1}단 (${startIdx + row * 50 + 1} ~ ${startIdx + (row + 1) * 50}) ---`;
        shelfArea.appendChild(rowLabel);

        let rowDiv = document.createElement('div');
        rowDiv.className = 'shelf-container';

        for (let col = 0; col < 50; col++) {
            let globalIdx = startIdx + (row * 50) + col;
            let bookObj = books[globalIdx];

            let bookEl = document.createElement('div');
            // 제자리를 찾은 책은 초록색(.correct)으로 바뀜
            let isCorrect = bookObj.id === globalIdx + 1;
            bookEl.className = `book ${isCorrect ? 'correct' : ''}`;
            bookEl.innerText = bookObj.id;
            bookEl.onclick = () => clickBook(globalIdx);
            
            rowDiv.appendChild(bookEl);
        }
        shelfArea.appendChild(rowDiv);
    }
}
