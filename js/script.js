const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Function to load tasks and due dates from local storage when the page loads
function loadTasksAndDueDatesFromStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const dueDates = JSON.parse(localStorage.getItem('dueDates')) || [];

    // Add each task with its due date
    for (let i = 0; i < tasks.length; i++) {
        addTask(tasks[i], dueDates[i]);
    }
}

// Call loadTasksAndDueDatesFromStorage when the page loads
window.addEventListener('load', loadTasksAndDueDatesFromStorage);

// Event listener for adding a task
taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const taskInput = document.getElementById('task');
    const dueDateInput = document.getElementById('due-date');

    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText !== '') {
        addTask(taskText, dueDate);
        taskInput.value = '';
        dueDateInput.value = '';
    }
});

// Function to add a task
function addTask(taskText, dueDate) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${taskText}</span>
        <span class="due-date">${dueDate}</span>
        <button class="complete">Complete</button>
        <button class="delete">Delete</button>
    `;

    taskList.appendChild(li);

    // Store task and due date in local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const dueDates = JSON.parse(localStorage.getItem('dueDates')) || [];

    tasks.push(taskText);
    dueDates.push(dueDate);

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('dueDates', JSON.stringify(dueDates));
}

// Event delegation for completing and deleting tasks
taskList.addEventListener('click', function (e) {
    if (e.target.classList.contains('complete')) {
        const taskText = e.target.parentElement.querySelector('span');
        taskText.classList.toggle('completed');

        // Update local storage after marking a task as complete
        updateLocalStorage();
    } else if (e.target.classList.contains('delete')) {
        e.target.parentElement.remove();

        // Update local storage after deleting a task
        updateLocalStorage();
    }
});

// Function to update the local storage with current tasks and due dates
function updateLocalStorage() {
    const tasks = Array.from(taskList.children).map(task =>
        task.querySelector('span').textContent.trim()
    );
    const dueDates = Array.from(taskList.children).map(task =>
        task.querySelector('.due-date').textContent
    );

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('dueDates', JSON.stringify(dueDates));
}

// Function to enable task editing
function enableTaskEditing(taskElement) {
    const taskText = taskElement.querySelector('span');
    taskText.contentEditable = true;
    taskText.focus();

    taskText.addEventListener('blur', function () {
        taskText.contentEditable = false;
        const editedText = taskText.textContent.trim();
        if (editedText !== '') {
            // Save edited task text
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const index = Array.from(taskList.children).indexOf(taskElement);
            if (index !== -1) {
                tasks[index] = editedText;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        }
    });

    // Allow pressing Enter to save changes
    taskText.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            taskText.blur();
        }
    });
}

// Add filter buttons to the HTML
const filterButtons = document.createElement('div');
filterButtons.innerHTML = `
    <button id="filter-all">All</button>
    <button id="filter-completed">Completed</button>
    <button id="filter-incomplete">Incomplete</button>
`;
document.body.insertBefore(filterButtons, taskList);

// Event listeners for filtering tasks
const filterAllButton = document.getElementById('filter-all');
const filterCompletedButton = document.getElementById('filter-completed');
const filterIncompleteButton = document.getElementById('filter-incomplete');

filterAllButton.addEventListener('click', function () {
    Array.from(taskList.children).forEach(task => task.style.display = 'block');
});

filterCompletedButton.addEventListener('click', function () {
    Array.from(taskList.children).forEach(task => {
        const isCompleted = task.querySelector('span').classList.contains('completed');
        task.style.display = isCompleted ? 'block' : 'none';
    });
});

filterIncompleteButton.addEventListener('click', function () {
    Array.from(taskList.children).forEach(task => {
        const isCompleted = task.querySelector('span').classList.contains('completed');
        task.style.display = isCompleted ? 'none' : 'block';
    });
});

// Function to update the total task count
function updateTotalTaskCount() {
    const totalTasks = taskList.children.length;
    const completedTasks = Array.from(taskList.children).filter(task =>
        task.querySelector('span').classList.contains('completed')
    ).length;
    const incompleteTasks = totalTasks - completedTasks;

    // Display the counts
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('incomplete-tasks').textContent = incompleteTasks;
}

// Call updateTotalTaskCount initially and after each task update
updateTotalTaskCount();


// Function to add a task with notes
function addTask(taskText, dueDate, notes) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${taskText}</span>
        <span class="due-date">${dueDate}</span>
        <textarea class="notes">${notes || ''}</textarea>
        <button class="complete">Complete</button>
        <button class="delete">Delete</button>
    `;

    taskList.appendChild(li);

    // Store task, due date, and notes in local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const dueDates = JSON.parse(localStorage.getItem('dueDates')) || [];
    const taskNotes = JSON.parse(localStorage.getItem('taskNotes')) || [];

    tasks.push(taskText);
    dueDates.push(dueDate);
    taskNotes.push(notes || ''); // Use an empty string if notes are not provided

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('dueDates', JSON.stringify(dueDates));
    localStorage.setItem('taskNotes', JSON.stringify(taskNotes));
}

