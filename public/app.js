// API endpoints
const API_BASE = '/api/todos';

// DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

// State
let todos = [];

// Fetch all todos
async function fetchTodos() {
    try {
        const response = await fetch(API_BASE);
        todos = await response.json();
        renderTodos();
    } catch (error) {
        console.error('Error fetching todos:', error);
        alert('Failed to load todos');
    }
}

// Add a new todo
async function addTodo() {
    const text = todoInput.value.trim();

    if (!text) {
        alert('Please enter a todo');
        return;
    }

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        if (response.ok) {
            todoInput.value = '';
            fetchTodos();
        } else {
            alert('Failed to add todo');
        }
    } catch (error) {
        console.error(error);
    }
}

// Toggle todo completion
async function toggleTodo(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
        });

        if (response.ok) {
            fetchTodos();
        }
    } catch (error) {
        console.error(error);
    }
}

// ✨ Edit todo
async function editTodo(id) {
    const newText = prompt('Edit todo text:');

    if (newText === null) return;
    if (newText.trim() === '') {
        alert('Todo cannot be empty');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newText }),
        });

        if (response.ok) {
            fetchTodos();
        } else {
            alert('Failed to edit todo');
        }
    } catch (error) {
        console.error(error);
    }
}

// Delete todo
async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchTodos();
        }
    } catch (error) {
        console.error(error);
    }
}

// Render todos
function renderTodos() {
    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">No todos yet</div>';
    } else {
        todoList.innerHTML = todos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <input type="checkbox"
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})"
                />
                <span>${escapeHtml(todo.text)}</span>
                <button onclick="editTodo(${todo.id})">Edit</button>
                <button onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `).join('');
    }

    updateStats();
}

// Update stats
function updateStats() {
    totalCount.textContent = `Total: ${todos.length}`;
    completedCount.textContent =
        `Completed: ${todos.filter(t => t.completed).length}`;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Events
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTodo();
});

// Init
fetchTodos();