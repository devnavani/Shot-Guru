import { Accelerometer } from "accelerometer";
import document from "document";
import { Gyroscope } from "gyroscope";
import { vibration } from "haptics";


var FREQUENCY = 20;
var ACCEL_X_PERFECT = [-5.72890043, -0.21775942, -5.7928277 , -2.35668449, -3.10920506,
                       -7.66431255, -6.9794302 , -7.39088659, -2.48034878, -1.06018476,
                       -1.43536749, -3.20018768, -6.09019661, -7.02097082, -9.7191988];
var ACCEL_Y_PERFECT = [-4.53715048, -0.97087812, -0.04046316, 0.20291471, 1.74015884,
                       3.69005585, 1.48576717, 2.58449955, 2.15628357, -1.22682619,
                       -1.63157806, -0.55882359, -0.77933617, -1.67371769, -0.75515385]
var ACCEL_Z_PERFECT = [4.63232241, 5.27315054, 4.3238204 , 6.7206089 , 3.87812634,
                       2.4455121 , 2.43916721, 1.58417177, 1.49761877, 4.1514327,
                       3.39986973, 1.65145073, 4.29963827, 4.15023546, 7.04275837]
var GYRO_X_PERFECT = [0.91306572, 0.79716129, 0.92052298, 1.05347214, 0.48108807,
                      1.2496995 , 0.13305569, 0.57472744, -0.33269215, -0.21337881,
                      -0.40055161, -0.15734415, -0.26014557, 0.20847845, 0.17918282]
var GYRO_Y_PERFECT = [0.49376507, 0.26781559, 0.06359854, -1.17576799, -0.31990871,
                     -1.36698875, -1.12591209, -0.90305204, -1.06316633, -0.56332922,
                     -0.95386648, -0.86065321, -0.64844608, -0.71257706, 0.04655342]   
var GYRO_Z_PERFECT = [0.12964678, 0.1052516 , 0.05752621, -0.62831192, -0.2733551 ,
                     -1.1310256 , -0.7351615 , -0.81654978, -0.57419491, -0.30265083,
                     -0.84520655, -0.45104656, -0.43144512, -0.65760765, 0.1038662]
    
function convertToStandardUnits(array){
    var total = 0;
    for (var i = 0; i < array.length; i++) {
       total += array[i];
    }
    var avg = total / array.length;
    var s = []
    for (var i = 0; i < array.length; i++) {
      var value = array[i] - avg;
      var value_s = value * value;
      s.push(value_s)
    }
    var total1 = 0;
    for (var i = 0; i < s.length; i++) {
       total1 += s[i];
    }
    var avg1 = total1 / s.length;
    var sd = Math.sqrt(avg1)
    
    for (var i = 0; i < array.length; i++)
      array[i] = (array[i] - avg) / sd
    return array
 }

function mse(a, b) {
  a = convertToStandardUnits(a);
  b = convertToStandardUnits(b);
  var total = 0;
  for (var i = 0; i < a.length; i++) {
     var difference = a[i] - b[i];
     var df = difference * difference;
     total += df;
  }
  return total;
}



let Motion = class
{
  constructor(name, duration)
  {
    this.name = name;
    this.duration = duration;
    this.gyro_x = [];
    this.gyro_y = [];
    this.gyro_z = [];
    
    this.accel_x = [];
    this.accel_y = [];
    this.accel_z = [];
  }
 //******Get and Set Gyro***************  
  addGX(value)
  {
    this.gyro_x.push(value);
  }
  getGX()
  {
    return this.gyro_x;
  }

  addGY(value)
  {
    this.gyro_y.push(value);
  }
  getGY()
  {
    return this.gyro_y;
  }

   addGZ(value)
  {
    this.gyro_z.push(value);
  }

  getGZ()
  {
    return this.gyro_z;
  }
 //***************************   
  
 addAX(value)
  {
    this.accel_x.push(value);
  }
  getAX()
  {
    return this.accel_x;
  }

  addAY(value)
  {
    this.accel_y.push(value);
  }
  getAY()
  {
    return this.accel_y;
  }

   addAZ(value)
  {
    this.accel_z.push(value);
  }

  getAZ()
  {
    return this.accel_z;
  } 

  changeName(newName)
  {
    this.name = newName;
  }
  
  getDuration()
  {
    return this.duration;
  }  
}

const testMotion = new Motion('Testing Motion', 1);

//***************************************************************************************


