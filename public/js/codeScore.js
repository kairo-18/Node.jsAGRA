
let lang = {
    java: {
        func: /(?<=^|s*)(class|static|int|factorial|int|n|if|n|0|return|1|else|return|n|factorial|n|1|public|static|void|main|String|args|int|i|fact|1|int|number|4|It|is|the|number|to|calculate|factorial|fact|factorial|number|System|out|println|Factorial|of|number|is|fact(?!s*=)|main)(?=\b)/g,
        decl: /(?<=^|\s*)(int|String|double|boolean|char|float|long|short|byte|void)/g,
        pare: /(\(|\))/g,
        squa: /(\[|\])/g,
        curl: /(\{|\})/g,
    }
};

var givenCode = `public class myClass{
	public static void main(String[] args){
		System.out.println("Hello World!");
	}
}`;


let score = 0;

let scoreText = document.getElementById("score");  //get the score element

let keywords = uniq(extractKeywords(givenCode));

let uniqueId = 0;

//create a function that will extract keywords from the given code
function extractKeywords(code) {
    //split the code into words
    let words = code.split(/\s+|(?<=[^\w\s])|(?=[^\w\s])/g).filter(Boolean);

    return removeNonWords(words);
}

function removeNonWords(arr) {
    const wordPattern = /[\w']+(!)?/g;

    const wordsOnly = arr.join(' ').match(wordPattern) || [];

    return wordsOnly;
}

function updateFuncRegex() {
    let regex = "(?<=^|\s*)(";

    let regexEnd = "(?!\s*\=)|main)(?=\\b)";

    let result = "" + regex;

    let keywords = extractKeywords(givenCode);

    keywords.forEach((keyword, index) => {
        if (index === keywords.length - 1) {
            result += keyword + regexEnd;
        } else {
            result += keyword + "|";
        }
    });

    lang.java.func = new RegExp(result, "g");

}



const highLite = el => {
    const dataLang = el.dataset.lang; // Detect "js", "html", "py", "bash", ...
    const langObj = lang[dataLang]; // Extract object from lang regexes dictionary
    let html = el.innerHTML;

    Object.keys(langObj).forEach(function (key) {
        html = html.replace(langObj[key], `<i class="correct ${dataLang}_${key}">$1</i>`);
    });
    el.previousElementSibling.innerHTML = html; // Finally, show highlights!
};

const codeInput = document.querySelector(".highLite_editable");
codeInput.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
        e.preventDefault();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0"); // Insert four non-breaking spaces for each tab
        range.insertNode(tabNode);
        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);
        selection.removeAllRanges();
        selection.addRange(range);
        highLite(el); // Init!
    }
});



const editors = document.querySelectorAll(".highLite_editable");
editors.forEach(el => {
    el.contentEditable = true;
    el.spellcheck = false;
    el.autocorrect = "off";
    el.autocapitalize = "off";
    el.addEventListener("input", () => {
        highLite(el);

        let number = document.getElementById("number");
        const inputText = codeInput.textContent;
        const inputWords = inputText
            .split(/\s+/)
            .filter((word) => word.trim() !== "");

        inputWords.forEach((word, index) => {
            if (keywords.includes(word)) {
                let i = document.querySelector('.correct:last-child');
                if (i != null) {
                    i.id = "i" + uniqueId;

                    let wordIndex = keywords.indexOf(word);
                    keywords.splice(wordIndex, 1); // Delete the matched keyword

                    score++;
                    scoreText.textContent = "Score = " + score;


                    var offsets = document
                        .getElementById(`i${uniqueId}`)
                        .getBoundingClientRect();
                    var top = offsets.top;
                    var left = offsets.left;

                    number.classList.add("plus-one");
                    number.innerText = "+1";
                    number.style.left = left + "px";
                    document.documentElement.style.setProperty(
                        "--my-start-top",
                        top - 300 + "px"
                    );

                    document.documentElement.style.setProperty(
                        "--my-start-end",
                        top - 500 + "px"
                    );
                    number.classList.remove("hidden");
                    setTimeout(() => {
                        number.classList.remove("plus-one");
                        number.classList.remove("minus-one");
                        number.classList.add("hidden");
                    }, 500);

                    uniqueId++;

                }
            }
        });




    });
    highLite(el); // Init!
});

const submitBtn = document.querySelector("#Submit");
submitBtn.addEventListener("click", () => {
    givenCode = document.querySelector("#code").value;
    keywords = extractKeywords(givenCode);
    updateFuncRegex();
    alert("Code submitted")
});

function uniq(a) {
    var seen = {};
    return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function changeHiddenInput() {
    document.getElementById("givenCodeValue").value = document.querySelector("#code").value;
    console.log(document.getElementById("givenCodeValue").innerHTML);
}
