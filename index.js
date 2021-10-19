document.querySelector("#title").addEventListener("click", onClickTitle, false);

function onClickTitle(e) {
  let targetElement = document.querySelector("#mb-center"); // 
  targetElement.innerHTML += "Moby-Dick; or, The Whale is an 1851 novel by American writer Herman Melville. The book is the sailor Ishmael's narrative of the obsessive quest of Ahab, captain of the whaling ship Pequod, for revenge on Moby Dick, the giant white sperm whale that on the ship's previous voyage bit off Ahab's leg at the knee."[el.innerHTML.length] || "";
}

function loadImages(e) {
  let targetElement = document.querySelector("#gallery"); //

  var request = new XMLHttpRequest();
  request.addEventListener("load", onLoad, true);
  request.addEventListener("fail", onFail, true);
  request.open("GET", "./_gallery/Important"+ Math.floor(Math.random() * 16 + 1), true);
  request.responseType = 'document';
  request.send();

  function onLoad() {
    var elements = request.response.getElementsByTagName("a");
    for (let x of elements) {
      if (x.href.match(/\.(jpe?g|png|gif)$/)) { 
        let img = document.createElement("img");
        x.href.replace("https://magnumshart.com/", "");
        img.src = x.href;
        targetElement.appendChild(img);
        console.log(x.href);
      } 
    };
  }

  function onFail() {  
    alert('Request failed. Returned status of ' + request.status);
  }
}

loadImages();