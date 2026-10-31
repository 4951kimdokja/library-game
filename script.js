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

// 🌟 숫자를 한 글자씩 쪼개서 세로로 한 줄씩 출력해주는 헬퍼 함수
function makeVerticalText(str) {
    return str.split('').map(char => `<span>${char}</span>`).join('');
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
            
            if (bookObj) {
                let isCorrect = bookObj.id === globalIdx + 1;
                bookEl.className = `book ${isCorrect ? 'correct' : ''}`;
                
                // 원래 번호와 현재 칸 번호를 글자 단위로 쪼개어 세로 배치
                let origText = makeVerticalText(String(bookObj.id));
                let currText = makeVerticalText(String(globalIdx + 1));

                bookEl.innerHTML = `
                    <div class="original-num">${origText}</div>
                    <div class="current-num">${currText}</div>
                `;
            } else {
                bookEl.className = `book`;
                bookEl.innerHTML = `<span>-</span>`;
            }

            bookEl.onclick = (function(idx) {
                return function() { clickBook(idx); };
            })(globalIdx);

            rowDiv.appendChild(bookEl);
        }
        shelfArea.appendChild(rowDiv);
    }
}
