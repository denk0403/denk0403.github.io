let canvas = document.getElementById("output");
let ctx = canvas.getContext('2d');
let img = document.getElementById("meme");
let mirror = document.getElementById("mirror");
let input = document.getElementById("caption");
let imagein = document.getElementById("imagein");
let upload = document.getElementById("upload");
let reader = new FileReader();

document.getElementById("title").onclick = () => {
    location.replace(`${location.origin}${location.pathname}`);
}

let processHash = (hash) => {
    if (hash) {
        if (hash.indexOf("data:image/") > -1 && hash.indexOf(";base64,") > -1) {
            document.getElementById("imageinRadio").checked = true;
            updateMode();
            upload.src = hash.slice(1);
        } else {
            document.getElementById("captionRadio").checked = true;
            updateMode();
            input.value = hash.slice(1).split("%20").join(" ");
            drawMemeText(input.value);
            repaint();
        }
    }
}

window.onload = () => {
    processHash(location.hash);
}

window.onhashchange = () => {
    processHash(location.hash)
}

input.oninput = (event) => {
    location.replace(`${location.origin}${location.pathname}#${event.currentTarget.value.trim()}`);
}

input.onkeydown = (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();
    }
}

function splitUp(str) {
    const maxLength = 20;
    let result = "";

    if (str.length > maxLength) {
        let lineCount = Math.floor(str.length / maxLength) + 1;
        let breakPoint = str.length / lineCount;
        let counter = 0;
        for (let c of str) {
            result += c;
            counter += 1;
            if (counter >= breakPoint && c === " ") {
                result += "\n";
                counter = 0;
            }
        }
    }
    return result || str;
}

function getFontSize(str) {
    let lines = str.split("\n");
    let xLength = lines.reduce((prev, cur) => Math.max(prev, cur.length), lines[0].length);
    return Math.min(Math.floor(75 - 1.5 * xLength),
        100 / lines.length);
}

function setFont(str) {
    str = splitUp(str);

    let size = getFontSize(str);

    ctx.textAlign = "center";
    ctx.lineWidth = getFontSize(str) / 8;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    ctx.font = `${size}px Arial`
    return str;
}

function drawMemeText(str) {
    let xloc = canvas.width / 2;

    str = altText(str);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    str = setFont(str);

    let lines = str.split('\n');
    let lineheight = getFontSize(str);

    yloc = img.height - ((lines.length - 1) * lineheight) - 20;

    for (let i = 0; i < lines.length; i++) {
        ctx.strokeText(lines[i], xloc, yloc + (i * lineheight));
        ctx.fillText(lines[i], xloc, yloc + (i * lineheight));
    }
}

function altText(str) {
    let result = "";
    let lower = true;
    for (let c of str) {
        result += lower ? c.toLowerCase() : c.toUpperCase();
        if (c.match(/[a-z]/i))
            lower = !lower;
    }
    return result;
}

reader.onload = function () {
    var dataURL = reader.result;
    location.replace(`${location.origin}${location.pathname}#${dataURL}`);
};

upload.onload = (event) => {
    drawMemeImage();
    repaint();
}

function drawMemeImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    let newHeight = 105;
    let scale = newHeight / upload.height;
    let newWidth = upload.width * scale;
    ctx.drawImage(upload, 250 - (newWidth / 2), canvas.height - 5 - newHeight, newWidth, newHeight);
}

function repaint() {
    var dataURL = canvas.toDataURL('image/png');
    mirror.src = dataURL;
}

imagein.onchange = (event) => {
    console.log(imagein.files[0])
    if (imagein.files[0]) {
        reader.readAsDataURL(imagein.files[0]);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        repaint();
    }
}

function updateMode() {
    var modes = document.getElementsByName('mode');

    for (i = 0; i < modes.length; i++) {
        if (modes[i].checked) {
            document.getElementById(modes[i].value).style.display = "initial";
        } else {
            document.getElementById(modes[i].value).style.display = "none";
        }
    }
}


