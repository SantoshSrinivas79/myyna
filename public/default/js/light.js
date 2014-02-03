// light specific js

function jFadeInit(){
	// jFade init
	jQuery(".post").jFade({
		trigger: "mouseover",
		property: 'background',
		start: 'ffffff',
		end: 'eeeeee',
		steps: 8,
		duration: 8
	}).jFade({
		trigger: "mouseout",
		property: 'background',
		start: 'eeeeee',
		end: 'ffffff',
		steps: 8,
		duration: 8
	});
}