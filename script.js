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
  }
);

// display module version
document.getElementById('version').innerText = `v${AudioMotionAnalyzer.version}`;

// toggle microphone on/off
const micButton = document.getElementById('mic');

micButton.addEventListener( 'change', () => {
  if ( micButton.checked ) {
    if ( navigator.mediaDevices ) {
      navigator.mediaDevices.getUserMedia( { audio: true, video: false } )
      .then( stream => {
        // create stream using audioMotion audio context
        micStream = audioMotion.audioCtx.createMediaStreamSource( stream );
        // connect microphone stream to analyzer
        audioMotion.connectInput( micStream );
        // mute output to prevent feedback loops from the speakers
        audioMotion.volume = 0;
      })
      .catch( err => {
        alert('Microphone access denied by user');
      });
    }
    else {
      alert('User mediaDevices not available');
    }
  }
  else {
    // disconnect and release microphone stream
    audioMotion.disconnectInput( micStream, true );
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
bt.addEventListener("click",()=>{
  if(running){
    clearInterval(interval)
    running = false
  }else{
    interval = setInterval(main,250);
  }
})
let s;
function main(){
  data = audioMotion.getBars();
  amps=[]
  freq = []
  s=0;
  for(let i=0;i<data.length;i++){
    if(data[i].freq>=900&&data[i].freq<=1200&&data[i].value[0]!=0){
      freq.push(data[i].freq)
      amps.push(data[i].value[0])
      s+=data[i].value[0];
    }
  }
  if(amps.length!=0){
    avgAmp=s/amps.length
  }else{avgAmp=0}
  console.log(avgAmp)
  if(avgAmp-prevAmp>0&&change==0){
    change = 1
  }
  if(avgAmp-prevAmp<0&&change==1){
    count++;
    c.innerHTML=count;
    change = 0
  }
  prevAmp=avgAmp;
  //console.log(amps)
}