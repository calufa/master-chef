var voiceActive = false;
var volAccum = 0;
var accum = 0;
var searchXHR = null;
var token = "K5NQQSET66UZXTSLCBK52BRS4BXYAUKU";

function setup(){

  mic = new p5.AudioIn();
  mic.start();

}

function draw(){

  vol = mic.getLevel();

  if(vol > 0.15 && !voiceActive){
    
    voiceActive = true;

    witMic.start();

    voiceInputStart();

  }

}

function volumeListener(){

  if(voiceActive){

    volAccum += vol;
    accum++;

    if(accum > 20){

      if(volAccum / accum < 0.1){

        witMic.stop();

        voiceActive = false;

        onVoiceInputEnd();

      }

      volAccum = 0;
      accum = 0;

    }

  }

}

setInterval(volumeListener, 100);

var witMic = new Wit.Microphone(document.getElementById("microphone"));

witMic.onready = function(){};
witMic.onaudiostart = function(){};
witMic.onaudioend = function(){};
witMic.onresult = function(intent, entities){
  
  if(entities != null && entities.product != null){
    search(entities.product.value);
  }

};

witMic.onerror = function(err){};
witMic.onconnecting = function(){};
witMic.ondisconnected = function(){};

witMic.connect(token);

function search(query){

  $("#voiceInput").html("\"" + query.toUpperCase() + "\"");

  if(searchXHR != null){
    searchXHR.abort();
  }

  searchXHR = $.ajax({
    type: "POST",
    url: "/search?query=" + query,
    success: onSearchResult
  });

}

function onSearchResult(list){
  
  $("#products").html("");
 
  for(i = 0; i < list.length; i++){
    
    var title = list[i].title[0];
    var img = list[i].img[0];

    $("#products").append("<img src=\"/assets/products/" + img + "\"/><br>");

  }

}


function voiceInputStart(){

  $("#waves").animate({marginLeft: 0}, 750, "linear", function() {
    $("#wave").attr("src", "/assets/imgs/voice.gif");
  });

  $("#voiceInput").animate({opacity: 0}, 400, function() {});

}

function onVoiceInputEnd(){
  
  $("#waves").animate({opacity: 0}, 500, function() {

    $("#waves").css("margin-left", -1260);

    $("#wave").attr("src", "/assets/imgs/wave.gif");

    $("#waves").animate({opacity: 1}, 500, function(){
      $("#voiceInput").animate({opacity: 1}, 300);
    }); 

  });

}
