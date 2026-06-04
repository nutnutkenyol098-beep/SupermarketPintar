/* =====================================================
   SUPERMARKET SIMULATOR RUPIAH
   KASIR CERDAS CBP
   BAGIAN 1
===================================================== */

/* =====================================================
   VARIABEL GLOBAL
===================================================== */

let playerName = "";

let score = 0;
let combo = 0;
let fakeFound = 0;

let currentLevel = 1;
let customerCount = 0;

let selectedMoney = null;

let currentEncounter = null;

let fakeSelections = [];

/* =====================================================
   DATA PELANGGAN (50)
===================================================== */

const customerNames = [
"Budi","Siti","Andi","Rina","Fajar",
"Putri","Dimas","Nabila","Agus","Rahma",
"Rizki","Aisyah","Bayu","Lestari","Joko",
"Dewi","Arif","Yuni","Tono","Maya",
"Farhan","Nina","Dedi","Fitri","Eko",
"Salma","Aldi","Wulan","Ilham","Anisa",
"Rafi","Tika","Yusuf","Citra","Bagus",
"Nadya","Rendra","Aulia","Reza","Melati",
"Hendra","Karina","Bambang","Vina","Dian",
"Zaki","Naufal","Tiara","Raka","Salsa"
];

/* =====================================================
   DATA BARANG (30)
===================================================== */

const items = [

{ name:"Beras", price:50000 },
{ name:"Tepung", price:20000 },
{ name:"Gula", price:17000 },
{ name:"Minyak Goreng", price:18000 },
{ name:"Mie Instan", price:3500 },
{ name:"Sabun", price:10000 },
{ name:"Susu", price:15000 },
{ name:"Telur", price:28000 },
{ name:"Kopi", price:12000 },
{ name:"Teh", price:8000 },

{ name:"Roti", price:15000 },
{ name:"Air Mineral", price:5000 },
{ name:"Kecap", price:12000 },
{ name:"Saus", price:13000 },
{ name:"Biskuit", price:9000 },
{ name:"Shampoo", price:25000 },
{ name:"Pasta Gigi", price:14000 },
{ name:"Detergen", price:22000 },
{ name:"Sarden", price:18000 },
{ name:"Mentega", price:16000 },

{ name:"Keju", price:30000 },
{ name:"Yogurt", price:17000 },
{ name:"Kerupuk", price:8000 },
{ name:"Cokelat", price:12000 },
{ name:"Permen", price:4000 },
{ name:"Tisu", price:11000 },
{ name:"Lampu", price:25000 },
{ name:"Baterai", price:18000 },
{ name:"Masker", price:10000 },
{ name:"Galon", price:25000 }

];

/* =====================================================
   FAKTA EDUKASI CBP (30)
===================================================== */

const educationFacts = [

"Metode 3D adalah Dilihat, Diraba, dan Diterawang.",

"Nomor seri yang buram dapat menjadi indikasi uang palsu.",

"Merawat Rupiah adalah bentuk Cinta Rupiah.",

"Rupiah merupakan simbol kedaulatan negara Indonesia.",

"Benang pengaman adalah salah satu ciri uang asli.",

"Watermark dapat dilihat saat uang diterawang.",

"Jangan mencoret uang Rupiah.",

"Jangan melipat uang secara berlebihan.",

"Cetakan timbul membantu mengenali uang asli.",

"Nomor seri setiap uang berbeda.",

"Uang rusak dapat ditukarkan di Bank Indonesia.",

"Periksa uang sebelum menerima pembayaran.",

"Uang palsu sering memiliki warna yang kurang tajam.",

"Paham Rupiah membantu menghindari penipuan.",

"Kasir yang teliti membantu menjaga keamanan transaksi.",

"Rupiah adalah alat pembayaran yang sah di Indonesia.",

"Jangan merusak uang dengan staples.",

"Simpan uang di tempat yang bersih dan kering.",

"Metode 3D dapat dilakukan siapa saja.",

"Benang pengaman sulit dipalsukan.",

"Watermark terlihat jelas pada uang asli.",

"Kenali pecahan Rupiah sejak dini.",

"Bangga menggunakan Rupiah di wilayah Indonesia.",

"Cinta Rupiah berarti merawat uang dengan baik.",

"Diraba berarti memeriksa tekstur uang.",

"Dilihat berarti memeriksa tampilan visual uang.",

"Diterawang berarti memeriksa watermark dan benang pengaman.",

"Jangan mudah percaya pada uang yang tampak mencurigakan.",

"Periksa lebih dari satu ciri keamanan.",

"Semakin sering berlatih, semakin mudah mengenali uang asli."

];

