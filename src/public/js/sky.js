var skycons = new Skycons({"color": "white"});
  // on Android, a nasty hack is needed: {"resizeClear": true}
//var test = img.test;
  // you can add a canvas by it's ID...
  console.log(test)
  skycons.add(document.getElementById("icon1"), test);

 // ...or by the canvas DOM element itself.
  //skycons.add(document.getElementById("icon2"), Skycons.RAIN); 

  skycons.play();





