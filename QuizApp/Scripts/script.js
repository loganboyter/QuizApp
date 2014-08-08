var quizApp = {};
quizApp.questions = [];
quizApp.theirAnswers = []
quizApp.currentQuestion = 0;
quizApp.currentAnswer = 0;


quizApp.inputReader = function (locationId, text) {
    if (text||text=="") {
        document.getElementById(locationId).value = text
    } else {
        return document.getElementById(locationId).value
    }
}

quizApp.divWriter = function(locationId, text) {
    document.getElementById(locationId).innerHTML = text;
}

quizApp.setDivDisplay = function (locationId, display) {
    document.getElementById(locationId).style.display = display;
}

quizApp.MultipleChoice = function (question, correctAnswer) {
    "use strict"
    var modifiedArgs =[];
    this.question = question;
    this.correctAnswer = correctAnswer;
    this.possibleAnswers = [];
    for (var i in arguments) {
        modifiedArgs[i] = arguments[i];
    }
    for (i = 0; i < 2; i++) {
        modifiedArgs.shift();
    }
    for (var i in modifiedArgs) {
       this.possibleAnswers[i] = modifiedArgs[i];
    }
    this.possibleAnswers = quizApp.shuffle(this.possibleAnswers);
}

quizApp.FillInTheBlank = function (part1, answer, part2) {
    this.part1 = part1;
    this.correctAnswer = answer;
    this.part2 = part2;
}

quizApp.SelectMoreThanOne = function (question, correctAnswer) {
    var modifiedArgs = [];
    this.question = question;
    this.correctAnswers = [];
    this.possibleAnswers = [];
    this.correctAnswers.push(correctAnswer);
    this.possibleAnswers.push(correctAnswer);

    for (var i in arguments) {
        modifiedArgs[i] = arguments[i];
    }
    for (i = 0; i < 2; i++) {
        modifiedArgs.shift();
    }
    for (var i in modifiedArgs) {
        this.possibleAnswers.push(modifiedArgs[i][0]);
        if (modifiedArgs[i][1] === true) {
            this.correctAnswers.push(modifiedArgs[i][0]);
        }
    }
    this.possibleAnswers = quizApp.shuffle(this.possibleAnswers);
}

quizApp.DragAndDrop = function (word1, word2) {
    var modifiedArgs = [];
    var pairedWords = {};
    this.totalWordList = [];
    pairedWords.word1 = word1;
    pairedWords.word2 = word2;
    this.totalWordList.push(pairedWords);
    for (var i in arguments) {
        modifiedArgs[i] = arguments[i];
    }
    for (i = 0; i < 2; i++) {
        modifiedArgs.shift();
    }
    for (var i in modifiedArgs) {
        var pairedWords2 = {};
        pairedWords2.word1 = modifiedArgs[i][0];
        pairedWords2.word2 = modifiedArgs[i][1];
        this.totalWordList.push(pairedWords2);
    }
}


quizApp.MultipleChoice.prototype.type = "Multiple Choice";
quizApp.FillInTheBlank.prototype.type = "Fill In The Blank";
quizApp.SelectMoreThanOne.prototype.type = "Select More Than One";
quizApp.DragAndDrop.prototype.type = "Drag And Drop";




quizApp.deleteCurrentQuestion = function () {
    quizApp.questions.pop();
    quizApp.currentQuestion--
    quizApp.editQuiz();
}


quizApp.addPossibleAnswer = function (text, text2) {
    var type = quizApp.questions[quizApp.currentQuestion].type;
    if (text) {
        if (type == "Select More Than One" || type == "Multiple Choice") {
            if (quizApp.questions[quizApp.currentQuestion].type == "Select More Than One" && document.getElementById("select-more-correct-answer").checked == true) {
                quizApp.questions[quizApp.currentQuestion].correctAnswers.push(text);
            }
            quizApp.questions[quizApp.currentQuestion].possibleAnswers.push(text);
            quizApp.editQuestion();
        }
        else { // drag and drop (or fill in the blank, but that question type doesn't call this function)
            var newGroup = {};
            newGroup.word1 = text;
            newGroup.word2 = text2;
            quizApp.questions[quizApp.currentQuestion].totalWordList.push(newGroup);
            quizApp.editQuestion();
               
        }
    }
    else { alert("Please enter something!") }
}

