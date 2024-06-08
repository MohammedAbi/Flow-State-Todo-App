const inputBox = document.getElementById("input-box");
const greenTasks = document.getElementById("green-tasks");
const orangeTasks = document.getElementById("orange-tasks");
const redTasks = document.getElementById("red-tasks");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

// Set to true to use the simulated time for testing
const testMode = true;

// Simulated test time
const testTime = new Date();
testTime.setHours(15); // Set the hour here (e.g., 10 for 10 AM, 14 for 2 PM, etc.)

function addTask() {
  const taskName = inputBox.value;
  const taskDifficulty = document.getElementById("task-difficulty").value;

  if (taskName === "") {
    alert("You must write something!");
    return;
  }

  const taskList = getTaskList(taskDifficulty);
  const li = document.createElement("li");
  li.innerHTML = taskName;
  li.classList.add("task", taskDifficulty);
  li.addEventListener("click", function () {
    if (!li.classList.contains("inactive")) {
      li.classList.toggle("checked");
      updateProgress();
      saveData();
    }
  });

  const span = document.createElement("span");
  span.innerHTML = "\u00d7";
  span.addEventListener("click", function (e) {
    e.stopPropagation();
    li.remove();
    updateProgress();
    saveData();
  });

  li.appendChild(span);
  taskList.appendChild(li);
  inputBox.value = "";
  saveData();
  updateTaskStates();
  updateProgress();
}

function getTaskList(difficulty) {
  if (difficulty === "green") return greenTasks;
  if (difficulty === "orange") return orangeTasks;
  if (difficulty === "red") return redTasks;
}

function updateTaskStates() {
  const currentTimeSlot = getCurrentTimeSlot();
  document.querySelectorAll(".task").forEach((task) => {
    task.classList.remove("active", "inactive");
    if (currentTimeSlot.includes(task.classList[1])) {
      task.classList.add("active");
    } else {
      task.classList.add("inactive");
    }
  });
}

function getCurrentTimeSlot() {
  const now = testMode ? testTime : new Date();
  const hours = now.getHours();
  if (hours >= 8 && hours < 12) return ["red"];
  if (hours >= 12 && hours < 15) return ["orange"];
  if (hours >= 15 && hours < 17) return ["green"];
  return [];
}

function saveData() {
  const tasks = {
    green: greenTasks.innerHTML,
    orange: orangeTasks.innerHTML,
    red: redTasks.innerHTML,
  };
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || {
    green: "",
    orange: "",
    red: "",
  };
  greenTasks.innerHTML = tasks.green;
  orangeTasks.innerHTML = tasks.orange;
  redTasks.innerHTML = tasks.red;

  // Reattach event listeners after loading from local storage
  document.querySelectorAll(".task").forEach((task) => {
    task.addEventListener("click", function () {
      if (!task.classList.contains("inactive")) {
        task.classList.toggle("checked");
        updateProgress();
        saveData();
      }
    });

    const span = task.querySelector("span");
    span.addEventListener("click", function (e) {
      e.stopPropagation();
      task.remove();
      updateProgress();
      saveData();
    });
  });

  updateTaskStates();
  updateProgress();
}

function updateProgress() {
  const totalTasks = document.querySelectorAll(".task").length;
  const completedTasks = document.querySelectorAll(".task.checked").length;
  const progressPercentage =
    totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  progressText.innerText = `${Math.round(progressPercentage)}%`;
}

loadTasksFromLocalStorage();
setInterval(updateTaskStates, 60000); // Check task states every minute
