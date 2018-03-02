window.onload = function() {
  let removeButtons = document.querySelectorAll(".action-remove");
  removeButtons.forEach(item => {
    item.addEventListener("click", deleteRequest);
  });
};

function deleteRequest() {
  let id = this.getAttribute("data-taskId");
  if (id) {
    $.ajax({
      url : id,
      type : "DELETE",
      success : function() {
        console.log(`Delete task ${id} - success.`);
        let li = document.getElementsByName(`task-${id}`)[0];
        li.remove();
      }
    });
  }
};