quizApp.editQuiz = function (text) {
    //display all question types
    quizApp.setDivDisplay("question-type", "");
    quizApp.setDivDisplay("multiple-choice1", "none");
    quizApp.setDivDisplay("multiple-choice2", "none");
    quizApp.setDivDisplay("fill-blank", "none");
    quizApp.setDivDisplay("select-more1", "none");
    quizApp.setDivDisplay("select-more2", "none");

    quizApp.setDivDisplay("drag-and-drop1", "none");
    quizApp.setDivDisplay("drag-and-drop2", "none");

    //quizApp.setDivDisplay("create-question-button", "none");
    quizApp.currentQuestion = quizApp.questions.length-1;
    $("#quizModal").modal('show');
}



quizApp.showMultipleChoice = function () {
    quizApp.setDivDisplay("question-type", "none");
    quizApp.setDivDisplay("multiple-choice1", "");
    quizApp.inputReader("question-title", "");
    quizApp.inputReader("question-answer", "");
    //quizApp.setDivDisplay("create-question-button", "");
}

quizApp.createMultipleChoice = function () {
    if (quizApp.inputReader("question-title") && quizApp.inputReader("question-answer") && quizApp.inputReader("question-answer")) {
        quizApp.currentQuestion++;
        var newQuestion = new quizApp.MultipleChoice(quizApp.inputReader("question-title"), quizApp.inputReader("question-answer"), quizApp.inputReader("question-answer"));
        quizApp.questions.push(newQuestion);
        quizApp.setDivDisplay("multiple-choice1", "none");
        quizApp.editQuestion();
    }
    else {
        alert("Please make sure all text fields are filled out.");
    }
}

quizApp.editQuestion = function () {
    var holder = "";
    holder += "Question #" + (quizApp.currentQuestion + 1) + ": " + quizApp.questions[quizApp.currentQuestion].question;
    holder += "<div class='well-sm'>Choices:<ul>"
    if (quizApp.questions[quizApp.currentQuestion].type == "Multiple Choice") {
        for (var i in quizApp.questions[quizApp.currentQuestion].possibleAnswers) {
            answerToWrite = quizApp.questions[quizApp.currentQuestion].possibleAnswers[i];
            holder += "<li>" + answerToWrite;
            if (answerToWrite == quizApp.questions[quizApp.currentQuestion].correctAnswer) {
                console.log(answerToWrite);
                holder += " <i class = 'fa fa-check-square' style='color:green'></i>"
            }
            holder += "</li>";
        }
        holder += "</ul></div>";
        quizApp.divWriter("current-question-and-answers", holder);
        quizApp.setDivDisplay("multiple-choice2", "");
    }

    else if (quizApp.questions[quizApp.currentQuestion].type == "Select More Than One") {
        for (var i in quizApp.questions[quizApp.currentQuestion].possibleAnswers) {
            answerToWrite = quizApp.questions[quizApp.currentQuestion].possibleAnswers[i];
            holder += "<li>" + answerToWrite;
            var inside = $.inArray(answerToWrite, quizApp.questions[quizApp.currentQuestion].correctAnswers);
            if (inside!==-1) {
                holder += " <i class = 'fa fa-check-square' style='color:green'></i>"
            }
            holder += "</li>";
        }
        holder += "</ul></div>"
        quizApp.divWriter("current-question-and-answers-multple", holder);
        quizApp.setDivDisplay("select-more2", "");
    }
    else if (quizApp.questions[quizApp.currentQuestion].type == "Drag And Drop") {
        for (var i in quizApp.questions[quizApp.currentQuestion].totalWordList) {
            holder += "<li>" + quizApp.questions[quizApp.currentQuestion].totalWordList[i].word1 + " is paired with " + quizApp.questions[quizApp.currentQuestion].totalWordList[i].word2 + ". </li>";
        }
        holder += "</ul></div>";
        quizApp.divWriter("current-answers-drag", holder);
        quizApp.setDivDisplay("drag-and-drop2", "");

    }
    
}

quizApp.showFillInTheBlank = function () {
    quizApp.setDivDisplay("question-type", "none");
    quizApp.setDivDisplay("fill-blank", "");
    quizApp.inputReader("fill-blank-1", "");
    quizApp.inputReader("fill-blank-answer", "");
    quizApp.inputReader("fill-blank-2", "");
}

