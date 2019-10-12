$(document).ready(function () {
    $("#scrapeAway").on("click", function (event) {
        event.preventDefault();

        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function (res) {
            res.end();
            location.reload();
        });
    });

    $(document).on("click", "#saveButton", function (event) {
        event.preventDefault();

        var queryID = $(this).attr("data-id");
        console.log(queryID);

        $.ajax({
            method: "PUT",
            url: "/entries/" + queryID
        }).then(function (result) {
            console.log(result);
            location.reload();
        });
    });

    $(document).on("click", "#unSaveButton", function (event) {
        event.preventDefault();

        var queryID = $(this).attr("data-id");
        console.log(queryID);

        $.ajax({
            method: "PUT",
            url: "/entries/" + queryID
        }).then(function (result) {
            console.log(result);
            location.reload();
        });
    });

    $.getJSON("/entries", function (data) {



        for (let i = 0; i < data.length; i++) {

            var entryButton;

            switch (data[i].saved) {
                case false:
                    entryButton = '<button type="button" class="btn btn-primary btn-lg" role="button" id="saveButton" data-id=' + data[i]._id + '>Save</button>';
                    break;

                case true:
                    entryButton = '<button type="button" class="btn btn-primary btn-lg" role="button" id="unSaveButton" data-id=' + data[i]._id + '>Unsave</button>';
                    break;
            };


            $("#entry-drop").append('<div class="card text-white bg-info"><img src="' + data[i].image + '" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">' + data[i].title + '</h5><p class="card-text"><a href="' + data[i].link + '">' + data[i].link + '</a></p>' + entryButton + '</div></div>')
        }
    });
});


