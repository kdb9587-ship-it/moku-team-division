let masterPlayers = JSON.parse(localStorage.getItem('vb_purple_list')) || [];

function updateActiveCount() {
    // 現在の絞り込み状態（すべて/男性/女性）を取得
    const filterRadio = document.querySelector('input[name="indexGenderFilter"]:checked');
    const filterValue = filterRadio ? filterRadio.value : "all";

    const checkboxes = document.querySelectorAll('input[name="present"]');
    let checkedCount = 0;
    
    checkboxes.forEach(cb => {
        const listItem = cb.closest('.list-item');
        const itemGender = listItem.getAttribute('data-gender');
        
        // フィルターで非表示になっている人は、参加人数のカウントや並び替え処理から除外する
        if (filterValue !== "all" && itemGender !== filterValue) {
            return; 
        }
        
        if (cb.checked) {
            checkedCount++;
            listItem.style.order = "1";
            listItem.style.opacity = "1";
        } else {
            listItem.style.order = "2";
            listItem.style.opacity = "0.5";
        }
    });
    
    document.getElementById('activeCount').innerText = checkedCount;
}

function renderSelectionList() {
    const list = document.getElementById('selectionList');
    
    list.style.display = 'flex';
    list.style.flexDirection = 'column';

    if(masterPlayers.length === 0) {
        list.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">名簿に登録がありません。</p>';
        return;
    }
    list.innerHTML = '';
    masterPlayers.forEach(p => {
        list.innerHTML += `
            <label class="list-item" data-gender="${p.gender}">
                <span>${p.gender === "1" ? "🔵" : "🟠"} ${p.name}</span>
                <input type="checkbox" name="present" value="${p.id}" checked onchange="updateActiveCount()" style="transform:scale(1.5); accent-color: var(--primary-purple);">
            </label>`;
    });
    
    updateActiveCount();
}

function filterSelectionList() {
    const filterRadio = document.querySelector('input[name="indexGenderFilter"]:checked');
    const filterValue = filterRadio ? filterRadio.value : "all";
    
    const items = document.querySelectorAll('#selectionList .list-item');
    
    items.forEach(item => {
        const itemGender = item.getAttribute('data-gender');
        if (filterValue === "all" || itemGender === filterValue) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
    
    // 表示が切り替わったタイミングで、人数のカウントを再計算する
    updateActiveCount();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateTeams() {
    // 現在の絞り込み状態を取得
    const filterRadio = document.querySelector('input[name="indexGenderFilter"]:checked');
    const filterValue = filterRadio ? filterRadio.value : "all";

    const checkedIds = Array.from(document.querySelectorAll('input[name="present"]:checked')).map(el => parseInt(el.value));
    
    // 「チェックが入っている」かつ「現在表示されている（フィルターに合致している）」人のみを対象にする
    const selectedPlayers = masterPlayers.filter(p => {
        const isChecked = checkedIds.includes(p.id);
        const isVisible = filterValue === "all" || p.gender === filterValue;
        return isChecked && isVisible;
    });

    const teamCount = parseInt(document.getElementById('teamCountInput').value);

    if(selectedPlayers.length < teamCount) return alert("人数が不足しています");

    const group1 = shuffle(selectedPlayers.filter(p => p.gender === "1"));
    const group2 = shuffle(selectedPlayers.filter(p => p.gender === "2"));
    const allSorted = [...group1, ...group2];
    const teams = Array.from({ length: teamCount }, (_, i) => ({ id: i + 1, members: [] }));

    allSorted.forEach((player, index) => {
        teams[index % teamCount].members.push(player);
    });

    const area = document.getElementById('resultArea');
    area.innerHTML = '';
    teams.forEach(t => {
        const memberHtml = t.members.map(m => `<div>${m.gender === '1' ? '🔵':'🟠'} ${m.name}</div>`).join('');
        area.innerHTML += `
            <div class="team-card">
                <div class="team-title">チーム ${t.id}</div>
                ${memberHtml}
            </div>`;
    });
    area.scrollIntoView({ behavior: 'smooth' });
}

renderSelectionList();