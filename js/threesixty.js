$(document).ready(function () {
    var ready = false,
            didPageJustLoad = true,
            dragging = false,
            pointerStartPosX = 0,
            pointerEndPosX = 0,
            pointerDistance = 0,

            monitorStartTime = 0,
            monitorInt = 10,
            ticker = 0,
            speedMultiplier = 5,
            spinner,
    
            totalFrames = 0,
            currentFrame = 0,
            frames = [],
            endFrame = 0,
            loadedImages = 0,
            isDirectionReversed = true;
      function readConfigFile() {
            $.get('config.txt', function(myContentFile) {
                  var lines = myContentFile.split("\n");
                  totalFrames = parseInt(lines[0]);
            },
            'text');
      }
      function addSpinner () {
    spinner = new CanvasLoader("spinner");
    spinner.setShape("spiral");
    spinner.setDiameter(90);
    spinner.setDensity(90);
    spinner.setRange(1);
    spinner.setSpeed(4);
    spinner.setColor("#333333");
    spinner.show();
    $("#spinner").fadeIn("slow");
};
function loadImage() {
    var li = document.createElement("li");
    var imageName = "img/threesixty_" + (loadedImages + 1) + ".jpg";
    var image = $('<img>').attr('src', imageName).addClass("previous-image").appendTo(li);
    frames.push(image);
    $("#threesixty_images").append(li);
    $(image).load(function() {
        imageLoaded();
    });
};
function imageLoaded() {
    loadedImages++;
    $("#spinner span").text(Math.floor(loadedImages / totalFrames * 100) + "%");
    if (loadedImages == totalFrames) {
        frames[0].removeClass("previous-image").addClass("current-image");
        $("#spinner").fadeOut("slow", function(){
            spinner.hide();
            showThreesixty();
        });
    } else {
        loadImage();
    }
};

function showThreesixty () {
            $("#threesixty_images").fadeIn("slow");
            ready = true;
            endFrame = 0;
            refresh();
    };
function render () {
            if((currentFrame !== endFrame) || didPageJustLoad)
            {     
                  didPageJustLoad = false; 
                  frames[currentFrame].removeClass("current-image").addClass("previous-image");
                  if (isDirectionReversed) {
                        console.log("currentFrame was ", currentFrame);
                        currentFrame = (currentFrame - 1) % totalFrames;
                        if (currentFrame < 0) {
                              currentFrame = totalFrames - 1;
                        }
                        console.log("currentFrame becomes ", currentFrame);
                  } else {
                        currentFrame = (currentFrame + 1) % totalFrames;
                  }
                  frames[currentFrame].removeClass("previous-image").addClass("current-image");
              // var frameEasing = endFrame < currentFrame ? Math.floor((endFrame - currentFrame) * 0.1) : Math.ceil((endFrame - currentFrame) * 0.1);
              // console.log("frameEasing = ", frameEasing, "\n");
              // hidePreviousFrame();
              // currentFrame += frameEasing;
              // showCurrentFrame();
            } else {
                    window.clearInterval(ticker);
                    ticker = 0;
            }
    };
function refresh () {
            if (ticker === 0) {
                    ticker = self.setInterval(render, Math.round(10000 / 60));
            }
    };
function hidePreviousFrame() {
            frames[getNormalizedCurrentFrame()].removeClass("current-image").addClass("previous-image");
    };
     
    function showCurrentFrame() {
            frames[getNormalizedCurrentFrame()].removeClass("previous-image").addClass("current-image");
    };
     
    function getNormalizedCurrentFrame() {
            var c = -Math.ceil(currentFrame % totalFrames);
            if (c < 0) c += (totalFrames - 1);
            console.log("c = ", c);
            return c;
    };
 function getPointerEvent(event) {
            return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
    };
     
    $("#threesixty").mousedown(function (event) {
            event.preventDefault();
            pointerStartPosX = getPointerEvent(event).pageX;
            dragging = true;
    });
     
    $(document).mouseup(function (event){
            event.preventDefault();
            dragging = false;
    });
     
    $(document).mousemove(function (event){
            event.preventDefault();
            trackPointer(event);
    });
$("#threesixty").on("touchstart", function (event) {
            event.preventDefault();
            pointerStartPosX = getPointerEvent(event).pageX;
            dragging = true;
    });
     
    $("#threesixty").on("touchmove", function (event) {
            event.preventDefault();
            trackPointer(event);
    });
     
    $("#threesixty").on("touchend", function (event) {
            event.preventDefault();
            dragging = false;
    });
function trackPointer(event) {
            if (ready && dragging) {
                    pointerEndPosX = getPointerEvent(event).pageX;
                    if(monitorStartTime < new Date().getTime() - monitorInt) {
                            pointerDistance = pointerEndPosX - pointerStartPosX;
                            if (pointerDistance < 0) {
                              isDirectionReversed = true;
                            } else {
                              isDirectionReversed = false;
                            }
                            console.log("pointerDistance = ", pointerDistance);
                            endFrame = (currentFrame + Math.ceil((totalFrames - 1) * speedMultiplier * (pointerDistance / $("#threesixty").width()))) % totalFrames;
                            console.log((totalFrames - 1) * speedMultiplier * (pointerDistance / $("#threesixty").width()));
                            console.log("currentFrame = ", currentFrame);
                            console.log("endFrame = ", endFrame);
                            refresh();
                            monitorStartTime = new Date().getTime();
                            pointerStartPosX = getPointerEvent(event).pageX;
                    }
            }
    };
readConfigFile();
addSpinner();
loadImage();
});