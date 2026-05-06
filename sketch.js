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

// Preloaded images cache
let preloadedImgs = {};

// Typewriter variables
let typewriterIndex = 0;
let typewriterTimer = 0;
let typewriterSpeed = 2; // frames per character — lower = faster

// City scans
const cityScans = {
  copenhagen: [
    {img: "scans/scan1.JPG", item: "PET ACT Flyer", location: "Refshaloen 2A Bus Stop", date: "March 14, 2026", refCode: "CPH-001"},
    {img: "scans/scan2.JPG", item: "RIFF Womans Protest Chant Flyer", location: "Norrebro Folkethus", date: "March 8, 2026", refCode: "CPH-002"},
    {img: "scans/scan3.JPG", item: "AFA KBH Sticker", location: "Elmgade 5C bus shelter wall", date: "March 18, 2026", refCode: "CPH-003"},
    {img: "scans/scan4.JPG", item: "RIFF Womans March Protest Chant Flyer", location: "Norrebro FolketHus", date: "Jan 20, 2026", refCode: "CPH-004"},
    {img: "scans/scan5.JPG", item: "Side texture", location: "Borgergade trashcan", date: "Jan 27, 2026", refCode: "CPH-005"},
    {img: "scans/scan6.JPG", item: "Communist march poster", location: "Nuuks Plads bus stop", date: "March 17, 2026", refCode: "CPH-006"},
    {img: "scans/scan7.JPG", item: "Zoned map of Copenhagen", location: "Jagtvej parking terminal", date: "March 17, 2026", refCode: "CPH-007"},
    {img: "scans/scan8.JPG", item: "Page of tattoo artbook", location: "Soho House Copenhagen", date: "March 19, 2026", refCode: "CPH-008"},
    {img: "scans/scan9.JPG", item: "Scribble in bathroom", location: "Props Coffee Bar", date: "March 18, 2026", refCode: "CPH-009"},
    {img: "scans/scan10.JPG", item: "Rock Night flyer at Krudttønden", location: "Tagensvej underpass", date: "April 9, 2026", refCode: "CPH-010"},
    {img: "scans/scan11.JPG", item: "Free Palestine sticker", location: "Guldbergsgade 6", date: "April 12, 2026", refCode: "CPH-011"},
    {img: "scans/scan12.JPG", item: "Krudttønden Rock Night flyer", location: "Tagensvej underpass", date: "April 14, 2026", refCode: "CPH-012"},
    {img: "scans/scan13.JPG", item: "DJ Marcinho, DJ Show Vinyl", location: "Thank You For Clapping Record Market", date: "April 18, 2026", refCode: "CPH-013"},
    {img: "scans/scan14.JPG", item: "Sparks, Kimono My House Vinyl", location: "Thank You For Clapping Record Market", date: "April 18, 2026", refCode: "CPH-014"},
    {img: "scans/scan15.JPG", item: "Amnesia Scanner + Freeka Tet - STROBE.RIP (PAN 139) Vinyl front", location: "Thank You For Clapping Record Market", date: "April 18, 2026", refCode: "CPH-015"},
    {img: "scans/scan16.JPG", item: "Amnesia Scanner + Freeka Tet - STROBE.RIP (PAN 139) Vinyl back", location: "Thank You For Clapping Record Market", date: "April 18, 2026", refCode: "CPH-016"},
    {img: "scans/scan17.JPG", item: "April event booklet cover", location: "Spillestedet Stengade", date: "April 20, 2026", refCode: "CPH-017"},
    {img: "scans/scan18.JPG", item: "April event booklet inside", location: "Spillestedet Stengade", date: "April 20, 2026", refCode: "CPH-018"},
    {img: "scans/scan19.JPG", item: "Kill-Town Death Fest flyer front", location: "Spillestedet Stengade", date: "April 20, 2026", refCode: "CPH-019"},
    {img: "scans/scan20.JPG", item: "Kill-Town Death Fest flyer back", location: "Spillestedet Stengade", date: "April 20, 2026", refCode: "CPH-020"},
    {img: "scans/scan12.JPG", item: "Krudttønden Rock Night flyer", location: "Tagensvej underpass", date: "April 14, 2026", refCode: "CPH-012"},
    {img: "scans/scan13.JPG", item: "DJ Marcinho, DJ Show Vinyl", location: "Thank You For Clapping Record Market", date: "April 18, 2026", refCode: "CPH-013"},
    {img: "scans/scan14.JPG", item: "Sparks, Kimono My House Vinyl", location: "Thank You For Clapping Record Market", date: "April 18, 2026", refCode: "CPH-014"},
    {img: "scans/scan15.JPG", item: "Amnesia Scanner + Freeka Tet - STROBE.RIP (PAN 139) Vinyl front", location: "Thank You For Clapping Record Market", date: "April 18, 2026", refCode: "CPH-015"},
    {img: "scans/scan16.JPG", item: "Amnesia Scanner + Freeka Tet - STROBE.RIP (PAN 139) Vinyl back", location: "Thank You For Clapping Record Market", date: "April 18, 2026", refCode: "CPH-016"},
    {img: "scans/scan17.JPG", item: "April event booklet cover", location: "Spillestedet Stengade", date: "April 20, 2026", refCode: "CPH-017"},
    {img: "scans/scan18.JPG", item: "April event booklet inside", location: "Spillestedet Stengade", date: "April 20, 2026", refCode: "CPH-018"},
    {img: "scans/scan19.JPG", item: "Kill-Town Death Fest flyer front", location: "Spillestedet Stengade", date: "April 20, 2026", refCode: "CPH-019"},
    {img: "scans/scan20.JPG", item: "Kill-Town Death Fest flyer back", location: "Spillestedet Stengade", date: "April 20, 2026", refCode: "CPH-020"},
    
  ],
  prague: [
    {img: "pscans/pscan1.JPG", item: "Receipt", location: "Havelská Koruna", date: "March 25, 2026", refCode: "PRG-001"},
    {img: "pscans/pscan2.JPG", item: "Magazine page", location: "Knihkupectvi Antikvariat Spalena 53", date: "March 25, 2026", refCode: "PRG-002"},
    {img: "pscans/pscan3.JPG", item: "Note", location: "Knihkupectvi Antikvariat Spalena 53", date: "March 25, 2026", refCode: "PRG-003"},
    {img: "pscans/pscan4.JPG", item: "Photograph", location: "Knihkupectvi Antikvariat Spalena 53", date: "March 25, 2026", refCode: "PRG-004"},
    {img: "pscans/pscan5.JPG", item: "Let's Go to the Disco Vinyl", location: "Knihkupectvi Antikvariat Spalena 53", date: "March 25, 2026", refCode: "PRG-005"},
    {img: "pscans/pscan6.JPG", item: "Charles Aznavour Vinyl", location: "Knihkupectvi Antikvariat Spalena 53", date: "March 25, 2026", refCode: "PRG-006"},
    {img: "pscans/pscan7.JPG", item: "Art Antiques Magazine", location: "Knihkupectvi Antikvariat Spalena 53", date: "March 25, 2026", refCode: "PRG-007"},
    {img: "pscans/pscan8.JPG", item: "Cat Playing Cards", location: "LaBula Restuarant", date: "March 25, 2026", refCode: "PRG-008"},
   {img: "pscans/pscan9.JPG", item: "Vaclav Havel Poster", location: "Maximum Underground Vinyls", date: "March 27, 2026", refCode: "PRG-009"},
   {img: "pscans/pscan10.JPG", item: "Public Transport Ticket", location: "Dopravní podnik hl. m. Prahy", date: "March 25, 2026", refCode: "PRG-010"},
   {img: "pscans/pscan11.JPG", item: "Street art", location: "Senovazna, Prague 1", date: "March 26, 2026", refCode: "PRG-011"},
  {img: "pscans/pscan12.JPG", item: "Street art", location: "Senovazna, Prague 1", date: "March 26, 2026", refCode: "PRG-012"},
  {img: "pscans/pscan13.JPG", item: "Street art", location: "Senovazna, Prague 1", date: "March 26, 2026", refCode: "PRG-013"},
  {img: "pscans/pscan14.JPG", item: "Prague is Feminist! Activism Poster", location: "Senovazna, Prague 1", date: "March 26, 2026", refCode: "PRG-014"},
  {img: "pscans/pscan15.JPG", item: "DiscoBilly Night Flyer", location: "Kollektor bathroom", date: "March 26, 2026", refCode: "PRG-015"},
  {img: "pscans/pscan16.JPG", item: "Klub Letka Loutex Exhibit Flyer", location: "Kollektor bathroom", date: "March 26, 2026", refCode: "PRG-016"},
  {img: "pscans/pscan17.JPG", item: "NQ Gallery The question mark must be a sign Exhibit Flyer", location: "Kollektor bathroom", date: "March 26, 2026", refCode: "PRG-017"},
  {img: "pscans/pscan18.JPG", item: "Místečko Gallery Vernissage Flyer", location: "Kollektor bathroom", date: "March 26, 2026", refCode: "PRG-018"},
 {img: "pscans/pscan19.JPG", item: "Multiple stickers", location: "Kollektor bathroom", date: "March 26, 2026", refCode: "PRG-019"},
 {img: "pscans/pscan20.JPG", item: "FCK AFD Sticker", location: "Kollektor bathroom", date: "March 26, 2026", refCode: "PRG-020"},
{img: "pscans/pscan21.JPG", item: "Wall writing", location: "Kollektor bathroom", date: "March 26, 2026", refCode: "PRG-021"},
{img: "pscans/pscan22.JPG", item: "EERIE x BRUXA x Fernweh Fuchs2 Event Flyer", location: "Kollektor bathroom", date: "March 26, 2026", refCode: "PRG-022"},
{img: "pscans/pscan23.JPG", item: "Stojime za prezidentem! Support Flyer", location: "Maximum Underground Vinyls", date: "March 27, 2026", refCode: "PRG-023"},
{img: "pscans/pscan24.JPG", item: "Latin Core Fuchs2 Event Flyer", location: "Kollektor bathroom", date: "March 26, 2026", refCode: "PRG-024"},
{img: "pscans/pscan25.JPG", item: "Vinyl sales newspaper clipping", location: "Maximum Underground Vinyls", date: "March 27, 2026", refCode: "PRG-025"},
{img: "pscans/pscan26.JPG", item: "Club entrance wristband", location: "Ankali", date: "March 28, 2026", refCode: "PRG-026"},

  ],
  malmo: []
};

