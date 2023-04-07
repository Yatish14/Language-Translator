const selectCountry = document.querySelectorAll("select"),
      icons = document.querySelectorAll(".row i"),
    fromText = document.querySelector(".from-text"),
    toText = document.querySelector(".to-text"),
    exchangeIcon = document.querySelector(".exchange"),
    translationBtn = document.querySelector("button");

// selectCountry = [fromLocation,toLocation]
selectCountry.forEach((tag, id) => {
    for (const countryCode in countries)
    {
        let selected;
        //Default fromLocation is English and toLocation is Telugu
        if (id == 0 && countryCode == "en-GB")
        {
            selected = "selected";
        }
        else if(id == 1 && countryCode == "te-IN")
        {
            selected = "selected"
        }

        //Giving all the supported countries present in countries.js as options to the select tag
        let option = `<option value=${countryCode} ${selected}>${countries[countryCode]}</option>`
        tag.insertAdjacentHTML("beforeend", option);
    }
});

exchangeIcon.addEventListener("click", () => {

    //Swapping the fromText and toText
    let temp = fromText.value;
    fromText.value = toText.value;
    toText.value = temp;

    //Swapping the fromLocation and toLocation
    tempLang = selectCountry[0].value;
    selectCountry[0].value = selectCountry[1].value;
    selectCountry[1].value = tempLang;
});

translationBtn.addEventListener("click", () => {
    let text = fromText.value,
        translateFrom = selectCountry[0].value,
        translateTo = selectCountry[1].value;

    //if textarea is empty we will not fetch any data
    if (!text) return;

    //we will display transalting... while the data is being fetched
    toText.setAttribute("placeholder", "Translating....")
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`
    fetch(apiUrl).then(res => res.json()).then(data =>{
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");
    })
});

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains("fa-copy"))
        {
            if (target.id == "from")
            {
                //if the button clicked is from copy then we will copy the fromText to clipboard
                navigator.clipboard.writeText(fromText.value);
            }
            else
            {
                //if the button clicked is to copy then we will copy the toText to clipboard
                navigator.clipboard.writeText(toText.value);
            }
        }
        else
        {
            let utterance;
            //if the button clicked is fromVoice
            if (target.id == "from")
            {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectCountry[0].value;
            }
            //if the button clicked is toVoice
            else
            {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectCountry[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    })
})