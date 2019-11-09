document.getElementById('word').innerText = sessionStorage.headWord;
dict = localStorage.getItem("searchResults");
console.log(JSON.parse(dict));

dict = JSON.parse(dict);

for(i = 1; i<=5;i++) {
    list_num = "lst" + i;
    lst = document.getElementById(list_num);

    lst.children[0].src = dict.items[i-1].snippet.thumbnails.high.url;
    lst.children[1].children[0].innerText = dict.items[i-1].snippet.title;
    lst.children[1].children[1].innerText = dict.items[i-1].snippet.channelTitle;
}

function clickList(num) {
    sessionStorage.setItem("videoID", dict.items[num].id.videoId);
    sessionStorage.setItem("videoTitle", dict.items[num].snippet.title)
    location.href = "/lectureView";
}