/* =====================================================
   NOMINAL UANG
===================================================== */

const moneyValues = [
1000,
2000,
5000,
10000,
20000,
50000,
100000
];

/* =====================================================
   UTILITAS
===================================================== */

function randomItem(array){

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];

}

function randomNumber(min,max){

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}

function formatRupiah(number){

    return "Rp" +
    number.toLocaleString("id-ID");

}

/* =====================================================
   SISTEM LEVEL
===================================================== */

function updateLevel(){

    if(customerCount >= 25){

        currentLevel = 5;

    }else if(customerCount >= 18){

        currentLevel = 4;

    }else if(customerCount >= 12){

        currentLevel = 3;

    }else if(customerCount >= 6){

        currentLevel = 2;

    }else{

        currentLevel = 1;

    }

}

/* =====================================================
   PELUANG UANG PALSU
===================================================== */

function fakeChanceByLevel(){

    switch(currentLevel){

        case 1:
            return 0.10;

        case 2:
            return 0.25;

        case 3:
            return 0.40;

        case 4:
            return 0.50;

        case 5:
            return 0.60;

        default:
            return 0.10;
    }

}

/* =====================================================
   MEMBUAT DATA UANG
===================================================== */

function createMoney(nominal, isFake){

    return {

        nominal,

        fake:isFake,

        texture:isFake
            ? "halus"
            : "kasar",

        serial:isFake
            ? "buram"
            : "jelas",

        watermark:isFake
            ? "hilang"
            : "jelas",

        securityThread:isFake
            ? "hilang"
            : "ada",

        hiddenImage:isFake
            ? "tidak menyatu"
            : "menyatu"

    };

}

/* =====================================================
   GENERATE BELANJA
===================================================== */

function generateShopping(){

    const totalItems =
        randomNumber(2,5);

    const shopping = [];

    let total = 0;

    for(
        let i = 0;
        i < totalItems;
        i++
    ){

        const item =
            randomItem(items);

        shopping.push(item);

        total += item.price;

    }

    return {
        shopping,
        total
    };

}

/* =====================================================
   GENERATE PEMBAYARAN
===================================================== */

function generatePayment(total){

    let payment = [];

    let paid = 0;

    const target =
        total +
        randomNumber(
            0,
            100000
        );

    while(paid < target){

        const nominal =
            randomItem(
                moneyValues
            );

        const isFake =
            Math.random()
            <
            fakeChanceByLevel();

        payment.push(

            createMoney(
                nominal,
                isFake
            )

        );

        paid += nominal;

    }

    if(
        currentLevel >= 4 &&
        Math.random() < 0.35
    ){

        const extraFake =
            randomNumber(
                1,
                payment.length - 1
            );

        payment[extraFake].fake = true;
        payment[extraFake].texture = "halus";
        payment[extraFake].serial = "buram";
        payment[extraFake].watermark = "hilang";
        payment[extraFake].securityThread = "hilang";
        payment[extraFake].hiddenImage = "tidak menyatu";

    }

    return payment;

}

/* =====================================================
   GENERATE ENCOUNTER
===================================================== */

