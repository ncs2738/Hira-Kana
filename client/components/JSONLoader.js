///This is a very small file with only one function
//But it did not belong in either the textTranslations.js file
//nor did it belong in the numberTranslations.js fule
//due to both of these files relying on the JSON files being read in.

//Load the page and set off the chain of events
$(document).ready(function()
{
    //Get the JSON files read in from file
    sendAjax('GET', '/getJSON', null, (res) =>
    {
        //Set the text dictionaries
        setTextJSON(res);

        //Set the number dictionaries
        setNumberJSON(res);
    });
});