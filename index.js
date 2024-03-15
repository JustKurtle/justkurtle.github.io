addEventListener("load", async e => {
    document.querySelector(".gallery-title").addEventListener("click", async e => {
        let galleryContent = document.querySelector(".gallery-content");
        galleryContent.innerHTML = "";

        let gallery = load_images("./gallery/Important"+Math.floor(Math.random() * 17 + 1),
            images => {
                let i = images.length;
                while(i--) {
                    images[i].className = "gallery-img";
                    galleryContent.appendChild(images[i]);
                }
            });
    }, false);
}, false);

/**
 * Loads all images from a folder and returns them
 * @param {string} folder_url the folder to load images from
 * @returns {Array<HTMLImageElement>}
 */
async function load_images(folder_url, after_load_callback) {
    let request = new XMLHttpRequest();
    request.open("GET", folder_url, true);
    request.responseType = 'document';

    let images = [];

    request.onload = _ => {
        if(request.status === 200) { // HTML status 200 OK
            let elements = request.response.getElementsByTagName("a");
            for(let a of elements) {
                if(a.href.match(/\.(jpe?g|png|gif|jfif)$/)) { 
                    let img = new Image(); // create a new image
                    img.src = a.href; // the url of the file
                    images.push(img); // put the image into the array
                } 
            }
        } else {
            throw('Request failed. Returned status of ' + request.status);
        }
        after_load_callback(images);
    };

    request.send();
    return images;
}
