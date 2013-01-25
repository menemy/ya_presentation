$(function(){
    var currentPresentationIdx = 0;
    var currentSlideIdx = 0;
    var currentPresentation;
    var History = window.History;

    //prepare list of presentation
    $(".presentation").each(function(index, element) {
       $("<li>" + $("h1.title", element).text() + "</li>")
           .click(function(){
               currentPresentationIdx = index;
               //reset pager
               currentSlideIdx = 0;
               historyChanged();
               $("#menu").hide();
           })
           .appendTo("#menu ul");
    });

    //First load, history init
    History.replaceState({slide: currentSlideIdx, presentation: currentPresentationIdx}, null, "?slide="+currentSlideIdx+"&presentation="+currentPresentationIdx);
    rebuildSlides();
    rebuildPresentations();


    function rebuildPresentations(){
        $(".presentation").hide();
        currentPresentation = $(".presentation").get(currentPresentationIdx);
        $(currentPresentation).show();
        $("span.current-title").text(
            $("h1.title", currentPresentation).text()
        );
        $("#menu ul li").removeClass("selected");
        $("#menu ul li").eq(currentPresentationIdx).addClass("selected");
    }

    function rebuildSlides(){
        var classes = [ 'far-prev', 'prev', 'current', 'next', 'far-next'];

        $(".slide", currentPresentation).removeClass("far-prev prev current next far-next");

        for (var i = currentSlideIdx; i < currentSlideIdx + 5; i++) {
            if ($(".slide", currentPresentation)[i-2]) {
                $($(".slide", currentPresentation)[i-2]).addClass(classes[i-currentSlideIdx]);
            }
        }
        $("#controls .current-slide").text(currentSlideIdx + 1);

    }

    function historyChanged(){
        History.pushState({slide: currentSlideIdx, presentation: currentPresentationIdx}, null, "?slide="+currentSlideIdx+"&presentation="+currentPresentationIdx);
    }
    var prev = function(){
        if(currentSlideIdx - 1 >= 0){
            currentSlideIdx--;
            historyChanged();
        }
    };
    var prevPresentation =  function(){
        if(currentPresentationIdx - 1 >= 0){
            currentPresentationIdx--;
            //reset pager
            currentSlideIdx = 0;
            historyChanged();
        }
    };

    var next = function(){
        if(currentSlideIdx + 1 <= $(".slide", currentPresentation).length - 1){
            currentSlideIdx++;
            historyChanged();
        }
    };
    var nextPresentation = function(){
        if(currentPresentationIdx + 1 <= $(".presentation").length - 1){
            currentPresentationIdx++;
            //reset pager
            currentSlideIdx = 0;
            historyChanged();
        }
    };

    $("#controls .btn-prev").click(prev);
    $("#controls .btn-next").click(next);

    $(document).keydown(function(e) {
        switch (e.which) {
            case 37:  // left arrow
                prev(); break;
            case 39:  // right arrow
            case 32:  // space
                next(); break;
            case 38:  // up arrow
                prevPresentation(); break;
            case 40:  // down arrow
                nextPresentation(); break;
        }
    })

    $(".presentations").touchwipe({
        wipeLeft: next,
        wipeRight: prev,
        wipeUp: prevPresentation,
        wipeDown: nextPresentation,
        min_move_x: 20,
        min_move_y: 20,
        preventDefaultEvents: true
    });

    $("span.current-title").click(function(){
        $("#menu").toggle();
    });

    History.Adapter.bind(window,'statechange',function(){
        var State = History.getState();
        if(State.data && typeof State.data.presentation != "undefined"){
            currentPresentationIdx = State.data.presentation;
            rebuildPresentations();
        }
        if(State.data && typeof State.data.slide != "undefined"){
            currentSlideIdx = State.data.slide;
            rebuildSlides();
        }
    });

});
