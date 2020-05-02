//HTML setup for the Date Translation form

//Used for the original date
const DateForm = (props) =>
{
    //Return the date
    //If we're not updating, show this render
    if(!updating)
    {
        return(
            <form id="dateSearch" 
            name="dateSearch"
            onSubmit={getDate}
            className="dateSearch"
            >
                <label for="date">Search a date to translate</label>
                <input type="date" id="dateInput" className="dataInput" name="date"/>
                <input className="dateSubmit" type="submit" value="Translate Date"/>
            </form>
        );
    }
    //We are updating, so show this one
    else
    {
        return(
            <form id="dateSearch" 
            name="dateSearch"
            onSubmit={getDate}
            className="dateSearch"
            >
                <label for="date">Re-search a date to update</label>
                <input type="date" id="dateInput" className="dataInput" name="date"/>
                <input className="dateSubmit" type="submit" value="Translate New Date"/>
            </form>
        );
    }
};

//Load in the date
const DateOutput = function(props) 
{
    //The user hasn't searched for the date
    if(props.date.length === 0)
    {
        //Return a empty list
        return (
            <h3 className="searchOutput"></h3>
        );
    }

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
                    <input className="dateSubmit" type="submit" value="Update"/>
                    <button type="button" onClick={e => stopUpdating(props.csrf)}>Cancel</button>
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
                <h3 className="emptyList">There are no saved dates!</h3>
            </div>
        );
    }

    //There are saved translations, so make a map of them
    const dateNodes = props.dates.map(function(dates)
    {
        //Return a new table entry for each saved translation
        return (
            <div key={dates._id} className="savedTranslation">
                <h4 className="translationDate">{dates.date}</h4>
                <h4 className="translationKanji">{dates.kanji}</h4>
                <h4 className="translationReading">{dates.reading}</h4>
                <h4 className="translationEnglish">{dates.english}</h4>
                <h4 className="translationText">{dates.translation}</h4>
                <button onClick={e => updateTranslation(false, props.dates, dates._id)}>Update</button>
                <button onClick={e => deleteTranslation(dates._id)}>Delete</button>
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



