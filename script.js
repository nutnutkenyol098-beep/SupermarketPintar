// your code goes here
/* =====================================
   SUPERMARKET SIMULATOR RUPIAH
   BAGIAN 3 - CORE SYSTEM
===================================== */

/* =====================================
   PLAYER DATA
===================================== */

let player = {
    name: "",
    day: 1,
    score: 0,
    coins: 0,
    customersServed: 0,
    fakeFound: 0,
    streak: 0,

    patienceUpgrade: 0,
    itemUpgrade: 0,
    bonusUpgrade: 0
};

/* =====================================
   GAME STATE
===================================== */

let currentCustomer = null;
let currentShopping = [];
let currentPayment = [];

let customerNumber = 1;

let timer = 60;
let timerInterval = null;

/* =====================================
   DOM
===================================== */

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

const playerNameInput = document.getElementById("playerName");
const newGameBtn = document.getElementById("newGameBtn");

const customerNameEl = document.getElementById("customerName");
const customerDialogEl = document.getElementById("customerDialog");

const shoppingListEl = document.getElementById("shoppingList");
const totalPriceEl = document.getElementById("totalPrice");

const moneyContainer = document.getElementById("moneyContainer");

const timerEl = document.getElementById("timer");
const patienceLabel = document.getElementById("patienceLabel");

const scoreEl = document.getElementById("score");
const coinsEl = document.getElementById("coins");

const dayNumberEl = document.getElementById("dayNumber");
const customerCountEl = document.getElementById("customerCount");

/* =====================================
   SAVE SYSTEM
===================================== */

function saveGame(){

    localStorage.setItem(
        "cbpPlayer",
        JSON.stringify(player)
    );

}

function loadGame(){

    const data =
    localStorage.getItem("cbpPlayer");

    if(data){

        player =
        JSON.parse(data);

    }

}

loadGame();

/* =====================================
   CUSTOMER NAMES
===================================== */

const customerNames = [

"Budi","Siti","Andi","Rina","Rahma",
"Putri","Dimas","Fajar","Agus","Nabila",
"Yusuf","Bayu","Dewi","Aldi","Rizky",
"Rafi","Anisa","Farhan","Aulia","Dian",
"Intan","Wahyu","Asep","Deni","Maya",
"Lina","Nisa","Joko","Rudi","Anton",
"Bagus","Eka","Tari","Nadya","Vina",
"Rendra","Tono","Lukman","Mira","Dewo",
"Yuni","Naufal","Riko","Rara","Arif",
"Kevin","Daffa","Ilham","Niko","Aisyah",
"Riko","Tegar","Salma","Niken","Jihan",
"Arman","Salsa","Bintang","Gilang","Hana",
"Fikri","Naufal","Mila","Riko","Rendy",
"Putra","Ratu","Meli","Siska","Bram",
"Rio","Seno","Vito","Vina","Zahra",
"Rama","Luthfi","Nina","Ayu","Roni",
"Yoga","Riska","Dewi","Miko","Adit",
"Vera","Dian","Niko","Yani","Fani",
"Putri","Nanda","Arga","Laras","Naufi"

];

/* =====================================
   CUSTOMER DIALOG
===================================== */

const customerDialogs = {

veryPatient:[
"Silakan diperiksa pelan-pelan.",
"Saya tidak buru-buru.",
"Yang penting teliti ya.",
"Santai saja kasir."
],

patient:[
"Tolong cepat sedikit ya.",
"Saya masih bisa menunggu.",
"Semoga tidak lama.",
"Tolong dicek dengan benar."
],

rush:[
"Saya sedang buru-buru.",
"Tolong dipercepat.",
"Ada urusan setelah ini.",
"Cepat ya kasir."
],

veryRush:[
"Saya tidak punya banyak waktu.",
"Jangan lama-lama ya.",
"Cepat ya.",
"Saya hampir terlambat."
],

suspicious:[
"Tidak perlu diperiksa lama.",
"Langsung saja diterima.",
"Saya buru-buru sekali.",
"Cepat dong."
]

};

