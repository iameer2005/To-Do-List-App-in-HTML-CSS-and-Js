
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const tasklist = document.getElementById('task-list');
    const emptyImg = document.querySelector('.empty-list');
    const todocontainer = document.querySelector('.todo-container');
    const progressBar = document.getElementById('progress');
    const progressnum = document.getElementById('numbers');
    const form = document.querySelector('.user-input');

    let editTarget = null;

    const toggleEmptyState = () => {
        emptyImg.style.display = tasklist.children.length === 0 ? 'block' : 'none';
        todocontainer.style.width = tasklist.children.length > 0 ? '100%' : '50%';
    };

    const updateProgress = () => {
        const totalTasks = tasklist.children.length;
        const completedtasks = tasklist.querySelectorAll('.checkbox:checked').length;
        progressBar.style.width = totalTasks ? `${(completedtasks / totalTasks) * 100}%` : '0%';
        progressnum.textContent = `${completedtasks} / ${totalTasks}`;
    };

    const saveTaskLocalStorage = () => {
        const tasks = Array.from(tasklist.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasks = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) => addtask(text, completed, false));
        toggleEmptyState();
        updateProgress();
    };

    const addtask = (text = '', completed = false, save = true) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) return;

        if (editTarget) {
            const span = editTarget.querySelector('span');
            span.textContent = taskText;
            editTarget = null;
            taskInput.value = '';
            saveTaskLocalStorage();
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
            <span>${taskText}</span>
            <div class="task-btns">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editbtn = li.querySelector('.edit-btn');

        if (completed) {
            li.classList.add('completed');
            editbtn.disabled = true;
            editbtn.style.opacity = '0.5';
            editbtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const ischecked = checkbox.checked;
            li.classList.toggle('completed', ischecked);
            editbtn.disabled = ischecked;
            editbtn.style.opacity = ischecked ? '0.5' : '1';
            editbtn.style.pointerEvents = ischecked ? 'none' : 'auto';
            updateProgress();
            saveTaskLocalStorage();
        });

        editbtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                editTarget = li;
            }
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskLocalStorage();
        });

        tasklist.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgress();
        if (save) saveTaskLocalStorage();
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addtask();
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addtask();
        }
    });

    loadTasks();
});