quizApp.createFillInTheBlank = function () {
    if (quizApp.inputReader("fill-blank-1") && quizApp.inputReader("fill-blank-answer") && quizApp.inputReader("fill-blank-2")) {
        quizApp.currentQuestion++;
        var newQuestion = new quizApp.FillInTheBlank(quizApp.inputReader("fill-blank-1"), quizApp.inputReader("fill-blank-answer"), quizApp.inputReader("fill-blank-2"));
        quizApp.questions.push(newQuestion);
        quizApp.inputReader("fill-blank-1", "");
        quizApp.inputReader("fill-blank-answer", "");
        quizApp.inputReader("fill-blank-2", "");
        quizApp.editQuiz();
    }
    else {
        alert("Please make sure all text fields are filled out.");
    }
}

quizApp.showSelectMoreThanOne = function () {
    quizApp.setDivDisplay("question-type", "none");
    quizApp.setDivDisplay("select-more1", "");
}

quizApp.createSelectMoreThanOne = function () {
    if (quizApp.inputReader("select-more-question") && quizApp.inputReader("select-more-possible-answer")) {
        quizApp.currentQuestion++;
        var newQuestion = new quizApp.SelectMoreThanOne(quizApp.inputReader("select-more-question"), quizApp.inputReader("select-more-possible-answer"));
        quizApp.questions.push(newQuestion);
        quizApp.inputReader("select-more-question", "");
        quizApp.inputReader("select-more-possible-answer", "");
        document.getElementById("select-more-correct-answer").checked = false;
        quizApp.setDivDisplay("select-more1", "none");
        quizApp.editQuestion();
    }
    else {
        alert("Please make sure all text fields are filled out.");
    }
}

quizApp.showDragAndDrop = function () {
    quizApp.setDivDisplay("question-type", "none");
    quizApp.setDivDisplay("drag-and-drop1", "");
}

quizApp.createDragAndDrop = function () {
    if (quizApp.inputReader("drag-1") && quizApp.inputReader("drag-2")) {
        quizApp.currentQuestion++
        var newQuestion = new quizApp.DragAndDrop(quizApp.inputReader("drag-1"), quizApp.inputReader("drag-2"));
        quizApp.questions.push(newQuestion);
        quizApp.inputReader("drag-1", "");
        quizApp.inputReader("drag-2", "");
        quizApp.setDivDisplay("drag-and-drop1", "none");
        quizApp.editQuestion();
    }
    else {
        alert("Please make sure all the text fields are filled out.");
    }

}


quizApp.beginQuiz = function () {
    //display stuff, shuffle answers, shuffle questions, call quizApp.displayNextQuestion()
    quizApp.currentQuestion = 0;
    for (var i in quizApp.questions) {
        if (quizApp.questions[i].possibleAnswers) {
            quizApp.questions[i].possibleAnswers = quizApp.shuffle(quizApp.questions[i].possibleAnswers);
        }
        if (quizApp.questions[i].totalWordList) {
            quizApp.questions[i].totalWordList = quizApp.shuffle(quizApp.questions[i].totalWordList);
        }
    }
    quizApp.questions = quizApp.shuffle(quizApp.questions);
    quizApp.displayNextQuestion();
}