function generateEncounter(){

    updateLevel();

    const customer =
        randomItem(
            customerNames
        );

    const shoppingData =
        generateShopping();

    const payment =
        generatePayment(
            shoppingData.total
        );

    currentEncounter = {

        customer,

        shopping:
            shoppingData.shopping,

        total:
            shoppingData.total,

        payment

    };

}
/* =====================================================
   BAGIAN 2
   RENDER UI + SISTEM INSPEKSI 3D
===================================================== */

/* =====================================================
   ELEMENT HTML
===================================================== */

const customerNameEl =
document.getElementById("customerName");

const shoppingListEl =
document.getElementById("shoppingList");

const totalBelanjaEl =
document.getElementById("totalBelanja");

const moneyContainerEl =
document.getElementById("moneyContainer");

const selectedMoneyEl =
document.getElementById("selectedMoney");

const inspectionResultEl =
document.getElementById("inspectionResult");

const scoreEl =
document.getElementById("score");

const comboEl =
document.getElementById("combo");

const levelEl =
document.getElementById("level");

const fakeFoundEl =
document.getElementById("fakeFound");

/* =====================================================
   UPDATE PANEL SKOR
===================================================== */

function updateStats(){

    scoreEl.textContent =
    score;

    comboEl.textContent =
    combo;

    levelEl.textContent =
    currentLevel;

    fakeFoundEl.textContent =
    fakeFound;

}

/* =====================================================
   RENDER DAFTAR BELANJA
===================================================== */

function renderShopping(){

    customerNameEl.textContent =
    currentEncounter.customer;

    shoppingListEl.innerHTML = "";

    currentEncounter.shopping.forEach(
        item => {

            const div =
            document.createElement("div");

            div.className =
            "shopping-item";

            div.innerHTML = `
                <span>${item.name}</span>
                <span>${formatRupiah(item.price)}</span>
            `;

            shoppingListEl.appendChild(div);

        }
    );

    totalBelanjaEl.textContent =
    formatRupiah(
        currentEncounter.total
    );

}

/* =====================================================
   RENDER UANG
===================================================== */

function renderMoney(){

    moneyContainerEl.innerHTML = "";

    currentEncounter.payment.forEach(
        (money,index)=>{

            const card =
            document.createElement("div");

            card.className =
            "money-card";

            card.dataset.index =
            index;

            card.innerHTML = `
                ${formatRupiah(
                    money.nominal
                )}
            `;

            card.addEventListener(
                "click",
                ()=>{

                    selectMoney(
                        index
                    );

                }
            );

            moneyContainerEl
            .appendChild(card);

        }
    );

}

/* =====================================================
   PILIH UANG
===================================================== */

function selectMoney(index){

    selectedMoney =
    currentEncounter.payment[
        index
    ];

    document
    .querySelectorAll(
        ".money-card"
    )
    .forEach(card=>{

        card.classList
        .remove("selected");

    });

    document
    .querySelector(
        `[data-index="${index}"]`
    )
    .classList
    .add("selected");

    selectedMoneyEl.textContent =
    formatRupiah(
        selectedMoney.nominal
    );

    inspectionResultEl.innerHTML =
    `
    Uang dipilih.<br>
    Gunakan Dilihat,
    Diraba, atau
    Diterawang.
    `;

}

/* =====================================================
   PETUNJUK BERDASARKAN LEVEL
===================================================== */

function clueLevelText(
    clearText,
    mediumText,
    hardText
){

    if(currentLevel === 1){

        return clearText;

    }

    if(currentLevel === 2){

        return clearText;

    }

    if(currentLevel === 3){

        return mediumText;

    }

    if(currentLevel === 4){

        return hardText;

    }

    return hardText;

}

/* =====================================================
   DILIHAT
===================================================== */

