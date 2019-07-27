$(document).ready(() => {
  getArticles();
})

function getArticles(){
  $.get("/api/articles", (req, res) => {
    console.log(req, " what this be /public/js/articles.js");


    for(var i = 0; i < req.lenght; i++){
      var divOne = $("<div>");
      divOne.attr({
        "data-_id": req.data[i]._id,
        class: "card"
      });

      var h3One = $("<h3>");

      var aOne = $("<a>");
      aOne.attr({
        class: "article-link",
        target: "_blank",
        rel= "noopener noreferrer",
        href= "https://www.bbc.com/" + req.data[i].link,
      })



      divOne.append(h3One);
    }
  })
}