quizApp.submitAnswer = function () {
    "use strict"
    var numberCorrect = 0, numberIncorrect = 0;
    var s = "";
    var theirNewAnswer = [];
    var correctAnswer = quizApp.questions[quizApp.currentQuestion].corectAnswer;
    if (quizApp.questions[quizApp.currentQuestion].type == "Fill In The Blank") {
        quizApp.currentAnswer = quizApp.inputReader('fill-blank-user-answer');
    }
    theirNewAnswer.push(quizApp.currentAnswer);

    if (quizApp.questions[quizApp.currentQuestion].type === "Select More Than One") {
        for (var j in quizApp.currentAnswer) {
            var inside = $.inArray(quizApp.currentAnswer[j], quizApp.questions[quizApp.currentQuestion].correctAnswers)
            if (inside !== -1) {
                //correct answer
                numberCorrect++;
            }
            else {
                numberIncorrect++;
            }
        }
        //if they missed any
        if (numberIncorrect) {
            if (numberIncorrect > 1) { s = "s" }
            alert("You selected " + numberIncorrect + " wrong answer" + s + ". Sorry.");
            theirNewAnswer.push(false);
        }
        else if (numberCorrect !== quizApp.questions[quizApp.currentQuestion].correctAnswers.length) {
            alert("You only selected " + numberCorrect + "/" + quizApp.questions[quizApp.currentQuestion].correctAnswers.length + " of the correct answers. Sorry.")
            theirNewAnswer.push(false);
        }
        else {
            alert("You got it right. Congratulations!");
            theirNewAnswer.push(true);
        }

    }
    else if (quizApp.questions[quizApp.currentQuestion].type == "Drag And Drop") {
        for (var i in quizApp.currentAnswer) {

            if (quizApp.currentAnswer[i]===undefined||quizApp.currentAnswer[i]===null||quizApp.currentAnswer[i][1] === false) {
                numberIncorrect++
            } else { numberCorrect++ }
        }
        if (numberCorrect !== quizApp.questions[quizApp.currentQuestion].totalWordList.length) {
            alert("You only paired " + numberCorrect + "/" + quizApp.questions[quizApp.currentQuestion].totalWordList.length + " words. Sorry!");
            theirNewAnswer.push(false);
        }
        else {
            alert("You got it right! Yay!");
            theirNewAnswer.push(true);
        }
    }
    else {
        if (quizApp.questions[quizApp.currentQuestion].correctAnswer.split(" ").join("").toLowerCase() === quizApp.currentAnswer.split(" ").join("").toLowerCase()) {
            theirNewAnswer.push(true);
            alert("Correct");
        } else { theirNewAnswer.push(false); alert("Incorrect"); }
    }
    quizApp.theirAnswers.push(theirNewAnswer);
    quizApp.currentQuestion++
    //$("#inner-area").toggle("slide", { direction: "left" });
    quizApp.displayNextQuestion();

}

quizApp.multipleAnswers = function(answer,cb) {
    if(cb.checked === false) {
        for(var i in quizApp.currentAnswer) {
            if(quizApp.currentAnswer[i] == answer) {
                quizApp.currentAnswer.splice(i,1)}
        }
    }
    else {
        quizApp.currentAnswer.push(answer)
    }
    
}


