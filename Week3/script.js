document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterAllBtn = document.getElementById('filterAll');
    const filterPendingBtn = document.getElementById('filterPending');
    const filterCompletedBtn = document.getElementById('filterCompleted');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all'; 
    function renderTasks() {
        taskList.innerHTML = ''; 
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
            li.setAttribute('data-id', task.id); 

            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <button class="delete-btn">Delete</button>
            `;
            taskList.appendChild(li);
        });
    }

    
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const newTask = {
                id: Date.now(), 
                text: taskText,
                completed: false
            };
            tasks.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = ''; 
            renderTasks();
        }
    }

    
    function toggleTaskCompletion(taskId) {
        tasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

   
    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });


    taskList.addEventListener('click', (e) => {
        const li = e.target.closest('.task-item');
        if (!li) return; 

        const taskId = parseInt(li.getAttribute('data-id'));

        if (e.target.type === 'checkbox') {
            toggleTaskCompletion(taskId);
        } else if (e.target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        }
    });

    
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

    
    function updateFilterButtons(activeButtonId) {
        document.querySelectorAll('.filters button').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(activeButtonId).classList.add('active');
    }
 
    renderTasks();
});
