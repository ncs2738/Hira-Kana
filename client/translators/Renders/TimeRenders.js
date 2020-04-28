//HTML setup for the Date Translation form
//This is not finished; will be updated
const TimeForm = (props) =>
{
    return(
        <form id="TimeSearch" 
        name="TimeSearch"
        onSubmit={getTime}
        className="TimeSearch"
        >
            <label for="time">Search a time</label>
            <input type="time" id="time" name="time" required/>
            <input className="timeSubmit" type="submit" value="Get Time"/>
        </form>
    );
};

//Load in the date
const TimeList = function(props) 
{
    console.log(props);
    //The user hasn't searched for the date
    if(props.time.length === 0)
    {
        //Return a empty list
        return (
            <div className="translationList">
                <h3 className="emptyTranslationList">Get the time please</h3>
            </div>
        );
    }

    //For future reference
    /*
    //There are saved translations, so make a map of them
    const dateNodes = props.date.map(function(date)
    {
        //Return a new table entry for each saved translation
        return (
            <div key={translations._id} className="todaysDate">
                <h3 className="dateText">{date.date}</h3>
                <h3 className="kanjiText">{date.kanji}</h3>
                <h3 className="readingText">{date.reading}</h3>
                <h3 className="englishText">{date.english}</h3>
                <h3 className="translationText">{date.translation}</h3>
            </div>
        );
    });
    */

    //Return the date
    return (
        <div className="NumberList">
                <div key={translations._id} className="translatedNumber">
                <h3 className="numberSearched">{props.number.num}</h3>
                <h3 className="numberKanji">{props.number.kanji}</h3>
                <h3 className="numberText">{props.number.reading}</h3>
                <h3 className="englishText">{props.number.english}</h3>
            </div>
        </div>
    );
};