/* =====================================
   PATIENCE LEVELS
===================================== */

const patienceLevels = [

{
name:"Sangat Sabar",
time:60,
type:"veryPatient"
},

{
name:"Sabar",
time:45,
type:"patient"
},

{
name:"Terburu-buru",
time:30,
type:"rush"
},

{
name:"Sangat Terburu-buru",
time:22,
type:"veryRush"
},

{
name:"Terburu-buru Mencurigakan",
time:15,
type:"suspicious"
}

];

/* =====================================
   ITEMS
===================================== */

const items = [

{ name:"Beras", price:50000 },
{ name:"Tepung", price:15000 },
{ name:"Gula", price:18000 },
{ name:"Minyak Goreng", price:22000 },
{ name:"Mie Instan", price:4000 },
{ name:"Sabun", price:8000 },
{ name:"Susu", price:18000 },
{ name:"Telur", price:28000 },
{ name:"Kopi", price:12000 },
{ name:"Teh", price:9000 },
{ name:"Air Mineral", price:5000 },
{ name:"Roti", price:12000 },
{ name:"Tisu", price:10000 },
{ name:"Pasta Gigi", price:13000 },
{ name:"Deterjen", price:24000 },
{ name:"Baterai", price:18000 },
{ name:"Lampu LED", price:30000 },
{ name:"Permen", price:2000 },
{ name:"Biskuit", price:9000 },
{ name:"Coklat", price:12000 },
{ name:"Sosis", price:25000 },
{ name:"Keju", price:28000 },
{ name:"Sarden", price:16000 },
{ name:"Sambal", price:14000 },
{ name:"Kecap", price:13000 },
{ name:"Shampoo", price:27000 },
{ name:"Body Wash", price:24000 },
{ name:"Pensil", price:3000 },
{ name:"Buku Tulis", price:6000 },
{ name:"Spidol", price:8000 }

];

/* =====================================
   START GAME
===================================== */

newGameBtn.addEventListener(
"click",
startGame
);

function startGame(){

    const name =
    playerNameInput.value.trim();

    if(!name){

        alert(
        "Masukkan nama pemain."
        );

        return;

    }

    player.name = name;

    saveGame();

    startScreen.classList.add(
    "hidden"
    );

    gameScreen.classList.remove(
    "hidden"
    );

    updateUI();

    generateCustomer();

}

/* =====================================
   UI
===================================== */

function updateUI(){

    scoreEl.textContent =
    player.score;

    coinsEl.textContent =
    player.coins;

    dayNumberEl.textContent =
    player.day;

    customerCountEl.textContent =
    customerNumber;

}

/* =====================================
   RANDOM HELPER
===================================== */

function randomItem(arr){

    return arr[
        Math.floor(
            Math.random()*arr.length
        )
    ];

}

/* =====================================
   GENERATE CUSTOMER
===================================== */

function generateCustomer(){

    shoppingListEl.innerHTML = "";
    moneyContainer.innerHTML = "";

    currentShopping = [];

    const patience =
    randomItem(
        patienceLevels
    );

    currentCustomer = {

        name:
        randomItem(
            customerNames
        ),

        patience

    };

    customerNameEl.textContent =
    currentCustomer.name;

    customerDialogEl.textContent =
    randomItem(
        customerDialogs[
        patience.type
        ]
    );

    patienceLabel.textContent =
    patience.name;

    timer =
    patience.time +
    (
    player.patienceUpgrade * 4
    );

    startTimer();

    generateShopping();

}

/* =====================================
   GENERATE SHOPPING
===================================== */

