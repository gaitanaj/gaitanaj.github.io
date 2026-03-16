let state = "menu";
let scans = [];
let panelOpen = false;
let selectedScan = null;
let panelAlpha = 0;
let grainDensity = 10000;

// Loading screen variables
let loadingTimer = 0;
let loadingDuration = 180;
let nextCity = null;

// Global menu spacing — change this one number to adjust city spread
let menuSpacing = 150;

// Glow colors per scan
const glowColors = ["#FF69B4", "#00BFFF", "#7FFF00"];

// Typewriter variables
let typewriterIndex = 0;
let typewriterTimer = 0;
let typewriterSpeed = 2; // frames per character — lower = faster

// City scans
const cityScans = {
  copenhagen: [
    {img: "scans/scan1.JPG", location: "Nørrebro kiosk", date: "March 2026"},
    {img: "scans/scan2.JPG", location: "Vesterbro newsstand", date: "Feb 2026"},
    {img: "scans/scan3.JPG", location: "Central station shop", date: "Jan 2026"},
    {img: "scans/scan4.JPG", location: "Central station shop", date: "Jan 2026"},
    {img: "scans/scan5.JPG", location: "Central station shop", date: "Jan 2026"},
  ],
  prague: [
    {img: "pscans/pscan1.JPG", location: "Old Town Square", date: "March 2026"},
    {img: "pscans/pscan2.JPG", location: "Charles Bridge", date: "Feb 2026"},
    {img: "pscans/pscan3.JPG", location: "Prague Castle", date: "Jan 2026"},
  ]
};

// ---- Scan class ----
class Scan {
  constructor(imgPath, location, date){
    this.img = loadImage(imgPath);
    this.x = random(window.innerWidth);
    this.y = random(window.innerHeight);
    this.vx = random(-0.05, 0.05);
    this.vy = random(-0.05, 0.05);
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.z = random(0.7, 1.3);
    this.baseSize = random(60, 90) * this.z;
    this.size = this.baseSize;
    this.location = location;
    this.date = date;
    this.glowColor = random(glowColors);
  }

  move(){
    this.x += this.vx + map(noise(this.noiseOffsetX),0,1,-0.2,0.2);
    this.y += this.vy + map(noise(this.noiseOffsetY),0,1,-0.2,0.2);
    this.noiseOffsetX += 0.01;
    this.noiseOffsetY += 0.01;
    if(this.x < 0 || this.x > width) this.vx *= -1;
    if(this.y < 0 || this.y > height) this.vy *= -1;
  }

  display(){
    let d = dist(mouseX, mouseY, this.x, this.y);
    let targetSize = d < this.baseSize ? this.baseSize * 1.5 : this.baseSize;
    this.size = lerp(this.size, targetSize, 0.05);
    push();
    translate(this.x, this.y);
    if(d < this.size){
      drawingContext.shadowBlur = 30;
      drawingContext.shadowColor = this.glowColor;
    } else {
      drawingContext.shadowBlur = 15;
      drawingContext.shadowColor = "rgba(0,0,0,0.1)";
    }
    imageMode(CENTER);
    image(this.img,0,0,this.size,this.size);
    pop();
  }
}

// ---- Setup ----
function setup(){
  createCanvas(window.innerWidth, window.innerHeight);
  textAlign(CENTER, CENTER);
  textFont('Space Mono');
  textStyle(NORMAL);
}

// ---- Draw grain ----
function drawGrain(){
  noStroke();
  fill(0, 60);
  for(let i=0;i<grainDensity;i++){
    let gx = random(width);
    let gy = random(height);
    rect(gx, gy, 1, 1);
  }
}

// ---- Draw ----
function draw(){
  background(255);
  drawGrain();

  if(state === "menu") drawMenu();
  else if(state === "loading") drawLoading();
  else drawCityWorld();
}

// ---- Menu ----
function drawMenu(){
  let centerY = height/2;
  let centerX = width/2;
  let cityY = centerY + 40;

  // SCAN ARCHIVE — only this is bold
  textSize(80);
  fill(0);
  textStyle(BOLD);
  text("SCAN ARCHIVE", centerX, centerY - 50);

  // City names — normal weight, spread using menuSpacing
  textSize(40);
  textStyle(NORMAL);

  // Copenhagen
  let copenhagenX = centerX - menuSpacing;
  let dC = dist(mouseX, mouseY, copenhagenX, cityY);
  push();
  drawingContext.shadowBlur = dC < 100 ? 30 : 18;
  drawingContext.shadowColor = "#00eeff";
  fill(dC < 100 ? "#00eeff" : 0);
  text("Copenhagen", copenhagenX, cityY);
  pop();

  // Prague
  let pragueX = centerX + menuSpacing;
  let dP = dist(mouseX, mouseY, pragueX, cityY);
  push();
  drawingContext.shadowBlur = dP < 100 ? 30 : 18;
  drawingContext.shadowColor = "#f912b8";
  fill(dP < 100 ? "#f912b8" : 0);
  text("Prague", pragueX, cityY);
  pop();
}

