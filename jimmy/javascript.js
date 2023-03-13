var sound = document.querySelector("#boom");
var img = document.querySelector("img.image");

img.onanimationiteration = function() {
	// sound.currentTime = 0;
	// sound.play();
}

window.onkeydown = function(event) {
	if(event.code == "KeyA") {
		sound.volume-=0.1;
	}
}

console.log("loaded");

sound.play()
	.catch(e => alert("enable autoplay!"));