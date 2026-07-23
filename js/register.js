let masterPlayers = JSON.parse(localStorage.getItem('vb_purple_list')) || [];

function addMember() {
    const nameInput = document.getElementById('newName');
    const isMale = document.getElementById('isMaleCheck').checked;
    if(!nameInput.value) return;

    // 男性は"1"、女性は"2"として保存します
    masterPlayers.push({ id: Date.now(), name: nameInput.value, gender: isMale ? "1" : "2" });
    nameInput.value = '';
    document.getElementById('isMaleCheck').checked = false;
    saveData();
    renderMasterList();
}

function deleteMember(id) {
    if(!confirm("削除しますか？")) return;
    masterPlayers = masterPlayers.filter(p => p.id !== id);
    saveData();
    renderMasterList();
}

function renderMasterList() {
    const list = document.getElementById('masterList');
    
    // 現在選択されているラジオボタンの値を取得 ("all", "1", "2" のいずれか)
    const filterRadio = document.querySelector('input[name="genderFilter"]:checked');
    const filterValue = filterRadio ? filterRadio.value : "all";

    // 選択された値に合わせて配列を絞り込む
    const filteredPlayers = masterPlayers.filter(p => {
        if (filterValue === "all") return true; // 「すべて」の場合は全員表示
        return p.gender === filterValue;        // 性別が一致する人のみ表示
    });

    // 絞り込み後の人数と、全体の登録人数を表示
    list.innerHTML = `<strong>名簿一覧 (${filteredPlayers.length}人 / 全${masterPlayers.length}人):</strong>`;
    
    // 絞り込んだ配列(filteredPlayers)をもとにリストを生成
    filteredPlayers.forEach(p => {
        const genderMark = p.gender === "1" ? "🔵" : "🟠";
        list.innerHTML += `
            <div class="list-item">
                <span>${genderMark} ${p.name}</span>
                <button onclick="deleteMember(${p.id})" style="color:var(--danger); border:none; background:none; cursor:pointer; font-weight:bold;">削除</button>
            </div>`;
    });
}

function saveData() {
    localStorage.setItem('vb_purple_list', JSON.stringify(masterPlayers));
}

renderMasterList();