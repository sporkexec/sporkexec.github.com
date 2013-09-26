function loadHiResImages() {
	var ratio = window.devicePixelRatio || 1;
	if     (ratio <  1.5) return;
	else if(ratio >= 3.0) ratio = '@3x';
	else if(ratio >= 2.0) ratio = '@2x';
	else if(ratio >= 1.5) ratio = '@1.5';

	var images = document.querySelectorAll('img.hires');
	for(var i=0; i < images.length; i++) {
		var url = images[i].src;
		var extPos = url.lastIndexOf('.');
		url = url.substring(0, extPos) + ratio + url.substring(extPos);
		images[i].src = url;
	}
}

function getGreeting() {
	var hour = (new Date()).getHours();
	if     (hour >= 21) return "Hey there!";
	else if(hour >= 16) return "Good evening!";
	else if(hour >= 12) return "Good afternoon!";
	else if(hour >=  8) return "Good morning!";
	else if(hour >=  6) return "Rise and shine!";
	else if(hour >=  2) return "Don't you ever sleep? Hi,";
	else                return "Hey there!";
}

function renderGreeting() {
	var greet = document.querySelector('body.about .greeting');
	if(greet) {
		greet.innerText = getGreeting();
	}
}

function swipeSlider() {
	var swipeElement = document.getElementById('slider');
	if(swipeElement) {
		swipeElement.style.visibility = 'hidden'; // See the commented bit in common.less about this.
		var swipeObj = Swipe(swipeElement);

		document.querySelector('#slider > .prev').onclick = swipeObj.prev;
		document.querySelector('#slider > .next').onclick = swipeObj.next;

		var oldFunc = document.onkeyup || function(){ return true; };
		document.onkeyup = function(e) {
			var keycode = e.keyCode || e.which;
			if(keycode == 37) { // Left
				swipeObj.prev();
			} else if(keycode == 39) { // Right
				swipeObj.next();
			}
			return oldFunc(e);
		}
	}
}

window.onload = function() {
	loadHiResImages();
	renderGreeting();
	swipeSlider();
};
