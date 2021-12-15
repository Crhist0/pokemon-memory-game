// instanciar o axios para pegar a api do pokemon, de onde retiramos a sprite e o id
const api = axios.create({
    baseURL: "https://pokeapi.co/api/v2",
});

// instanciar a database
const db = axios.create({
    baseURL: "https://pokemon-memory-game-ranking.herokuapp.com",
});

// função para fazer as chamadas da api do pokemon, popular o playArea, e randomizar as cartas
function getPokemonSprite(id) {
    api.get(`/pokemon/${id}`)
        .then((result) => {
            let sprite = result.data.sprites.front_default;
            let id = result.data.id;
            let difficulty = document.getElementById("title").data;

            //  adicionado definição conjunta de tamanho das imagens, conforme dificuldade
            if (difficulty == "12") {
                size = "200px";
            } else if (difficulty == "28") {
                size = "150px";
            } else if (difficulty == "60") {
                size = "125px";
            } else {
                size = "100px";
            }

            document.getElementById("playArea").innerHTML += createCardBox(sprite, id, size); // popula o playArea com as cardBox

            const cards = document.querySelectorAll(".cardBox");
            cards.forEach((card) => {
                card.addEventListener("click", flipCard);
                if (difficulty == "12") {
                    card.classList.add("cardBoxEasy");
                } else if (difficulty == "28") {
                    card.classList.add("cardBoxNormal");
                } else if (difficulty == "60") {
                    card.classList.add("cardBoxHard");
                } else {
                    card.classList.add("cardBoxBrasil");
                }
            }); // define um eventListener ao clicar na carta, para ativar a função  "flipCard", que guarda a carta escolhida e ativa a checagem das cartas + adicionado modificação de tamanho conforme dificuldade selecionada

            // o forEach abaixo é uma randomização da ordem das cartas criadas
            cards.forEach((card) => {
                let ramdomPos = Math.floor(Math.random() * difficulty);
                card.style.order = ramdomPos;
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

// função que cria as cartas, colocando a sprite do pokemon como img e o id como data da div mãe. O id usamos para randomizar a posição das cartas
function createCardBox(sprite, id, size) {
    return `
    <div id="test" class="cardBox m-2 d-flex justify-content-center align-items-center" data-pkmn="${id}">
    <img style="height: ${size}" src="${sprite}" class="front-face">
    <img style="height: ${size}" src="images/pokeball.png" class="back-face">
    </div>
    `;
}

// função que define a quantidade de cartas do jogo
function difficulty() {
    let easy = document.getElementById("btnradio1").checked;
    let normal = document.getElementById("btnradio2").checked;
    let hard = document.getElementById("btnradio3").checked;
    let brasil = document.getElementById("btnradio4").checked;

    if (easy) {
        document.getElementById("title").data = "12";
        return 6; // expect 12
    } else if (normal) {
        document.getElementById("title").data = "28";
        return 14; // expect 28
    } else if (hard) {
        document.getElementById("title").data = "60";
        return 30; // expect 60;
    } else if (brasil) {
        document.getElementById("title").data = "104";
        return 52; // expect 104;
    }
}

// função que cria um botão de retornar
function createBackButton() {
    return `<button type="button" class="btn btn-outline-dark" onclick="backToStart()">Back</button>`;
}

// função ativada ao clicar no botão de retornar, reseta ao estado inicial
function backToStart() {
    document.getElementById("title").innerHTML = "";
    document.getElementById("playArea").innerHTML = "";
    document.getElementById("settings").style.display = "none";
    document.getElementById("buttons").style.display = "flex";
    document.getElementById("title").style.display = "none";
    document.getElementById("counterText").style.display = "none";
    document.getElementById("counterText").innerHTML = `Contador: <span id="counter" class="h4 ms-2"data-count="0"></span>`;
    document.getElementById("timerText").style.display = "none";
    document.getElementById("timerText").innerHTML = `Contador: <span id="counter" class="h4 ms-2"data-count="0"></span>`;
    document.getElementById("counter").style.display = "none";
    document.getElementById("counter").dataset.count = "0";
    document.getElementById("counter").innerText = document.getElementById("counter").dataset.count;
    document.getElementById("pageTitle").classList.toggle("mt-5");
    document.getElementById("leaderboardContainer").style.display = "none";
    document.getElementById("leaderboardEasy").style.display = "none";
    document.getElementById("leaderboardNormal").style.display = "none";
    document.getElementById("leaderboardHard").style.display = "none";
    document.getElementById("leaderboardBrasil").style.display = "none";
    document.getElementById("leaderboardEasy").innerText = "";
    document.getElementById("leaderboardNormal").innerText = "";
    document.getElementById("leaderboardHard").innerText = "";
    document.getElementById("leaderboardBrasil").innerText = "";
    document.getElementById("titleText").style.fontSize = "4rem";
    stopTimer();

    progress = 0;
    hasFlippedCard = false;
}

function goToSettings() {
    document.getElementById("settings").style.display = "flex";
    document.getElementById("buttons").style.display = "none";
    document.getElementById("title").innerHTML = createBackButton(); // cria o botão de retorno
    document.getElementById("title").style.display = "block";
    document.getElementById("pageTitle").classList.toggle("mt-5");
    document.getElementById("counterText").style.display = "block";
    document.getElementById("timerText").style.display = "block";
    document.getElementById("counterText").innerHTML = "<img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png'>";
    document.getElementById("counterText").style.height = "140px";
}

// função timer
let minutes = 0;
let seconds = 0;
let second = 1000;
let cron;
function startTimer() {
    cron = setInterval(() => {
        timer();
    }, second);
}

function stopTimer() {
    clearInterval(cron);
    minutes = 0;
    seconds = 0;
}

function pauseTimer() {
    clearInterval(cron);
}

function timer() {
    if (seconds < 59) {
        seconds++;
        if (seconds.toString().length < 2) {
            document.getElementById("timerSeconds").innerText = `0${seconds}`;
        } else {
            document.getElementById("timerSeconds").innerText = seconds;
        }
        return;
    } else {
        minutes++;
        seconds = 0;
        if (minutes.toString().length < 2) {
            document.getElementById("timerSeconds").innerText = `00`;
            document.getElementById("timerMinutes").innerText = `0${minutes}`;
        } else {
            document.getElementById("timerSeconds").innerText = `00`;
            document.getElementById("timerMinutes").innerText = minutes;
        }
        return;
    }
}

// função que cria os pares de cartas
function populatePlayArea() {
    document.getElementById("playArea").innerHTML = ""; // reseta a playarea porque sim
    document.getElementById("settings").style.display = "none"; // esconde as settings
    document.getElementById("buttons").style.display = "none";
    document.getElementById("pageTitle").classList.toggle("mt-5");
    document.getElementById("title").innerHTML = createBackButton(); // cria o botão de retorno
    document.getElementById("counterText").style.display = "inherit";
    document.getElementById("counterText").style.height = "auto";
    document.getElementById("counterText").innerHTML = `Contador: <span id="counter" class="h4 ms-1"data-count="0">  </span>`;
    document.getElementById("timerText").style.display = "inherit";
    document.getElementById("timerText").style.height = "auto";
    document.getElementById("timerText").innerHTML = `Timer: <span id="timerMinutes" class="h4 ms-1">00</span>:<span id="timerSeconds" class="h4">00</span>`;
    document.getElementById("counter").style.display = "inline";
    document.getElementById("title").style.display = "block";
    document.getElementById("titleText").style.fontSize = "2.5rem";
    let x = difficulty(); // define a quantidade de cartas
    goal = x;
    // o for abaixo cria os pares de cartas
    let pkmnsSorteados = [];

    let index = 0;
    while (index < x) {
        let indexOfPkmn = getRandomInt(1, 898);
        if (pkmnsSorteados.includes(indexOfPkmn)) continue; // + garantia de que o mesmo número não será sorteado duas vezes
        pkmnsSorteados.push(indexOfPkmn);
        getPokemonSprite(indexOfPkmn);
        getPokemonSprite(indexOfPkmn);
        index++;
    }
    console.log(pkmnsSorteados);
    startTimer();
}

// função que ativa o efeito "flip", guarda a carta escolhida e ativa a checagem das cartas
function flipCard() {
    if (lockBoard) return; // se já tiver as duas cartas abertas, trava as outras cartas

    this.classList.add("flip"); // faz o efeito de "flip"

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this; // se não tem carta virada, a que foi clicada se torna a primeira virada
        return;
    }

    if (this === firstCard) return; // a segunda carta virada não pode ser igual a primeira

    secondCard = this; // guarda a segunda carta virada
    hasFlippedCard = false;

    document.getElementById("counter").dataset.count++;
    document.getElementById("counter").innerText = document.getElementById("counter").dataset.count;

    checkForMatch(); // checa as duas cartas
}

// função que checa as duas cartas escolhidas
function checkForMatch() {
    firstCard.dataset.pkmn === secondCard.dataset.pkmn ? disableCards() : unflipCards();
}

// função que desabilita o eventListener(click) das cartas, para ativar quando as cartas escolhidas são um match
function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    progress++;
    if (progress == goal) {
        pauseTimer();
        Swal.fire({
            title: "Parabéns!",
            // text: `Você completou em ${document.getElementById("counter").dataset.count} jogadas.`,
            html: `Você completou em ${document.getElementById("counter").dataset.count} jogadas e levou ${minutes} minutos e ${seconds} segundos.
            <br>
            <br>
            Para salvar sua pontuação no ranking, informe um apelido:
            <br>
            <div class="input-group input-group-lg">
                <input id="nick" type="text" maxlength="10" class="form-control text-center">
            </div>
            `,
            imageUrl: "https://c.tenor.com/zenjhCdEDtkAAAAC/pokemon-happy.gif",
            imageWidth: 400,
            imageHeight: 250,
            imageAlt: "Parabéns!",
            confirmButtonText: "enviar",
            inputValidator: (value) => {
                if (!value) {
                    return "Digite suas iniciais";
                }
            },
            showClass: {
                popup: "animate__animated animate__zoomInDown",
            },
            hideClass: {
                popup: "animate__animated animate__zoomOutUp",
            },
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                let name = document.getElementById("nick").value;
                let count = document.getElementById("counter").dataset.count;
                let now = new Date();
                let date = `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`;
                let time = minutes * 60 + seconds;

                // gameDifficulty
                // easy 6
                // normal 14
                // hard 30
                // very hard 52

                let player = {
                    name,
                    count,
                    time,
                    date,
                    difficulty: goal,
                };

                db.post("/", player)
                    .then((result) => {
                        console.log(result.data.message);
                    })
                    .catch((err) => console.log({ err }));

                backToStart();
            }
        });
    }
}

// função que desvira as cartas escolhidas, para ativar quando as cartas NÃO são um match
function unflipCards() {
    lockBoard = true; // trava o playArea para não ser possível clicar em nenhuma carta enquanto não desvirar as escolhidas anteriormente
    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        lockBoard = false; // destrava o playArea
    }, 1000);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// função para mostrar o leaderboard
function showLeaderboard(x) {
    document.getElementById("leaderboardContainer").style.display = "flex";
    document.getElementById("leaderboardEasy").style.display = "block";
    document.getElementById("leaderboardNormal").style.display = "block";
    document.getElementById("leaderboardHard").style.display = "block";
    document.getElementById("leaderboardBrasil").style.display = "block";
    document.getElementById("settings").style.display = "none";
    document.getElementById("buttons").style.display = "none";
    document.getElementById("title").innerHTML = createBackButton(); // cria o botão de retorno
    document.getElementById("title").style.display = "block";
    document.getElementById("pageTitle").classList.toggle("mt-5");
    document.getElementById("counterText").style.display = "block";
    document.getElementById("counterText").innerHTML = "<img src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png'>";
    document.getElementById("counterText").style.height = "140px";

    printTopLeaderboard();
    if (x == 1) {
        db.get("/listByTime").then((result) => list(result));
    } else {
        db.get("/listByPlays").then((result) => list(result));
    }
}

function printTopLeaderboard() {
    document.getElementById("leaderboardEasy").innerHTML = `<p class="textFuzz">Easy</p><p>Rank - Apelido - Data - Jogadas - Tempo</p>`;
    document.getElementById("leaderboardNormal").innerHTML = `<p class="textFuzz">Normal</p><p>Rank - Apelido - Data - Jogadas - Tempo</p>`;
    document.getElementById("leaderboardHard").innerHTML = `<p class="textFuzz">Hard</p><p>Rank - Apelido - Data - Jogadas - Tempo</p>`;
    document.getElementById("leaderboardBrasil").innerHTML = `<p class="textFuzz">Very hard</p><p>Rank - Apelido - Data - Jogadas - Tempo</p>`;
}

function list(result) {
    let databaseEasy = [];
    let databaseNormal = [];
    let databaseHard = [];
    let databaseBrasil = [];

    for (const player of result.data.data) {
        if (player.difficulty == 6) {
            databaseEasy.push(player);
        } else if (player.difficulty == 14) {
            databaseNormal.push(player);
        } else if (player.difficulty == 30) {
            databaseHard.push(player);
        } else {
            databaseBrasil.push(player);
        }
    }

    for (let index = 0; index < databaseEasy.length; index++) {
        const playerEasy = databaseEasy[index];
        document.getElementById("leaderboardEasy").innerHTML += `
        <div class="d-flex align-items-center justify-content-evenly">
            <p>${index + 1} -</p>
            <p>${playerEasy.name} -</p>
            <p>${playerEasy.date} -</p>
            <p>${playerEasy.count} -</p>
            <p>${showTime(playerEasy.time)}</p>
        </div>
            `;
        if (index == 14) break;
    }

    for (let index = 0; index < databaseNormal.length; index++) {
        const playerNormal = databaseNormal[index];
        document.getElementById("leaderboardNormal").innerHTML += `
        <div class="d-flex align-items-center justify-content-evenly">
            <p>${index + 1} -</p>
            <p>${playerNormal.name} -</p>
            <p>${playerNormal.date} -</p>
            <p>${playerNormal.count} -</p>
            <p>${showTime(playerNormal.time)}</p>
        </div>
            `;
        if (index == 14) break;
    }

    for (let index = 0; index < databaseHard.length; index++) {
        const playerHard = databaseHard[index];
        document.getElementById("leaderboardHard").innerHTML += `
        <div class="d-flex align-items-center justify-content-evenly">
            <p>${index + 1} -</p>
            <p>${playerHard.name} -</p>
            <p>${playerHard.date} -</p>
            <p>${playerHard.count} -</p>
            <p>${showTime(playerHard.time)}</p>
        </div>
            `;
        if (index == 14) break;
    }

    for (let index = 0; index < databaseBrasil.length; index++) {
        const playerBrasil = databaseBrasil[index];
        document.getElementById("leaderboardBrasil").innerHTML += `
        <div class="d-flex align-items-center justify-content-evenly">
            <p>${index + 1} -</p>
            <p>${playerBrasil.name} -</p>
            <p>${playerBrasil.date} -</p>
            <p>${playerBrasil.count} -</p>
            <p>${showTime(playerBrasil.time)}</p>
        </div>
        `;
        if (index == 14) break;
    }
}

function showTime(timeInSeconds) {
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor(timeInSeconds / 60) - hours * 3600;
    let seconds = timeInSeconds - hours * 3600 - minutes * 60;
    if (hours >= 1) {
        return `${hours}:${minutes}:${seconds}s`;
    } else if (minutes >= 1) {
        return `${minutes}:${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let progress = 0;
let goal = 1;
