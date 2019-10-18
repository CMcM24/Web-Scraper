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

        var id = $(this).attr("data-id");
        console.log(id);

        $.ajax({
            method: "PUT",
            url: "/entries/" + id
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

    $(document).on("click", "#commentButton", function(){

        var thisId = $(this).attr("data-id");

        $.ajax({
            method: "GET",
            url: "/entries/" + thisId
          }).then(function(data){
              console.log(data);
            if(data.comment){
                if(thisId == $("#commBody").attr("data-id")){
                    $("commBody").append("<h2>"+data.comment.title+"</h2>");
                    $("#commBody").append("<p>"+data.comment.body+"</p>")
                }
            }
            else{
                console.log("No Comment")
            }
          });
    });

    $(document).on("click", "#saveChanges", function(event){
        event.preventDefault();

        var thisID = $(this).attr("data-id");
        var commObj={};

        if(thisID == $("#commentTitle").attr("data-id") && $("#comm-text").attr("data-id")){
            commObj={
                title: $("#commentTitle").val(),
                body:$("#comm-text").val()
            }
        }

        $.ajax({
            method: "POST",
            url: "/entries/" + thisID,
            data: commObj
        }).then(function(data){
            console.log(data);
            $("#commentTitle").val("");
            $("#comm-text").val("");
        })
    });

    $.getJSON("/entries", function (data) {

        for (let i = 0; i < data.length; i++) {

            var entryButton;

            function checkForCom(stuff){
                var commentState = stuff ? stuff.comment : "No Comment";
                return commentState;
            }

            switch (data[i].saved) {
                case false:
                    entryButton = '<button type="button" class="btn btn-primary btn-lg" role="button" id="saveButton" data-id=' + data[i]._id + '>Save</button>';
                    break;

                case true:
                    entryButton = '<button type="button" class="btn btn-primary btn-lg" role="button" id="unSaveButton" data-id=' + data[i]._id + '>Unsave</button>';
                    break;
            };


            $("#entry-drop").append('<div class="card text-white bg-info"><img src="' + data[i].image + '" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">' + data[i].title + '</h5><p class="card-text"><a href="' + data[i].link + '">' + data[i].link + '</a></p>' + entryButton + '<span><button type="button" class="btn btn-light btn-lg" data-toggle="modal" data-target="#modal'+data[i]._id+'" id="commentButton" data-id=' + data[i]._id + '>Comment</button></span></div></div><div class="modal fade" id="modal'+data[i]._id+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Comment</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body" id="commBody" data-id="'+data[i]._id+'">'+checkForCom(data[i].comment)+'<input type="text" class="form-control" id="commentTitle" data-id=' + data[i]._id + '><textarea class="form-control" id="comm-text" data-id=' + data[i]._id + '></textarea></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="saveChanges" data-id=' + data[i]._id + '>Save changes</button></div></div></div></div>');

            if(data[i].saved){
                $("#saved-drop").append('<div class="card text-white bg-info"><img src="' + data[i].image + '" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">' + data[i].title + '</h5><p class="card-text"><a href="' + data[i].link + '">' + data[i].link + '</a></p>' + entryButton + '<span><button type="button" class="btn btn-light btn-lg" data-toggle="modal" data-target="#modal'+data[i]._id+'" id="commentButton" data-id=' + data[i]._id + '>Comment</button></span></div></div><div class="modal fade" id="modal'+data[i]._id+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">Comment</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body" id="'+data[i]._id+'">'+checkForCom(data[i].comment)+'<input type="text" class="form-control" id="commentTitle" data-id=' + data[i]._id + '><textarea class="form-control" id="message-text" data-id=' + data[i]._id + '></textarea></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" id="saveChanges" data-id=' + data[i]._id + '>Save changes</button></div></div></div></div>');
            }
        }
    });
});



