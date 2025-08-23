// js/dashboard.js

// 1. SIMULATED DATABASE (Dummy Data)
let projects = [
    {
        id: 1,
        name: 'Learn Web Development',
        tasks: [
            { id: 1, title: 'Complete HTML & CSS for Project Pulse', completed: true },
            { id: 2, title: 'Learn JavaScript interactivity', completed: false },
            { id: 3, title: 'Build a Node.js backend', completed: false }
        ]
    },
    {
        id: 2,
        name: 'Plan Summer Trip',
        tasks: [
            { id: 1, title: 'Research destinations', completed: false },
            { id: 2, title: 'Book flights', completed: false }
        ]
    }
];
let currentProjectId = null; // Tracks the currently selected project

// 2. CORE APPLICATION FUNCTIONS
function renderProjects() {
    const projectListElement = document.getElementById('projectList');
    projectListElement.innerHTML = ''; // Clear the list first

    projects.forEach(project => {
        const projectElement = document.createElement('li');
        projectElement.classList.add('project-item');
        projectElement.textContent = project.name;
        projectElement.dataset.id = project.id; // Store ID for selection

        projectElement.addEventListener('click', () => {
            selectProject(project.id);
        });

        projectListElement.appendChild(projectElement);
    });
}

function createNewProject(name) {
    const newProject = {
        id: Date.now(), // Simple unique ID
        name: name,
        tasks: [] // Start with an empty task array
    };

    projects.push(newProject); // Add to our data
    renderProjects(); // Update the UI
    selectProject(newProject.id); // Select the new project
}

function selectProject(projectId) {
    currentProjectId = projectId;
    const selectedProject = projects.find(project => project.id === projectId);

    // Update UI
    document.getElementById('currentProjectName').textContent = selectedProject.name;
    document.getElementById('newTaskBtn').disabled = false;

    // Visual feedback for selected project
    document.querySelectorAll('.project-item').forEach(item => {
        item.classList.remove('active');
    });
    const selectedElement = document.querySelector(`.project-item[data-id="${projectId}"]`);
    if (selectedElement) selectedElement.classList.add('active');

    // Render the tasks (You need to implement renderTasks)
    renderTasks(selectedProject.tasks);
}

function renderTasks(tasks) {
    const taskListElement = document.getElementById('taskList');
    taskListElement.innerHTML = '';

    if (tasks.length === 0) {
        taskListElement.innerHTML = '<p>No tasks found. Add a new task to get started!</p>';
        return;
    }

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        // Add checkbox, title, etc. here later
        taskElement.textContent = task.title;
        taskListElement.appendChild(taskElement);
    });
}

// 3. MODAL CONTROL FUNCTIONS
function openProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.add('show');
    document.getElementById('projectName').focus();
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
    document.getElementById('projectForm').reset();
}

function handleProjectFormSubmit(event) {
    event.preventDefault(); // CRITICAL: Prevent the form from refreshing the page

    const projectNameInput = document.getElementById('projectName');
    const projectName = projectNameInput.value.trim();

    if (projectName === '') {
        alert('Please enter a project name.');
        return;
    }

    createNewProject(projectName);
    closeProjectModal();
}

// 4. MOBILE MENU FUNCTIONALITY
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const projectSidebar = document.querySelector('.project-sidebar');

    if (mobileMenuBtn && projectSidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            projectSidebar.classList.toggle('mobile-open');
        });
    }
}

// 5. INITIALIZE THE APPLICATION
document.addEventListener('DOMContentLoaded', () => {
    // Render the initial state
    renderProjects();

    // Setup Mobile Menu
    setupMobileMenu();

    // Connect Modal Functionality
    const newProjectBtn = document.getElementById('newProjectBtn');
    const projectForm = document.getElementById('projectForm');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modal = document.getElementById('projectModal');

    if (newProjectBtn) newProjectBtn.addEventListener('click', openProjectModal);
    if (projectForm) projectForm.addEventListener('submit', handleProjectFormSubmit);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeProjectModal);

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target.id === 'projectModal') {
                closeProjectModal();
            }
        });
    }
});