"use strict"

window.onload = () => {

  let childNestedTasks = document.querySelectorAll(".action-child-nested-remove");
  if (childNestedTasks) {
    childNestedTasks.forEach(item => {
      item.addEventListener("click", deleteTaskHandler("child-nested-task"));
    });
  }

  let childTasks = document.querySelectorAll(".action-child-remove");
  if (childTasks) {
    childTasks.forEach(item => {
      item.addEventListener("click", deleteTaskHandler("child-task"));
    });
  }

};

function deleteChildNestedTask() {
  let id = this.getAttribute("data-taskId");
  if (id) {
    $.ajax({
      url : id,
      type : "DELETE",
      success : () => {
        console.log(`Task ${id} was deleted.`);
        let li = document.getElementById(`child-nested-task-${id}`);
        li.remove();
      }
    });
  }
};

function deleteTaskHandler(elementIdName) {
  return function() {
    let id = this.getAttribute("data-taskId");
    if (id) {
      $.ajax({
        url : id,
        type : "DELETE",
        success : () => {
          console.log(`Task ${id} was deleted.`);
          let task = document.getElementById(`${elementIdName}-${id}`);
          task.remove();
        }
      });
    }
  };
}