// ---- Loading screen ----
function drawLoading() {
  textSize(28);
  fill(0);
  noStroke();
  textStyle(NORMAL);
  let dots = floor((frameCount / 30) % 4);
  let dotStr = ".".repeat(dots);
  text("Loading Archive" + dotStr, width/2, height/2);

  loadingTimer++;
  if (loadingTimer > loadingDuration) {
    state = nextCity;
    loadingTimer = 0;
  }
}

// ---- City scan world ----
function drawCityWorld(){
  if(scans.length===0){
    let selectedCity = state;
    for(let s of cityScans[selectedCity]){
      scans.push(new Scan(s.img, s.location, s.date));
    }
  }

  // network lines
  let lineColor = state === "prague" ? "rgba(249, 18, 184, 0.25)" : "rgba(0,191,255,0.25)";
  stroke(lineColor);
  strokeWeight(2);
  for(let i=0;i<scans.length;i++){
    for(let j=i+1;j<scans.length;j++){
      line(scans[i].x, scans[i].y, scans[j].x, scans[j].y);
    }
  }

  for(let s of scans){
    s.move();
    s.display();
  }

  // Fade panel in/out
  if(panelOpen){
    panelAlpha = lerp(panelAlpha, 255, 0.1);
  } else {
    panelAlpha = lerp(panelAlpha, 0, 0.1);
  }

  // ---- Vintage chat box panel ----
  if(panelAlpha > 5 && selectedScan){
    let boxW = 300;
    let boxH = 160;
    let boxX = width/2 - boxW/2;
    let boxY = height/2 - boxH/2;
    let titleBarH = 26;
    let cityColor = state === "prague" ? "#f912b8" : "#00eeff";

    // Typewriter logic
    let fullText = "Location: " + selectedScan.location + "\n\nDate: " + selectedScan.date;
    typewriterTimer++;
    if(typewriterTimer % typewriterSpeed === 0 && typewriterIndex < fullText.length){
      typewriterIndex++;
    }
    let displayText = fullText.substring(0, typewriterIndex);
    let showCursor = floor(frameCount / 20) % 2 === 0;

    // Drop shadow
    noStroke();
    fill(0, 40 * (panelAlpha / 255));
    rect(boxX + 6, boxY + 6, boxW, boxH);

    // Main box — white semi-transparent background
    fill(255, 210 * (panelAlpha / 255));
    stroke(0, panelAlpha);
    strokeWeight(2);
    rect(boxX, boxY, boxW, boxH);

    // Title bar — city colour
    let c = color(cityColor);
    fill(red(c), green(c), blue(c), panelAlpha);
    noStroke();
    rect(boxX, boxY, boxW, titleBarH);

    // Title bar text
    fill(0, panelAlpha);
    textSize(13);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text("INFO.exe", boxX + 10, boxY + titleBarH / 2);

    // [x] button decoration
    textAlign(RIGHT, CENTER);
    text("[x]", boxX + boxW - 8, boxY + titleBarH / 2);

    // Body text — typewriter + blinking cursor
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    textSize(13);
    fill(0, panelAlpha);
    let cursor = showCursor ? "_" : " ";
    text(displayText + cursor, boxX + 16, boxY + titleBarH + 16);

    // Reset alignment for everything else
    textAlign(CENTER, CENTER);
  }

  // ---- Back button — no glow, hover just darkens ----
  noStroke();
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = "transparent";
  fill(dist(mouseX, mouseY, 60, 30) < 20 ? 80 : 0);
  textSize(16);
  textStyle(NORMAL);
  text("< Back", 60, 30);
}

// ---- Mouse click ----
function mousePressed(){
  if(state === "menu"){
    let centerX = width / 2;
    let cityY = height / 2 + 40;
    if(dist(mouseX, mouseY, centerX - menuSpacing, cityY) < 120){
      nextCity = "copenhagen";
      state = "loading";
      scans = [];
    } else if(dist(mouseX, mouseY, centerX + menuSpacing, cityY) < 120){
      nextCity = "prague";
      state = "loading";
      scans = [];
    }
  } else {
    if(dist(mouseX, mouseY, 60, 30) < 20){
      state = "menu";
      scans = [];
      selectedScan = null;
      panelOpen = false;
    } else {
      let clickedOnScan = false;
      for(let s of scans){
        if(dist(mouseX, mouseY, s.x, s.y) < s.size){
          selectedScan = s;
          panelOpen = true;
          clickedOnScan = true;
          typewriterIndex = 0; // reset typewriter on new scan click
          typewriterTimer = 0;
        }
      }
      if(!clickedOnScan){
        panelOpen = false;
        selectedScan = null;
      }
    }
  }
}

// ---- Window resize ----
function windowResized(){
  resizeCanvas(window.innerWidth, window.innerHeight);
}