quizApp.displayNextQuestion = function () {
    var holder = "", answerToWrite, totalCorrect, totalIncorrect, percentComplete, draggableWords = [], droppableAreas = [];
    quizApp.currentAnswer = "";
    percentComplete = Math.round(quizApp.currentQuestion / quizApp.questions.length * 100)
    holder += "<div class='progress'><div class='progress-bar' role='progressbar' aria-valuenow='" + quizApp.currentQuestion + "' aria-valuemin='0' aria-valuemax='100' style='width: " + percentComplete + "%;'>" + percentComplete  + "%</div></div>"
    // if there is a next question
    if (quizApp.questions[quizApp.currentQuestion]) {
        // display multiple choice question
        if (quizApp.questions[quizApp.currentQuestion].type == "Multiple Choice") {
            holder += "<div class='well' id='inner-area'>Question #" + (quizApp.currentQuestion + 1) + ": " + quizApp.questions[quizApp.currentQuestion].question + "?";
            holder += "<div class='well-sm'>"
            for (var i in quizApp.questions[quizApp.currentQuestion].possibleAnswers) {
                answerToWrite = quizApp.questions[quizApp.currentQuestion].possibleAnswers[i];
                holder += "<label class='radio-inline'><input type='radio' onclick='quizApp.currentAnswer = \"" + answerToWrite + "\"' name='answers' value='" + answerToWrite + "'>" + answerToWrite + "</label>";
            }
            holder += "</div>";
            
        }
        //display fill in the blank question
        else if (quizApp.questions[quizApp.currentQuestion].type == "Fill In The Blank") {
            holder += "<div class='well' id='inner-area'>Question #" + (quizApp.currentQuestion + 1) + ": Fill in the blank";
            holder += "<div class='well-sm'>";
            holder += "<i class='fa fa-question'></i> " + quizApp.questions[quizApp.currentQuestion].part1 + " <input type='text' id='fill-blank-user-answer'/> " + quizApp.questions[quizApp.currentQuestion].part2;
            holder += "</div>";
        }

        //display multiple answers question
        else if (quizApp.questions[quizApp.currentQuestion].type == "Select More Than One") {
            quizApp.currentAnswer = [];
            holder += "<div class='well' id='inner-area'>Question #" + (quizApp.currentQuestion + 1) + ": " + quizApp.questions[quizApp.currentQuestion].question +"? Select all that apply.";
            holder += "<div class='well-sm'>";
            for (var i in quizApp.questions[quizApp.currentQuestion].possibleAnswers) {
                answerToWrite = quizApp.questions[quizApp.currentQuestion].possibleAnswers[i];
                holder += "<div class='checkbox-inline'><label><input type='checkbox' onclick='quizApp.multipleAnswers(\"" + answerToWrite + "\",this);' name='answers' value='" + answerToWrite + "'>" + answerToWrite + "</label></div>";
            }
            holder += "</div>";

        }

        // display drag and drop question
        else if (quizApp.questions[quizApp.currentQuestion].type == "Drag And Drop") {
            var toMatch;
            var r;
            var tempHolder = [];
            quizApp.currentAnswer = []; // how to store their answers????....get where all the draggables are onsubmit, then see if right or wrong
            holder += "<div class='well' id='inner-area'>Question #" + (quizApp.currentQuestion + 1) + ": Drag each word or phrase to its matching word or phrase.";
            toMatch = quizApp.questions[quizApp.currentQuestion].totalWordList.length;
            holder += "<div class='well-sm' id='draggableBackground'>";
            holder += "<div class='container'><div class='row clearfix'><div class='col-md-4 column' id='first-col'>";


            /*while (toMatch.length) {                 //this doesn't work because changing toMatch changes 
                                                                               //quizApp.questions[quizApp.currentQuestion].totalWordList
                r = quizApp.randomInteger(0, toMatch.length - 1);
                holder += "<div class='well-sm'><div id='drag" + toMatch[r].word1 + "' class='btn btn-success'>" + toMatch[r].word1 + "</div></div>";
                draggableWords.push(toMatch[r].word1);
                toMatch.splice(r, 1);
                alert("Inside the while Loop" + quizApp.questions[quizApp.currentQuestion].totalWordList);

            }*/

            var alreadyR = []
            var hasRHappened = 3;
            for (var i in quizApp.questions[quizApp.currentQuestion].totalWordList) {

                draggableWords.push(quizApp.questions[quizApp.currentQuestion].totalWordList[i].word1.split(" ").join(""))
            }
            for (var i = toMatch; i > 0; i--) {
                while (hasRHappened !== -1) {
                    r = quizApp.randomInteger(0, toMatch - 1);
                    hasRHappened = $.inArray(r, alreadyR);
                }
                alreadyR.push(r)
                tempHolder.push("<div class='well-sm'><div id='drag" + quizApp.questions[quizApp.currentQuestion].totalWordList[r].word1.split(" ").join("") + "' class='btn btn-success'>" + quizApp.questions[quizApp.currentQuestion].totalWordList[r].word1 + "</div></div>");
                hasRHappened = 3;
            }
            tempHolder = quizApp.shuffle(tempHolder)
            tempHolder = tempHolder.join("");
            holder += tempHolder;
            
            

            holder += "</div><div class='col-md-4 column' id='second-col'>"; // this ends the first col-md-4 column div and starts the second one

            for (var i in quizApp.questions[quizApp.currentQuestion].totalWordList) {
                holder += "<div class='well-sm'><div class='btn btn-info' id='dropAreaFor" + quizApp.questions[quizApp.currentQuestion].totalWordList[i].word2.split(" ").join("") + "'>Droppable Area</div></div>";
                droppableAreas.push(quizApp.questions[quizApp.currentQuestion].totalWordList[i].word2.split(" ").join(""));
                //quizApp.questions[quizApp.currentQuestion].totalWordList.word2;     // this is for the paired questions/droppable area
            }

           
            

            holder += "</div><div class='col-md-4 column' id='third-col'>"; //this ends the second col-md-4 column div and starts the third one

            // other words
            //
            //
            for (var i in quizApp.questions[quizApp.currentQuestion].totalWordList) {
                holder += "<div class='well-sm'><div class='btn btn-success'>" + quizApp.questions[quizApp.currentQuestion].totalWordList[i].word2 + "</div></div>";
            }
            
            holder += "</div>";  //not sure what this is for :D


            holder += "</div></div></div>";   // one is for the container, other is for div with id draggableBackground, other is for row clearfix div

        }

        // display other question types


        //always want the submit button
        holder += "<div class='well-lg'><button class='btn btn-primary' class='form-control' onclick='quizApp.submitAnswer();'>Submit</button></div></div>";
        document.getElementById("question-area").innerHTML = holder;

        if (quizApp.questions[quizApp.currentQuestion].type == "Drag And Drop") {
            for (var i in draggableWords) {
                $('#drag' + draggableWords[i]).data("word", draggableWords[i]).data("number", i).draggable({
                    revert: true,
                    containment: "#draggableBackground",
                    stack: "#draggableBackground",
                    start: quizApp.unsetAnswer
                })
            }
            for (var i in droppableAreas) {
                $('#dropAreaFor' + droppableAreas[i]).data("word", droppableAreas[i]).data("number", i).droppable({
                    hoverClass: "hovered",
                    drop: quizApp.handleDropEvent,
                })
            }
        }
    }
    else {
        //end of test stuff
        totalCorrect = 0;
        totalIncorrect = 0;
        for (var i in quizApp.theirAnswers) {
            if (quizApp.theirAnswers[i][1] === true) { totalCorrect++ }
            else {totalIncorrect++}
        }
        holder = "<div class = 'well'>You got " + totalCorrect + "/" + quizApp.questions.length + "(" + Math.round(parseFloat(totalCorrect / quizApp.questions.length) * 100) + "%) correct.";
        holder += "<button class='btn btn-info' onclick='quizApp.quizInfo()'>Click For Detailed Information</button></div>";
        document.getElementById("question-area").innerHTML = holder;
    }
}


