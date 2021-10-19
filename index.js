document.querySelector("#title").addEventListener("click", onClickTitle, false);

function onClickTitle(e) {
  let targetElement = document.querySelector("#mb-center"); // 
  targetElement.innerHTML += "Moby-Dick; or, The Whale is an 1851 novel by American writer Herman Melville. The book is the sailor Ishmael's narrative of the obsessive quest of Ahab, captain of the whaling ship Pequod, for revenge on Moby Dick, the giant white sperm whale that on the ship's previous voyage bit off Ahab's leg at the knee."[el.innerHTML.length] || "";
}

function loadImages(e) {
  let targetElement = document.querySelector("#gallery"); //

  // let image = document.createElement("image");
  // image.src = "_gallery/Important"+ Math.floor(Math.random() * 16 + 1) +"/";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/_gallery/Important"+ Math.floor(Math.random() * 16 + 1), true);
  xhr.responseType = 'document';
  xhr.onload = () => {
    if (xhr.status === 200) {
      var elements = xhr.response.getElementsByTagName("a");
      for (let x of elements) {
        if (x.href.match(/\.(jpe?g|png|gif)$/)) { 
          let img = document.createElement("img");
          img.src = x.href;
          document.querySelector("#gallery").appendChild(img);
        } 
      };
    } 
    else {
      alert('Request failed. Returned status of ' + xhr.status);
    }
  }
  xhr.send()
  
  // targetElement.appendChild(image);
}

loadImages();