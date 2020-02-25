var $ = $;
var questions = new Map();
var continueMain = true;

async function main()
{
	if(typeof $('.prompt') === "undefined")
	{
		console.log("Jquery not working properly...")
		return;
	}

	var currentQuestion = $('.prompt').childNodes[0].childNodes[0].innerText.replace(/(\r\n|\n|\r)/gm, "");
	console.log("Current Question is:", currentQuestion);

	if(questions.has(currentQuestion))
	{
		console.log('Answer found! Answer is: ', questions.get(currentQuestion));
		// properly answer
		if(await answerRadio(questions.get(currentQuestion)))
		{
			console.log('Radio Certain');
		}
		else if(await answerTexts(questions.get(currentQuestion)))
		{
			console.log('Text Certain');
		}
		else
		{
			console.log('You\'re Certain');
			await requestHelp(questions.get(currentQuestion));
		}
		await delay(750);
		await submitAnswer();
		await delay(750);
		await nextQuestion();
		await delay(750);
	}
	else
	{
		console.log('Answer not found!');
		// guess lmao
		if(await answerRadio(null))
		{
			console.log('Radio Guess');
		}
		else if(await answerTexts(null))
		{
			console.log('Text Guess');
		}
		else
		{
			console.log('You Guess For me!');
			await requestHelp(null);
		}
		await delay(750);
		// then submit the answer
		await submitAnswer();
		await delay(750);
		// open and close the book to stop the warning
		await openCloseBook();
		await delay(750);
		// then store the correct answer
		questions.set(currentQuestion, await getAnswer());
		console.log('Found answer for next time! Answer is: ', questions.get(currentQuestion));
		// move on to the next question
		await nextQuestion();
		await delay(750);
	}
	if(continueMain)
		main();
}

function stop()
{
	continueMain = false;
}

function print()
{
	var i = 1;
	var toPrint = "";
	for(var [question, answers] of questions)
	{
		toPrint += '"' + i + ') ","' + question + '","' + answers + '"\n';
		i ++;
	}
	console.log(toPrint);
}

async function answerRadio(answers)
{
	try {
		await delay(750);
		var found = false;
		for(var choice of document.getElementsByClassName('choice-row'))
		{
			found = true;

			if(answers == null)
			{
				choice.getElementsByClassName('choice-container')[0].click();
				return found;
			}

			for(var answer of answers)
			{
				if(choice.innerText.includes(answer))
				{
					choice.getElementsByClassName('choice-container')[0].click();
				}
			}
		}
		await delay(750);
		return found;
	} catch (e) {
		return false;
	}
}

async function answerTexts(answers)
{
	try {
		var i = 0;
		for(var inputs of $('.prompt').childNodes[0].childNodes[0].childNodes)
		{
			if(inputs.tagName == "INPUT")
			{
				inputs.value = answers != null ? answers[i] : 's';
				i ++;
			}
		}
		confirm("I NEED HELP!");
		await delay(3000);
		return i != 0;
	} catch (e) {
		return false;
	}
}

async function requestHelp(answers)
{
	confirm("I NEED HELP!");

	if(answers != null)
	{
		$('.responses-container').append(JSON.stringify(answers));
	}
	await delay(20000);
}

// submits the answer
async function submitAnswer()
{
	console.log('Submitting Answer');
	$('.btn-confidence').click();
}

// opens and closes the book for funz
async function openCloseBook()
{
	console.log('Opening and Closing book');
	$('.lr-button').click();

	await delay(750);

	for(var button of document.getElementsByClassName('awd-primary-button'))
	{
		if(button.innerText.includes("Back to Questions"))
		{
			button.click();
		}
	}
}

// returns array of answers
async function getAnswer()
{
	var arr = $('.correct-answer-container').innerText.replace('Correct Answer\n', '').replace('Correct Answer', '').split('\n');

	var newArr = [];
	for(var element of arr)
	{
		if(element != "")
			newArr.push(element);
	}
	return newArr;
}

// moves onto next question!
async function nextQuestion()
{
	console.log('Next Question');
	for(var button of document.getElementsByClassName('awd-primary-button'))
	{
		if(button.innerText.includes("Next Question"))
		{
			button.click();
		}
	}
}

function delay(t)
{
	var time = t;
	return (new Promise(function(resolve) {
		setTimeout(function() {
			resolve();
		}, time);
	}));
}