quizApp.quizInfo = function () {
    var holder = "<div id='accordion' class='well'>";
    var faCheck = "";
    for (var i in quizApp.questions) {
        if (quizApp.theirAnswers[i][1] === true) {
            faCheck = "<i class= 'fa fa-check-square' style='color:green'></i>";
        }
        else {
            faCheck = "<i class= 'fa fa-exclamation' style='color:red'></i>";
        }
        if (quizApp.questions[i].type === "Multiple Choice") {
            holder += "<div><h3 class='btn btn-primary'>Question # " + (Number(i) + 1) + ": " + quizApp.questions[i].question + faCheck + "</h3></div><div class = 'well-sm'><p><ul>"
            for (var j in quizApp.questions[i].possibleAnswers) {
                faCheck = "";
                if (quizApp.questions[i].possibleAnswers[j] == quizApp.questions[i].correctAnswer) {
                    faCheck = " <i class = 'fa fa-check-square' style='color:green'></i> Correct Answer"
                }
                if (quizApp.questions[i].possibleAnswers[j] == quizApp.theirAnswers[i][0]) {
                    faCheck += " <i class = 'fa fa-arrow-left' style='color:blue'></i> Your Answer"
                }
                holder += "<li>" + quizApp.questions[i].possibleAnswers[j] + faCheck + "</li>";
            }
            holder += "</ul></p></div>";

        }
        else if (quizApp.questions[i].type === "Fill In The Blank") {
            holder += "<div><h3 class='btn btn-primary'>Question # " + (Number(i) + 1) + ": Fill In The Blank " + faCheck + "</h3></div><div class='well-sm'><p>";
            holder += quizApp.questions[i].part1 + " <span style='color:green'><strong>" + quizApp.questions[i].correctAnswer + "</strong></span> " + quizApp.questions[i].part2;
            if (quizApp.theirAnswers[i][1] === false) {
                faCheck = "<span style = 'color:red'>";
            }
            else {
                faCheck = "<span style = 'color:green'>";
            }
            holder += "Your answer: " + faCheck + quizApp.theirAnswers[i][0] + "</span>";
            holder += "</p></div>";
        }
        else if (quizApp.questions[i].type === "Select More Than One") {
            holder += "<div><h3 class='btn btn-primary'>Question # " + (Number(i)+1) + ": " + quizApp.questions[i].question + "? Select all that apply. " + faCheck + "</h3></div><div class='well-sm'><p><ul>"
            for (var j in quizApp.questions[i].possibleAnswers) {
                faCheck = "";
                if ($.inArray(quizApp.questions[i].possibleAnswers[j], quizApp.questions[i].correctAnswers) !== -1) {
                    faCheck = " <i class= 'fa fa-check-square' style='color:green'></i> Correct Answer";
                }
                if($.inArray(quizApp.questions[i].possibleAnswers[j],quizApp.theirAnswers[i][0]) !== -1) {
                    faCheck += " <i class = 'fa fa-arrow-left' style='color:blue'></i> Your Answer"
                }
                holder += "<li>" + quizApp.questions[i].possibleAnswers[j] + faCheck + "</li>";
            }
            holder += "</ul></p></div>";
        }
        else if (quizApp.questions[i].type === "Drag And Drop") {
            holder += "<div><h3 class='btn btn-primary'>Question # " + (Number(i) + 1) + ": Drag and drop." + faCheck + "</h3></div><div class='well-sm'><p><div class='container'><div class='row clearfix'><div class='col-md-3 column'>Correct Answers:<ul>"
            for (var j in quizApp.questions[i].totalWordList) {
                holder += "<li>"+quizApp.questions[i].totalWordList[j].word1 + " is paired with " + quizApp.questions[i].totalWordList[j].word2+"</li>";
            }
            holder += "</ul></div><div class='col-md-3 column'>Your answers:<ul>" // first col-md-3 column div
            for (var j in quizApp.theirAnswers[i][0]) {
                faCheck = "";
                if (quizApp.theirAnswers[i][0][j][1] === false) {
                    faCheck = "<span style='color:red'>";
                }
                else {
                    faCheck = "<span style='color:green'>";
                }
                holder += "<li>" + faCheck + "You paired " + quizApp.theirAnswers[i][0][j][0] + " with " + quizApp.theirAnswers[i][0][j][2] + "</span></li>"
            }          
            holder += "</ul></div></div></div></p></div>";
        }
    }
    holder+="</div>" // accordion div 
    quizApp.divWriter('question-area', holder);
    $("#accordion").accordion({
        collapsible: true,
        heightStyle: "content",
        active: false
    });
    
}


