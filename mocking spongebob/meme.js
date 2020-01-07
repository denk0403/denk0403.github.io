let canvas = document.getElementById("output");
let ctx = canvas.getContext('2d');
let img = document.getElementById("meme");
let mirror = document.getElementById("mirror");
let input = document.getElementById("caption");

input.oninput = (event) => {
    drawMeme(event.currentTarget.value.trim());
    var dataURL = canvas.toDataURL('image/png');
    mirror.src = dataURL;
}

input.onkeydown = (event) => {
    if(event.keyCode == 13) {
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
    return Math.min(Math.floor(75 - 1.5*xLength), 
                    100 / lines.length);
}

function setFont(str) {
    str = splitUp(str);
    let length = str.length;

    let size = getFontSize(str);

    ctx.textAlign = "center";
    ctx.lineWidth = getFontSize(str)/8;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    ctx.font = `${size}px Arial`
    return str;
}

function drawMeme(str) {
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
