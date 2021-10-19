document.querySelector("#title").addEventListener("click", onClickTitle, false);

function onClickTitle(e) {
  let targetElement = document.querySelector("#mb-center"); // 
  targetElement.innerHTML += "Moby-Dick; or, The Whale is an 1851 novel by American writer Herman Melville. The book is the sailor Ishmael's narrative of the obsessive quest of Ahab, captain of the whaling ship Pequod, for revenge on Moby Dick, the giant white sperm whale that on the ship's previous voyage bit off Ahab's leg at the knee."[el.innerHTML.length] || "";
}

function loadImages(e) {
  let targetElement = document.querySelector("#gallery"); //
  let Path = "Important" + Math.floor(Math.random() * 16 + 1);

  fetch("_gallery/manifest.json")
    .then(response => response.json())
    .then(data => {
        for(let x of data[Path]) {
          let img = document.createElement("img");
          img.src = "./_gallery/"+Path+"/"+x;
          targetElement.appendChild(img);
        }
    });
}

loadImages();