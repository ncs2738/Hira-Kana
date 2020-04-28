
//HTML setup for the Date Translation form
//This is not finished; will be updated
const DateForm = (props) =>
{
    return(
        <form id="dateSearch" 
        name="dateSearch"
        onSubmit={getDate}
        className="dateSearch"
        >
            <label for="date">Enter Date:</label>
            <input type="date" id="dateInput" name="date"/>
            <input className="dateSubmit" type="submit" value="Get Date"/>
        </form>
    );
};

/*
        <form id="dateForm" 
        name="dateForm"
        onSubmit={handleDate}
        action = "/getDate"
        method="GET"
        className="dateForm"
        >
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="dateSubmit" type="submit" value="Get Date"/>
        </form>
*/
//Load in the date
const DateOutput = function(props) 
{
    //The user hasn't searched for the date
    if(props.date.length === 0)
    {
        //Return a empty list
        return (
            <div className="translationList">
                <h3 className="emptyTranslationList">Get the date please</h3>
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
    if(!updating)
    {
        return (
            <div className="dateOutput">
                 <div className="searchedDate">
                    <h3 className="dateText">{props.date.date}</h3>
                    <h3 className="kanjiText">{props.date.kanji}</h3>
                    <h3 className="readingText">{props.date.reading}</h3>
                    <h3 className="englishText">{props.date.english}</h3>
                    <h3 className="translationText">{props.date.translation}</h3>
                </div>
    
                <form id="dateForm" 
                name="dateForm"
                onSubmit={handleDate}
                action = "/dates"
                method="POST"
                className="dateForm"
                >
                    <input type="hidden" name="date" value={props.date.date}/>
                    <input type="hidden" name="kanji" value={props.date.kanji}/>
                    <input type="hidden" name="reading" value={props.date.reading}/>
                    <input type="hidden" name="english" value={props.date.english}/>
                    <input type="hidden" name="translation" value={props.date.translation}/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <input className="dateSubmit" type="submit" value="Save Date"/>
                </form>
            </div>
        );
    }
    else
    {
        return (
            <div className="dateOutput">
                 <div className="searchedDate">
                    <h3 className="dateText">{props.date.date}</h3>
                    <h3 className="kanjiText">{props.date.kanji}</h3>
                    <h3 className="readingText">{props.date.reading}</h3>
                    <h3 className="englishText">{props.date.english}</h3>
                    <h3 className="translationText">{props.date.translation}</h3>
                </div>
    
                <form id="dateForm" 
                name="dateForm"
                onSubmit={handleDate}
                action = "/dates"
                method="POST"
                className="dateForm"
                >
                    <input type="hidden" name="date" value={props.date.date}/>
                    <input type="hidden" name="kanji" value={props.date.kanji}/>
                    <input type="hidden" name="reading" value={props.date.reading}/>
                    <input type="hidden" name="english" value={props.date.english}/>
                    <input type="hidden" name="translation" value={props.date.translation}/>
                    <input type="hidden" name="id" value={removedElem[0]._id}/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <button type="button" onClick={e => stopUpdating(props.csrf)}>Cancel</button>
                    <input className="dateSubmit" type="submit" value="Update Date"/>
                </form>
            </div>
        );
    }
};


//Load in the date
const DateList = function(props) 
{
    //If there are no previously saved translations
    if(props.dates.length === 0)
    {
        //Return a empty list
        return (
            <div className="dateList">
                <h3 className="emptyDateList">There are no saved dates!</h3>
            </div>
        );
    }

    //There are saved translations, so make a map of them
    const dateNodes = props.dates.map(function(dates)
    {
        //Return a new table entry for each saved translation
        return (
            <div key={dates._id} className="date">
                <h3 className="translationDate">{dates.date}</h3>
                <h3 className="translationKanji">{dates.kanji}</h3>
                <h3 className="translationReading">{dates.reading}</h3>
                <h3 className="translationEnglish">{dates.english}</h3>
                <h3 className="translationText">{dates.translation}</h3>
                <button onClick={e => deleteMe(dates._id)}>Remove</button>
                <button onClick={e => loadData(false, props.dates, dates._id)}>Update</button>
            </div>
        );
    });


    //Return the translations list
    return (
        <div className="dateList">
            {dateNodes}
        </div>
    );
};



