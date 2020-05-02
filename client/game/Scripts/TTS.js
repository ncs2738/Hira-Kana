const apiKey = "f177946bd43944e4b272d7d48e241730"; //API key for voicerrs.
let speechButton;

function setTTS()
{
    speechButton = document.querySelector("#wordContainer"); //Reads in word-box to be used as a button
    speechButton.addEventListener("click", textToSpeech); //Plays a TTS recording when the word-box button is clicked
}

//Text to speech api call.
//Returns a audio link containing the pronunciation of the word to be typed.
function textToSpeech()
{
    clickButton(); //Acts as a button being clicked

    let text = document.querySelector("#word").innerHTML; //Gets the word to be typed

    let url = "https://api.voicerss.org/?key=" + apiKey + "&hl=ja-jp&src=" + text + "&r=MP3&f=48khz_16bit_stereo&c=-10"; //link to API
    
    let audio = new Audio(); //Creates new audio element of the audio.
    audio.src = url; //Sets the audio source to the api link source.
    audio.volume = 1; //Sets the audio volume to max.
    audio.play(); //Plays the audio;
}


//Function to imitate a button being clicked
function clickButton()
{
    let tmp = speechButton.id.toString(); //Temp variable used for holding button's name
    speechButton.id += "Active"; //sets speech button to active

    setTimeout(() => 
    {
        speechButton.id = tmp.replace("Active", ""); //Removes the "Active" value from the button
    }, 250);
}