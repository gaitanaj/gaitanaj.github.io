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
let menuSpacing = 220;

// Glow colors per scan
const glowColors = ["#FF69B4", "#00BFFF", "#7FFF00"];

// Image zoom
let imgZoom = 1.0;

// Typewriter variables
let typewriterIndex = 0;
let typewriterTimer = 0;
let typewriterSpeed = 2; // frames per character — lower = faster

// City scans
const cityScans = {
  copenhagen: [
    {img: "scans/scan1.JPG", item: "PET ACT Flyer", location: "Refshaloen 2A Bus Stop", date: "March 14, 2026", refCode: "CPH-001"},
    {img: "scans/scan2.JPG", item: "RIFF Womans Protest Chant Flyer", location: "Norrebro Folkethus", date: "March 8, 2026", refCode: "CPH-002"},
    {img: "scans/scan3.JPG", item: "Tabloid", location: "Central station shop", date: "Jan 13, 2026", refCode: "CPH-003"},
    {img: "scans/scan4.JPG", item: "RIFF Womans March Protest Chant Flyer", location: "Norrebro FolketHus", date: "Jan 20, 2026", refCode: "CPH-004"},
    {img: "scans/scan5.JPG", item: "Trashcan Texture", location: "Elmgade 5A Bus Stop", date: "Jan 27, 2026", refCode: "CPH-005"},
  ],
  prague: [
    {img: "pscans/pscan1.JPG", item: "Tabloid", location: "Old Town Square", date: "March 1, 2026", refCode: "PRG-001"},
    {img: "pscans/pscan2.JPG", item: "Magazine", location: "Charles Bridge", date: "Feb 8, 2026", refCode: "PRG-002"},
    {img: "pscans/pscan3.JPG", item: "Newspaper", location: "Prague Castle", date: "Jan 13, 2026", refCode: "PRG-003"},
  ],
  malmo: [
    {img: "mscans/mscan1.JPG", item: "Magazine", location: "Stortorget", date: "March 5, 2026", refCode: "MLM-001"},
    {img: "mscans/mscan2.JPG", item: "Newspaper", location: "Möllevångstorget", date: "Feb 20, 2026", refCode: "MLM-002"},
    {img: "mscans/mscan3.JPG", item: "Tabloid", location: "Triangeln station", date: "Feb 12, 2026", refCode: "MLM-003"},
    {img: "mscans/mscan4.JPG", item: "Magazine", location: "Lilla Torg kiosk", date: "Jan 30, 2026", refCode: "MLM-004"},
    {img: "mscans/mscan5.JPG", item: "Newspaper", location: "Malmö Central", date: "Jan 18, 2026", refCode: "MLM-005"},
  ]
};

