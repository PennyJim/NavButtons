// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
'use strict';

//Variables to change for different websites
let ReaderRegex = /comics\/.*\/\d+/
let doMouseButton = true
let doArrowKeys = true
let getButtons = () => {
	return [
        document.querySelector(".nav-buttons div:nth-child(1) a"),
        document.querySelector(".nav-buttons div:nth-child(2) a")
    ];
}

let func = (doMouseButton, doArrowKeys, getButtons, ReaderRegex) => {
	//Get back/next buttons
    let [backBtn, nextBtn] = getButtons();
	console.log(backBtn, nextBtn);

	//Make button handlers
	let pressNextBtn = (nextBtn !== null) ? () => nextBtn.click() : () =>
		{
			console.warn("No next chapter");
			swal("Missing Button", "No next chapter button was found.", "error");
		};
	let pressBackBtn = (backBtn !== null) ? () => backBtn.click() : () =>
		{
			console.warn("No previous chapter");
			swal("Missing Button", "No previous chapter button was found.", "error");
		};

	//Add key listener
	if (doArrowKeys) document.addEventListener('keyup', (e) => {
		try {
			if (e.code === "ArrowRight") pressNextBtn();
			else if (e.code === "ArrowLeft") pressBackBtn();
		}
		catch (e) { console.warn(e); }
	});
	//Add Mouse Button Listener
	if (doMouseButton) document.addEventListener('DOMMouseScroll', (e) => {
		try {
			if (e.detail === 1) pressNextBtn();
			else if (e.detail === -1) pressBackBtn();
		}
		catch (e) { console.warn(e); }
	});
}