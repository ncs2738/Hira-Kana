//HTML setup for the Number Translation form
const NumberForm = (props) =>
{
    //If we're not updating, show this render
    if(!updating)
    {
    return(
        <form id="numberSearch" 
        name="numberSearch"
        onSubmit={getNumber}
        className="numberSearch"
        >
            <label for="number">Enter a number to translate</label>
            <input type="text" id="numberInput" className="dataInput" maxlength="5"/>
            <input className="numberSubmit" type="submit" value="Translate Number"/>
        </form>
    );
    }
    //We are updating, so show this one
    else
    {
        return(
            <form id="numberSearch" 
            name="numberSearch"
            onSubmit={getNumber}
            className="numberSearch"
            >
                <label for="number">Re-search a number to update</label>
                <input type="text" id="numberInput" className="dataInput" maxlength="5"/>
                <input className="numberSubmit" type="submit" value="Translate New Number"/>
            </form>
        );
    }
};

//Load in the number
const NumberOutput = function(props) 
{
     //The user hasn't searched for a number yet
     if(props.number.length === 0)
     {
         //Return a empty list
         return (
            <h3 className="searchOutput"></h3>
        );
     }
 
     //Return the number
     if(!updating)
     {
         return (
             <div className="translations">
                  <div className="translation">
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
            <div className="translations">
                <div className="translation">
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
                     <input className="numberSubmit" type="submit" value="Update"/>
                     <button type="button" onClick={e => stopUpdating(props.csrf)}>Cancel</button>
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
                <h3 className="emptyList">There are no saved numbers!</h3>
            </div>
        );
    }

    //There are saved translations, so make a map of them
    const numberNodes = props.numbers.map(function(numbers)
    {
        //Return a new table entry for each saved translation
        return (
            <div key={numbers._id} className="savedTranslation">
                <h4 className="numberSearched">{numbers.number}</h4>
                <h4 className="numberKanji">{numbers.kanji}</h4>
                <h4 className="numberText">{numbers.reading}</h4>
                <h4 className="englishText">{numbers.english}</h4>
                <button onClick={e => updateTranslation(false, props.numbers, numbers._id)}>Update</button>
                <button onClick={e => deleteTranslation(numbers._id)}>Delete</button>
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

