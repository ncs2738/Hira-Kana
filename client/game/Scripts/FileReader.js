let words = []; //Array used for holding file read-in data
let gameWords = []; //Array used for holding in filtered words
let countArray = []; //Array used for getting count of word tags in the text file
let searchArray = []; //Array used for containing parameters to be searched
let wrongArray = []; //Array used for collecting words the user gets wrong. 

function readFile() //Reads in text file containing words to be typed
{
	let path = 'assets/text/input.txt'
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
		if (xhr.readyState === XMLHttpRequest.DONE) 
		{
			if (xhr.status === 200) //If file read properly
			{
				readData(xhr.responseText); //Read the data
			}
			else //Display error screen.
			{
				ReactDOM.render(
					<FileErrorScreen />, gameScreen
				);
			}
        }
    };
    xhr.open("GET", path, true);
	xhr.send();
}

//Paramter: file data
function readData(data) //Splits text file into array by new lines
{
	words = data.split("\n");
}

//Paramter: settings array containing user search fields
function setParameters(paramArray)
{
	gameWords = []; //resets gamewords array

	for(let i = 1; i < words.length; i++) // Starts off at one to ignore the text key
	{
		let word = words[i].split('|'); // Splits current line of file into three parts; the japanese word | the english word | search tags


		if(paramArray.length > 0) //If there are terms to search
		{
			paramCheck:
			for(let j = 0; j < paramArray.length; j++) //Loop through the search term array
			{
				if(word[2].search(paramArray[j]) == -1) //If the word does not contain the search term. word[2] contains all the search tags for the word.
				{
					break paramCheck; //Break the loop
				}
				if(j == paramArray.length - 1) //Succesfully got through loop without breaking;
				{
					gameWords.push([word[0], word[1]]); //This means the word contains all search terms. Add word to gameWords array to be used in game.
				}
			}
		}
		else //If there are none, just push all the words into the gameWords array
		{
			gameWords.push([word[0], word[1]]);
		}
	}	

	if(gameWords.length == 0) //If there were no words meeting all search criteria...
	{
		showSearchNum(paramArray); //Append the tag counts searched to the bad-search screen.
		
		
		//Set the next window to the bad search screen
		currentWindow = "badSearch";
		createWindow();

		ReactDOM.render(
			<ResultList options={optionArray} counts={countArray} />, document.querySelector("#errorMessageBox")
		);
	}
	else //The search criteria was met
	{
		nextLevel(); //Go onto the next level (AKA actually start the game.)
		setTTS(); //Set the TTS button to being active
	}
}

//Used at the start of each level; Reads from gameWords.
function getNewWord()
{
	let index = Math.floor(Math.random() * (gameWords.length)); //Gets random index number
	let newWord = gameWords.splice(index,1)[0]; //Removes the word from the gameWords array
	return newWord; //Returns new word
}

//Array used for getting the counts of search criteria tags of the overall words
//Parameters: search term array
function showSearchNum(paramArray)
{
	countArray = []; //Resets arrays
	gameWords = [];

	for(let i = 0; i < paramArray.length; i++) //Sets the count array to the length of the search term array
	{
		countArray[i] = 0; //Fills each element with a 0. Will be incrimented to.
	}

	for(let j = 1; j < words.length; j++) // Starts off at one to ignore the text key
	{
		let word = words[j].split('|'); // Splits current line of file into three parts; the japanese word | the english word | search tags

		for(let k = 0; k < paramArray.length; k++) //Loops through search parameter array. 
		{
			if(word[2].search(paramArray[k]) > -1) //word[2] contains all the search tags for the word. Checks to see if the word contains the tags being searched
			{
				countArray[k]++; //if so, add tot he coint.
			}
		}
	}
}	