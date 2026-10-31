let books = [];
let inventory = [null, null, null, null, null];
let selectedSlot = null;
let currentZone = 0;

function startGame() {
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

    for (let i = books.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [books[i], books[j]] = [books[j], books[i]];
    }

    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');

    render();
}

function changeZone(zoneIndex) {
    currentZone = zoneIndex;
    render();
}

function selectSlot(index) {
    selectedSlot = index;
    renderInventory();
}

function clickBook(globalIndex) {
    let shelfBook = books[globalIndex];

    if (selectedSlot !== null) {
        let temp = inventory[selectedSlot];
        inventory[selectedSlot] = shelfBook;
        books[globalIndex] = temp;
        selectedSlot = null;
    } else {
        showModal(shelfBook);
    }

    render();
}

function showModal(book) {
    document.getElementById('modal-title').innerText = book ? book.title : "빈 칸";
    document.getElementById('modal-desc').innerText = book ? book.desc : "책이 없습니다.";
    document.getElementById('modal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

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
        slot.onclick = (function(idx) {
            return function() { selectSlot(idx); };
        })(i);

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

        let wrapper = document.createElement('div');
        wrapper.className = 'shelf-wrapper';

        let rowDiv = document.createElement('div');
        rowDiv.className = 'shelf-container';

        for (let col = 0; col < 50; col++) {
            let globalIdx = startIdx + (row * 50) + col;
            let bookObj = books[globalIdx];

            // 책 슬롯 (책장 위 원래 번호 + 책 본체를 함께 담음)
            let slotEl = document.createElement('div');
            slotEl.className = 'book-slot';

            // 1. 책장 위 원래 번호 (예: #3)
            let origNumEl = document.createElement('div');
            origNumEl.className = 'original-num';
            if (bookObj) {
                origNumEl.innerText = `#${bookObj.id}`;
            }
            slotEl.appendChild(origNumEl);

            // 2. 책 본체 (현재 칸 번호 세로 쓰기)
            let bookEl = document.createElement('div');
            if (bookObj) {
                let isCorrect = bookObj.id === globalIdx + 1;
                bookEl.className = `book ${isCorrect ? 'correct' : ''}`;
                bookEl.innerText = String(globalIdx + 1);
            } else {
                bookEl.className = `book`;
                bookEl.innerText = "-";
            }

            bookEl.onclick = (function(idx) {
                return function() { clickBox(idx); }; // clickBook
            })(globalIdx);
            
            // 이벤트 연결 수정
            bookEl.onclick = (function(idx) {
                return function() { clickBook(idx); };
            })(globalIdx);

            slotEl.appendChild(bookEl);
            rowDiv.appendChild(slotEl);
        }
        wrapper.appendChild(rowDiv);
        shelfArea.appendChild(wrapper);
    }
}