// ---- Scan class ----
class Scan {
  constructor(imgPath, item, location, date, refCode){
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
    this.object = item;
    this.location = location;
    this.date = date;
    this.refCode = refCode;
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
  // Malmö shifted right by ~25px so visual gaps are equal despite "Copenhagen" being wider text
  let copenhagenX = centerX - 220; 
  let malmoX      = centerX + 25;
  let pragueX     = centerX + 220;

  // SCAN ARCHIVE — centered over all three cities
  let headingX = (copenhagenX + pragueX) / 2;
  textSize(80);
  fill(0);
  textStyle(BOLD);
  text("SCAN ARCHIVE", headingX - 15, centerY - 50);

  // City names — normal weight
  textSize(40);
  textStyle(NORMAL);

  // Copenhagen
  let dC = dist(mouseX, mouseY, copenhagenX, cityY);
  push();
  drawingContext.shadowBlur = dC < 100 ? 30 : 18;
  drawingContext.shadowColor = "#00eeff";
  fill(dC < 100 ? "#00eeff" : 0);
  text("Copenhagen", copenhagenX, cityY);
  pop();

  // Malmö
  let dM = dist(mouseX, mouseY, malmoX, cityY);
  push();
  drawingContext.shadowBlur = dM < 100 ? 30 : 18;
  drawingContext.shadowColor = "#7eeb10";
  fill(dM < 100 ? "#7eeb10" : 0);
  text("Malmö", malmoX, cityY);
  pop();

  // Prague
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
      scans.push(new Scan(s.img, s.item, s.location, s.date, s.refCode));
    }
  }

  // network lines
  let lineColor = state === "prague" ? "rgba(249, 18, 184, 0.25)" : state === "malmo" ? "rgba(136, 227, 44, 0.25)" : "rgba(0,191,255,0.25)";
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

  // Fade out background scans when panel is open
  if(panelAlpha > 5){
    noStroke();
    fill(255, panelAlpha * 0.55);
    rect(0, 0, width, height);
  }

  // ---- Vintage dual panel: image + info, connected by node wire ----
  if(panelAlpha > 5 && selectedScan){
    let titleBarH = 26;
    let imgPanelW = 320;
    let imgPanelH = 340;
    let infoPanelW = 260;
    let infoPanelH = 230;
    let nodeGap = 70;
    let cityColor = state === "prague" ? "#f912b8" : state === "malmo" ? "#88e52b" : "#00eeff";
    let c = color(cityColor);
    let a = panelAlpha;

    // Center both panels together horizontally
    let totalW = imgPanelW + nodeGap + infoPanelW;
    let imgBoxX = width/2 - totalW/2;
    let imgBoxY = height/2 - imgPanelH/2;
    let infoBoxX = imgBoxX + imgPanelW + nodeGap;
    let infoBoxY = height/2 - infoPanelH/2;

    // ---- Node wire connecting the two panels ----
    let wireX1 = imgBoxX + imgPanelW;
    let wireY1 = imgBoxY + imgPanelH / 2;
    let wireX2 = infoBoxX;
    let wireY2 = infoBoxY + infoPanelH / 2;

    stroke(red(c), green(c), blue(c), a * 0.7);
    strokeWeight(1.5);
    drawingContext.setLineDash([6, 4]);
    line(wireX1, wireY1, wireX2, wireY2);
    drawingContext.setLineDash([]);

    // Node dots at wire endpoints
    noStroke();
    fill(red(c), green(c), blue(c), a);
    circle(wireX1, wireY1, 12);
    circle(wireX2, wireY2, 12);
    fill(255, a);
    circle(wireX1, wireY1, 5);
    circle(wireX2, wireY2, 5);

    // ---- Image panel ----
    noStroke();
    fill(0, 40 * (a / 255));
    rect(imgBoxX + 6, imgBoxY + 6, imgPanelW, imgPanelH);

    fill(255, 210 * (a / 255));
    stroke(0, a);
    strokeWeight(2);
    rect(imgBoxX, imgBoxY, imgPanelW, imgPanelH);

    fill(red(c), green(c), blue(c), a);
    noStroke();
    rect(imgBoxX, imgBoxY, imgPanelW, titleBarH);

    fill(0, a);
    textSize(13);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text("IMG.exe", imgBoxX + 10, imgBoxY + titleBarH / 2);
    textAlign(RIGHT, CENTER);
    text("[x]", imgBoxX + imgPanelW - 8, imgBoxY + titleBarH / 2);

    let imgPad = 8;
    let imgAreaX = imgBoxX + imgPad;
    let imgAreaY = imgBoxY + titleBarH + imgPad;
    let imgAreaW = imgPanelW - imgPad * 2;
    let imgAreaH = imgPanelH - titleBarH - imgPad * 2;

    // Zoom: lerp toward 2.5x when hovering over image, 1x otherwise
    let overImg = mouseX > imgAreaX && mouseX < imgAreaX + imgAreaW &&
                  mouseY > imgAreaY && mouseY < imgAreaY + imgAreaH &&
                  a > 150;
    imgZoom = lerp(imgZoom, overImg ? 2.5 : 1.0, 0.1);

    // Clip to image area so zoom doesn't bleed outside
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(imgAreaX, imgAreaY, imgAreaW, imgAreaH);
    drawingContext.clip();

    tint(255, a);
    imageMode(CORNER);
    let zw = imgAreaW * imgZoom;
    let zh = imgAreaH * imgZoom;
    // Anchor zoom to mouse position within image
    let mx = constrain(mouseX - imgAreaX, 0, imgAreaW);
    let my = constrain(mouseY - imgAreaY, 0, imgAreaH);
    let ox = imgAreaX - mx * (imgZoom - 1);
    let oy = imgAreaY - my * (imgZoom - 1);
    image(selectedScan.img, ox, oy, zw, zh);
    noTint();
    drawingContext.restore();
    imageMode(CENTER);

    // Zoom cursor hint
    if(overImg && imgZoom > 1.1){
      noStroke();
      fill(255, a * 0.6);
      textSize(10);
      textStyle(NORMAL);
      textAlign(RIGHT, BOTTOM);
      text("zoom", imgAreaX + imgAreaW - 4, imgAreaY + imgAreaH - 4);
    }

    // ---- Info panel ----
    // Typewriter logic
    let fullText = "Object: " + selectedScan.object + "\n\nLocation: " + selectedScan.location + "\n\nDate: " + selectedScan.date + "\n\nRef: " + selectedScan.refCode;
    typewriterTimer++;
    if(typewriterTimer % typewriterSpeed === 0 && typewriterIndex < fullText.length){
      typewriterIndex++;
    }
    let displayText = fullText.substring(0, typewriterIndex);
    let showCursor = floor(frameCount / 20) % 2 === 0;

    noStroke();
    fill(0, 40 * (a / 255));
    rect(infoBoxX + 6, infoBoxY + 6, infoPanelW, infoPanelH);

    fill(255, 210 * (a / 255));
    stroke(0, a);
    strokeWeight(2);
    rect(infoBoxX, infoBoxY, infoPanelW, infoPanelH);

    fill(red(c), green(c), blue(c), a);
    noStroke();
    rect(infoBoxX, infoBoxY, infoPanelW, titleBarH);

    fill(0, a);
    textSize(13);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text("INFO.exe", infoBoxX + 10, infoBoxY + titleBarH / 2);
    textAlign(RIGHT, CENTER);
    text("[x]", infoBoxX + infoPanelW - 8, infoBoxY + titleBarH / 2);

    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    textSize(13);
    fill(0, a);
    let cursor = showCursor ? "_" : " ";
    text(displayText + cursor, infoBoxX + 16, infoBoxY + titleBarH + 16, infoPanelW - 32);

    // Reset alignment
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
    if(dist(mouseX, mouseY, centerX - 220, cityY) < 120){
      nextCity = "copenhagen";
      state = "loading";
      scans = [];
    } else if(dist(mouseX, mouseY, centerX + 25, cityY) < 120){
      nextCity = "malmo";
      state = "loading";
      scans = [];
    } else if(dist(mouseX, mouseY, centerX + 220, cityY) < 120){
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