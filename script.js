/**
 * for documentation and more demos,
 * visit https://audiomotion.dev
 */

// load module from Skypack CDN
import AudioMotionAnalyzer from 'https://cdn.skypack.dev/audiomotion-analyzer?min';

// global variable to save microphone stream
let micStream;

// instantiate analyzer
const audioMotion = new AudioMotionAnalyzer(
  document.getElementById('container'),
  {
    gradient: 'rainbow',
    height: window.innerHeight - 40,
    showScaleY: true
    //useCanvas: false
  }
);

// display module version
document.getElementById('version').innerText = `v${AudioMotionAnalyzer.version}`;

// toggle microphone on/off
const micButton = document.getElementById('mic');
function connectMic(){
  if ( navigator.mediaDevices ) {
    navigator.mediaDevices.getUserMedia( { audio: true, video: false } )
    .then( stream => {
      // create stream using audioMotion audio context
      micStream = audioMotion.audioCtx.createMediaStreamSource( stream );
      // connect microphone stream to analyzer
      audioMotion.connectInput( micStream );
      // mute output to prevent feedback loops from the speakers
      audioMotion.volume = 0;
      audioMotion.start()
    })
    .catch( err => {
      alert('Microphone access denied by user');
    });
  }else {
    alert('User mediaDevices not available');
  }
}
console.log(navigator.mediaDevices)
connectMic()
micButton.addEventListener( 'change', () => {
  if ( micButton.checked ) {
    audioMotion.start()
  }
  else {
    // disconnect and release microphone stream
    audioMotion.stop()
  }
});
let data;
let freq;
let amps;
let running = true;
let bt = document.getElementById("toggle")
let interval = setInterval(main,250);
let avgAmp=0;
let change = 0;
let prevAmp=0;
let count=0;
let c = document.getElementById("c")
let a = document.getElementById("a")
bt.addEventListener("click",()=>{
  if(running){
    clearInterval(interval)
    running = false
  }else{
    interval = setInterval(main,100);
  }
})
let s;
function main(){
  data = audioMotion.getBars();
  amps=[]
  freq = []
  s=0;
  for(let i=0;i<data.length;i++){
    if(data[i].freq>=950&&data[i].freq<=1150&&data[i].value[0]!=0){
      freq.push(data[i].freq)
      amps.push(data[i].value[0])
      s+=data[i].value[0];
    }
  }
  if(amps.length!=0){
    avgAmp=s/amps.length
  }else{avgAmp=0}
  //console.log(avgAmp)
  //if(avgAmp>0.15){
    if(avgAmp-prevAmp>0.3&&change==0){
      change = 1
    }
    if(avgAmp-prevAmp<-0.3&&change==1){//&&(avgAmp>0.15||prevAmp>0.15)){
      count++;
      c.innerHTML=count;
      change = 0
    }
  //}
  a.innerHTML=avgAmp
  prevAmp=avgAmp;
  //console.log(amps)
}