function generateShopping(){

    let total = 0;

    const amount =

    2 +
    Math.floor(
    Math.random() *
    (4 + player.itemUpgrade)
    );

    for(
        let i=0;
        i<amount;
        i++
    ){

        const item =
        randomItem(items);

        currentShopping.push(item);

        total += item.price;

        const row =
        document.createElement(
        "div"
        );

        row.className =
        "shopping-item";

        row.innerHTML = `

        <span>
        ${item.name}
        </span>

        <span>
        Rp${item.price.toLocaleString()}
        </span>

        `;

        shoppingListEl.appendChild(
        row
        );

    }

    totalPriceEl.textContent =
    "Rp" +
    total.toLocaleString();
    
    generateMoney(total);

}

/* =====================================
   TIMER
===================================== */

function startTimer(){

    clearInterval(
    timerInterval
    );

    timerEl.textContent =
    timer;

    timerInterval =
    setInterval(()=>{

        timer--;

        timerEl.textContent =
        timer;

        if(timer <= 10){

            timerEl.classList.add(
            "timer-warning"
            );

        }

        if(timer <= 0){

            clearInterval(
            timerInterval
            );

            customerLeave();

        }

    },1000);

}

/* =====================================
   CUSTOMER LEAVE
===================================== */

function customerLeave(){

    alert(
    "Pelanggan kesal dan pergi!"
    );

    player.score -= 100;

    player.coins -= 50;

    if(player.coins < 0)
    player.coins = 0;

    updateUI();

    nextCustomer();

}

/* =====================================
   NEXT CUSTOMER
===================================== */

function nextCustomer(){

    customerNumber++;

    if(customerNumber > 12){

        endDay();

        return;

    }

    updateUI();

    generateCustomer();

}

/* =====================================
   END DAY
===================================== */

function endDay(){

    clearInterval(timerInterval);

    saveGame();

    document.getElementById(
        "dayPopup"
    ).classList.remove(
        "hidden"
    );

    document.getElementById(
        "dayScore"
    ).textContent =
    player.score;

    document.getElementById(
        "dayCoins"
    ).textContent =
    player.coins;

}

/* =====================================
   INITIAL UI
===================================== */

updateUI();
/* =====================================
   BAGIAN 4
   SISTEM UANG & PEMERIKSAAN 3D
===================================== */

/* =====================================
   DENOMINASI
===================================== */

const denominations = [
1000,
2000,
5000,
10000,
20000,
50000,
100000
];

/* =====================================
   CURRENT MONEY
===================================== */

let selectedMoney = null;

/* =====================================
   CLUE DILIHAT
===================================== */

const lookGood = [

"Warna terlihat tajam dan konsisten.",
"Nomor seri tampak jelas.",
"Cetakan terlihat rapi.",
"Gambar pahlawan tampak jelas.",
"Tidak terlihat kejanggalan visual.",
"Ornamen tampak lengkap.",
"Tinta terlihat normal.",
"Detail kecil terlihat tajam."

];

const lookBad = [

"Nomor seri tampak agak buram.",
"Warna sedikit kusam.",
"Ada kejanggalan kecil pada cetakan.",
"Sebagian detail terlihat kurang tajam.",
"Tinta tampak tidak merata.",
"Ada bagian yang terlihat aneh.",
"Ornamen tampak kurang jelas.",
"Cetakan terlihat sedikit bergeser."

];

/* =====================================
   CLUE DIRABA
===================================== */

const touchGood = [

"Tekstur khas uang terasa jelas.",
"Cetakan timbul terasa normal.",
"Ada bagian yang terasa kasar.",
"Permukaan terasa sesuai uang asli.",
"Tekstur terasa konsisten."

];

const touchBad = [

"Permukaan terasa terlalu halus.",
"Cetakan timbul hampir tidak terasa.",
"Kertas terasa terlalu licin.",
"Tekstur terasa berbeda dari biasanya.",
"Kertas terasa agak tipis."

];

/* =====================================
   CLUE DITERAWANG
===================================== */

