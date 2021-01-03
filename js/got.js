const characterContainer = document.querySelector('.character-container');

const character = document.querySelectorAll('character');
const filmPicture = document.querySelector('.film-picture');
const filmName = document.querySelector('.film-name');
const description = document.querySelector('.description');
const crest = document.querySelector('.crest');



const rowArray = [0, 1, 2, 3, 4, 5];
rowArray.forEach((item, index) => characterContainer.insertAdjacentHTML('beforeend', `<div class="row" data-row="${index}"></div>`));

const rows = document.querySelectorAll('.row');
const charInARow = [0, 1, 2, 3, 4, 5, 6, 7];

const setRowContent = () => {
    rows.forEach((item, index) => charInARow.forEach((it, ind) => rows[index].insertAdjacentHTML('beforeend', `
    <div class="character">
        <img class="portrait" src="${sortedCharacters[((rowArray[index] * charInARow.length) + ind)].portrait}" 
            alt="${sortedCharacters[((rowArray[index] * charInARow.length) + ind)].name}"></img>
        <div class="name">${sortedCharacters[((rowArray[index] * charInARow.length) + ind)].name}</div>
    </div>`
    )));
}

const swapping = (name) => {
    const firstName = name.split(' ')[0];
    const lastName = name.split(' ')[1];
    return name = lastName ? `${lastName} ${firstName}` : `${firstName}`;
}

let sortedCharacters = [];
const sortByName = (char) => {
    const swappedNames = char.map(item => swapping(item.name));
    swappedNames.sort();
    swappedNames.map((item, index) => sortedCharacters[index] = char.find(i => i.name === swapping(item)));
    return sortedCharacters;
}

const setPicture = (index) => {
    if (index === 99) {
        filmPicture.src = "assets/pictures/got_placeholder.jpg";
    } else {
        filmPicture.src = sortedCharacters[index].picture;
    }
}

const setFilmName = (index) => {
    if (index === 99) {
        filmName.textContent = '';
    } else {
        filmName.textContent = sortedCharacters[index].name;
    }
}

const setDescription = (index) => {
    if (index === 99) {
        description.textContent = 'Character not found';
    } else {
        description.textContent = sortedCharacters[index].bio;
    }
}

const setCrest = (index) => {
    if (index !== 99 && sortedCharacters[index].house) {
        crest.src = `assets/houses/${sortedCharacters[index].house}.png`;
    } else {
        crest.src = '';
    }
}

const setEffect = (index) => {
    const portrait = document.querySelectorAll('.portrait');
    const name = document.querySelectorAll('.name');
    portrait.forEach(item => item.classList.remove('active-portrait'));
    name.forEach(item => item.classList.remove('active-name'));
    portrait[index].classList.add('active-portrait');
    name[index].classList.add('active-name');
}


const setDetails = () => {
    const portrait = document.querySelectorAll('.portrait');
    //const name = document.querySelectorAll('.name');
    portrait.forEach((item, index) => item.addEventListener('click', () => {
    //     portrait.forEach(item => item.classList.remove('active-portrait'))
    // item.classList.add('active-portrait');
        setEffect(index);
        setPicture(index);
        setFilmName(index);
        setDescription(index);
        setCrest(index);
    }))
}

const searching = () => {
    const name = document.querySelectorAll('.name');
    const search = document.querySelector('.search');
    const searchButton = document.querySelector('.search-btn');
    searchButton.addEventListener('click', () => {
        const index = Array.from(name).findIndex((item, index) => search.value.toUpperCase() === item.textContent.toUpperCase());
        if (index > 0) {
            setPicture(index);
            setFilmName(index);
            setDescription(index);
            setCrest(index);
            search.value= '';
        } else {
            setPicture(99);
            setFilmName(99);
            setDescription(99);
            setCrest(99);
        }
    })
}

let alive = [];
async function setCharacters(url, options = {}) {
    try {
        const response = await fetch(url);
        const characters = await response.json();
        alive = await characters.filter(item => !item.dead);
        console.log('alive', alive);
        sortByName(alive);
        setRowContent();
        setDetails();
        searching();
    } catch (error) {
        console.error(error);
    }
}
setCharacters('json/got.json');
