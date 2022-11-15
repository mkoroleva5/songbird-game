import "./styles/index.css"
import birdsData from "./birds.js"
import birdsDataEn from "./birds-en.js"
import leafImage from "./assets/leaf.png"

// ---------- Game start ----------

const gameButton = document.querySelector('.play-button');
const restartButton = document.querySelector('.restart-button');
const homeLink = document.querySelector('.home-link');
const gameLink = document.querySelector('.game-link');
const galleryLink = document.querySelector('.gallery-link');
const startPage = document.querySelector('.start-section');
const gamePage = document.querySelector('.game-section');
const galleryPage = document.querySelector('.gallery-section');
const resultsPage = document.querySelector('.results-section');
const taskDescription = document.querySelector('.task-description');
const leaves = document.querySelectorAll('.leaf-image');
leaves.forEach(item => item.src = leafImage);
const flyingBirds = document.querySelector('.flying-birds');
homeLink.style.color = '#9dbd00';

homeLink.addEventListener('click', () => {
    startPage.style.display = 'flex';
    resultsPage.style.display = 'none';
    gamePage.style.display = 'none';
    gamePage.style.transform = 'translateX(100%)';
    galleryPage.style.display = 'none';
    homeLink.style.color = '#9dbd00';
    gameLink.style.color = '#332c2c';
    galleryLink.style.color = '#332c2c';
});

gameButton.addEventListener('click', () => {
    flyingBirds.style.display = 'flex';
    flyingBirds.style.transform = 'translateX(150%)';
    flyingBirds.classList.add('fly');
    homeLink.style.color = '#332c2c';
    gameLink.style.color = '#9dbd00';
    galleryLink.style.color = '#332c2c';
    startPage.classList.add('flip');
    setTimeout(() => {
        gamePage.style.display = 'flex';
        flyingBirds.style.transform = 'translateX(-150%)';
    }, 500);
    setTimeout(() => {
        startPage.style.display = 'none';
        galleryPage.style.display = 'none';
        resultsPage.style.display = 'none';
        gamePage.style.transform = 'translateX(0)';
        levelInputs[0].checked = 'true';
        levelLabels.forEach(item => item.style.backgroundColor = '#9dbd00');
        levelLabels[0].style.backgroundColor = '#b7d428';
        score.innerHTML = 0;
        getRandomSong(0);
        createAnswers();
        for (let i = 0; i < answerInputs.length; i++) {
            answerInputs[i].checked = false;
        }
        answersForm.addEventListener('input', selectAnswers);
        startPage.classList.remove('flip');
    }, 1000); 
    setTimeout(() => {
        flyingBirds.style.display = 'none';
        flyingBirds.style.transform = 'translateX(150%)';
        flyingBirds.classList.remove('fly');
    }, 3000); 
});

gameLink.addEventListener('click', () => {
    homeLink.style.color = '#332c2c';
    gameLink.style.color = '#9dbd00';
    galleryLink.style.color = '#332c2c';
    startPage.style.display = 'none';
    resultsPage.style.display = 'none';
    galleryPage.style.display = 'none';
    gamePage.style.display = 'flex';
    gamePage.style.transform = 'translateX(0)';
});