quizApp.handleDropEvent = function (event, ui) {
    var newArray = [];
    ui.draggable.data('pair', $(this).attr('id'));
    ui.draggable.position({ of: $(this), my: 'center top', at: 'center top' }); // position the dragged word in the center of the droppable area
    ui.draggable.draggable('option', 'revert', false); // make it so the dragged word doesn't revert anymore
    $(this).droppable("disable");                       // make it so they can only drop one word in
    newArray.push(ui.draggable.data('word'));
    if ($(this).data('number') === ui.draggable.data('number')) {
        newArray.push(true);
    }
    else { newArray.push(false) }
    newArray.push($(this).data('word'));
    quizApp.currentAnswer[$(this).data('number')] = newArray;
}

quizApp.unsetAnswer = function (event, ui) {
    if ($(this).data('pair')) {
        $("#"+$(this).data('pair')).droppable("enable");
        quizApp.currentAnswer[$("#" + $(this).data('pair')).data('number')] = null;
        $(this).data('pair',null)
    }

}


quizApp.shuffle = function(array,array2) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

quizApp.randomInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


quizApp.seed = function () {
    "use strict"
    var newQuestion = new quizApp.MultipleChoice("Test", "Answer", "Pie", "Okay", "Nahhhh", "Answer");
    quizApp.questions.push(newQuestion);
    newQuestion = new quizApp.FillInTheBlank("Fill in", "the", "blank.");
    quizApp.questions.push(newQuestion);
    newQuestion = new quizApp.FillInTheBlank("Another", "blank", "to fill.");
    quizApp.questions.push(newQuestion);
    newQuestion = new quizApp.SelectMoreThanOne("Multiple Options", "Answer",["Wrong Answer",false],["Answer2",true],["Answer3",true],["Wrong Answer2",false],["Wrong Answer3",false]);
    quizApp.questions.push(newQuestion);
    newQuestion = new quizApp.DragAndDrop("One", "A",["Two","B"],["Three","C"],["Four","D"]);
    quizApp.questions.push(newQuestion);

}


quizApp.seed();