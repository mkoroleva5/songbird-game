import "./styles/index.css"
import birdsData from "./birds.js"
console.log(birdsData)

// ---------- Game start ----------

const gameButton = document.querySelector('.play-button');
const homeLink = document.querySelector('.home-link');
const gameLink = document.querySelector('.game-link');
const galleryLink = document.querySelector('.gallery-link');
const startPage = document.querySelector('.start-section');
const gamePage = document.querySelector('.game-section');
const galleryPage = document.querySelector('.gallery-section');
const resultsPage = document.querySelector('.results-section');

homeLink.addEventListener('click', () => {
    startPage.style.display = 'flex';
    resultsPage.style.display = 'none';
    gamePage.style.display = 'none';
    galleryPage.style.display = 'none';
});

gameButton.addEventListener('click', () => {
    setTimeout(() => {
        startPage.style.display = 'none';
        galleryPage.style.display = 'none';
        resultsPage.style.display = 'none';
        gamePage.style.display = 'flex';
    }, 500);  
});

gameLink.addEventListener('click', () => {
    setTimeout(() => {
        startPage.style.display = 'none';
        resultsPage.style.display = 'none';
        galleryPage.style.display = 'none';
        gamePage.style.display = 'flex';
    }, 500);  
});

galleryLink.addEventListener('click', () => {
    startPage.style.display = 'none';
    resultsPage.style.display = 'none';
    gamePage.style.display = 'none';
    galleryPage.style.display = 'flex';
});


// ---------- Levels ----------

const levelInputs = document.querySelectorAll('.level-input');
const levelLabels = document.querySelectorAll('.level-label');

if (levelInputs[0].checked) {
    levelLabels[0].style.backgroundColor = '#b7d428';
}

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

// ----------Player----------

const audio = document.querySelector('.audio');
const playButton = document.querySelector('.play');
let isPlay = false;

function playTrack() {
    if (!isPlay) {
        audio.play();
        isPlay = true;
        playButton.classList.add('pause');
    } else if (isPlay) {
        audio.pause();
        isPlay = false;
        playButton.classList.remove('pause');
    }
}
playButton.addEventListener('click', playTrack);

audio.addEventListener('ended', () => {
    isPlay = false;
    playButton.classList.remove('pause');
});

const muteButton = document.querySelector('.mute-button');
const volume = document.querySelector('.volume');
const volumePercentage = document.querySelector('.volume-percentage');

muteButton.addEventListener('click', () => {
    muteButton.classList.toggle('muted');
    if (audio.muted === false) audio.muted = true;
    else audio.muted = false;
});

function setVolume() {
    localStorage.setItem('volume-bar', volumePercentage.style.width);
    localStorage.setItem('volume', audio.volume);
}

function getVolume() {
    if (localStorage.getItem('volume-bar')) volumePercentage.style.width = localStorage.getItem('volume-bar');
    if (localStorage.getItem('volume')) audio.volume = localStorage.getItem('volume');
}

window.addEventListener('beforeunload', setVolume);
window.addEventListener('load', getVolume);

async function changeVolume() {
    const res = await getVolume();
    volume.style.opacity = '1';
    volume.addEventListener('click', e => {
        const sliderWidth = window.getComputedStyle(volume).width;
        const newVolume = e.offsetX / parseInt(sliderWidth);
        audio.volume = newVolume;
        volumePercentage.style.width = newVolume * 100 + '%';
    }, false)
}
changeVolume();

const timeline = document.querySelector('.timeline');
const progressBar = document.querySelector('.progress-bar');
const currentTime = document.querySelector('.current');
const trackLength = document.querySelector('.length');

timeline.addEventListener('click', e => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
    audio.currentTime = timeToSeek;
}, false);

function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `0${minutes}:${String(seconds % 60).padStart(2, 0)}`;
        return `${String(hours).padStart(2, 0)}:0${minutes}:${String(
            seconds % 60
    ).padStart(2, 0)}`;
}

setInterval(() => {
    progressBar.style.width = audio.currentTime / audio.duration * 100 + '%';
    currentTime.textContent = getTimeCodeFromNum(audio.currentTime);
}, 100);

// ---------- Question ----------

const questionImage = document.querySelector('.question-bird-image');
const questionName = document.querySelector('.question-bird-name');
const questionSong = document.querySelector('.question-song');
import unknownBird from './assets/unknown-bird.jpg';
import { result } from "lodash";

