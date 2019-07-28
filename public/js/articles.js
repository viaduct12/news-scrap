$(document).ready(() => {
  getArticles();
})

function getArticles(){
  $.get("/api/articles", (req, res) => {
    // console.log(req.data.length, " what this be /public/js/articles.js");


    for(var i = 0; i < req.data.length; i++){
      console.log(req.data[i]._id, "for loop id");
      var divOne = $("<div>");
      divOne.attr({
        "data-_id": req.data[i]._id,
        class: "card"
      });

      var divTwo = $("<div>");
      divTwo.attr({
        class: "card-header"
      });

      var h3One = $("<h3>");

      var aOne = $("<a>");
      aOne.attr({
        class: "article-link",
        target: "_blank",
        rel: "noopener noreferrer",
        href: "https://www.bbc.com/" + req.data[i].link,
      });
      aOne.text(req.data[i].title);

      var aTwo = $("<a>");
      aTwo.attr({
        class: "btn btn-success save"
      });
      aTwo.text("Save Article");

      var divThree = $("<div>");
      divThree.addClass("card-body");
      divThree.text(req.data[i].summary);


      h3One.append(aOne);
      h3One.append(aTwo);
      divTwo.append(h3One);

      divOne.append(divTwo);
      divOne.append(divThree);
      $(".article-container").append(divOne);
    }
  })
}