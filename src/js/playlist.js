(function($, root) {
    var controlmanager;
    var liList;
    var $scope = $(document.body);
    var $playlist = $('<div class="play-list">' +
        '<div class="list-header">播放列表</div>' +
        '<ul class="list-wrapper"></ul>' +
        '<div class="list-footer">关闭</div>' +
        '</div>');

    function renderList(data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<li class="list-info"><h3>' + data[i].song + '-<span>' + data[i].singer + '</span></h3></li>';
        }
        $scope.append($playlist);
        bindEvent();
        $playlist.find(".list-wrapper").html(html);

    }

    function signIndex(index) {
        liList = $playlist.find("li");
        $playlist.find("li").removeClass("playing");
        $playlist.find("li").eq(index).addClass("playing");
        $playlist.find("li").on("click", function() {
            var index = $(this).index();
            signIndex(index);
            controlmanager.index = index;
            $scope.trigger("play:change", [index, true]);
            $(".play-btn").addClass("playing");
            setTimeout(function() {
                $playlist.removeClass("show");
            }, 500)
        })


    }

    function bindEvent() {
        $playlist.find(".list-footer").on("click", function() {
            $playlist.removeClass("show");
        })
    }

    function show(control) {
        $playlist.addClass("show");
        controlmanager = control;
        var index = controlmanager.index;
        signIndex(index);
    }
    root.playlist = {
        renderList: renderList,
        show: show
    }
}(window.Zepto, window.player))