function measure() 
{

let acc = new Accelerometer({ frequency: FREQUENCY, batch: testMotion.getDuration() * FREQUENCY });

acc.onreading = () => 
{ 
  var a_x_output = 'accel x: [';
  var a_y_output = 'accel y: [';
  var a_z_output = 'accel z: [';
  var n1 = 1;
  
  for (let index = 0; index < acc.readings.timestamp.length; index++) 
  {
    if ((testMotion.getAY().length % 5 == 0) && (testMotion.getAY().length != 0))
      {
        console.log(n1 + a_x_output);
        console.log(n1 + a_y_output);
        console.log(n1 + a_z_output);
        n1++;
        a_x_output = 'accel x: [';
        a_y_output = 'accel y: [';
        a_z_output = 'accel z: [';
      }
    
    a_x_output += acc.readings.x[index]+',';
    a_y_output += acc.readings.y[index]+',';
    a_z_output += acc.readings.z[index]+',';
    
    testMotion.addAX(acc.readings.x[index]);
    testMotion.addAY(acc.readings.y[index]);
    testMotion.addAZ(acc.readings.z[index]);
    if (testMotion.getAX.length == 15) {
      
    }
    acc.stop();
    
  }
}
acc.start();


let gyro = new Gyroscope({ frequency: FREQUENCY, batch: testMotion.getDuration() * FREQUENCY });

gyro.onreading = () => 
{
  var g_x_output = 'gyroscope x: [';
  var g_y_output = 'gyroscope y: [';
  var g_z_output = 'gyroscope z: [';
  var n2 = 1;

  for (let index = 0; index <= gyro.readings.timestamp.length; index++) 
  {
    if ((testMotion.getGY().length % 5 == 0) && (testMotion.getGY().length != 0))
      {
        console.log(n2 + g_x_output);
        console.log(n2 + g_y_output);
        console.log(n2 + g_z_output);
        n2++;
        g_x_output = 'gyroscope x: [';
        g_y_output = 'gyroscope y: [';
        g_z_output = 'gyroscope z: [';
      }
    
    g_x_output += gyro.readings.x[index]+',';
    g_y_output += gyro.readings.y[index]+',';
    g_z_output += gyro.readings.z[index]+',';
    
    testMotion.addGX(gyro.readings.x[index]);
    testMotion.addGY(gyro.readings.y[index]);
    testMotion.addGZ(gyro.readings.z[index]);
    
    gyro.stop();
    
  }
}

gyro.start();
  
  
  
  
  

return 1;
}

// ****************************************************************************************


let homeScreen = document.getElementById("homeScreen");
let transScreen = document.getElementById("transScreen");
let accuracyScreen = document.getElementById("accuracyScreen");
let exitButton = homeScreen.getElementById("exitButton");
let goButton = homeScreen.getElementById("goButton");
let homeButton = accuracyScreen.getElementById("homeButton")


function showAccuracyWithData(accuracy){
  

if (accuracy < 50) {
  var shot = "Bad shot. Try again...          "
} else if (accuracy >= 50 && accuracy < 80) {
  var shot = "Can't you do better?            "
} else {
  var shot = "Great shot!!!                   "
}
  
  
 

var demoinstance11 = document.getElementById("demoinstance11");
setTimeout(function() {
  demoinstance11.animate("enable"); 
}, 10);

var demoinstance12 = document.getElementById("demoinstance12");
setTimeout(function() {
  demoinstance12.animate("enable"); 
}, 10);

var demoinstance13 = document.getElementById("demoinstance13");
setTimeout(function() {
  demoinstance13.animate("enable"); 
}, 10);

var demoinstance14 = document.getElementById("demoinstance14");
setTimeout(function() {
  demoinstance14.animate("enable"); 
}, 10);

var demoinstance15 = document.getElementById("demoinstance15");
setTimeout(function() {
  demoinstance15.animate("enable"); 
}, 10);

var demoinstance16 = document.getElementById("demoinstance16");
setTimeout(function() {
  demoinstance16.animate("enable"); 
}, 10);

var demoinstance17 = document.getElementById("demoinstance17");
setTimeout(function() {
  demoinstance17.animate("enable"); 
}, 10);

var demoinstance18 = document.getElementById("demoinstance18");
setTimeout(function() {
  demoinstance18.animate("enable"); 
}, 10);

var demoinstance19 = document.getElementById("demoinstance19");
setTimeout(function() {
  demoinstance19.animate("enable"); 
}, 10);

var demoinstance20 = document.getElementById("demoinstance20");
setTimeout(function() {
  demoinstance20.animate("enable"); 
}, 10);

var demoinstance21 = document.getElementById("demoinstance21");
setTimeout(function() {
  demoinstance21.animate("enable"); 
}, 10);

let mixedtext = document.getElementById("mixedtext");
mixedtext.text = " Perfect Shot";

let mixedtext1 = document.getElementById("mixedtext1");
mixedtext1.text = String(accuracy) +"%" ;

let mixedtext2 = document.getElementById("mixedtext2");

mixedtext2.text = "Accuracy" ;

let marquee = document.getElementById("marquee");
marquee.text = shot  + shot

setTimeout(function() {
  marquee.state = "enabled";
}, 3000);
}



function vibrate1(){
  vibration.start("confirmation-max")
}

function vibrate2(){
  vibration.start("confirmation-max")
}

function vibrate3(){
  vibration.start("confirmation-max")
}

function timer(){
  setTimeout(vibrate1, 4000);
  setTimeout(vibrate2, 3000);
  setTimeout(vibrate3, 2000);
}


function hideAll() {
  homeScreen.style.display = "none";
  transScreen.style.display = "none";
  accuracyScreen.style.display = "none";
}

function showHomeScreen() {
  hideAll();
  homeScreen.style.display = "inline";
}

function showTransScreen() {
  hideAll();
  transScreen.style.display = "inline";
}

function showAccuracyScreen() {
  hideAll();
  showAccuracyWithData(50);
  accuracyScreen.style.display = "inline";
}

exitButton.onclick = function(evt) {
  console.log("LATER");
  homeScreen.style.display = "none";
}

goButton.onclick = function(evt) {
  hideAll();
  showTransScreen();
  var y = setTimeout(measure, 5000)
  timer()
  setTimeout(showAccuracyScreen, 11000) 
} 

homeButton.onclick = function(evt) {
  hideAll();
  showHomeScreen();
}
  
showHomeScreen();
