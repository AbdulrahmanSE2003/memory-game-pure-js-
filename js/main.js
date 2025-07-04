// Variables:
let difficulty;
const emojiList = [
    "🍎",
    "🍩",
    "🍇",
    "🍉",
    "🍒",
    "🍍",
    "🥝",
    "🥭",
    "🍦",
    "🍔",
    "🍕",
    "🍟",
    "🍗",
    "🍮",
    "🍚",
];

// Handling Intro section
const introBtns = document.querySelectorAll(".game-start .btns button");
const startBtn = document.querySelector(".game-start .submit");

introBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        startBtn.classList.remove("d-none");
        difficulty = +btn.value;
    });
});
// Starting Game
startBtn.addEventListener("click", () => {
    document.querySelector(".game-start").classList.add("d-none");
    document.querySelector(".game .row").classList.toggle("d-none");
    LoadGame(difficulty);
});

// !INFO: Memory game V2
function LoadGame(diff) {
    let emojisCopy = [...emojiList];
    let selected = [];

    // Make the pics dynamic

    if (diff === 6) {
        document
            .querySelector(".game .row")
            .classList.replace("row-cols-sm-5", "row-cols-sm-3");
        document
            .querySelector(".game .row")
            .classList.replace("row-cols-4", "row-cols-3");
    } else if (diff === 20) {
        // document
        //     .querySelector(".game .row")
        //     .classList.replace("row-cols-sm-5", "row-cols-sm-4");
    }

    const parentDiv = document.querySelector(".row");

    for (let i = 0; i < diff / 2; i++) {
        let itemIdx = Math.floor(Math.random() * emojisCopy.length);
        let emoji = emojisCopy[itemIdx];
        emojisCopy.splice(itemIdx, 1);

        selected.push(emoji);
    }

    let finalList = [...selected, ...selected];

    finalList.sort(() => Math.random() - 0.5);

    finalList.forEach((em) => {
        parentDiv.innerHTML += `
        <div class="col">
                    <div
                        class="card text-center p-3 px-0 d-flex justify-content-center align-items-center"
                        data-face="rear"
                        data-id="${em}"
                        data-matched="false"
                    >
                        <span class="rear">❓</span>
                        <span class="d-none front" data-face="front">${em}</span>
                    </div>
                </div>
    `;
    });

    // Select all card elements from the DOM
    const cards = document.querySelectorAll(".card");

    // Game state variables
    let locked = false; // Prevents clicking multiple cards during a check
    let elements = []; // Stores the data-id of selected cards
    let picsFlipped = 0; // (Optional) Can be used to track flipped cards count
    let solved = 0; // for checking if all matched

    // Initial setup: if a card is already matched, keep it flipped
    cards.forEach((card) => {
        if (card.dataset.matched === "true") {
            card.classList.add("flipped");
            toggleImg(card);
        }
    });

    // Add click event to each card
    cards.forEach((card) => {
        card.addEventListener("click", (e) => {
            if (locked) return; // Ignore clicks if locked

            toggleImg(e.currentTarget); // Flip the selected card
            elements.push(e.currentTarget.dataset.id); // Store its ID

            // If two cards are selected, check for a match
            if (elements.length === 2) {
                check();
                elements = []; // Reset for the next pair
            }

            // Lock clicks for a short delay
            locked = true;
            setTimeout(() => {
                locked = false;
            }, 800);
        });
    });

    // Flip card visuals and toggle front/back display
    function toggleImg(card) {
        // Don't flip already matched cards
        if (card.dataset.matched == "true") return;

        card.classList.add("flipped");

        // Toggle the face value between front and rear
        card.dataset.face == "rear"
            ? (card.dataset.face = "front")
            : (card.dataset.face = "rear");

        // Toggle visibility of children (question mark vs emoji)
        setTimeout(() => {
            card.children[0].classList?.toggle("d-none"); // rear
            card.children[1].classList?.toggle("d-none"); // front
            card.classList.remove("flipped");
        }, 250);
    }

    // Check if selected pair matches
    function check() {
        let isMatched = elements[0] === elements[1];

        if (isMatched) {
            solved += 2;

            cards.forEach((card) => {
                if (card.dataset.id === elements[0]) {
                    card.dataset.matched = "true";
                    setTimeout(() => {
                        card.classList.add("matched");
                    }, 500);
                }
            });

            // ✅ Check win after updating solved
            if (solved === cards.length) {
                showFirework();
                endGameCelebration();
            }
        } else {
            cards.forEach((card) => {
                if (
                    card.dataset.id == elements[0] ||
                    card.dataset.id == elements[1]
                ) {
                    if (card.dataset.face == "front") {
                        setTimeout(() => {
                            card.classList.add("wrong");
                        }, 400);
                        setTimeout(() => {
                            card.classList.remove("wrong");
                            toggleImg(card);
                        }, 1200);
                    }
                }
            });
        }
    }

    // function for celebration
    function showFirework() {
        const firework = document.querySelector(".firework-container");
        firework.classList.remove("d-none");
    }

    function endGameCelebration() {
        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.6 },
            zIndex: 9999,
        });

        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 130,
                origin: { y: 0.7 },
                zIndex: 9999,
            });
        }, 200);

        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 140,
                origin: { y: 0.8 },
                zIndex: 9999,
            });
        }, 400);

        confetti({
            particleCount: 100,
            spread: 60,
            angle: 60,
            origin: { x: 0, y: 1 },
            zIndex: 9999,
        });

        confetti({
            particleCount: 100,
            spread: 60,
            angle: 120,
            origin: { x: 1, y: 1 },
            zIndex: 9999,
        });
    }
}