const lightGood = [

"Watermark terlihat jelas.",
"Benang pengaman terlihat utuh.",
"Gambar saling isi menyatu sempurna.",
"Fitur keamanan terlihat lengkap.",
"Watermark tampak tajam."

];

const lightBad = [

"Watermark terlihat samar.",
"Watermark tidak terlihat jelas.",
"Benang pengaman sulit ditemukan.",
"Gambar saling isi tidak menyatu.",
"Watermark tampak tidak normal.",
"Benang pengaman tampak terputus.",
"Tidak ditemukan watermark."

];

/* =====================================
   GENERATE MONEY
===================================== */

function generateMoney(totalBelanja){

    currentPayment = [];

    let sisa = totalBelanja;

    while(sisa > 0){

        let nominal =
        randomItem(
            denominations
        );

        if(nominal <= sisa){

            currentPayment.push(
                createMoney(
                    nominal
                )
            );

            sisa -= nominal;
        }

    }

    if(Math.random() < 0.5){

        currentPayment.push(
            createMoney(
                randomItem(
                    denominations
                )
            )
        );

    }

    renderMoney();

}

/* =====================================
   CREATE MONEY
===================================== */

function createMoney(nominal){

    let fakeChance = 0.10;

    if(player.day > 3)
    fakeChance = 0.25;

    if(player.day > 7)
    fakeChance = 0.40;

    const isFake =
    Math.random() <
    fakeChance;

    return {

        nominal,

        fake:isFake,

        look:

        isFake
        ?
        randomItem(lookBad)
        :
        randomItem(lookGood),

        touch:

        isFake
        ?
        randomItem(touchBad)
        :
        randomItem(touchGood),

        light:

        isFake
        ?
        randomItem(lightBad)
        :
        randomItem(lightGood)

    };

}

/* =====================================
   RENDER MONEY
===================================== */

function renderMoney(){

    moneyContainer.innerHTML = "";

    currentPayment.forEach(
    (money,index)=>{

        const card =
        document.createElement(
        "div"
        );

        card.className =
        `money-card money-${money.nominal}`;

        card.innerHTML = `

        <div class="money-value">
        Rp${money.nominal.toLocaleString()}
        </div>

        <div class="money-label">
        Klik untuk periksa
        </div>

        `;

        card.addEventListener(
        "click",
        ()=>{

            selectMoney(
                index
            );

        }
        );

        moneyContainer.appendChild(
        card
        );

    });

}

/* =====================================
   SELECT MONEY
===================================== */

function selectMoney(index){

    selectedMoney =
    currentPayment[index];

    clueBox.textContent =

    `Memeriksa Rp${selectedMoney.nominal.toLocaleString()}`;

}

/* =====================================
   INSPECTION BUTTONS
===================================== */

const lookBtn =
document.getElementById(
"lookBtn"
);

const touchBtn =
document.getElementById(
"touchBtn"
);

const lightBtn =
document.getElementById(
"lightBtn"
);

const clueBox =
document.getElementById(
"clueBox"
);

lookBtn.addEventListener(
"click",
()=>{

    if(!selectedMoney){

        clueBox.textContent =
        "Pilih uang terlebih dahulu.";

        return;

    }

    clueBox.textContent =
    "👁 DILIHAT: " +
    selectedMoney.look;

}
);

touchBtn.addEventListener(
"click",
()=>{

    if(!selectedMoney){

        clueBox.textContent =
        "Pilih uang terlebih dahulu.";

        return;

    }

    clueBox.textContent =
    "✋ DIRABA: " +
    selectedMoney.touch;

}
);

lightBtn.addEventListener(
"click",
()=>{

    if(!selectedMoney){

        clueBox.textContent =
        "Pilih uang terlebih dahulu.";

        return;

    }

    clueBox.textContent =
    "💡 DITERAWANG: " +
    selectedMoney.light;

}
);

/* =====================================
   ACCEPT / REJECT
===================================== */

const acceptBtn =
document.getElementById(
"acceptBtn"
);

