let alphabet;
let dictionaries;

const inputData = 
{
    title: 'Kanji Finder', //Title for the page
    placeholder: "Type here to translate!", //Placeholder text for the textbox
    message: "",        //Variable used for the vue-model
    characterArray: "", //Variable used for holding the current character array (Either hiragana or Katakana)
    arrayName: "",      //Variable used for holding the current alpahbet array's name (EX: k, s, g, z)
    state: 1,           //Variable used for controlling the case checking state
    stateIndex: 0,      //Index used for getting specific character array in the overall alphabet array; EX: if index == 1, the character array is K
    pos: 0,             //Value containing input field position 
    tmpPos: 0,          //Temp value used for comparing position
    selectedTerm: "Kunyomi", //Variable used for holding current select option
    textBoxReference: "" //Variable used for storing the textbox target
};

const inputHandler = (e) =>
{
    inputData.message = e.target.value;
    inputData.textBoxReference = e.target;

    // this.setState({message: this.refs.inputField.value});   

    //If the chosen reading term is english, literally ignore all of this. Nothing needs to be translated
    if(inputData.selectedTerm != "English")
    {
        inputData.pos = e.target.selectionStart; //Gets the current position of the input field

        if(inputData.tmpPos == inputData.pos || inputData.tmpPos > inputData.pos || inputData.tmpPos+1 < inputData.pos) //Checks to see if the position has moved too far from where they last typed
        {
            inputData.state = 1; //If they have, reset the state back to 1
        }
        inputData.tmpPos = inputData.pos; //Sets reference value of where they last typed

        //If the input was not at the end of the string...
        if(inputData.pos != inputData.message.length)
        {
            //Check the farthest case away (four characters), and check to see if the character correlates any valid Japanese characters
            for(let i = 4; i >= 1; i--)
            {
                let tmp = inputData.message.charAt(inputData.pos-i); //Finds the character last typed in the text field
                if(alphabet[tmp] !== undefined || dictionaries.specialDictionary[tmp] !== undefined) //Checks to see if the character exists in either dictionary
                {
                    //It does, so check which dictionary it's in
                    (alphabet[tmp] !== undefined ? inputData.characterArray = tmp : inputData.characterArray = dictionaries.specialDictionary[tmp]);
                    //Set the state to the current loop's number. The state-check will handle the rest now.
                    inputData.state = i;
                    break;
                }
            }
        }

        //Reads in the complete string from the text field
        let char = inputData.message.charAt(inputData.pos-1); //Finds the character last typed in the text field
        //Sets the alphabet to be typed in. Kunyomi is for hiragana, and Onyumi is for katakana.
        (char.toLowerCase() == char ? inputData.arrayName = "hiraVowels" : inputData.arrayName = "kataVowels")
        //(inputData.selectedTerm == "Kunyomi" ? inputData.arrayName = "hiraVowels" : inputData.arrayName = "kataVowels")
        char = char.toLowerCase(); //Set the character back to lowercase
        stateCheck(char); //Check which state we are in.
    }
}

//Handles the state variable. The state is essentially the length of the input the user is typing.
//EX: For the character "ka", it would go from case one for 'k', then to case 2 for 'a', and then print the character for 'ka'
//So for the character 'kya', it would need to go to state 3 to be printed. 
//Two special characters, 'chi' and 'shi' could be spelt "chya" or "shya" for their y values, so the most amount of cases would be 4
//Parameters: user keystroke input
const stateCheck = (input) =>
{
    switch(inputData.state)
    {
        case 1:
        {
            firstCase(input);
            break;
        }
        case 2:
        {
            secondCase(input);
            break;
        }
        case 3:
        {
            thirdCase(input);
            break;
        }
        case 4:
        {
            fourthCase(input);
            break;
        }
    }
}