let answer;
function getRandomSong(levelNum) {
    questionName.innerHTML = '???';
    questionImage.style.backgroundImage = `url('${unknownBird}')`;
    questionImage.style.border = '5px solid rgb(255, 250, 234, 0.5)';
    let randomNum = Math.floor(Math.random() * 6);
    questionSong.src = birdsData[levelNum][randomNum].audio;
    trackLength.textContent = birdsData[levelNum][randomNum].duration;
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
const birdAudio = document.querySelector('.bird-audio');
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

let counter = 6;
function selectAnswers() {
    counter--;
    for (let i = 0; i < answerInputs.length; i++) {
        if (answerInputs[i].checked) {
            if (answerLabels[i].textContent === answer.name) {
                answerLabels[i].firstElementChild.style.backgroundColor = '#9dbd00';
                questionImage.style.backgroundImage = `url('${answer.image}')`;
                questionName.innerHTML = answer.name;
                score.innerHTML = +score.innerHTML + counter;
                counter = 6;
                nextLevelButton.classList.add('active');
                answersForm.removeEventListener('input', selectAnswers);
            } else {
                answerLabels[i].firstElementChild.style.backgroundColor = '#f60056';
            }
        }
    }
}

answersForm.addEventListener('input', selectAnswers);

nextLevelButton.addEventListener('click', () => {
    if (nextLevelButton.classList.contains('active')) {
        if (!levelInputs[5].checked) {
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
        } else {
            console.log('win')
            setTimeout(() => {
                gamePage.style.display = 'none';
                resultsPage.style.display = 'flex';
                resultMessage.innerHTML = `Поздравляем!\nВы прошли викторину и набрали ${score.innerHTML} из 30 возможных баллов`
            }, 500);
        }
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
                birdSong.style.display = 'none';

                answerLabels[j].addEventListener('click', () => {
                    if (levelInputs[i].checked) {
                        let bird = birdsData[i].find(item => item.name === answerLabels[j].textContent);
                        birdImage.style.backgroundImage = `url('${bird.image}')`;
                        birdImage.style.border = '5px solid rgb(255, 250, 234, 0.5)';
                        birdName.innerHTML = bird.name;
                        birdName.style.borderBottom = '1px solid #d0d0d0';
                        birdLatinName.innerHTML = bird.species;
                        birdLatinName.style.borderBottom = '1px solid #d0d0d0';
                        birdDescription.innerHTML = bird.description;
                        birdSong.style.display = 'flex';
                        birdAudio.src = bird.audio;
                    }
                });
            }
        }
    }
}
createAnswers();

// ---------- Score ----------

const score = document.querySelector('.score-number');
const resultMessage = document.querySelector('.result');
score.innerHTML = 0;

// ---------- Gallery ----------

const birdTypesForm = document.querySelector('.bird-types-form');
const birdTypeInputs = document.querySelectorAll('.bird-type-input');
const birdTypeLabels = document.querySelectorAll('.bird-type-label');
const gallery = document.querySelector('.gallery');

if (birdTypeInputs[0].checked) {
    birdTypeLabels[0].style.backgroundColor = '#b7d428';
}

birdTypesForm.addEventListener('input', () => {
    for (let i = 0; i < birdTypeInputs.length; i++) {
        birdTypeLabels[i].style.backgroundColor = '#9dbd00';
        if (birdTypeInputs[i].checked) {
            birdTypeLabels[i].style.backgroundColor = '#b7d428';
            birdTypeInputs[i].checked = 'true';
            generateBirdCards(i);
        }
    }
})

for (let i = 0; i < birdTypeLabels.length; i++) {
    birdTypeLabels[i].addEventListener('mouseover', () => {
        birdTypeLabels[i].style.backgroundColor = '#b7d428';
    });
    birdTypeLabels[i].addEventListener('mouseout', () => {
        if (!birdTypeInputs[i].checked) birdTypeLabels[i].style.backgroundColor = '#9dbd00';
    });
}

function generateBirdCards(type) {
    gallery.innerHTML = '';
    for (let i = 0; i < birdTypeInputs.length; i++) {

        let birdCard = document.createElement('div');
        birdCard.classList.add('bird-card');  
        gallery.appendChild(birdCard);

        let birdCardImage = document.createElement('div');
        birdCardImage.classList.add('bird-image');
        birdCardImage.style.backgroundImage = `url('${birdsData[type][i].image}')`;
        birdCardImage.style.border = '5px solid rgb(255, 250, 234, 0.5)';
        birdCard.appendChild(birdCardImage);
        
        let birdCardName = document.createElement('div');
        birdCardName.classList.add('bird-name');
        birdCardName.innerHTML = birdsData[type][i].name;
        birdCardName.style.borderBottom = '1px solid #d0d0d0';
        birdCard.appendChild(birdCardName);

        let birdCardLatinName = document.createElement('div');
        birdCardLatinName.classList.add('bird-latin-name');
        birdCardLatinName.innerHTML = birdsData[type][i].species;
        birdCardLatinName.style.borderBottom = '1px solid #d0d0d0';
        birdCard.appendChild(birdCardLatinName);

        let birdCardSong = document.createElement('audio');
        birdCardSong.classList.add('bird-audio');
        birdCardSong.setAttribute('controls', 'true');
        birdCardSong.setAttribute('src', birdsData[type][i].audio);
        birdCard.appendChild(birdCardSong);

        let birdCardDescr = document.createElement('div');
        birdCardDescr.classList.add('bird-description');
        birdCardDescr.style.display = 'none';
        birdCardDescr.innerHTML = birdsData[type][i].description;

        birdCard.appendChild(birdCardDescr);

        birdCard.addEventListener('click', () => {
            birdCard.classList.toggle('bird-card-active');
            if (!birdCard.classList.contains('bird-card-active')) birdCardDescr.style.display = 'none';
            else birdCardDescr.style.display = 'block';
        });
    }   
}

generateBirdCards(0);