function inspectLook(){

    if(!selectedMoney){

        alert(
            "Pilih uang terlebih dahulu!"
        );

        return;
    }

    let result = "";

    if(!selectedMoney.fake){

        result =
        clueLevelText(

            `
            Nomor seri terlihat jelas.
            Warna tajam.
            Gambar presiden sangat jelas.
            `,

            `
            Nomor seri tampak normal.
            Warna cukup tajam.
            Tidak terlihat kejanggalan.
            `,

            `
            Nomor seri tampak cukup baik.
            Cetakan terlihat meyakinkan.
            `
        );

    }else{

        result =
        clueLevelText(

            `
            Nomor seri terlihat buram.
            Warna sedikit pudar.
            Terdapat kejanggalan cetakan.
            `,

            `
            Nomor seri kurang meyakinkan.
            Warna tampak berbeda.
            `,

            `
            Ada sesuatu yang terasa
            kurang tepat pada cetakan.
            `
        );

    }

    inspectionResultEl.innerHTML =
    `
    <b>👀 Dilihat</b><br><br>
    ${result}
    `;

}

/* =====================================================
   DIRABA
===================================================== */

function inspectTouch(){

    if(!selectedMoney){

        alert(
            "Pilih uang terlebih dahulu!"
        );

        return;
    }

    let result = "";

    if(!selectedMoney.fake){

        result =
        clueLevelText(

            `
            Tekstur terasa kasar.
            Cetakan timbul terasa jelas.
            `,

            `
            Permukaan terasa normal.
            Ada sedikit tekstur timbul.
            `,

            `
            Tekstur terasa cukup baik.
            `
        );

    }else{

        result =
        clueLevelText(

            `
            Permukaan terlalu halus.
            Tidak terasa cetakan timbul.
            `,

            `
            Tekstur terasa aneh.
            Bagian timbul sulit ditemukan.
            `,

            `
            Tekstur terasa kurang
            meyakinkan.
            `
        );

    }

    inspectionResultEl.innerHTML =
    `
    <b>✋ Diraba</b><br><br>
    ${result}
    `;

}

/* =====================================================
   DITERAWANG
===================================================== */

function inspectLight(){

    if(!selectedMoney){

        alert(
            "Pilih uang terlebih dahulu!"
        );

        return;
    }

    let result = "";

    if(!selectedMoney.fake){

        result =
        clueLevelText(

            `
            Watermark terlihat jelas.
            Benang pengaman terlihat.
            Gambar saling isi menyatu.
            `,

            `
            Watermark tampak baik.
            Benang pengaman terlihat.
            `,

            `
            Fitur keamanan tampak
            cukup meyakinkan.
            `
        );

    }else{

        result =
        clueLevelText(

            `
            Watermark tidak terlihat.
            Benang pengaman hilang.
            Gambar tidak menyatu.
            `,

            `
            Watermark tampak kurang jelas.
            Benang pengaman sulit ditemukan.
            `,

            `
            Ada fitur keamanan yang
            terasa kurang meyakinkan.
            `
        );

    }

    inspectionResultEl.innerHTML =
    `
    <b>💡 Diterawang</b><br><br>
    ${result}
    `;

}

/* =====================================================
   RENDER SELURUH ENCOUNTER
===================================================== */

function renderEncounter(){

    selectedMoney = null;

    renderShopping();

    renderMoney();

    updateStats();

    selectedMoneyEl.textContent =
    "Belum dipilih";

    inspectionResultEl.innerHTML =
    `
    Pilih uang lalu lakukan
    pemeriksaan menggunakan
    metode 3D.
    `;

}

/* =====================================================
   EVENT INSPEKSI
===================================================== */

document
.getElementById("lihatBtn")
.addEventListener(
    "click",
    inspectLook
);

document
.getElementById("rabaBtn")
.addEventListener(
    "click",
    inspectTouch
);

document
.getElementById("terawangBtn")
.addEventListener(
    "click",
    inspectLight
);
/* =====================================================
   BAGIAN 3
   TERIMA / TOLAK
   SKOR
   COMBO
   HASIL RONDE
===================================================== */

/* =====================================================
   ELEMENT HASIL
===================================================== */