//Handles base inputs. At the start of every valid input chain, checks to see if the character has any japanese characters related to it.
//Parameters: user keystroke input
const firstCase = (input) =>
{
    if(dictionaries.vowelDictionary[input] !== undefined) //If the user tpyed a vowel, check to see which vowel
    {
        inputData.characterArray = "vowels";
        printCharacter(setCharacter(dictionaries.vowelDictionary[input]), 1);
    }
    if(input == "v")
    {
        printCharacter(alphabet["special"]["kataV"], inputData.state);
    }
    else if(alphabet[input] !== undefined) //If the user typed a letter, check which letter to set the stateIndex to it's array position
    {
        if(input == "n") //n is a special case; it has both a single character, a vowel array, and a y array.
        {
        setArray("hiraN","kataN");
        printCharacter(alphabet[input][inputData.arrayName], inputData.state);
        }
        
        inputData.characterArray = input;        //Set the array's pointer to be to the input just entered
        inputData.state = 2;                          //and set the state to 2 so we move onto the second case
    }
    else if(dictionaries.specialDictionary[input] !== undefined)
    {
        inputData.characterArray = dictionaries.specialDictionary[input];        //Set the array's pointer to be to the input just entered
        inputData.state = 2;
    }
    else if(dictionaries.punctuationDictionary[input] !== undefined)
    {
        printCharacter(alphabet["punctuation"][dictionaries.punctuationDictionary[input]], inputData.state);
    }
    else
    {
        inputData.state = 1;
    }
}


//Handles second case inputs (IE, If the input will be 2 characters long).
//Parameters: user keystroke input
const secondCase = (input) =>
{
    let preChar = inputData.message.charAt(inputData.pos - 2).toLowerCase(); //Gets the character right before the current position

    //If the character is a tsu, (so for example, kk was entered)...
    if(dictionaries.tsuList.includes(preChar) && preChar == input)
    {
        setArray("hiraTsu","kataTsu"); //Set the array to tsu
        if(inputData.arrayName == "kataTsu") input = input.toUpperCase(); //set the character after the tsu to the appropriate typing.
        printCharacter(input, 1, true); //print the character
    }

    //Check the previous character behind the input
    else if(dictionaries.specialDictionary[preChar] !== undefined && preChar != "l")
    {
        switch(preChar)
        {
            //These c, f, and j are special characters, so they need to be handled uniquely. 
            case "c":
            {
                //If the next input after the c is h, go onto the next step. if not, reset.
                (input == "h" ? inputData.state = 3 : resetState(1, input))
                break;
            }

            case "f":
            {
                //Check if the input is u
                uCheck(input, 2);
                break;
            }

            case "j":
            {
                //Checks if the input is i, then go and check if the input is a y-vowel
                iCheck(input, 2);
                break;
            }

            case "w":
            {
                if(input == "a" || input == "o") //If the user typed a y-character vowel, check to see which vowel
                {
                    let num;
                    (input == "a" ? num = 0 : num = 1)
                    printCharacter(setCharacter(num), 1);
                }
                else //The user entered no valid inputs; return to the first case.
                {
                    resetState(1, input);
                }
                break;
            }

            case "y":
            {
                //Check if the input is a y-vowel
                yCheck(input, 1);
                break;
            }

            case "_":
            {
                if(dictionaries.vowelDictionary[input] !== undefined) //If the user tpyed a vowel, check to see which vowel
                {
                    inputData.arrayName = "kataVowels";
                    printCharacter(setCharacter(dictionaries.vowelDictionary[input]), 1);
                }
                else //The user entered no valid inputs; return to the first case.
                {
                    resetState(1, input);
                }

                break;
            }
        }
    }

    else if(dictionaries.vowelDictionary[input] !== undefined) //If the user typed a vowel, check to see which vowel
    {
        printCharacter(setCharacter(dictionaries.vowelDictionary[input]), 1);
    }

    else if(lastChar('s') || lastChar('t') || input == "y")
    {
        inputData.state = 3;
    }

    else
    {
        resetState(1, input); //Reset the state
    }
}

//Handles third case inputs (IE, If the input will be 3 characters long).
//Mainly handles y-character checks
//Parameters: user keystroke input
const thirdCase = (input) =>
{
    let preChar = inputData.message.substring(inputData.pos - 3, inputData.pos - 1).toLowerCase(); //Gets the last 2 letters inputted
    if(preChar == 'sh' || preChar == "ch") //Used for the character 'shi' or 'chi'. If last two inputs were 'sh' or 'ch'...
    {
        iCheck(input, 2);
    }

    else if(preChar == 'ts') //Used for character 'tsu'.  If last two inputs were 'ts'
    {
        uCheck(input, 2);
    }

    else
    {
        yCheck(input, 2);
    }
}

        
//Final case; handles only for 'shy_' and 'chy_'. (IE, the input length is 4)
//Parameters: user keystroke input
const fourthCase = (input) =>
{
    yCheck(input, 2);
}


