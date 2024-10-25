const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const pendingTasks = document.getElementById('pendingTasks');
const completedTasks = document.getElementById('completedTasks');

window.addEventListener('load', () => {
    loadTasksFromStorage();
});

addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        addNewTask(taskText);
        taskInput.value = '';
        saveTasksToStorage();
    }
});

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addNewTask(taskText);
            taskInput.value = '';
            saveTasksToStorage();
        }
    }
});

function addNewTask(taskText, taskStatus = 'pending', dateAdded = new Date().toLocaleString()) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    const taskTextElement = document.createElement('span');
    taskTextElement.classList.add('task-text');
    taskTextElement.textContent = taskText;
    taskTextElement.contentEditable = true;

    //Altered code 
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');

    const taskDateElement = document.createElement('span');
    taskDateElement.classList.add('task-date');
    taskDateElement.textContent = taskStatus === 'pending' ? `Added: ${dateAdded}` : `Completed: ${dateAdded}`;

    const completeButton = createButton('<i class="fa fa-check"></i>', 'complete', () => {
        markTaskComplete(taskItem);
    });

    const deleteButton = createButton('<i class="fa fa-trash"></i>', 'delete', () => {
        deleteTask(taskItem);
    });

    // Append date and buttons to the task container
    taskContainer.appendChild(taskDateElement);
    taskContainer.appendChild(completeButton);
    taskContainer.appendChild(deleteButton);


    taskItem.appendChild(taskTextElement);
    taskItem.appendChild(taskContainer); 

    if (taskStatus === 'pending') {
        pendingTasks.appendChild(taskItem);
    } else {
        completedTasks.appendChild(taskItem);
    }
    saveTasksToStorage();
}

function createButton(innerHTML, className, onClick) {
    const button = document.createElement('button');
    button.classList.add('new-task-buttons', className);
    button.innerHTML = innerHTML;
    button.addEventListener('click', onClick);
    return button;
}

function markTaskComplete(taskItem) {
    const taskTextElement = taskItem.querySelector('.task-text');
    const taskDateElement = taskItem.querySelector('.task-date');

    taskDateElement.textContent = `Completed: ${new Date().toLocaleString()}`;
    completedTasks.appendChild(taskItem);

    taskItem.querySelector('.complete').remove(); // Remove complete button
    saveTasksToStorage();
}

function deleteTask(taskItem) {
    taskItem.remove();
    saveTasksToStorage();
}

function saveTasksToStorage() {
    const pending = [];
    pendingTasks.querySelectorAll('li').forEach(task => pending.push({
        text: task.querySelector('.task-text').textContent,
        date: task.querySelector('.task-date').textContent.replace("Added: ", "").replace("Completed: ", "")
    }));
    const completed = [];
    completedTasks.querySelectorAll('li').forEach(task => completed.push({
        text: task.querySelector('.task-text').textContent,
        date: task.querySelector('.task-date').textContent.replace("Completed: ", "")
    }));
    localStorage.setItem('pendingTasks', JSON.stringify(pending));
    localStorage.setItem('completedTasks', JSON.stringify(completed));
}

function loadTasksFromStorage() {
    const pendingTasksFromStorage = JSON.parse(localStorage.getItem('pendingTasks')) || [];
    const completedTasksFromStorage = JSON.parse(localStorage.getItem('completedTasks')) || [];
    pendingTasksFromStorage.forEach(task => addNewTask(task.text, 'pending', task.date));
    completedTasksFromStorage.forEach(task => addNewTask(task.text, 'completed', task.date));
}