const rejectBtn =
document.getElementById(
"rejectBtn"
);

acceptBtn.addEventListener(
"click",
acceptMoney
);

rejectBtn.addEventListener(
"click",
rejectMoney
);

function acceptMoney(){

    const fakeExist =
    currentPayment.some(
    m=>m.fake
    );

    if(fakeExist){

        player.score -= 100;

        alert(
        "Uang palsu lolos!"
        );

    }else{

        player.score += 50;

        player.coins += 100;

        player.streak++;

        alert(
        "Semua uang asli."
        );

    }

    finishRound();

}

function rejectMoney(){

    const fakeExist =
    currentPayment.some(
    m=>m.fake
    );

    if(fakeExist){

        player.score += 100;

        player.coins += 200;

        player.fakeFound++;

        player.streak++;

        alert(
        "Berhasil menolak uang palsu!"
        );

    }else{

        player.score -= 50;

        alert(
        "Semua uang asli."
        );

    }

    finishRound();

}

/* =====================================
   FINISH ROUND
===================================== */

function finishRound(){

    clearInterval(
    timerInterval
    );

    if(
        player.streak > 0 &&
        player.streak % 5 === 0
    ){

        player.score += 200;

        player.coins += 500;

        alert(
        "Bonus streak +200 skor!"
        );

    }

    updateUI();

    saveGame();

    nextCustomer();

}
const nextDayBtn =
document.getElementById(
    "nextDayBtn"
);

nextDayBtn.addEventListener(
    "click",
    openShop
);
function openShop(){

    document.getElementById(
        "dayPopup"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "shopPopup"
    ).classList.remove(
        "hidden"
    );

    document.getElementById(
        "shopCoins"
    ).textContent =
    player.coins;

}
const closeShopBtn =
document.getElementById(
    "closeShop"
);

closeShopBtn.addEventListener(
    "click",
    startNextDay
);
function startNextDay(){

    document.getElementById(
        "shopPopup"
    ).classList.add(
        "hidden"
    );

    player.day++;

    customerNumber = 1;

    saveGame();

    updateUI();

    generateCustomer();

}
document
.getElementById(
"upgradePatience"
)
.addEventListener(
"click",
()=>{

let cost =
1000 *
(
player.patienceUpgrade + 1
);

if(
player.coins < cost
){

alert(
"Koin tidak cukup."
);

return;

}

player.coins -= cost;

player.patienceUpgrade++;

saveGame();

document.getElementById(
"shopCoins"
).textContent =
player.coins;

alert(
"Kesabaran pelanggan bertambah 4 detik."
);

});

document
.getElementById(
"upgradeItems"
)
.addEventListener(
"click",
()=>{

let cost =
1500 *
(
player.itemUpgrade + 1
);

if(
player.coins < cost
){

alert(
"Koin tidak cukup."
);

return;

}

player.coins -= cost;

player.itemUpgrade++;

saveGame();

document.getElementById(
"shopCoins"
).textContent =
player.coins;

alert(
"Jumlah barang meningkat."
);

});
document
.getElementById(
"upgradeBonus"
)
.addEventListener(
"click",
()=>{

let cost =
2000 *
(
player.bonusUpgrade + 1
);

if(
player.coins < cost
){

alert(
"Koin tidak cukup."
);

return;

}

player.coins -= cost;

player.bonusUpgrade++;

saveGame();

document.getElementById(
"shopCoins"
).textContent =
player.coins;

alert(
"Bonus kasir meningkat."
);

});
document
.getElementById(
"saveAndExit"
)
.addEventListener(
"click",
()=>{

saveGame();

location.reload();

});width:300px;
}

.profile-box input{
padding:12px;
border:2px solid #ddd;
border-radius:10px;
font-size:1rem;
}

.profile-box button{
background:#d32f2f;
color:white;
padding:12px;
border-radius:10px;
font-weight:bold;
}