//Used to 'print' characters to the textfield
//Parameter: japanese character, the next state num, position buffer (adds to the current textfield position)
const printCharacter = (char, posBuffer, tsuCheck = false) =>
{
    let val = inputData.message; //Reads in textfield value

    if(inputData.pos == val.length) //If we are at the end of the text field...
    {
        let stringField = val.substring(0, val.length - inputData.state); //Cut off the last few character inputs
        (!tsuCheck ? stringField += char : stringField += alphabet["tsu"][inputData.arrayName] + char) //Set the current string to the new character
        inputData.message = stringField; //set the textfield value to the new string
        inputData.textBoxReference.value = inputData.message;
    }
    else //We are not at the end of the text field
    {
        let stringStart = val.substring(0, inputData.pos-inputData.state); //Get the string prior to the current text field position
        let stringField = val.substring(inputData.pos-inputData.state, inputData.pos); //Get the current string at the current text field position
        let stringEnd = val.substring(inputData.pos, val.length); //Get the string after the current text field position
        if(!tsuCheck) //If the character inputted was not a tsu...
        { 
            stringField = char; //just set the stringField to the character being typed
        }
        else
        {
            stringField = alphabet["tsu"][inputData.arrayName] + char; //Set the current string to a tsu character
            posBuffer +=1;
        }

        inputData.message = stringStart + stringField + stringEnd; //Set the textfield to the combination of the strings
        inputData.textBoxReference.value = inputData.message;
        let tmp = inputData.state; //temp variable for state; state gets modified in the next call
        //Sets the new position to be right after where the new character was added
        inputData.textBoxReference.setSelectionRange((inputData.pos-tmp) + posBuffer, (inputData.pos-tmp) + posBuffer)
    }
}

//Function used for reverting back to the first case or the second case/
//Parameters: next-state number, user keystroke input
const resetState = (num, input) =>
{
    let preChar = inputData.message.charAt(inputData.pos - 2).toLowerCase(); //Gets the character right before the current position

    if(alphabet[preChar] !== undefined)
    {
        inputData.characterArray = preChar;
    }
    else if(dictionaries.vowelDictionary[input] !== undefined)
    {
        inputData.characterArray = "vowels";
    }

    inputData.state = num; //sets the next case state.
    if(inputData.state == 1) //If first, go directly to the first case.
    {
        firstCase(input);
    }
    else //If second...
    {
        secondCase(input); //go to second case.
    }
}

//Used for checking the last characters inputted.
//returns true or false.
//Parameters: Last user keystroke input
const lastChar = (char) =>
{
    //Reads in value up to last input and lowercases both the value and the character inputted
    let val = inputData.message.substring(0, inputData.pos - 1).toLowerCase(); 
    char = char.toLowerCase(); //Character is the last character inputted

    if(val.charAt(val.length-1) == char) // if the last character of the value string is the same as the last character inputted...
    {
        return true; //return true
    }
    return false; //if not, return false.
}

//Checks if the new array should be in hiragana or katakana
const setArray = (hiraArray, kataArray) =>
{
    (inputData.arrayName == "hiraVowels" ? inputData.arrayName = hiraArray : inputData.arrayName = kataArray)
}

//Sets the new character to be printed
const setCharacter = (charNum) =>
{
    return alphabet[inputData.characterArray][inputData.arrayName][charNum];
}

//Checks if the character inputted was a 'u'
const uCheck = (input, stateIndex) =>
{
    if(input == "u")
    {
        printCharacter(setCharacter(2), 1)
    }
    else //The user entered no valid inputs; return to the first case.
    {
        resetState(stateIndex, input);
    }
}

//Checks to see if the character inputted is a valid y-vowel
const yCheck = (input, stateIndex) =>
{
    if(dictionaries.yDictionary[input] !== undefined)
    {
        setArray("hiraYs","kataYs");
        printCharacter(setCharacter(dictionaries.yDictionary[input]), stateIndex);    
    }
    else if(input == "y" && inputData.state <= 3)
    {
        inputData.state++;
    }
    else
    {
        resetState(stateIndex, input);
    }
}

//Checks to see if the character inputted was 'i'. If not, go onto seeing if it was a y-vowel
const iCheck = (input, stateIndex) =>
{
    if(input == "i")
    {
        printCharacter(setCharacter(1), 1);
    }
    else
    {
        yCheck(input, stateIndex);
    }
}

const setTextJSON = (jsonDictionary) =>
{
    alphabet = jsonDictionary.text;
    dictionaries = jsonDictionary.dictionaries;
}