// ---- Scan class ----
class Scan {
  constructor(imgPath, item, location, date, refCode){
    this.img = preloadedImgs[imgPath];
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
    this.noiseOffsetX += 0.005;
    this.noiseOffsetY += 0.005;
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
    let aspect = (this.img.width > 0 && this.img.height > 0) ? this.img.width / this.img.height : 1;
    let iw = aspect >= 1 ? this.size : this.size * aspect;
    let ih = aspect >= 1 ? this.size / aspect : this.size;
    image(this.img, 0, 0, iw, ih);
    pop();
  }
}

// ---- Preload ----
function preload(){
  for(let city in cityScans){
    for(let s of cityScans[city]){
      preloadedImgs[s.img] = loadImage(s.img, null, () => {});
    }
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
  else if(state === "comingsoon") drawComingSoon();
  else drawCityWorld();
}

// ---- Menu ----
function drawMenu(){
  let centerY = height/2;
  let centerX = width/2;
  let cityY = centerY + 40;
  // Malmö shifted right by ~25px so visual gaps are equal despite "Copenhagen" being wider text
  let copenhagenX = centerX - 220; 
  let malmoX      = centerX + 21;
  let pragueX     = centerX + 220;

  // SCAN ARCHIVE — centered over all three cities
  let headingX = (copenhagenX + malmoX + pragueX) / 3;
  textSize(80);
  fill(0);
  textStyle(BOLD);
  text("SCAN ARCHIVE", headingX - 28, centerY - 50);

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

// ---- Coming Soon screen ----
function drawComingSoon() {
  textSize(28);
  fill(0);
  noStroke();
  textStyle(NORMAL);
  let dots = floor((frameCount / 30) % 4);
  let dotStr = ".".repeat(dots);
  text("Coming Soon" + dotStr, width/2, height/2);

  // Back button
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = "transparent";
  fill(dist(mouseX, mouseY, 60, 30) < 20 ? 80 : 0);
  textSize(16);
  text("< Back", 60, 30);
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

    // Letterbox: fit image within panel preserving aspect ratio
    let imgAspect = (selectedScan.img.width > 0 && selectedScan.img.height > 0) ? selectedScan.img.width / selectedScan.img.height : 1;
    let fitW, fitH;
    if(imgAspect > imgAreaW / imgAreaH){
      fitW = imgAreaW;
      fitH = imgAreaW / imgAspect;
    } else {
      fitH = imgAreaH;
      fitW = imgAreaH * imgAspect;
    }
    let fitX = imgAreaX + (imgAreaW - fitW) / 2;
    let fitY = imgAreaY + (imgAreaH - fitH) / 2;

    tint(255, a);
    imageMode(CORNER);
    let zw = fitW * imgZoom;
    let zh = fitH * imgZoom;
    let mx = constrain(mouseX - fitX, 0, fitW);
    let my = constrain(mouseY - fitY, 0, fitH);
    let ox = fitX - mx * (imgZoom - 1);
    let oy = fitY - my * (imgZoom - 1);
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
  if(state === "loading") return false;
  if(state === "comingsoon"){
    if(dist(mouseX, mouseY, 60, 30) < 20) state = "menu";
    return false;
  }
  if(state === "menu"){
    let centerX = width / 2;
    let cityY = height / 2 + 40;
    if(dist(mouseX, mouseY, centerX - 220, cityY) < 120){
      nextCity = "copenhagen";
      state = "loading";
      scans = [];
    } else if(dist(mouseX, mouseY, centerX + 21, cityY) < 120){
      state = "comingsoon";
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
  return false;
}

// ---- Window resize ----
function windowResized(){
  resizeCanvas(window.innerWidth, window.innerHeight);
}