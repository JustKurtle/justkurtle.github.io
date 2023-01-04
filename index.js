addEventListener("load", async e => {
  let gallery;

  fetch("gallery/manifest.json")
    .then(response => response.json())
    .then(data => gallery = data);
    
  document.querySelector(".gallery-title").addEventListener("click", loadImages, false);
  document.querySelector(".title").addEventListener("click", onClickTitle, false);

  function onClickTitle(e) {
    let targetElement = document.querySelector(".mb-center"); // 
    targetElement.innerHTML += moby[targetElement.innerHTML.length] || "";
  }

  function loadImages(e) {
    let targetElement = document.querySelector(".gallery-content"); //
    let Path = "Important" + Math.floor(Math.random() * 16 + 1);

    targetElement.innerHTML = "";

    for(let x of gallery[Path]) {
      let img = document.createElement("img");
      img.className = "gallery-img";
      img.src = "./gallery/"+Path+"/"+x;
      targetElement.appendChild(img);
    }
  }
  setTimeout(loadImages, 50);
}, false);