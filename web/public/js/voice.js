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

    if(accum > 10){

      if(volAccum / accum < 0.1){

        witMic.stop();

        voiceActive = false;

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

  console.log(JSON.stringify(entities));
  
  if(entities != null && entities.product != null){
    search(entities.product.value);
  }else{
    onVoiceInputEnd();
  }

};

witMic.onerror = function(err){};
witMic.onconnecting = function(){};
witMic.ondisconnected = function(){};

witMic.connect(token);

function search(query){

  $("#products").html("");
  $("#products").css("opacity", 0);
  $("#products").css("top", 200);

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

  onVoiceInputEnd();
  
  $("#resultsCount").html(list.length + " RESULTADOS");
 
  for(i = 0; i < list.length; i++){
    
    var title = list[i].title[0];
    var img = list[i].img[0];

    var html = "<div class=\"resultTitle\">" + title.toUpperCase() + "</div><br>";
    html += "<img src=\"/assets/products/" + img + "\"/>";
    html += "<br><br><br>";

    $("#products").append(html);

  }

  $("#products").animate({opacity: 1, top: 50}, 500, "easeOutQuart");

}

function voiceInputStart(){

  $("#waves").animate({marginLeft: 0}, 750, "linear", function() {
    $("#wave").attr("src", "/assets/imgs/voice.gif");
  });

  $("#voiceInput").animate({opacity: 0}, 400, function() {});
  $("#resultsCount").animate({opacity: 0}, 400, function() {});

}

function onVoiceInputEnd(){
  
  $("#waves").animate({opacity: 0}, 500, function() {

    $("#waves").css("margin-left", -1260);

    $("#wave").attr("src", "/assets/imgs/wave.gif");

    $("#waves").animate({opacity: 1}, 500, function(){
      $("#voiceInput").animate({opacity: 1}, 300);
    }); 

    $("#resultsCount").animate({opacity: 0.7}, 500, function() {});

  });

}

search("coca cola");