const resultModal =
document.getElementById(
    "resultModal"
);

const resultTitle =
document.getElementById(
    "resultTitle"
);

const resultMessage =
document.getElementById(
    "resultMessage"
);

const continueBtn =
document.getElementById(
    "continueBtn"
);

const fakeSelectorSection =
document.getElementById(
    "fakeSelectorSection"
);

const fakeSelectorList =
document.getElementById(
    "fakeSelectorList"
);

const confirmFakeBtn =
document.getElementById(
    "confirmFakeBtn"
);

/* =====================================================
   CEK ADA UANG PALSU?
===================================================== */

function hasFakeMoney(){

    return currentEncounter.payment
    .some(
        money => money.fake
    );

}

/* =====================================================
   DAFTAR UANG PALSU
===================================================== */

function getFakeIndexes(){

    const fakeIndexes = [];

    currentEncounter.payment
    .forEach(
        (money,index)=>{

            if(money.fake){

                fakeIndexes.push(
                    index
                );

            }

        }
    );

    return fakeIndexes;

}

/* =====================================================
   TAMPILKAN POPUP HASIL
===================================================== */

function showResult(
    title,
    message
){

    resultTitle.textContent =
    title;

    resultMessage.innerHTML =
    message;

    resultModal
    .classList
    .remove("hidden");

}

/* =====================================================
   TUTUP POPUP
===================================================== */

function closeResult(){

    resultModal
    .classList
    .add("hidden");

}

/* =====================================================
   RESET COMBO
===================================================== */

function resetCombo(){

    combo = 0;

}

/* =====================================================
   BONUS COMBO
===================================================== */

function checkComboBonus(){

    if(combo > 0 &&
       combo % 5 === 0){

        score += 200;

        showResult(
            "🔥 Bonus Combo!",
            `
            5 pelanggan berturut-turut
            berhasil diselesaikan!
            <br><br>
            Bonus +200 poin.
            `
        );

    }

}

/* =====================================================
   PILIH UANG PALSU
===================================================== */

function openFakeSelector(){

    fakeSelections = [];

    fakeSelectorList.innerHTML =
    "";

    currentEncounter.payment
    .forEach(
        (money,index)=>{

            const div =
            document.createElement(
                "div"
            );

            div.className =
            "fake-option";

            div.textContent =
            formatRupiah(
                money.nominal
            );

            div.addEventListener(
                "click",
                ()=>{

                    div.classList
                    .toggle(
                        "selected"
                    );

                    if(
                        fakeSelections
                        .includes(index)
                    ){

                        fakeSelections =
                        fakeSelections
                        .filter(
                            i=>i!==index
                        );

                    }else{

                        fakeSelections
                        .push(index);

                    }

                }
            );

            fakeSelectorList
            .appendChild(div);

        }
    );

    fakeSelectorSection
    .classList
    .remove("hidden");

}

/* =====================================================
   CEK PILIHAN UANG PALSU
===================================================== */

function validateFakeSelection(){

    const realFakes =
    getFakeIndexes();

    const chosen =
    [...fakeSelections]
    .sort();

    const actual =
    [...realFakes]
    .sort();

    const correct =
    JSON.stringify(chosen)
    ===
    JSON.stringify(actual);

    if(correct){

        fakeFound +=
        actual.length;

        score +=
        100 *
        actual.length;

        combo++;

        showResult(
            "✅ Benar!",
            `
            Kamu berhasil menemukan
            seluruh uang palsu.
            <br><br>
            +${100 * actual.length}
            poin
            `
        );

        checkComboBonus();

    }else{

        score -= 100;

        resetCombo();

        showResult(
            "❌ Salah",
            `
            Ada uang palsu yang
            terlewat atau pilihanmu
            tidak tepat.
            <br><br>
            -100 poin
            `
        );

    }

    updateStats();

    fakeSelectorSection
    .classList
    .add("hidden");

}

