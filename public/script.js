$(document).ready(function(){
  var socket = io();

  socket.emit("update-old-names");
  socket.on("update-old-names", (names) => {
    names.forEach((name, index) => {
      var html = "<li>" + name + "</li>";
      $("#names-list").append(html);
    });
  });

  $("#submit-btn").on("click", () => {
    var name = $.trim($("#name-input").val());
    if (name){
      socket.emit("send-name", name);
      $("#name-input").val("");
    }
    else alert("Nhập tên khác đi...");
  });

  socket.on("update-new-name", (name) => {
    var html = "<li>" + name + "</li>";
    $("#names-list").append(html);
  })

});