/* ========================= */
/* GAME SCREEN */
/* ========================= */

#gameScreen{
padding:15px;
max-width:1200px;
margin:auto;
}

/* ========================= */
/* TOP BAR */
/* ========================= */

.topbar{
display:grid;
grid-template-columns:repeat(4,1fr);
gap:10px;
margin-bottom:15px;
}

.topbar div{
background:white;
padding:12px;
border-radius:12px;
font-weight:bold;
text-align:center;
box-shadow:0 2px 8px rgba(0,0,0,.1);
}

/* ========================= */
/* TIMER */
/* ========================= */

#timerBox{
background:linear-gradient(
135deg,
#ffebee,
#ffcdd2
);
padding:15px;
border-radius:15px;
margin-bottom:15px;
text-align:center;
border:3px solid #e53935;
}

#timer{
font-size:2rem;
font-weight:bold;
color:#d50000;
}

#patienceLabel{
margin-top:8px;
font-weight:bold;
}

/* timer warning */

.timer-warning{
animation:blink 1s infinite;
}

@keyframes blink{

0%{
opacity:1;
}

50%{
opacity:.4;
}

100%{
opacity:1;
}

}

/* ========================= */
/* CUSTOMER */
/* ========================= */

.customer-section{
background:white;
padding:20px;
border-radius:15px;
margin-bottom:15px;
box-shadow:0 2px 10px rgba(0,0,0,.08);
}

#customerName{
color:#b71c1c;
margin-bottom:10px;
}

#customerDialog{
font-size:1rem;
line-height:1.5;
}

/* ========================= */
/* SHOPPING LIST */
/* ========================= */

.shopping-section{
background:white;
padding:20px;
border-radius:15px;
margin-bottom:15px;
box-shadow:0 2px 10px rgba(0,0,0,.08);
}

#shoppingList{
display:flex;
flex-direction:column;
gap:8px;
margin-top:10px;
margin-bottom:10px;
}

.shopping-item{
display:flex;
justify-content:space-between;
background:#fafafa;
padding:10px;
border-radius:8px;
}

/* ========================= */
/* TOTAL */
/* ========================= */

#totalPrice{
color:#d32f2f;
font-size:1.3rem;
font-weight:bold;
}

/* ========================= */
/* MONEY AREA */
/* ========================= */

.payment-section{
background:white;
padding:20px;
border-radius:15px;
margin-bottom:15px;
box-shadow:0 2px 10px rgba(0,0,0,.08);
}

#moneyContainer{
display:flex;
flex-wrap:wrap;
gap:12px;
margin-top:15px;
}

/* ========================= */
/* MONEY CARD */
/* ========================= */

.money-card{
width:160px;
height:90px;
border-radius:12px;
padding:10px;
color:white;
display:flex;
flex-direction:column;
justify-content:space-between;
cursor:pointer;
transition:.2s;
position:relative;
overflow:hidden;
}

.money-card:hover{
transform:translateY(-4px);
}

.money-card::after{
content:"";
position:absolute;
top:0;
left:-60%;
width:40%;
height:100%;
background:rgba(255,255,255,.25);
transform:skewX(-20deg);
}

.money-card:hover::after{
left:130%;
transition:.7s;
}

.money-1000{
background:#616161;
}

.money-2000{
background:#8e24aa;
}

.money-5000{
background:#8d6e63;
}

.money-10000{
background:#7cb342;
}

.money-20000{
background:#2e7d32;
}

.money-50000{
background:#1565c0;
}

.money-100000{
background:#d32f2f;
}

.money-value{
font-size:1.2rem;
font-weight:bold;
}

.money-label{
font-size:.8rem;
opacity:.9;
}

/* ========================= */
/* INSPECTION */
/* ========================= */

.inspection-panel{
display:flex;
gap:10px;
flex-wrap:wrap;
margin-bottom:15px;
}