galleryLink.addEventListener('click', () => {
    homeLink.style.color = '#332c2c';
    gameLink.style.color = '#332c2c';
    galleryLink.style.color = '#9dbd00';
    startPage.style.display = 'none';
    resultsPage.style.display = 'none';
    gamePage.style.display = 'none';
    gamePage.style.transform = 'translateX(100%)';
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

// ---------- Question player ----------

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
    if (localStorage.getItem('language') === 'en') answer = birdsDataEn[levelNum].find(item => item.audio === birdsDataEn[levelNum][randomNum].audio);
    if (localStorage.getItem('language') === 'ru') answer = birdsData[levelNum].find(item => item.audio === birdsData[levelNum][randomNum].audio);
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

import wrongSoundSource from './assets/wrong.mp3';
import rightSoundSource from './assets/right.mp3';
const wrongSound = new Audio(wrongSoundSource);
const rightSound = new Audio(rightSoundSource);

let counter = 6;
function selectAnswers() {
    taskDescription.style.width = '0';
    taskDescription.innerHTML = '';
    for (let i = 0; i < answerInputs.length; i++) {
        if (answerInputs[i].checked && answerLabels[i].firstElementChild.style.backgroundColor === 'rgb(208, 208, 208)') {
            counter--;
            console.log(answerLabels[i].textContent)
            if (answerLabels[i].textContent === answer.name) {
                answerLabels[i].firstElementChild.style.backgroundColor = '#9dbd00';
                questionImage.style.backgroundImage = `url('${answer.image}')`;
                questionName.innerHTML = answer.name;
                score.innerHTML = +score.innerHTML + counter;
                counter = 6;
                rightSound.currentTime = 0;
                rightSound.play();
                questionSong.pause();
                isPlay = false;
                playButton.classList.remove('pause');
                nextLevelButton.classList.add('active');
                answersForm.removeEventListener('input', selectAnswers);
            } else {
                wrongSound.currentTime = 0;
                wrongSound.play();
                answerLabels[i].firstElementChild.style.backgroundColor = '#f60056';               
            }
        }       
    }   
}

answersForm.addEventListener('input', selectAnswers);

nextLevelButton.addEventListener('click', () => {
    if (nextLevelButton.classList.contains('active')) {
        if (!levelInputs[5].checked) {
            answersForm.addEventListener('input', selectAnswers);
            nextLevelButton.classList.remove('active');
            changeLevels();
            isPlay = false;
            playButton.classList.remove('pause');
            for (let i = 0; i < levelInputs.length; i++) {
                answerInputs[i].checked = false;
                if (levelInputs[i].checked) {
                    getRandomSong(i);
                    createAnswers();
                }
            }
            console.log(answer.name)
        } else {
            console.log('win')
            setTimeout(() => {
                gamePage.style.display = 'none';
                resultsPage.style.display = 'flex';
                if (localStorage.getItem('language') === 'en') {
                    if (score.innerHTML > 29) {
                        resultMessage.innerHTML = `<div>Wow!</div><div>You did great and scored ${score.innerHTML} out of 30 possible points!</div>`;
                    }
                    if (score.innerHTML < 30 && score.innerHTML > 15 ) {
                        resultMessage.innerHTML = `<div>Congratulations!</div><div>You completed the quiz and scored ${score.innerHTML} out of 30 possible points</div>`;
                    }
                    if (score.innerHTML <= 15 ) {
                        resultMessage.innerHTML = `<div>Nice!</div><div>You completed the quiz and scored ${score.innerHTML} out of 30 possible points</div><div>Let's try again!</div>`;
                    }
                }
                if (localStorage.getItem('language') === 'ru') {
                    if (score.innerHTML > 29) {
                        resultMessage.innerHTML = `<div>Ого!</div><div>Вы великолепны и набрали ${score.innerHTML} из 30 возможных баллов</div>`;
                    }
                    if (score.innerHTML < 30 && score.innerHTML > 15 ) {
                        resultMessage.innerHTML = `<div>Поздравляем!</div><div>Вы прошли викторину и набрали ${score.innerHTML} из 30 возможных баллов</div>`;
                    }
                    if (score.innerHTML <= 15 ) {
                        resultMessage.innerHTML = `<div>Неплохо!</div><div>Вы прошли викторину и набрали ${score.innerHTML} из 30 возможных баллов</div><div>Попробуйте еще раз!</div>`;
                    }
                }
                restartButton.addEventListener('click', () => {
                    setTimeout(() => {
                        startPage.style.display = 'none';
                        resultsPage.style.display = 'none';
                        gamePage.style.display = 'flex';
                        gamePage.style.transform = 'translateX(0)';
                        galleryPage.style.display = 'none';
                        homeLink.style.color = '#332c2c';
                        gameLink.style.color = '#9dbd00';
                        galleryLink.style.color = '#332c2c';
                        levelInputs[0].checked = 'true';
                        levelLabels.forEach(item => item.style.backgroundColor = '#9dbd00');
                        levelLabels[0].style.backgroundColor = '#b7d428';
                        score.innerHTML = 0;
                        getRandomSong(0);
                        createAnswers();
                        for (let i = 0; i < answerInputs.length; i++) {
                            answerInputs[i].checked = false;
                        }
                        nextLevelButton.classList.remove('active');
                        answersForm.addEventListener('input', selectAnswers);
                    }, 500);  
                });
            }, 500);
        }
    }
})

// ---------- Birds description ----------

function createAnswers() {
    taskDescription.style.width = '100%';
    if (localStorage.getItem('language') === 'en') taskDescription.innerHTML = '<p>1. Listen to the player</p><p>2. Select a bird from the list</p>';
    if (localStorage.getItem('language') === 'ru') taskDescription.innerHTML = '<p>1. Послушайте плеер</p><p>2. Выберите птицу из списка</p>';
    for (let i = 0; i < levelInputs.length; i++) {
        if (levelInputs[i].checked) {
            for (let j = 0; j < answerInputs.length; j++) {
                if (localStorage.getItem('language') === 'en') answerLabels[j].innerHTML = `<div class="dot"></div>${birdsDataEn[i][j].name}`;
                if (localStorage.getItem('language') === 'ru') answerLabels[j].innerHTML = `<div class="dot"></div>${birdsData[i][j].name}`;
                answerLabels[j].firstElementChild.style.backgroundColor = 'rgb(208, 208, 208)';
                birdImage.style.backgroundImage = 'none';
                birdImage.style.border = 'none';
                birdName.innerHTML = '';
                birdName.style.borderBottom = 'none';
                birdLatinName.innerHTML = '';
                birdLatinName.style.borderBottom = 'none';
                birdDescription.innerHTML = '';
                birdSong.style.display = 'none';

                answerLabels[j].addEventListener('click', () => {
                    taskDescription.style.width = '0';
                    taskDescription.innerHTML = '';
                    if (levelInputs[i].checked) {
                        let bird;
                        if (localStorage.getItem('language') === 'en') bird = birdsDataEn[i].find(item => item.name === answerLabels[j].textContent);
                        if (localStorage.getItem('language') === 'ru') bird = birdsData[i].find(item => item.name === answerLabels[j].textContent);
                        birdImage.style.backgroundImage = `url('${bird.image}')`;
                        birdImage.style.border = '5px solid rgb(255, 250, 234, 0.5)';
                        birdName.innerHTML = bird.name;
                        birdName.style.borderBottom = '1px solid #d0d0d0';
                        birdLatinName.innerHTML = bird.species;
                        birdLatinName.style.borderBottom = '1px solid #d0d0d0';
                        birdDescription.innerHTML = bird.description;
                        birdSong.style.display = 'flex';
                        birdSongAudio.src = bird.audio;
                        birdTrackLength.textContent = bird.duration;
                        birdSongisPlay = false;
                        birdPlayButton.classList.remove('pause');
                    }
                });
            }
        }
    }
}
createAnswers();

// ---------- Score ----------

const score = document.querySelector('.score-number');
const scoreText = document.querySelector('.score-text');
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
            if (localStorage.getItem('language') === 'en') generateBirdCards(i, birdsDataEn);
            if (localStorage.getItem('language') === 'ru') generateBirdCards(i, birdsData);
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

function generateBirdCards(type, dataLang) {
    gallery.innerHTML = '';
    for (let i = 0; i < birdTypeInputs.length; i++) {

        let birdCard = document.createElement('div');
        birdCard.classList.add('bird-card');  
        gallery.appendChild(birdCard);

        let birdCardImage = document.createElement('div');
        birdCardImage.classList.add('bird-image');
        birdCardImage.style.backgroundImage = `url('${dataLang[type][i].image}')`;
        birdCardImage.style.border = '5px solid rgb(255, 250, 234, 0.5)';
        birdCard.appendChild(birdCardImage);
        
        let birdCardName = document.createElement('div');
        birdCardName.classList.add('bird-name');
        birdCardName.innerHTML = dataLang[type][i].name;
        birdCardName.style.borderBottom = '1px solid #d0d0d0';
        birdCard.appendChild(birdCardName);

        let birdCardLatinName = document.createElement('div');
        birdCardLatinName.classList.add('bird-latin-name');
        birdCardLatinName.innerHTML = dataLang[type][i].species;
        birdCardLatinName.style.borderBottom = '1px solid #d0d0d0';
        birdCard.appendChild(birdCardLatinName);

        let birdCardSong = document.createElement('div');
        birdCardSong.classList.add('bird-song');
        birdCardSong.innerHTML = `
                  <div class="player">
                    <audio class="audio bird-card-audio"></audio>
                    <button class="play player-icon bird-card-play"></button>
                    <div class="time-bar bird-card-time-bar">
                      <div class="timeline bird-card-timeline">
                        <div class="progress-bar bird-card-progress-bar"></div>
                      </div>
                      <div class="track-time">
                        <div class="current bird-card-current">00:00</div>
                        <div class="divider">/</div>
                        <div class="length bird-card-track-length">00:00</div>
                      </div>
                    </div>
                    <div class="controls">
                      <div class="volume-controls">
                        <button class="mute-button player-icon bird-card-mute-button"></button>
                        <div class="volume bird-card-volume">
                          <div class="volume-percentage bird-card-volume-percentage"></div>
                        </div>
                      </div>
                    </div>
                  </div>`
        birdCard.appendChild(birdCardSong);
        const birdCardAudio = document.querySelectorAll('.bird-card-audio');
        birdCardAudio[i].src = dataLang[type][i].audio;
        const birdCardTrackLength = document.querySelectorAll('.bird-card-track-length');
        birdCardTrackLength[i].textContent = dataLang[type][i].duration;
        const birdCardPlayButton = document.querySelectorAll('.bird-card-play');
        let birdCardSongisPlay = false;
        birdCardPlayButton[i].addEventListener('click', () => {
            if (!birdCardSongisPlay) {
                birdCardAudio[i].play();
                birdCardSongisPlay = true;
                birdCardPlayButton[i].classList.add('pause');
            } else if (birdCardSongisPlay) {
                birdCardAudio[i].pause();
                birdCardSongisPlay = false;
                birdCardPlayButton[i].classList.remove('pause');
            }
        });
        birdCardAudio[i].addEventListener('ended', () => {
            birdCardSongisPlay = false;
            birdCardPlayButton[i].classList.remove('pause');
        });

        const birdMuteButtons = document.querySelectorAll('.bird-card-mute-button');
        const birdVolumes = document.querySelectorAll('.bird-card-volume');
        const birdVolumePercentages = document.querySelectorAll('.bird-card-volume-percentage');

        birdMuteButtons[i].addEventListener('click', () => {
            birdMuteButtons[i].classList.toggle('muted');
            if (birdCardAudio[i].muted === false) birdCardAudio[i].muted = true;
            else birdCardAudio[i].muted = false;
        });

        async function changeBirdCardVolume() {
            birdVolumes[i].style.opacity = '1';
            birdVolumes[i].addEventListener('click', e => {
                const sliderWidth = window.getComputedStyle(birdVolumes[i]).width;
                const newVolume = e.offsetX / parseInt(sliderWidth);
                birdCardAudio[i].volume = newVolume;
                birdVolumePercentages[i].style.width = newVolume * 100 + '%';
            }, false)
        }
        changeBirdCardVolume();

        const birdCardTimeline = document.querySelectorAll('.bird-card-timeline');
        const birdCardProgressBar = document.querySelectorAll('.bird-card-progress-bar');
        const birdCardCurrentTime = document.querySelectorAll('.bird-card-current');
        
        birdCardTimeline[i].addEventListener('click', e => {
            const timelineWidth = window.getComputedStyle(birdCardTimeline[i]).width;
            const timeToSeek = e.offsetX / parseInt(timelineWidth) * birdCardAudio[i].duration;
            birdCardAudio[i].currentTime = timeToSeek;
        }, false);
        
        setInterval(() => {
            birdCardProgressBar[i].style.width = birdCardAudio[i].currentTime / birdCardAudio[i].duration * 100 + '%';
            birdCardCurrentTime[i].textContent = getTimeCodeFromNum(birdCardAudio[i].currentTime);
        }, 100);
        
        let birdCardDescr = document.createElement('div');
        birdCardDescr.classList.add('bird-description');
        birdCardDescr.style.display = 'none';
        birdCardDescr.innerHTML = dataLang[type][i].description;

        birdCard.appendChild(birdCardDescr);

        birdCard.addEventListener('click', (e) => {
            const click = e.composedPath().includes(birdCardSong);
            if ( !click ) {
                birdCard.classList.toggle('bird-card-active');
                if (!birdCard.classList.contains('bird-card-active')) birdCardDescr.style.display = 'none';
                else birdCardDescr.style.display = 'block';
            }
        });
    }   
}

if (localStorage.getItem('language') === 'en') generateBirdCards(0, birdsDataEn);
if (localStorage.getItem('language') === 'ru') generateBirdCards(0, birdsData);


// ---------- Bird-song player ----------

const birdSongAudio = birdSong.querySelector('.audio');
const birdPlayButton = birdSong.querySelector('.play');
let birdSongisPlay = false;

function playBirdTrack() {
    if (!birdSongisPlay) {
        birdSongAudio.play();
        birdSongisPlay = true;
        birdPlayButton.classList.add('pause');
    } else if (birdSongisPlay) {
        birdSongAudio.pause();
        birdSongisPlay = false;
        birdPlayButton.classList.remove('pause');
    }
}
birdPlayButton.addEventListener('click', playBirdTrack);

birdSongAudio.addEventListener('ended', () => {
    birdSongisPlay = false;
    birdPlayButton.classList.remove('pause');
});

const birdMuteButton = birdSong.querySelector('.mute-button');
const birdVolume = birdSong.querySelector('.volume');
const birdVolumePercentage = birdSong.querySelector('.volume-percentage');

birdMuteButton.addEventListener('click', () => {
    birdMuteButton.classList.toggle('muted');
    if (birdSongAudio.muted === false) birdSongAudio.muted = true;
    else birdSongAudio.muted = false;
});

function setBirdVolume() {
    localStorage.setItem('bird-volume-bar', birdVolumePercentage.style.width);
    localStorage.setItem('bird-volume', birdSongAudio.volume);
}

function getBirdVolume() {
    if (localStorage.getItem('bird-volume-bar')) birdVolumePercentage.style.width = localStorage.getItem('bird-volume-bar');
    if (localStorage.getItem('bird-volume')) birdSongAudio.volume = localStorage.getItem('bird-volume');
}

window.addEventListener('beforeunload', setBirdVolume);
window.addEventListener('load', getBirdVolume);

async function changeBirdVolume() {
    const res = await getBirdVolume();
    birdVolume.style.opacity = '1';
    birdVolume.addEventListener('click', e => {
        const sliderWidth = window.getComputedStyle(birdVolume).width;
        const newVolume = e.offsetX / parseInt(sliderWidth);
        birdSongAudio.volume = newVolume;
        birdVolumePercentage.style.width = newVolume * 100 + '%';
    }, false)
}
changeBirdVolume();

const birdTimeline = birdSong.querySelector('.timeline');
const birdProgressBar = birdSong.querySelector('.progress-bar');
const birdCurrentTime = birdSong.querySelector('.current');
const birdTrackLength = birdSong.querySelector('.length');

birdTimeline.addEventListener('click', e => {
    const timelineWidth = window.getComputedStyle(birdTimeline).width;
    const timeToSeek = e.offsetX / parseInt(timelineWidth) * birdSongAudio.duration;
    birdSongAudio.currentTime = timeToSeek;
}, false);

setInterval(() => {
    birdProgressBar.style.width = birdSongAudio.currentTime / birdSongAudio.duration * 100 + '%';
    birdCurrentTime.textContent = getTimeCodeFromNum(birdSongAudio.currentTime);
}, 100);

// ---------- Translation ----------

const languageForm = document.querySelector('.language-form');
const enLang = document.getElementById('en');
const ruLang = document.getElementById('ru');
const languageInputs = document.querySelectorAll('.language-input');
const languageLabels = document.querySelectorAll('.language-label');
const startDescription = document.querySelector('.start-description');

const enLevels = ['Warm-up', 'Sparrow birds', 'Forest birds', 'Songbirds', 'Predator birds', 'Sea birds'];
const ruLevels = ['Разминка', 'Воробьиные птицы', 'Лесные птицы', 'Певчие птицы', 'Хищные птицы', 'Морские птицы'];

for (let i = 0; i < languageLabels.length; i++) {
    languageLabels[i].addEventListener('mouseover', () => {
        languageLabels[i].style.backgroundColor = '#b7d428';
    });
    languageLabels[i].addEventListener('mouseout', () => {
        if (!languageInputs[i].checked) languageLabels[i].style.backgroundColor = '#9dbd00';
    });
}

function changeLanguage() {
    let lang = localStorage.getItem('language');
    if (lang === 'en') {
        languageLabels[0].style.backgroundColor = '#b7d428';
        languageLabels[1].style.backgroundColor = '#9dbd00';
        homeLink.textContent = 'Home';
        gameLink.textContent = 'Game';
        galleryLink.textContent = 'Gallery';
        scoreText.textContent = 'Score:';
        gameButton.textContent = 'Play game!';
        restartButton.textContent = 'Play again';
        for (let i = 0; i < levelLabels.length; i++) {
            levelLabels[i].textContent = enLevels[i];
            birdTypeLabels[i].textContent = enLevels[i];
        }
        nextLevelButton.textContent = 'Next level';
        createAnswers();
        counter = 6;
        for (let i = 0; i < levelInputs.length; i++) {
            if (levelInputs[i].checked) {
                questionSong.src = birdsDataEn[i][answer.id - 1].audio;
                trackLength.textContent = birdsDataEn[i][answer.id - 1].duration;
                answer = birdsDataEn[i].find(item => item.audio === birdsDataEn[i][answer.id - 1].audio);
            }
            if (birdTypeInputs[i].checked) generateBirdCards(i, birdsDataEn);
        }
        startDescription.innerHTML = `<div>Welcome to Songbird!</div><div>In this game you will have to get acquainted with the singing of different birds and try to guess them all.</div><div>Let's start?</div>`
        if (score.innerHTML > 29) {
            resultMessage.innerHTML = `<div>Wow!</div><div>You did great and scored ${score.innerHTML} out of 30 possible points!</div>`;
        }
        if (score.innerHTML < 30 && score.innerHTML > 15 ) {
            resultMessage.innerHTML = `<div>Congratulations!</div><div>You completed the quiz and scored ${score.innerHTML} out of 30 possible points</div>`;
        }
        if (score.innerHTML <= 15 ) {
            resultMessage.innerHTML = `<div>Nice!</div><div>You completed the quiz and scored ${score.innerHTML} out of 30 possible points</div><div>Let's try again!</div>`;
        }
    }
    if (lang === 'ru') {
        languageLabels[1].style.backgroundColor = '#b7d428';
        languageLabels[0].style.backgroundColor = '#9dbd00';
        homeLink.textContent = 'Главная';
        gameLink.textContent = 'Игра';
        galleryLink.textContent = 'Галерея';
        scoreText.textContent = 'Очки:';
        gameButton.textContent = 'Играть!';
        restartButton.textContent = 'Играть снова';
        for (let i = 0; i < levelLabels.length; i++) {
            levelLabels[i].textContent = ruLevels[i];
            birdTypeLabels[i].textContent = ruLevels[i];
        }
        nextLevelButton.textContent = 'Следующий уровень';
        createAnswers();
        counter = 6;
        for (let i = 0; i < levelInputs.length; i++) {
            if (levelInputs[i].checked) {
                questionSong.src = birdsData[i][answer.id - 1].audio;
                trackLength.textContent = birdsData[i][answer.id - 1].duration;
                answer = birdsData[i].find(item => item.audio === birdsData[i][answer.id - 1].audio);
            }
            if (birdTypeInputs[i].checked) generateBirdCards(i, birdsData);
        }
        startDescription.innerHTML = '<div>Добро пожаловать в игру Songbird!</div><div>В этой игре вам предстоит познакомиться с пением разных птиц и попытаться угадать их все.</div><div>Начнем?</div>'
        if (score.innerHTML > 29) {
            resultMessage.innerHTML = `<div>Ого!</div><div>Вы великолепны и набрали ${score.innerHTML} из 30 возможных баллов</div>`;
        }
        if (score.innerHTML < 30 && score.innerHTML > 15 ) {
            resultMessage.innerHTML = `<div>Поздравляем!</div><div>Вы прошли викторину и набрали ${score.innerHTML} из 30 возможных баллов</div>`;
        }
        if (score.innerHTML <= 15 ) {
            resultMessage.innerHTML = `<div>Неплохо!</div><div>Вы прошли викторину и набрали ${score.innerHTML} из 30 возможных баллов</div><div>Попробуйте еще раз!</div>`;
        }    }
}

function setLanguage() {
    if (enLang.checked) {
        localStorage.setItem('language', 'en');
    }
    if (ruLang.checked)  {
        localStorage.setItem('language', 'ru');
    }
}

function getLanguage() {
    if (localStorage.getItem('language') === 'en') {
        enLang.checked = 'true';
    }
    if (localStorage.getItem('language') === 'ru') {
        ruLang.checked = 'true';
    }
}

languageForm.addEventListener('input', () => {
    setLanguage();
    changeLanguage();
});

window.addEventListener('beforeunload', setLanguage);
window.addEventListener('load', () => {
    getLanguage();
    changeLanguage();
});

changeLanguage();

// ---------- Burger menu ----------

const burgerMenuButton = document.querySelector('.header__menu_button');
const burgerCloseButton = document.querySelector('.burger__close-button');
const burgerMenu = document.querySelector('.header__menu_burger');
const nav = document.querySelector('.nav');
const dark = document.querySelector('.dark');

burgerMenuButton.addEventListener('click', () => {
    dark.style.display = 'block';
    burgerMenu.style.transform = 'translateX(0)';
    setTimeout(() => {
        nav.style.transform = 'translateX(0)';
    }, 200);
});

if (window.innerWidth < 650) {
    nav.addEventListener('click', () => {
        dark.style.display = 'none';
        burgerMenu.style.transform = 'translateX(150%)';
        nav.style.transform = 'translateX(300%)';
    });
}

window.addEventListener('resize', () => {
    if (window.innerWidth >= 650) {
        nav.style.transform = 'translateX(0)';
    }
    if (window.innerWidth < 650) {
        dark.style.display = 'none';
        burgerMenu.style.transform = 'translateX(150%)';
        nav.style.transform = 'translateX(300%)';
    }
})


dark.addEventListener('click', () => {
    dark.style.display = 'none';
    burgerMenu.style.transform = 'translateX(150%)';
    nav.style.transform = 'translateX(300%)';
});

burgerCloseButton.addEventListener('click', () => {
    dark.style.display = 'none';
    burgerMenu.style.transform = 'translateX(150%)';
    nav.style.transform = 'translateX(300%)';
});


