const canvas = document.querySelector("#vaszon");
const rajz = canvas.getContext("2d");

const szelesseg = canvas.width;
const magassag = canvas.height;

const g = 9.82;
const frissitesiIdo = 1000 / 60;
let allapot;
let x, y, vx, vy;

let urhajoY;
const urhajoSugar = 10; // az űrhajót megtestesítő kör sugara
const aszteroidaSebesseg = 4; // az aszteriodák sebessége (px/lépés)

const ujAszteroidaIntervallum = 1000; // másodpercenként egy új aszteroida

let aszteroidak; // aszerodiákat tároló tömb
// egy aszteroidát egy {x, y} koordináta ír le és a sugara (r) ír le

let urhajoX; // az űrhajó x koordinátája

let idozito, idozito2;

// segédfüggvények
function veletlenEgesz(min, max) {
    const veletlen = Math.random();
    const tartomany = max - min + 1;
    return Math.trunc(veletlen * tartomany) + min;
}

function kirajzol() {
    // rajz.clearRect(0, 0, szelesseg, magassag); // a vászon törlése
    // rajz.beginPath();
    // rajz.fillStyle = "black";
    // rajz.arc(x, y, 5, 0, Math.PI * 2); // 5 px sugarú fekete kör (x;y)-ba
    // rajz.fill();
    // rajz.closePath();

    rajz.clearRect(0, 0, szelesseg, magassag); // a vászon törlése
    rajz.fillStyle = "gray";
    // végigmegyünk az aszterodiákon
    for (let aszteroida of aszteroidak) {
        // kirajzolunk egy aszeroidát
        rajz.beginPath();
        // `aszteroida.sugar` sugarú kör (x;y)-ba
        rajz.arc(aszteroida.x, aszteroida.y, aszteroida.sugar, 0, Math.PI * 2);
        rajz.fill();
        rajz.closePath();
    }
    // az űrhajó kirajzolása
    rajz.fillStyle = "red";
    rajz.beginPath();
    // `urhajoSugar` sugarú kör (x;y)-ba
    rajz.arc(urhajoX, urhajoY, urhajoSugar, 0, Math.PI * 2);
    rajz.fill();
    rajz.closePath();
}

function kovetkezoAllapot() {
    for (let aszterodia of aszteroidak) {
        aszterodia.y += aszteroidaSebesseg;
    }

    // minden lépésben ellenőrizni kell, hogy vége van-e a játéknak
    vegeEllenoriz();

    kirajzol();
}

function kezdoAllapot() {
    
    aszteroidak = [];
    urhajoX = szelesseg / 2;
    urhajoY = magassag / 8 * 7; // az űrhajó fix y koordinátája

    kirajzol();
}

function ujAszteroida() {
    aszteroidak.push({
        x: veletlenEgesz(0, szelesseg),
        y: -20, // a vásznon kívül jön létre, hogy ne megjelenjen, hanem beússzon,
        sugar: veletlenEgesz(10, 30)
    });
}

function gombLe(e) {
    e.preventDefault();
    if (e.key == "ArrowLeft") { // ha a bal gombot nyomtuk
        urhajoX -= 5;
    } else if (e.key == "ArrowRight") { // ha a jobb gombot nyomtuk
        urhajoX += 5;
    } else if (e.key == "ArrowDown") { // ha a bal gombot nyomtuk
        urhajoY += 5;
    } else if (e.key == "ArrowUp") { // ha a jobb gombot nyomtuk
        urhajoY -= 5;
    }
}

function utkozik(aszteroida) {
    // akkor ütközik, ha a két középpont távolsága kisebb, mint a sugarak összege
    const tavolsag = Math.sqrt(
        Math.pow(urhajoX - aszteroida.x, 2) +
        Math.pow(urhajoY - aszteroida.y, 2)
    );
    return tavolsag < (urhajoSugar + aszteroida.sugar);
}

function vegeEllenoriz() {
    // akkor van vége, ha létezik olyan aszteroida, amivel ütközünk
    let vege = aszteroidak.some(aszteroida => utkozik(aszteroida));
    if (vege) {
        clearInterval(idozito);
        clearInterval(idozito2);

        // a játék vége itt most annyit jelent, hogy kapunk egy felugró ablakot és utána azonnal újraindul
        alert("Vége a játéknak");
        kezdoAllapot();
    }
}

// hozzárendeljük a `gombLe` függvényt a billenytűlenyomáshoz
window.addEventListener("keydown", gombLe);

// valamilyen esemény (pl. egy gomb megnyomása) hatására indul el/újra a játék
button = document.querySelector("button");
button.addEventListener("click", start);

// itt startol el az alkalmazásom - 2024.04.09.
function start() {
    kezdoAllapot();
    idozito = setInterval(kovetkezoAllapot, frissitesiIdo);
    idozito2 = setInterval(ujAszteroida, ujAszteroidaIntervallum);
}
