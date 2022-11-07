import "./styles/index.css"
import birdsData from "./birds.js"
console.log(birdsData)

// ---------- Game start ----------

const playButton = document.querySelector('.play-button');
const gameLink = document.querySelector('.game-link');
const startPage = document.querySelector('.start-section');
const gamePage = document.querySelector('.game-section');

playButton.addEventListener('click', () => {
    setTimeout(() => {
        startPage.style.display = 'none';
        gamePage.style.display = 'flex';
    }, 500);  
});

gameLink.addEventListener('click', () => {
    setTimeout(() => {
        startPage.style.display = 'none';
        gamePage.style.display = 'flex';
    }, 500);  
});

// ---------- Levels ----------

const levelInputs = document.querySelectorAll('.level-input');
const levelLabels = document.querySelectorAll('.level-label');
const levelsForm = document.querySelector('.levels-form');
/*
function changeLevels() {
    for (let i = 0; i < levelInputs.length; i++) {
        levelLabels[i].style.backgroundColor = '#9dbd00';
        if (levelInputs[i].checked) {
            levelLabels[i].style.backgroundColor = '#b7d428';
        }
    }
}*/

if (levelInputs[0].checked) {
    levelLabels[0].style.backgroundColor = '#b7d428';
}
/*
levelsForm.addEventListener('input', () => {
    changeLevels();
});*/
/*
for (let i = 0; i < 6; i++) {
    levelLabels[i].addEventListener('mouseover', () => {
        levelLabels[i].style.backgroundColor = '#b7d428';
    });
    levelLabels[i].addEventListener('mouseout', () => {
        if (!levelInputs[i].checked) levelLabels[i].style.backgroundColor = '#9dbd00';
    });
}*/

// ---------- Question ----------

const questionImage = document.querySelector('.question-bird-image');
const questionName = document.querySelector('.question-bird-name');
const questionSong = document.querySelector('.question-song');
import unknownBird from './assets/unknown-bird.jpg';

let answer;
function getRandomSong(levelNum) {
    questionName.innerHTML = '???';
    questionImage.style.backgroundImage = `url('${unknownBird}')`;
    questionImage.style.border = '5px solid rgb(255, 250, 234, 0.5)';
    let randomNum = Math.floor(Math.random() * 6);
    questionSong.innerHTML = `<audio class="question-audio" controls src="${birdsData[levelNum][randomNum].audio}">`;
    answer = birdsData[levelNum].find(item => item.audio === birdsData[levelNum][randomNum].audio);
    return answer;
}

getRandomSong(0);

// ---------- Answers ----------

const answerInputs = document.querySelectorAll('.answer-input');
const answerLabels = document.querySelectorAll('.answer-label');
const answersForm = document.querySelector('.answers-form');
const birdImage = document.querySelector('.bird-image');
const birdName = document.querySelector('.bird-name');
const birdLatinName = document.querySelector('.bird-latin-name');
const birdDescription = document.querySelector('.bird-description');
const birdSong = document.querySelector('.bird-song');
const nextLevelButton = document.querySelector('.next-level-button');


for (let i = 0; i < answerInputs.length; i++) {
    answerLabels[i].addEventListener('mouseover', () => {
        answerLabels[i].style.backgroundColor = 'white';
        answerLabels[i].style.backgroundImage = 'none';      
    });
    answerLabels[i].addEventListener('mouseout', () => {
        answerLabels[i].style.backgroundColor = 'rgb(255,253,245)';
        answerLabels[i].style.backgroundImage = 'linear-gradient(145deg, rgba(255,253,245,1) 0%, rgba(255,247,233,1) 39%, rgba(255,242,230,1) 70%, rgba(255,239,236,1) 100%)';      
    });
}

function selectAnswers() {
    for (let i = 0; i < answerInputs.length; i++) {
        if (answerInputs[i].checked) {
            if (answerLabels[i].textContent === answer.name) {
                answerLabels[i].firstElementChild.style.backgroundColor = '#9dbd00';
                questionImage.style.backgroundImage = `url('${answer.image}')`;
                questionName.innerHTML = answer.name;
                nextLevelButton.classList.add('active');
                answersForm.removeEventListener('input', selectAnswers);
            } else {
                answerLabels[i].firstElementChild.style.backgroundColor = '#f60056';
            }
        }
    }
}

answersForm.addEventListener('input', selectAnswers);

function changeLevels() {
    for (let i = 0; i < levelInputs.length; i++) {
        if (levelInputs[i].checked) {
            levelLabels[i].style.backgroundColor = '#9dbd00';
            levelLabels[i+1].style.backgroundColor = '#b7d428';
            levelInputs[i+1].checked = 'true';
            break;
        }
    }
}

nextLevelButton.addEventListener('click', () => {
    if (nextLevelButton.classList.contains('active')) {
        nextLevelButton.classList.remove('active');
        changeLevels();
        for (let i = 0; i < levelInputs.length; i++) {
            if (levelInputs[i].checked) {
                getRandomSong(i);
                createAnswers();
                answersForm.addEventListener('input', selectAnswers);
            }
        }
        console.log(answer.name)
    }
})

// ---------- Birds description ----------

function createAnswers() {
    for (let i = 0; i < levelInputs.length; i++) {
        if (levelInputs[i].checked) {
            for (let j = 0; j < answerInputs.length; j++) {
                answerLabels[j].innerHTML = `<div class="dot"></div>${birdsData[i][j].name}`;
                birdImage.style.backgroundImage = 'none';
                birdImage.style.border = 'none';
                birdName.innerHTML = '';
                birdName.style.borderBottom = 'none';
                birdLatinName.innerHTML = '';
                birdLatinName.style.borderBottom = 'none';
                birdDescription.innerHTML = '';
                birdSong.innerHTML = '';

                answerLabels[j].addEventListener('click', () => {
                    let bird = birdsData[i].find(item => item.name === answerLabels[j].textContent);
                    birdImage.style.backgroundImage = `url('${bird.image}')`;
                    birdImage.style.border = '5px solid rgb(255, 250, 234, 0.5)';
                    birdName.innerHTML = bird.name;
                    birdName.style.borderBottom = '1px solid #d0d0d0';
                    birdLatinName.innerHTML = bird.species;
                    birdLatinName.style.borderBottom = '1px solid #d0d0d0';
                    birdDescription.innerHTML = bird.description;
                    birdSong.innerHTML = `<audio class="bird-audio" controls src="${bird.audio}">`;
                });
            }
        }
    }
}
createAnswers();