/* =====================================================
   TERIMA UANG
===================================================== */

function acceptMoney(){

    const fakeExists =
    hasFakeMoney();

    if(fakeExists){

        score -= 100;

        resetCombo();

        updateStats();

        showResult(
            "❌ Uang Palsu Lolos",
            `
            Kamu menerima transaksi
            yang mengandung uang palsu.
            <br><br>
            -100 poin
            `
        );

    }else{

        score += 50;

        combo++;

        updateStats();

        showResult(
            "✅ Transaksi Benar",
            `
            Semua uang asli.
            <br><br>
            +50 poin
            `
        );

        checkComboBonus();

    }

}

/* =====================================================
   TOLAK UANG
===================================================== */

function rejectMoney(){

    const fakeExists =
    hasFakeMoney();

    if(fakeExists){

        openFakeSelector();

    }else{

        score -= 50;

        resetCombo();

        updateStats();

        showResult(
            "❌ Salah Menolak",
            `
            Semua uang sebenarnya asli.
            <br><br>
            -50 poin
            `
        );

    }

}

/* =====================================================
   LEVEL UP INFO
===================================================== */

function checkLevelMessage(){

    const oldLevel =
    parseInt(
        levelEl.textContent
    );

    updateLevel();

    if(currentLevel > oldLevel){

        showResult(
            "⬆ Level Naik!",
            `
            Selamat!
            <br><br>
            Kamu naik ke
            Level ${currentLevel}.
            <br><br>
            Uang palsu akan
            semakin sulit dikenali.
            `
        );

    }

}

/* =====================================================
   EVENT BUTTON
===================================================== */

document
.getElementById(
    "acceptBtn"
)
.addEventListener(
    "click",
    acceptMoney
);

document
.getElementById(
    "rejectBtn"
)
.addEventListener(
    "click",
    rejectMoney
);

confirmFakeBtn
.addEventListener(
    "click",
    validateFakeSelection
);
/* =====================================================
   BAGIAN 4
   LEADERBOARD
   EDUKASI CBP
   START GAME
   NEXT CUSTOMER
===================================================== */

/* =====================================================
   ELEMENT START SCREEN
===================================================== */

const startScreen =
document.getElementById(
    "startScreen"
);

const playerNameInput =
document.getElementById(
    "playerName"
);

const startBtn =
document.getElementById(
    "startBtn"
);

/* =====================================================
   EDUKASI MODAL
===================================================== */

const educationModal =
document.getElementById(
    "educationModal"
);

const educationText =
document.getElementById(
    "educationText"
);

const nextCustomerBtn =
document.getElementById(
    "nextCustomerBtn"
);

/* =====================================================
   LEADERBOARD ELEMENT
===================================================== */

const bestPlayerEl =
document.getElementById(
    "bestPlayer"
);

const bestScoreEl =
document.getElementById(
    "bestScore"
);

const bestFakeEl =
document.getElementById(
    "bestFake"
);

/* =====================================================
   LOCAL STORAGE KEY
===================================================== */

const STORAGE_KEY =
"cbpLeaderboard";

/* =====================================================
   LOAD LEADERBOARD
===================================================== */

function loadLeaderboard(){

    const data =
    localStorage.getItem(
        STORAGE_KEY
    );

    if(!data){

        bestPlayerEl.textContent =
        "-";

        bestScoreEl.textContent =
        "0";

        bestFakeEl.textContent =
        "0";

        return;
    }

    const leaderboard =
    JSON.parse(data);

    bestPlayerEl.textContent =
    leaderboard.playerName;

    bestScoreEl.textContent =
    leaderboard.highScore;

    bestFakeEl.textContent =
    leaderboard.fakeFound;

}

/* =====================================================
   SAVE LEADERBOARD
===================================================== */

