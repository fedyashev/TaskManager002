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

  let childNestedSuccessActions = document.querySelectorAll(".action-child-nested-success");
  if (childNestedSuccessActions) {
    childNestedSuccessActions.forEach(item => {
      item.addEventListener("click", setStatusSuccess);
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

function setStatusSuccess() {
  let id = this.getAttribute("data-taskId");
  if (id) {
    $.ajax({
      url: `${id}/setStatusSuccess`,
      type: "PUT",
      success: (res) => {
        console.log(res);
        let task = document.getElementById(`child-nested-task-${id}`);
        let taskClassAttr = task.getAttribute("class");
        if (taskClassAttr) {
          let classes = taskClassAttr.split(" ");
          let index = classes.findIndex((value, i, obj) => value.match("bg-.*"));
          if (index >= 0) {
            classes[index] = "bg-success"
          }
          else {
            classes.push("bg-success");
          }
          task.setAttribute("class", classes.join(" "));
        }
      }
    });
  }
};

function showFailMessage(container) {

}