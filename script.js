//https://opentdb.com/api.php?amount=10

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');

let correctAnswer = '', correctScore = 0, askedCount = 0, totalQuestion = 10;
let questions = [];

function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);

}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
})

// async function loadQuestion() {
//     if (questions.length === 0) {
//         const apiUrl = `https://opentdb.com/api.php?amount=${totalQuestion}`;
//         const result = await fetch(apiUrl);
//         const data = await result.json();
//         //console.log(data.results[0]);
//         if (!data.results) {
//             console.error("API failed");
//             return;
//         }
//         questions = data.results;
//     }

//     _result.innerHTML = '';
//     showQuestion(questions[askedCount]);
// }

async function loadQuestion() {
    if (questions.length === 0) {
        _result.innerHTML = "<p>Loading question...</p>";
        _checkBtn.disabled = true;
        try {
            const apiUrl = `https://opentdb.com/api.php?amount=${totalQuestion}`;
            const result = await fetch(apiUrl);
            if (!result.ok) throw new Error("API error");
            const data = await result.json();
            if (!data.results || data.results.length === 0) {
                throw new Error("No questions received");
            }
            questions = data.results;
        } catch (error) {
            _result.innerHTML = `<p>Failed to load questions. Try again.</p>`;
            console.error(error);
            return;
        }
    }
    _result.innerHTML = '';
    showQuestion(questions[askedCount]);
}

function showQuestion(data) {
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    console.log(correctAnswer);
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = [...data.incorrect_answers];
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    _options.innerHTML = optionsList.map((option, index) => `<li>${index + 1}. <span> ${option} </span> </li>`).join('');
    selectOptions();
}

function selectOptions() {
    _options.querySelectorAll('li').forEach(option => {
        option.addEventListener('click', () => {
            if (_options.querySelector('.selected')) {
                const activeOPtion = _options.querySelector('.selected');
                activeOPtion.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

function checkAnswer() {
    _checkBtn.disabled = true;
    if (_options.querySelector('.selected')) {
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if (selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
            correctScore++;
            _result.innerHTML = `<p><i class="fas fa-check"></i> Correct Answer!</p>`;
        }
        else {
            _result.innerHTML = `<p><i class="fas fa-times"></i> Incorrect Answer! </p> <p><small><b>Correct Answer: </b>${correctAnswer}</small></p>`;
        }
        checkCount();
    }
    else {
        _result.innerHTML = `<p><i class="fas fa-exclamation-triangle"></i> Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

function HTMLDecode(textString) {
    var doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount() {
    askedCount++;
    setCount();
    if (askedCount == totalQuestion) {
        _result.innerHTML = `<p>Your Score: ${correctScore} / ${totalQuestion}</p>`;
        _playAgainBtn.style.display = 'block';
        _checkBtn.style.display = 'none';
    }
    else {
        setTimeout(() => {
            loadQuestion();
        }, 1000);
    }
}

function setCount() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function restartQuiz() {
    correctScore = askedCount = 0;
    questions = [];
    _playAgainBtn.style.display = 'none';
    _checkBtn.style.display = 'block';
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}