// Event listener for editing task notes
taskList.addEventListener('input', function (e) {
    if (e.target.classList.contains('notes')) {
        const taskText = e.target.parentElement.querySelector('span').textContent;
        const dueDate = e.target.parentElement.querySelector('.due-date').textContent;
        const notes = e.target.value;

        // Update local storage when task notes are edited
        updateTaskNotes(taskText, dueDate, notes);
    }
});

// Function to update task notes in local storage
function updateTaskNotes(taskText, dueDate, notes) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const dueDates = JSON.parse(localStorage.getItem('dueDates')) || [];
    const taskNotes = JSON.parse(localStorage.getItem('taskNotes')) || [];

    const taskIndex = tasks.findIndex(task => task === taskText && dueDates[taskIndex] === dueDate);

    if (taskIndex !== -1) {
        taskNotes[taskIndex] = notes;
        localStorage.setItem('taskNotes', JSON.stringify(taskNotes));
    }
}

// Function to add a task with category
function addTask(taskText, dueDate, notes, category) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${taskText}</span>
        <span class="due-date">${dueDate}</span>
        <textarea class="notes">${notes || ''}</textarea>
        <select class="category">
            <option value="Personal" ${category === 'Personal' ? 'selected' : ''}>Personal</option>
            <option value="Work" ${category === 'Work' ? 'selected' : ''}>Work</option>
            <option value="Study" ${category === 'Study' ? 'selected' : ''}>Study</option>
            <option value="Other" ${category === 'Other' ? 'selected' : ''}>Other</option>
        </select>
        <button class="complete">Complete</button>
        <button class="delete">Delete</button>
    `;

    taskList.appendChild(li);

    // Store task, due date, notes, and category in local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const dueDates = JSON.parse(localStorage.getItem('dueDates')) || [];
    const taskNotes = JSON.parse(localStorage.getItem('taskNotes')) || [];
    const taskCategories = JSON.parse(localStorage.getItem('taskCategories')) || [];

    tasks.push(taskText);
    dueDates.push(dueDate);
    taskNotes.push(notes || '');
    taskCategories.push(category || ''); // Use an empty string if category is not provided

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('dueDates', JSON.stringify(dueDates));
    localStorage.setItem('taskNotes', JSON.stringify(taskNotes));
    localStorage.setItem('taskCategories', JSON.stringify(taskCategories));
}

// Event listener for editing task categories
taskList.addEventListener('change', function (e) {
    if (e.target.classList.contains('category')) {
        const taskText = e.target.parentElement.querySelector('span').textContent;
        const dueDate = e.target.parentElement.querySelector('.due-date').textContent;
        const category = e.target.value;

        // Update local storage when task categories are changed
        updateTaskCategory(taskText, dueDate, category);
    }
});

// Function to update task categories in local storage
function updateTaskCategory(taskText, dueDate, category) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const dueDates = JSON.parse(localStorage.getItem('dueDates')) || [];
    const taskCategories = JSON.parse(localStorage.getItem('taskCategories')) || [];

    const taskIndex = tasks.findIndex(task => task === taskText && dueDates[taskIndex] === dueDate);

    if (taskIndex !== -1) {
        taskCategories[taskIndex] = category;
        localStorage.setItem('taskCategories', JSON.stringify(taskCategories));
    }
}
