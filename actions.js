// ################################################ SETTINGS ################################################

const speakerHighlighting = true;			// toggle speaker highlighting here

// the settings below only apply if speaker highlighting is set to 'true'

const showItemsOutsideHighlight = false;	// set this to 'true' if you would like lines outside the highlight to be shown
const showNextLine = true;					// set this to 'true' if you would like the line after the highlight to be shown (only applies if the previous setting is set to 'false')
const opacityOfItemsOutsideHighlight = 0.4;	// adjust the opacity of lines outside the highlight here
const opacityOfActions = 1;					// adjust the opacity of actions here
const useBlurEffect = true;					// toggle blur effect here
const blurEffectRadius = 0.5;					// adjust blur effect radius here

// ############################################################################################################

let linesAndActions;
let followingActions;
let lineIndex = 0;

window.onload = function () // runs as soon as the page loads
{
	linesAndActions = document.querySelectorAll("line,action"); // gets all 'line' and 'action' elements
	linesAndActions[lineIndex].scrollIntoView({ behavior: "smooth" }); // scrolls to the first line/action
	updateEffects();
}

document.addEventListener("keydown", (event) => { // runs whenever a key is pressed
	let validKeyPressed = false;
	if (event.key === 'ArrowRight') { // if the right arrow key is pressed
		validKeyPressed = true;
		do // skips over action elements
		{
			lineIndex++;
		}
		while (linesAndActions[lineIndex] != null && linesAndActions[lineIndex].tagName === "ACTION");
	}
	else if (event.key === 'ArrowLeft') { // if the left arrow key is pressed
		validKeyPressed = true;
		do // skips over action elements
		{
			lineIndex--;
		}
		while (linesAndActions[lineIndex] != null && linesAndActions[lineIndex].tagName === "ACTION");
	}

	if (validKeyPressed === true) // only if one if the previous keys is pressed
	{
		lineIndex = clamp(lineIndex, 0, linesAndActions.length - 1); // keeps the line index from going outside the bounds of the array

		linesAndActions[lineIndex].scrollIntoView({ behavior: "smooth" }); // scrolls to the current line
		updateEffects();
	}
});

function updateEffects()
{
	if (!speakerHighlighting)
	{
		return;
		// this method will not be run if speaker highlighting is off
	}
	
	// updates the number of actions following the current line
	followingActions = 0;
	while (linesAndActions[lineIndex + 1 + followingActions] != null && linesAndActions[lineIndex + 1 + followingActions].tagName === "ACTION")
	{
		followingActions++;
	}
	
	for (let i = 0; i < linesAndActions.length; i++) // runs the following code as many times as there are lines/actions
	{		
		let blurAmount;
		let opacityAmount;
		
		if (i === lineIndex) // for the current line
		{
			blurAmount = "0";
			opacityAmount = 1;
		}
		else if (i > lineIndex && i <= lineIndex + followingActions) // for any following actions
		{
			blurAmount = "0";
			opacityAmount = opacityOfActions;
		}
		else if (i === lineIndex + followingActions + 1) // for the next line (after following actions)
		{
			blurAmount = "0";
			opacityAmount = opacityOfItemsOutsideHighlight;
		}
		else // for any other lines and/or actions
		{
			if (showItemsOutsideHighlight) // if items outside the highlight are being shown
			{
				if (linesAndActions[i].tagName === "ACTION") // for 'action' elements
				{
					blurAmount = "0"
					opacityAmount = opacityOfItemsOutsideHighlight * opacityOfActions;
				}
				else // for 'line' elements (or anything that's not an action)
				{
					blurAmount = "0"
					opacityAmount = opacityOfItemsOutsideHighlight;
				}
			}
			else // if items outside the highlight are not being shown
			{
				blurAmount = blurEffectRadius + "vh"
				opacityAmount = 0;
			}
		}
		
		// assigns the style to the item
		if (useBlurEffect)
		{
			linesAndActions[i].style.filter = "blur(" + blurAmount + ")"
		}
		linesAndActions[i].style.opacity = opacityAmount;
	}
}

function clamp(value, min, max)
{
	if (value < min)
	{
		value = min;
	}
	else if (value > max)
	{
		value = max;
	}
	return value;
}
