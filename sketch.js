let state = "menu";
let scans = [];
let panelOpen = false;
let selectedScan = null;
let panelAlpha = 0;
let grainDensity = 10000; // number of tiny dots per frame
 
// Loading screen variables
let loadingTimer = 0;
let loadingDuration = 180; // frames (~2 seconds at 60fps)
let nextCity = null;
 
// Glow colors per scan
const glowColors = ["#FF69B4", "#00BFFF", "#7FFF00"];
 
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
  textFont('Input Mono');
  textStyle(BOLD);
}
 
// ---- Draw grain ----
function drawGrain(){
  noStroke();
  fill(0, 60); // CHANGE 2: unified opacity 0.5 (approx 5/255) across all pages
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
  textSize(80);
  fill(0);
  textStyle(BOLD);
  text("SCAN ARCHIVE", width/2, centerY-50);
 
  textSize(40);
  textStyle(BOLD);
  let spacing = 200;
  let centerX = width/2;
 
  // Copenhagen
  let copenhagenX = centerX - spacing/2;
  let dC = dist(mouseX, mouseY, copenhagenX, centerY+40);
  // CHANGE 1: colored back-glow on city titles
  push();
  drawingContext.shadowBlur = dC < 100 ? 30 : 18;
  drawingContext.shadowColor = "#00eeff";
  fill(dC < 100 ? "#00eeff" : 0);
  text("Copenhagen", copenhagenX, centerY+40);
  pop();
 
  // Prague
  let pragueX = centerX + spacing/2;
  let dP = dist(mouseX, mouseY, pragueX, centerY+40);
  push();
  drawingContext.shadowBlur = dP < 100 ? 30 : 18;
  drawingContext.shadowColor = "#f912b8";
  fill(dP < 100 ? "#f912b8" : 0);
  text("Prague", pragueX, centerY+40);
  pop();
}
 
// ---- Loading screen ----
function drawLoading() {
  // CHANGE 2: grain now renders on the loading screen (drawGrain already called in draw())
  textSize(28);
  fill(0);
  noStroke();
  let dots = floor((frameCount / 30) % 4);
  let dotStr = ".".repeat(dots);
  text("Loading Archive" + dotStr, width/2, height/2);
 
  loadingTimer++;
  if (loadingTimer > loadingDuration) {
    state = nextCity;
    loadingTimer = 0;
  }
}
 
// ---- Draw star shape ----
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle/2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle){
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
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
 
  if(panelOpen){
    panelAlpha = lerp(panelAlpha, 255, 0.1);
  } else {
    panelAlpha = lerp(panelAlpha, 0, 0.1);
  }
 
  if(panelAlpha > 5 && selectedScan){
    let lines = [
      `Location: ${selectedScan.location}`,
      `Date: ${selectedScan.date}`
    ];
    let lineHeight = 20;
    let panelX = width - 170;
    let panelY = 180;
    fill(255, panelAlpha);
    stroke(0, panelAlpha);
    strokeWeight(4);
    drawStar(panelX, panelY, 90, 140, 7);
    noStroke();
    fill(0, panelAlpha);
    textStyle(BOLD);
    textSize(14);
    text("Scan Info", panelX, panelY - 30);
    textStyle(NORMAL);
    textSize(12);
    for(let i=0;i<lines.length;i++){
      text(lines[i], panelX, panelY + i * lineHeight);
    }
  }
 
  // ---- Back button ---- CHANGE 3: no glow, plain fill change on hover only
  noStroke();
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = "transparent";
  fill(dist(mouseX, mouseY, 60, 30) < 20 ? 80 : 0);
  textSize(16);
  textStyle(BOLD);
  text("< Back", 60, 30);
}
 
// ---- Mouse click ----
function mousePressed(){
  if(state==="menu"){
    let centerY = height/2 + 20;
    if(dist(mouseX, mouseY, width/2 - 100, centerY+40)<100){
      nextCity = "copenhagen";
      state = "loading";
      scans=[];
    } else if(dist(mouseX, mouseY, width/2 + 100, centerY+40)<100){
      nextCity = "prague";
      state = "loading";
      scans=[];
    }
  } else {
    if(dist(mouseX, mouseY, 60, 30)<20){
      state = "menu";
      scans=[];
      selectedScan = null;
      panelOpen = false;
    } else {
      let clickedOnScan = false;
      for(let s of scans){
        if(dist(mouseX, mouseY, s.x, s.y)<s.size){
          selectedScan = s;
          panelOpen = true;
          clickedOnScan = true;
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