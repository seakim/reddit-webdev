$.getJSON("/articles", data => {
  for (let i = 0; i < data.length; i++) {
    const $title = "<a href='"+data[i].link+"'><h5 class='title'> "+data[i].rank+". "+data[i].title+"</h5></a>";
    const $submittedBy = "<div class='submittedBy'>" + data[i].submittedBy + "</div>";
    const $score = "<div class='likes right-align'>"+data[i].score+" people like this article</div>"
    const $numComment = "<div class='numComment right-align'>"+data[i].numComment+" comments</div>"

    $("#articles").append("<div class='card article' data-id='" + data[i]._id + "'>" 
      + $title + $submittedBy + $score + $numComment + "</>");
  }
});

$(document).on("click", "div.article", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  .then(data => {
    console.log(data);
    $("#notes").append("<h4>" + data.title + "</h4>");
    $("#notes").append("<h6>" + data.submittedBy + "</h6>");
    $("#notes").append("<input id='titleinput' name='title' placeholder='title'>");
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    $("#notes").append("<br><br><h4>Notes:</h4>");
    for (let i = 0; i < data.notes.length; i++) {
      $("#notes").append("<div class='note'><h6>"+ data.notes[i].title +": " + data.notes[i].body 
        + "<a class='material-icons icon'>clear</a></h6></div>");
    }
    

    if (data.note) {
      $("#titleinput").val(data.note.title);
      $("#bodyinput").val(data.note.body);
    }
  });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
  .then(data => {
    console.log(data);
    $("#notes").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