function saveLeaderboard(){

    const oldData =
    JSON.parse(
        localStorage.getItem(
            STORAGE_KEY
        )
    );

    if(
        !oldData ||
        score >
        oldData.highScore
    ){

        const leaderboard = {

            playerName:
            playerName,

            highScore:
            score,

            fakeFound:
            fakeFound

        };

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                leaderboard
            )
        );

    }

    loadLeaderboard();

}

/* =====================================================
   FAKTA EDUKASI ACAK
===================================================== */

function randomEducationFact(){

    return educationFacts[
        Math.floor(
            Math.random()
            *
            educationFacts.length
        )
    ];

}

/* =====================================================
   TAMPILKAN EDUKASI
===================================================== */

function showEducation(){

    educationText.textContent =
    randomEducationFact();

    educationModal
    .classList
    .remove("hidden");

}

/* =====================================================
   TUTUP EDUKASI
===================================================== */

function closeEducation(){

    educationModal
    .classList
    .add("hidden");

}

/* =====================================================
   PELANGGAN BERIKUTNYA
===================================================== */

function nextCustomer(){

    customerCount++;

    updateLevel();

    generateEncounter();

    renderEncounter();

    saveLeaderboard();

}

/* =====================================================
   LANJUT DARI HASIL
===================================================== */

continueBtn
.addEventListener(
    "click",
    ()=>{

        closeResult();

        showEducation();

    }
);

/* =====================================================
   LANJUT SETELAH EDUKASI
===================================================== */

nextCustomerBtn
.addEventListener(
    "click",
    ()=>{

        closeEducation();

        nextCustomer();

    }
);

/* =====================================================
   MULAI GAME
===================================================== */

function startGame(){

    const inputName =
    playerNameInput.value
    .trim();

    if(
        inputName.length < 2
    ){

        alert(
            "Masukkan nama pemain."
        );

        return;
    }

    playerName =
    inputName;

    startScreen
    .classList
    .add("hidden");

    score = 0;
    combo = 0;
    fakeFound = 0;
    customerCount = 0;
    currentLevel = 1;

    generateEncounter();

    renderEncounter();

    updateStats();

    loadLeaderboard();

}

/* =====================================================
   EVENT START
===================================================== */

startBtn
.addEventListener(
    "click",
    startGame
);

/* =====================================================
   ENTER UNTUK MULAI
===================================================== */

playerNameInput
.addEventListener(
    "keydown",
    (e)=>{

        if(
            e.key === "Enter"
        ){

            startGame();

        }

    }
);

/* =====================================================
   GAME OVER OPSIONAL
===================================================== */

function gameOver(){

    saveLeaderboard();

    showResult(
        "🏁 Permainan Selesai",
        `
        Terima kasih telah bermain.

        <br><br>

        Nama:
        ${playerName}

        <br>

        Skor:
        ${score}

        <br>

        Uang palsu ditemukan:
        ${fakeFound}

        <br><br>

        Tetap ingat metode 3D:
        Dilihat,
        Diraba,
        Diterawang.
        `
    );

}

/* =====================================================
   LOAD AWAL
===================================================== */

window.addEventListener(
    "load",
    ()=>{

        loadLeaderboard();

    }
);
function validateFakeSelection(){

    const realFakes =
    getFakeIndexes();

    const chosen =
    [...fakeSelections].sort();

    const actual =
    [...realFakes].sort();

    const correct =
    JSON.stringify(chosen) ===
    JSON.stringify(actual);

    fakeSelectorSection
    .classList
    .add("hidden");

    if(correct){

        fakeFound += actual.length;

        score += 100 * actual.length;

        combo++;

        updateStats();

        showResult(
            "✅ Benar!",
            `
            Kamu berhasil menemukan
            seluruh uang palsu.

            <br><br>

            +${100 * actual.length} poin
            `
        );

    }else{

        score -= 100;

        combo = 0;

        updateStats();

        showResult(
            "❌ Salah",
            `
            Pilihan uang palsu
            tidak tepat.

            <br><br>

            -100 poin
            `
        );

    }

      }
