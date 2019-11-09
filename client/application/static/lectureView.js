id = sessionStorage.getItem("videoID");
script = null
index = 1
prevTime = "00:00"
prevCaption = ""
//postReq(id);
document.getElementById('videoTitle').innerText = sessionStorage.videoTitle;
//id = sessionStorage.getItem("videoID");
//console.log(sessionStorage.videoID);
//document.getElementById('video').src = "https://www.youtube.com/embed/" + id;


function postReq(ID,target){
    $.ajax({
        method: "POST",
        url: "http://localhost:5000/subtitles",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ videoID: ID}),
        success: function(data, textStatus) {
            script = data;
            target.playVideo();
        }
    });
}


var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: id,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });

}

function onPlayerReady(event) {
    console.log("playerReady");
    postReq(id,event.target);

    //event.target.playVideo();
}    

var done = false;
function onPlayerStateChange(event) {

    var myVar = setInterval(myTimer, 1000);
    function myTimer() {
        time = player.getCurrentTime()

        if (parseFloat(script[index-1]['start'])<parseFloat(time)){
            if (script[index]['text']){
                var min = Math.floor(parseFloat(script[index]['start'])/60);
                // if (min.length==1){
                //     min = "0"+min
                // }
                var sec = (Math.round(parseFloat(script[index]['start'])-min*60));
                // if (sec.length==1){
                //     sec = "0"+sec
                // }
                currTime =  min.toString()+ ":" + sec.toString(); 


                var currCaption = script[index]['text'];
                if (currCaption.indexOf("* *") != -1){
                    currCaption = currCaption.replace("* *", " ");
                }else if (currCaption.indexOf("**") != -1){
                    currCaption = currCaption.replace("**", " ");
                }
                while (currCaption.indexOf("*") != -1){
                    start = currCaption.indexOf("*");
                    currCaption = currCaption.replace("*","$");
                    end = currCaption.indexOf("*");
                    var key = currCaption.slice(start+1,end);
                    currCaption = currCaption.replace("$", `<b style="color:yellow;" onclick="postReqWiki(\'${key}\');">`);
                    currCaption = currCaption.replace("*", '</b>');
                    console.log(currCaption);
                }

                document.getElementById('time1').innerHTML = "<p style=\"color:white;\">" + prevTime + "</p>";
                document.getElementById('caption1').innerHTML = "<p style=\"color:white;\">" + prevCaption + "</p>";

                document.getElementById('time2').innerHTML = "<p style=\"color:white;\">" + currTime + "</p>";
                document.getElementById('caption2').innerHTML = "<p style=\"color:white;\">" + currCaption + "</p>";

                prevTime = currTime;
                prevCaption = currCaption;
            }
            index+=1
        }
    }
}

function stopVideo() {
    player.stopVideo();
}


function postReqWiki(searchQuery){
    console.log("AAz");
    $.ajax({
        method: "POST",
        url: "http://localhost:5000/wiki",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ keyword: searchQuery }),
        success: function(data, textStatus) {
            document.getElementById("terminExplanation").innerHTML = data.toString();
            document.getElementById("terminName").innerHTML = searchQuery;
            postReqForVideos(searchQuery);
            
        }
    });
    document.getElementById('wikiContents').style.display = "block";
}

function postReqForVideos(terminQuery){
    console.log("postReqForVideos");
    $.ajax({
        method: "POST",
        url: "http://localhost:5000/videos",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ query: terminQuery }),
        success: function(data, textStatus) {
            console.log("inSuccess")
            renderResults(JSON.stringify(data));
            // $.when(setData(data)).then(window.location = nextPage);
        }
    });
}
function pressX() {
    console.log("pressX");
    document.getElementById('wikiContents').style.display = "none";
}

function renderResults(data1){
    data = JSON.parse(data1);
    myList1 = data.items;
    myList = myList1.slice(0, 5);
    var arrayLength = myList.length;
    for (var i = 0; i < arrayLength; i++) {
        var result = '<div class="item" width = "93" style = "border-radius: 14px; background-color: rgba(0,0,0,0.21);">' +
    '<div class="image" style = "border-color:transparent;">' +
    '<img src="'+ myList[i].snippet.thumbnails.high.url + '" style = "border-radius: 14px; min-width: 100%; height: auto">' +
    '</div>' + 
    '<div class="content">' +
    '<a style="height:30%; font-size: 1vw;" class="header" onclick="pressHead('+i+')" videoId = "'+ myList[i].id.videoId +'" videoTitle = "'+myList[i].snippet.title+'">'+ myList[i].snippet.title +'</a>' +
    '<div class="meta">' +
    '<span>'+myList[i].snippet.channelTitle+'</span>' +
    '</div>' +
    '<div class="description">' +
    ' <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">'+myList[i].snippet.description+'</p> ' +
    '</div>' +
    '</div>' +
    '</div>'
    $(result).insertAfter(".fxd");
    }
}

function pressHead(i){
    lst = document.getElementById("videosColl");
    videoId = lst.children[i+1].children[1].children[0].getAttribute("videoID")
    videoTitle = lst.children[i+1].children[1].children[0].getAttribute("videoTitle")
    
    sessionStorage.setItem("videoID", videoId);
    sessionStorage.setItem("videoTitle", videoTitle);
    location.href = "/lectureView";
};
