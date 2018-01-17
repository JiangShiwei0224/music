var $ = window.Zepto;
var $scope = $(document.body);
var root = window.player;
var index = 0;
var songList;
var controlmanager;
var processor = root.processor;
var audiomanager = new root.audioManager();
var playlist = root.playlist;

function bindClick() {
    $scope.on("play:change", function(e, index, flag) {
        root.render(songList[index]);
        processor.renderAllTime(songList[index].duration);
        processor.update(0);
        audiomanager.setAudioSource(songList[index].audio);
        if (audiomanager.status == "play" || flag) {
            audiomanager.play();
            processor.start();
        }
    })
    $scope.find(".next-btn").on("click", function() {
        var index = controlmanager.next();
        $scope.trigger('play:change', index);
    })
    $scope.find(".prev-btn").on("click", function() {
        var index = controlmanager.prev();
        $scope.trigger('play:change', index);
    })
    $scope.find(".play-btn").on("click", function() {
        if (audiomanager.status == "pause") {
            audiomanager.play();
            $(this).addClass("playing");
            processor.start();
        } else {
            audiomanager.pause();
            $(this).removeClass("playing");
            processor.stop();
        }
    })
    $scope.find(".list-btn").on("click", function() {
        playlist.show(controlmanager);
    })
}

function bindTouch() {
    var $sliderPoint = $scope.find(".slider-point");
    var offset = $scope.find(".processor").offset();
    var left = offset.left;
    var width = offset.width;

    $sliderPoint.on("touchstart", function() {
        processor.stop();
    }).on("touchmove", function(e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if (percent < 0) {
            percent = 0;
        }
        if (percent > 1) {
            percent = 1;
        }
        processor.update(percent);
    }).on("touchend", function(e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        var curDuration = songList[controlmanager.index].duration * percent;
        audiomanager.jumpToPlay((curDuration));
        $scope.find(".play-btn").addClass("playing");
        processor.start(percent);
    })
}

function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: successFn
    })
}

function successFn(data) {
    playlist.renderList(data);
    controlmanager = new root.controlManager(data.length);
    bindClick();
    bindTouch();
    songList = data;
    $scope.trigger('play:change', 0);
}
getData("/mock/data.json")