.inspection-panel button{
flex:1;
min-width:120px;
padding:14px;
font-size:1rem;
font-weight:bold;
border-radius:12px;
color:white;
}

#lookBtn{
background:#1565c0;
}

#touchBtn{
background:#ef6c00;
}

#lightBtn{
background:#8e24aa;
}

/* ========================= */
/* CLUE BOX */
/* ========================= */

#clueBox{
background:#fff8e1;
border-left:6px solid #ffb300;
padding:15px;
border-radius:12px;
margin-bottom:15px;
min-height:90px;
line-height:1.5;
}

/* ========================= */
/* ACCEPT / REJECT */
/* ========================= */

.action-panel{
display:flex;
gap:10px;
margin-bottom:20px;
}

.action-panel button{
flex:1;
padding:16px;
font-size:1rem;
font-weight:bold;
border-radius:12px;
color:white;
}

#acceptBtn{
background:#2e7d32;
}

#rejectBtn{
background:#c62828;
}

/* ========================= */
/* POPUPS */
/* ========================= */

.popup{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,.6);
display:flex;
justify-content:center;
align-items:center;
padding:15px;
z-index:999;
}

.popup-content{
background:white;
width:100%;
max-width:500px;
border-radius:15px;
padding:25px;
text-align:center;
animation:popupShow .25s ease;
}

@keyframes popupShow{

from{
transform:scale(.85);
opacity:0;
}

to{
transform:scale(1);
opacity:1;
}

}

.popup-content button{
margin-top:10px;
width:100%;
padding:12px;
border-radius:10px;
background:#d32f2f;
color:white;
font-weight:bold;
}

/* ========================= */
/* LEADERBOARD */
/* ========================= */

#leaderboardList{
max-height:300px;
overflow:auto;
margin-top:15px;
}

.leaderboard-item{
display:flex;
justify-content:space-between;
padding:10px;
margin-bottom:8px;
background:#f5f5f5;
border-radius:8px;
}

/* ========================= */
/* MONEY MODAL */
/* ========================= */

#moneyInfo{
margin-top:15px;
line-height:1.7;
text-align:left;
}

/* ========================= */
/* SHOP */
/* ========================= */

#shopPopup button{
margin-top:10px;
}

#shopCoins{
font-weight:bold;
color:#d32f2f;
font-size:1.2rem;
}

/* ========================= */
/* DAY COMPLETE */
/* ========================= */

#dayPopup p{
margin-top:10px;
}

/* ========================= */
/* CUSTOMER MOOD */
/* ========================= */

.customer-calm{
border-left:6px solid #43a047;
}

.customer-normal{
border-left:6px solid #fbc02d;
}

.customer-angry{
border-left:6px solid #e53935;
}

/* ========================= */
/* STREAK EFFECT */
/* ========================= */

.streak-glow{
animation:glow 1.2s infinite;
}

@keyframes glow{

0%{
box-shadow:0 0 5px gold;
}

50%{
box-shadow:0 0 25px gold;
}

100%{
box-shadow:0 0 5px gold;
}

}

/* ========================= */
/* RESPONSIVE TABLET */
/* ========================= */

@media(max-width:900px){

.topbar{
grid-template-columns:repeat(2,1fr);
}

.money-card{
width:140px;
}

}

/* ========================= */
/* RESPONSIVE HP */
/* ========================= */

@media(max-width:600px){

.topbar{
grid-template-columns:1fr;
}

.money-card{
width:100%;
height:80px;
}

.inspection-panel{
flex-direction:column;
}

.action-panel{
flex-direction:column;
}

#timer{
font-size:1.7rem;
}

.popup-content{
padding:20px;
}

}

/* ========================= */
/* SCROLLBAR */
/* ========================= */

::-webkit-scrollbar{
width:8px;
}

::-webkit-scrollbar-thumb{
background:#c62828;
border-radius:20px;
}

::-webkit-scrollbar-track{
background:#f0f0f0;
   }
