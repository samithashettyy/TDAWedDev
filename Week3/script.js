document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterAllBtn = document.getElementById('filterAll');
    const filterPendingBtn = document.getElementById('filterPending');
    const filterCompletedBtn = document.getElementById('filterCompleted');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all'; // 'all', 'pending', 'completed'

    // Function to render tasks based on the current filter
    function renderTasks() {
        taskList.innerHTML = ''; // Clear existing tasks
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'all') {
                return true;
            } else if (currentFilter === 'pending') {
                return !task.completed;
            } else if (currentFilter === 'completed') {
                return task.completed;
            }
        });

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', task.id); // Use a unique ID for each task

            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <button class="delete-btn">Delete</button>
            `;
            taskList.appendChild(li);
        });
    }

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const newTask = {
                id: Date.now(), // Unique ID
                text: taskText,
                completed: false
            };
            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = ''; // Clear input field
            renderTasks();
        }
    }

    // Function to toggle task completion
    function toggleTaskCompletion(taskId) {
        tasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    // Function to delete a task
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    // Event Listeners

    // Add task on button click
    addTaskBtn.addEventListener('click', addTask);

    // Add task on Enter key press in input field
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Event delegation for marking complete and deleting tasks
    taskList.addEventListener('click', (e) => {
        const li = e.target.closest('.task-item');
        if (!li) return; // Click was not on a task item

        const taskId = parseInt(li.getAttribute('data-id'));

        if (e.target.type === 'checkbox') {
            toggleTaskCompletion(taskId);
        } else if (e.target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        }
    });

    // Filter buttons event listeners
    filterAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        updateFilterButtons('filterAll');
        renderTasks();
    });

    filterPendingBtn.addEventListener('click', () => {
        currentFilter = 'pending';
        updateFilterButtons('filterPending');
        renderTasks();
    });

    filterCompletedBtn.addEventListener('click', () => {
        currentFilter = 'completed';
        updateFilterButtons('filterCompleted');
        renderTasks();
    });

    // Function to update active filter button styling
    function updateFilterButtons(activeButtonId) {
        document.querySelectorAll('.filters button').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(activeButtonId).classList.add('active');
    }

    // Initial render of tasks when the page loads
    renderTasks();
});