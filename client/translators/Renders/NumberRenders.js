//HTML setup for the Date Translation form
//This is not finished; will be updated
const NumberForm = (props) =>
{
    return(
        <form id="NumberSearch" 
        name="NumberSearch"
        onSubmit={getNumber}
        className="NumberSearch"
        >
            <label for="number">Enter Number:</label>
            <input type="number" id="numberInput" name="number" max="99999"/>
            <input className="numberSubmit" type="submit" value="Get Number"/>
        </form>
    );
};



//Load in the date
const NumberOutput = function(props) 
{
    console.log(props);
     //The user hasn't searched for a number yet
     if(props.number.length === 0)
     {
         //Return a empty list
         return (
             <div className="translationList">
                 <h3 className="emptyTranslationList">Get the number please</h3>
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
             <div className="numberOutput">
                  <div className="searchedNumber">
                        <h3 className="numberSearched">{props.number.number}</h3>
                        <h3 className="numberKanji">{props.number.kanji}</h3>
                        <h3 className="numberText">{props.number.reading}</h3>
                        <h3 className="englishText">{props.number.english}</h3>
                 </div>
     
                 <form id="numberForm" 
                 name="numberForm" 
                 onSubmit={handleNumber}
                 action = "/number"
                 method="POST"
                 className="numberForm" 
                 >
                     <input type="hidden" name="number" value={props.number.number}/>
                     <input type="hidden" name="kanji" value={props.number.kanji}/>
                     <input type="hidden" name="reading" value={props.number.reading}/>
                     <input type="hidden" name="english" value={props.number.english}/>
                     <input type="hidden" name="_csrf" value={props.csrf}/>
                     <input className="numberSubmit" type="submit" value="Save Number"/>
                 </form>
             </div>
         );
     }
     else
     {
         return (
            <div className="numberOutput">
                <div className="searchedNumber">
                    <h3 className="numberSearched">{props.number.number}</h3>
                    <h3 className="numberKanji">{props.number.kanji}</h3>
                    <h3 className="numberText">{props.number.reading}</h3>
                    <h3 className="englishText">{props.number.english}</h3>
                 </div>
     
                 <form id="numberForm" 
                 name="numberForm" 
                 onSubmit={handleNumber}
                 action = "/number"
                 method="POST"
                 className="numberForm" 
                 >
                     <input type="hidden" name="number" value={props.number.number}/>
                     <input type="hidden" name="kanji" value={props.number.kanji}/>
                     <input type="hidden" name="reading" value={props.number.reading}/>
                     <input type="hidden" name="english" value={props.number.english}/>
                     <input type="hidden" name="id" value={removedElem[0]._id}/>
                     <input type="hidden" name="_csrf" value={props.csrf}/>
                     <button type="button" onClick={e => stopUpdating(props.csrf)}>Cancel</button>
                     <input className="numberSubmit" type="submit" value="Save Number"/>
                 </form>
             </div>
         );
     }
};

//Load in the date
const NumberList = function(props) 
{
    //If there are no previously saved translations
    if(props.numbers.length === 0)
    {
        //Return a empty list
        return (
            <div className="numberList">
                <h3 className="emptyNumberList">There are no saved numbers!</h3>
            </div>
        );
    }

    console.log(props.numbers);

    //There are saved translations, so make a map of them
    const numberNodes = props.numbers.map(function(numbers)
    {
        //Return a new table entry for each saved translation
        return (
            <div key={numbers._id} className="translatedNumber">
                <h3 className="numberSearched">{numbers.number}</h3>
                <h3 className="numberKanji">{numbers.kanji}</h3>
                <h3 className="numberText">{numbers.reading}</h3>
                <h3 className="englishText">{numbers.english}</h3>
                <button onClick={e => deleteMe(numbers._id)}>Remove</button>
                <button onClick={e => loadData(false, props.numbers, numbers._id)}>Update</button>
            </div>
        );
    });


    //Return the translations list
    return (
        <div className="numberList">
            {numberNodes}
        </div>
    );
};

