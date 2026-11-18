

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const emptyMessage = document.getElementById("emptyMessage");



let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";



function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}



function addTask() {

    let taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    let newTask = {
        id: Date.now(),
        name: taskName,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = "";

    saveTasks();

    displayTasks();

}



addBtn.addEventListener("click", addTask);



taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});



function displayTasks() {

    taskList.innerHTML = "";

    

    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });


    

    filteredTasks.forEach(function(task) {

        let li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }


        

        let checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;


        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();

            displayTasks();

        });


        

        let span = document.createElement("span");

        span.className = "task-text";
        span.textContent = task.name;


        // EDIT BUTTON

        let editBtn = document.createElement("button");

        editBtn.textContent = "✏️ Edit";
        editBtn.className = "edit-btn";


        editBtn.addEventListener("click", function() {

            let updatedTask = prompt(
                "Edit your task:",
                task.name
            );

            if (updatedTask === null) {
                return;
            }

            if (updatedTask.trim() === "") {
                alert("Task cannot be empty!");
                return;
            }

            task.name = updatedTask.trim();

            saveTasks();

            displayTasks();

        });


        

        let deleteBtn = document.createElement("button");

        deleteBtn.textContent = "🗑 Delete";
        deleteBtn.className = "delete-btn";


        deleteBtn.addEventListener("click", function() {

            let confirmDelete = confirm(
                "Are you sure you want to delete this task?"
            );

            if (confirmDelete) {

                tasks = tasks.filter(function(item) {
                    return item.id !== task.id;
                });

                saveTasks();

                displayTasks();

            }

        });


        

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });


    

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

        if (currentFilter === "pending" && tasks.length > 0) {
            emptyMessage.textContent = "🎉 No pending tasks!";
        }
        else if (currentFilter === "completed" && tasks.length > 0) {
            emptyMessage.textContent = "🌸 No completed tasks yet!";
        }
        else {
            emptyMessage.textContent = "🌸 No tasks yet. Add your first task!";
        }

    } else {

        emptyMessage.style.display = "none";

    }




    let total = tasks.length;

    let completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    let pending = total - completed;

    totalCount.textContent = total;

    pendingCount.textContent = pending;

    completedCount.textContent = completed;




    let percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    progressText.textContent = percentage + "% Completed";

    progressFill.style.width = percentage + "%";

}



const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTasks();

    });

});



displayTasks();
