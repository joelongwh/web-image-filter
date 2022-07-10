var ogImg = null;
var grayImg = null;
var redImg = null;
var rainbowImg = null;
var blurImg = null;
var colorImg = null;
var canvas = document.getElementById("cvs");
var fileinput;

function loadImage() {
  fileinput = document.getElementById("img");
  ogImg = new SimpleImage(fileinput);
  grayImg = new SimpleImage(fileinput);
  redImg = new SimpleImage(fileinput);
  rainbowImg = new SimpleImage(fileinput);
  blurImg = new SimpleImage(fileinput);
  colorImg = new SimpleImage(fileinput);
  ogImg.drawTo(canvas);
}

function imageIsLoaded(img) {
  if (img == null || ! img.complete()) {
    alert("Image is not loaded");
    return false; 
  }
  else {
    return true; 
  }
}

function filterGray() {
  for (var pixel of grayImg.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }
}

function filterRed() {
  for (var pixel of redImg.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    if (avg < 128) {
      pixel.setRed(avg*2);
      pixel.setGreen(0);
      pixel.setBlue(0);
    }
    else {
      pixel.setRed(255);
      pixel.setGreen(avg*2-255);
      pixel.setBlue(avg*2-255);
    }
  }
}

function filterAnyColor(Rc,Gc,Bc,avg) {
  var R, G, B;
  if (avg < 128) {
    R = Rc/127.5*avg;
    G = Gc/127.5*avg;
    B = Bc/127.5*avg;
  }
  else {
    R = (2-Rc/127.5)*avg + 2*Rc - 255;
    G = (2-Gc/127.5)*avg + 2*Gc - 255;
    B = (2-Bc/127.5)*avg + 2*Bc - 255;
  }
  return [R,G,B];
}

function filterRainbow() {
  var rgb;
  var stripeHeight = rainbowImg.getHeight() / 7;
  
  for (var pixel of rainbowImg.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    var pixelY = pixel.getY();
    
    // Red
    if (pixelY < stripeHeight) {
      rgb = filterAnyColor(255,0,0,avg);
    }
    
    // Orange
    if (pixelY >= stripeHeight && pixelY < stripeHeight*2) {
      rgb = filterAnyColor(255,215,0,avg);
    }
    
    // Yellow
    if (pixelY >= stripeHeight*2 && pixelY < stripeHeight*3) {
      rgb = filterAnyColor(255,255,0,avg);
    }
    
    // Green
    if (pixelY >= stripeHeight*3 && pixelY < stripeHeight*4) {
      rgb = filterAnyColor(0,255,0,avg);
    }
    
    // Blue
    if (pixelY >= stripeHeight*4 && pixelY < stripeHeight*5) {
      rgb = filterAnyColor(0,0,255,avg);
    }
    
    // Indigo
    if (pixelY >= stripeHeight*5 && pixelY < stripeHeight*6) {
      rgb = filterAnyColor(75,0,130,avg);
    }
    
    // Violet
    if (pixelY >= stripeHeight*6 && pixelY < stripeHeight*7) {
      rgb = filterAnyColor(238,130,238,avg);
    }
    
    pixel.setRed(rgb[0]);
    pixel.setGreen(rgb[1]);
    pixel.setBlue(rgb[2]);
  }
}

function newPixelPos(x,y) {
  var max = 10;
  var min = -10;
  var ranX = parseInt(Math.random() * (max - min) + min);
  var ranY = parseInt(Math.random() * (max - min) + min);
  var newX = x + ranX;
  var newY = y + ranY;
  
  if (newX < 0) {
    newX = 0;
  }
  
  if (newY < 0) {
    newY = 0;
  }
  
  if (newX > ogImg.getWidth()-1) {
    newX = ogImg.getWidth()-1;
  }
  
  if (newY > ogImg.getHeight()-1) {
    newY = ogImg.getHeight()-1;
  }
  
  return[newX, newY];
}

function filterBlur() {
  for (var pixel of blurImg.values()) {
    var x = pixel.getX();
    var y = pixel.getY();
    var randomNum = Math.random();
    if (randomNum < 0.5) {
      var ogPixel = ogImg.getPixel(x,y);
      blurImg.setPixel(x,y,ogPixel);
    }
    else {
      var newPos = newPixelPos(x,y);
      var newPixel = ogImg.getPixel(newPos[0], newPos[1]);
      blurImg.setPixel(x,y,newPixel);
    }
  }
}

function filterColor() {
  var redInput = document.getElementById("redSlider");
  var Rc = redInput.value;
  var greenInput = document.getElementById("greenSlider");
  var Gc = greenInput.value;
  var blueInput = document.getElementById("blueSlider");
  var Bc = blueInput.value;
  for (var pixel of colorImg.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    var rgb = filterAnyColor(Rc,Gc,Bc,avg);
    pixel.setRed(rgb[0]);
    pixel.setGreen(rgb[1]);
    pixel.setBlue(rgb[2]);
  }
}

function doGray() {
  if (imageIsLoaded(grayImg)) {
    filterGray();
    grayImg.drawTo(canvas);
  }
}

function doRed() {
  if (imageIsLoaded(redImg)) {
    filterRed();
    redImg.drawTo(canvas);
  }
}

function doRainbow() {
  if (imageIsLoaded(rainbowImg)) {
    filterRainbow();
    rainbowImg.drawTo(canvas);
  }
}

function doBlur() {
  if (imageIsLoaded(blurImg)) {
    filterBlur();
    blurImg.drawTo(canvas);
  }
}

function doColor() {
  if (imageIsLoaded(colorImg)) {
    filterColor();
    colorImg.drawTo(canvas);
  }
}

function reset() {
  if (imageIsLoaded(ogImg)) {
    ogImg.drawTo(canvas);
    grayImg = new SimpleImage(fileinput);
    redImg = new SimpleImage(fileinput);
    rainbowImg = new SimpleImage(fileinput);
    blurImg = new SimpleImage(fileinput);
    colorImg = new SimpleImage(fileinput);
  }
}

function editRed(newValue) {
  document.getElementById("redOutput").value = newValue;
}

function editGreen(newValue) {
  document.getElementById("greenOutput").value = newValue;
}

function editBlue(newValue) {
  document.getElementById("blueOutput").value = newValue;
}