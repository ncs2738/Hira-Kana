//Gets Option menu selects
let alphabetSelect;
let missSelect;
let timeSelect;
let categorySelect;
let chapterSelect;

//Gets option menu difficutly buttons
let easySelect;
let mediumSelect;
let hardSelect;

//Variables used for storing option menu values + used for searching the text file
let missLimit = 5;
let timeLimit = 60;
let chosenAlphabet = "hiragana";
let chosenCategory = "any";
let chosenChapter = "any";
let chosenDifficulty = [];

let optionArray = ['easy', 'hiragana']; //Array used for holding search parameter terms. Set by default to easy and hiragana.

function setDefaultOptions()
{
    //Set the miss limit
    missSelect.value = 5;

    //Set the time
    timeSelect.value = 60;

    //Set the alphabet
    alphabetSelect.value = "hiragana";

    //Set the category type
    categorySelect.value = "any";

    //Set the chapter number
    chapterSelect.value = "any";


    //Resets all the values
    missLimit = 5;
    timeLimit = 60;
    chosenAlphabet = "hiragana";
    chosenCategory = "any";
    chosenChapter = "any";
}

function setOptionHandlers()
{
    //Gets Option menu selects
    alphabetSelect = document.querySelector("#Alphabet");
    missSelect = document.querySelector("#missLimit");
    timeSelect = document.querySelector("#timeLimit");
    categorySelect = document.querySelector("#wordCategory");
    chapterSelect = document.querySelector("#chapters");

    //Gets option menu difficutly buttons
    easySelect = document.querySelector(".easy");
    mediumSelect = document.querySelector(".medium");
    hardSelect = document.querySelector(".hard");

    //Stores values into storage, sets the chosen limit to the stored value.
    missSelect.onchange = e=>
    { 
        missLimit = parseInt(e.target.value, 10);
    };

    timeSelect.onchange = e=>
    { 
        timeLimit = parseInt(e.target.value, 10);
    };


    //Stores values into storage, sets the chosen value to the stored value.
    //Once the chosen value is set, calls the setOptionArray to set search parameters.
    alphabetSelect.onchange = e=>
    { 
        chosenAlphabet = alphabetSelect.value; 
        setOptionArray(); 
    };

    categorySelect.onchange = e=>
    { 
        chosenCategory = categorySelect.value; 
        setOptionArray();
    };


    chapterSelect.onchange = e=>
    { 
        chosenChapter = chapterSelect.value;  
        setOptionArray(); 
    };
}

//Checks what option values were selected. These values are used to filter the words shown in game
function setOptionArray()
{
    optionArray = []; //Clears the search array
    if(chosenAlphabet && chosenAlphabet != "both") optionArray.push(chosenAlphabet); //If a alphabet was chosen, adds to the array
    if(chosenCategory && chosenCategory != "any") optionArray.push(chosenCategory); //If a category was chosen, adds to the array
    if(chosenChapter && chosenChapter != "any") optionArray.push(chosenChapter); //If a chapter was chosen, adds to the array
    if(chosenDifficulty && chosenDifficulty != "any") optionArray.push(tempButton.value); //If a difficulty was chosen, adds to the array
}
