$.getJSON("./entries", function(data){
    for (var i = 0; i < data.length; i++){
        $("#entry-drop").append('<div class="card text-white bg-info"><img src="' + data[i].image + '" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">'+ data[i].title +'</h5><p class="card-text"><a href="'+data[i].link+'">' + data[i].link + '</a></p></div></div>')
    }
});

$("#scrapeAway").on("click", function(event){
    event.preventDefault();

    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(res){
        res.end();
        location.reload();
    });
});