$(document).ready(function(){
  var socket = io();

  socket.emit("update-old-members");
  socket.on("update-old-members", (members) => {
    members.forEach((member, index) => {
      var html = "<tr><td>" + member.name + "</td><td>" + member.class + "</td></tr>";
      $("#members-list").append(html);
    });
  });

  $("#submit-btn").on("click", () => {
    var name = $.trim($("#name-input").val());
    var class_ = $.trim($("#class-input").val());
    var birthday = $("#birth-input").val();
    var phone = $("#phone-input").val();
    if (name && class_){
      socket.emit("send-member", {name: name, class: class_, birthday: birthday, phone: phone});
      $("#name-input").val("");
      $("#class-input").val("");
      $("#birth-input").val("");
      $("#phone-input").val("");
    }
    else alert("Vui lòng nhập tên và lớp...");
  });

  socket.on("update-new-member", (member) => {
    var html = "<tr><td>" + member.name + "</td><td>" + member.class + "</td></tr>";
    $("#members-list").append(html);
  })

});
