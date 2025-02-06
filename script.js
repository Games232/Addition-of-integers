document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-button');
    const problemElement = document.getElementById('problem');
    const circlesContainer = document.getElementById('circles-container');
    const dropZone1 = document.getElementById('drop-zone-1');
    const dropZone2 = document.getElementById('drop-zone-2');
    const messageDiv = document.getElementById('message');
    const showResultButton = document.getElementById('show-result');
    const newProblemButton = document.getElementById('new-problem');
    const popSound = document.getElementById('pop-sound');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const timerSound = document.getElementById('timer-sound');
    const timeoutPopup = document.getElementById('timeout-popup');
    const closeTimeoutPopup = document.getElementById('close-timeout-popup');
    const restartPopupTimeout = document.getElementById('restart-popup-timeout');
    const restartPopupLose = document.getElementById('restart-popup-lose');
    const finalScorePopup = document.getElementById('final-score-popup');
    const loseSound = document.getElementById('lose-sound'); // إضافة صوت الخسارة
    const loseSound2 = document.getElementById('lose-sound2'); // إضافة صوت الخسارة
    const losePopUp = document.getElementById('lose-popup');
    const timeout = document.getElementById('timeout-sound');
    const howToPlayButton = document.getElementById('how-to-play-button');
    const howToPlaySound = document.getElementById('how-to-play-sound');

    let num1, num2;
    let selectedCircle = null;
    let score = 0;
    let timeLeft = 60;
    let timer;
    

    restartPopupLose.addEventListener('click', () => {
        losePopUp.style.display = 'none'; // إخفاء نافذة الخسارة
        gameScreen.style.display = 'block'; // إعادة إظهار شاشة اللعب
        startGame(); // إعادة بدء اللعبة من جديد
    });

    restartPopupTimeout.addEventListener('click', () => {
        timeoutPopup.style.display = 'none'; // إخفاء نافذة انتهاء الوقت
        gameScreen.style.display = 'block'; // إعادة إظهار شاشة اللعب
        startGame(); // إعادة بدء اللعبة من جديد
    });
    

    newProblemButton.addEventListener('click', () => {
        startGame();
    });
    
    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        startGame();
    });

    howToPlayButton.addEventListener('click', () => {
        timerSound.pause();
        timerSound.currentTime = 0;
        if (howToPlaySound.paused) {
            howToPlaySound.play();
        } else {
            howToPlaySound.pause();
            howToPlaySound.currentTime = 0;
            howToPlaySound.play();
        }
    });

    function startGame() {
        timeout.pause();
        score = 0;
        scoreElement.textContent = score;
        timerElement.textContent = `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;
        generateProblem();
        startTimer();
    }

    function startTimer() {
        timerSound.play()
        timerSound.volume = 0.1;
        timerSound.loop = true
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `00:${timeLeft < 10 ? '0' + timeLeft : timeLeft}`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        timeout.play()
        timerSound.pause();
        timerSound.currentTime = 0;
        gameScreen.style.display = 'none';
        finalScorePopup.textContent = score;
        timeoutPopup.style.display = 'flex';
    }

    function loseGame(message) {
        loseSound.play();
        loseSound2.play();
        timerSound.pause();
        timerSound.currentTime = 0;
        gameScreen.style.display = 'none';
        finalScorePopup.textContent = score;
        losePopUp.style.display = 'flex';
    }

    closeTimeoutPopup.addEventListener('click', () => {
        startGame();
    });


    function generateProblem() {
    let isNum1Positive = Math.random() < 0.5; // اختيار عشوائي لجعل num1 موجب أو سالب
    num1 = (Math.floor(Math.random() * 5) + 1) * (isNum1Positive ? 1 : -1); // عدد بين 1 و 5 أو -1 و -5
    num2 = (Math.floor(Math.random() * 5) + 1) * (isNum1Positive ? -1 : 1); // العدد الثاني يكون عكس الأول

    problemElement.textContent = `${num1} + ${num2} = ?`;
    createCircles();

    // تغيير كتابة الخانات بناءً على العدد الأول والثاني
    dropZone1.innerHTML = num1 > 0 ? 'العدد الموجب' : 'العدد السالب';
    dropZone2.innerHTML = num2 > 0 ? 'العدد الموجب' : 'العدد السالب';

    messageDiv.innerHTML = ' ';
    showResultButton.style.display = 'none';
    timeLeft = 60; // إعادة تعيين العداد بعد كل مسألة
    timerElement.textContent = timeLeft;
}


    // ... (بقية الكود كما هو)


    function createCircles() {
        circlesContainer.innerHTML = '';
        for (let i = 0; i < Math.abs(num1); i++) {
            const circle = document.createElement('div');
            circle.className = `circle ${num1 > 0 ? 'positive' : 'negative'}`;
            circle.textContent = num1 > 0 ? '+' : '-';
            circle.draggable = true;
            circle.addEventListener('dragstart', drag);
            circle.addEventListener('dragend', dragEnd);
            circlesContainer.appendChild(circle);
        }
        for (let i = 0; i < Math.abs(num2); i++) {
            const circle = document.createElement('div');
            circle.className = `circle ${num2 > 0 ? 'positive' : 'negative'}`;
            circle.textContent = num2 > 0 ? '+' : '-';
            circle.draggable = true;
            circle.addEventListener('dragstart', drag);
            circle.addEventListener('dragend', dragEnd);
            circlesContainer.appendChild(circle);
        }
    }

    function drag(event) {
        event.dataTransfer.setData('text', event.target.textContent);
        setTimeout(() => {
            event.target.style.visibility = 'hidden';
        }, 0);
    }

    function dragEnd(event) {
        event.target.style.visibility = 'visible';
        if (event.dataTransfer.dropEffect === 'none') {
            circlesContainer.appendChild(event.target);
        }
    }

    dropZone1.addEventListener('dragover', (event) => event.preventDefault());
    dropZone2.addEventListener('dragover', (event) => event.preventDefault());

    dropZone1.addEventListener('drop', (event) => drop(event, dropZone1));
    dropZone2.addEventListener('drop', (event) => drop(event, dropZone2));

    function drop(event, dropZone) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text');
        const circle = document.createElement('div');
        circle.className = `circle ${data === '+' ? 'positive' : 'negative'}`;
        circle.textContent = data;
        circle.addEventListener('click', () => selectCircle(circle));
        dropZone.appendChild(circle);

        const draggedCircle = Array.from(circlesContainer.children).find(
            (child) => child.textContent === data && child.style.visibility === 'hidden'
        );
        if (draggedCircle) {
            circlesContainer.removeChild(draggedCircle);
        }

        checkForLoss(); // التحقق من الخسارة بعد كل سحب

        if (dropZone1.children.length === Math.abs(num1) + 1 && dropZone2.children.length === Math.abs(num2) + 1) {
            messageDiv.innerHTML = 'انقر على دائرتين متشابهتين أو متعاكستين لإلغائهما.';
        }
    }

    function checkForLoss() {
        const dropZone1Circles = dropZone1.querySelectorAll('.circle');
        const dropZone2Circles = dropZone2.querySelectorAll('.circle');
    
        // تحقق من عدد الدوائر في كل منطقة
        if (dropZone1Circles.length > Math.abs(num1) || dropZone2Circles.length > Math.abs(num2)) {
            loseGame("لقد خسرت! لأنك وضعت دوائر أكثر من العدد المطلوب.");
            return;
        }
    
        // تحقق من وضع الدوائر في الأماكن الصحيحة
        const isZone1Correct = Array.from(dropZone1Circles).every(circle => {
            return (num1 > 0 && circle.classList.contains('positive')) || 
                   (num1 < 0 && circle.classList.contains('negative'));
        });
    
        const isZone2Correct = Array.from(dropZone2Circles).every(circle => {
            return (num2 > 0 && circle.classList.contains('positive')) || 
                   (num2 < 0 && circle.classList.contains('negative'));
        });
    
        if (!isZone1Correct || !isZone2Correct) {
            loseGame("لقد خسرت! لأنك وضعت الدوائر في الأماكن غير الصحيحة.");
        }
    }

    function selectCircle(circle) {
        if (!selectedCircle) {
            selectedCircle = circle;
            selectedCircle.style.border = '2px solid yellow';
        } else {
            const parent1 = selectedCircle.parentElement;
            const parent2 = circle.parentElement;

            if (parent1 !== parent2) {
                if ((selectedCircle.textContent === circle.textContent) || 
                    (selectedCircle.textContent === '+' && circle.textContent === '-') ||
                    (selectedCircle.textContent === '-' && circle.textContent === '+')) {
                    
                    applyEffect(selectedCircle, circle);
                    setTimeout(() => {
                        selectedCircle.remove();
                        circle.remove();
                        selectedCircle = null;
                        popSound.play();
                        score += 1;
                        scoreElement.textContent = score;
                        checkForRemainingPairs();
                    }, 500);
                } else {
                    selectedCircle.style.border = '';
                    selectedCircle = null;
                    messageDiv.innerHTML = 'اختر دائرتين متشابهتين أو متعاكستين من خانتين مختلفتين.';
                }
            } else {
                selectedCircle.style.border = '';
                selectedCircle = null;
                messageDiv.innerHTML = 'يجب اختيار دائرة من كل خانة!';
                setTimeout(() => {
                    messageDiv.innerHTML = 'اختر دائرتين متشابهتين أو متعاكستين من خانتين مختلفتين.';
                }, 1000);
            }
        }
    }

    function applyEffect(circle1, circle2) {
        circle1.style.transform = 'scale(1.5)';
        circle1.style.opacity = '0';
        circle2.style.transform = 'scale(1.5)';
        circle2.style.opacity = '0';
    }

    function checkForRemainingPairs() {
        setTimeout(() => {
            const dropZone1Circles = dropZone1.querySelectorAll('.circle').length;
            const dropZone2Circles = dropZone2.querySelectorAll('.circle').length;
    
            if (dropZone1Circles === 0 || dropZone2Circles === 0) {
                showRemainingCircles();
            }
        }, 500);
    }

    function showRemainingCircles() {
        const remainingPositive = document.querySelectorAll('#drop-zone-1 .positive, #drop-zone-2 .positive').length;
        const remainingNegative = document.querySelectorAll('#drop-zone-1 .negative, #drop-zone-2 .negative').length;
    
        if (remainingPositive === 0 && remainingNegative === 0) {
            messageDiv.innerHTML = 'النتيجة هي: 0';
            winGame();
        } else {
            const result = remainingPositive - remainingNegative;
            messageDiv.innerHTML = `النتيجة هي: ${result}`;
            winGame();
        }
    
        setTimeout(() => {
            generateProblem();
        }, 2000);
    }
    
    showResultButton.addEventListener('click', () => {
        const positiveCircles = document.querySelectorAll('#drop-zone-1 .positive, #drop-zone-2 .positive').length;
        const negativeCircles = document.querySelectorAll('#drop-zone-1 .negative, #drop-zone-2 .negative').length;
        const result = positiveCircles - negativeCircles;

        if (result > 0) {
            messageDiv.innerHTML = `النتيجة هي: +${result}`;
        } else if (result < 0) {
            messageDiv.innerHTML = `النتيجة هي: ${result}`;
        } else {
            messageDiv.innerHTML = 'النتيجة هي: 0';
        }
    });
});

function winGame() {
    const winSound = document.getElementById('win-sound');
    const winSound2 = document.getElementById('win-sound2');
    winSound.play();
    winSound2.play();

    const confettiContainer = document.getElementById('confetti');
    confettiContainer.classList.remove('hidden');

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');

        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        confettiContainer.appendChild(confetti);

        const fallDuration = Math.random() * 1 + 1;
        confetti.style.animationDuration = `${fallDuration}s`;

        setTimeout(() => {
            confetti.remove();
        }, fallDuration * 1000);
    }
}