// js/dashboard.js

// 1. DATA & STATE      //
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

// 2. CORE FUNCTIONS    //
function renderProjects() {
    const projectListElement = document.getElementById('projectList');
    projectListElement.innerHTML = ''; // Clear the list first

    projects.forEach(project => {
        // Create container for project item
        const projectElement = document.createElement('li');
        projectElement.classList.add('project-item');
        projectElement.dataset.id = project.id;

        // Create span for project name
        const projectNameSpan = document.createElement('span');
        projectNameSpan.textContent = project.name;
        projectNameSpan.classList.add('project-name');

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.classList.add('project-delete-btn');
        deleteBtn.title = 'Delete Project';

        // Append name and button to project element
        projectElement.appendChild(projectNameSpan);
        projectElement.appendChild(deleteBtn);

        // Add click event to select project (on the name span)
        projectNameSpan.addEventListener('click', () => {
            selectProject(project.id);
        });

        projectListElement.appendChild(projectElement);
    });
}
function setupProjectClickHandlers() {
    const projectListElement = document.getElementById('projectList');
    
    if (projectListElement) {
        projectListElement.addEventListener('click', (event) => {
            // Handle Delete Button Clicks
            if (event.target.classList.contains('project-delete-btn')) {
                const projectElement = event.target.closest('.project-item');
                const projectId = parseInt(projectElement.dataset.id);
                deleteProject(projectId);
            }
        });
    }
}

function deleteProject(projectId) {
    // Prevent deleting the currently selected project if it's the one being deleted
    const isCurrentProject = projectId === currentProjectId;
    
    // REPLACED: confirm() with custom modal
    showConfirmationModal('Are you sure you want to delete this project and all its tasks? This action cannot be undone.', () => {
        // This function runs only if user clicks "Confirm"
        
        // Find the index of the project in the array
        const projectIndex = projects.findIndex(project => project.id === projectId);
        
        if (projectIndex !== -1) {
            // Remove the project from the array
            projects.splice(projectIndex, 1);
            
            // If we deleted the currently selected project, clear the view
            if (isCurrentProject) {
                currentProjectId = null;
                document.getElementById('currentProjectName').textContent = 'Select a Project';
                document.getElementById('newTaskBtn').disabled = true;
                document.getElementById('taskList').innerHTML = '<p>Select a project from the sidebar to view its tasks.</p>';
                
                // Also remove active class from any project
                document.querySelectorAll('.project-item').forEach(item => {
                    item.classList.remove('active');
                });
            }
            
            // Re-render the project list to update the UI
            renderProjects();
            
            // Save the updated data to localStorage
            saveProjectsToStorage();
        }
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
    saveProjectsToStorage(); // SAVE: Persist the change to localStorage
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

    // Render the tasks
    renderTasks(selectedProject.tasks);
}
// renderTasks
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
        taskElement.dataset.taskId = task.id;

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.classList.add('task-checkbox');

        // --- CHANGED: Task Text Container ---
        // Create a container for both display text and edit input
        const taskTextContainer = document.createElement('div');
        taskTextContainer.classList.add('task-text-container');

        // Task Text (Display Mode)
        const taskTextDisplay = document.createElement('span');
        taskTextDisplay.textContent = task.title;
        taskTextDisplay.classList.add('task-text');
        if (task.completed) {
            taskTextDisplay.classList.add('completed');
        }

        // Task Input (Edit Mode - initially hidden)
        const taskInputEdit = document.createElement('input');
        taskInputEdit.type = 'text';
        taskInputEdit.value = task.title;
        taskInputEdit.classList.add('task-edit-input');
        taskInputEdit.style.display = 'none'; // Hide it by default

        // Append both display and edit elements to the container
        taskTextContainer.appendChild(taskTextDisplay);
        taskTextContainer.appendChild(taskInputEdit);
        // --- END OF CHANGES ---

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.classList.add('task-delete-btn');
        deleteBtn.title = 'Delete Task';

        // Append everything to the task element
        taskElement.appendChild(checkbox);
        taskElement.appendChild(taskTextContainer); // Replaced taskText with container
        taskElement.appendChild(deleteBtn);

        taskListElement.appendChild(taskElement);
    });
}
// --- Data Persistence Functions ---
function saveProjectsToStorage() {
    // 1. Convert the 'projects' array into a JSON string
    const projectsJson = JSON.stringify(projects);
    // 2. Save that string to localStorage under the key 'projectPulseData'
    localStorage.setItem('projectPulseData', projectsJson);
    console.log('Projects saved to localStorage!'); // Optional: for debugging
}

function loadProjectsFromStorage() {
    // 1. Try to get the saved data from localStorage
    const savedData = localStorage.getItem('projectPulseData');
    
    // 2. Check if there actually was any data saved
    if (savedData) {
        try {
            // 3. Convert the string back into a live JavaScript array
            projects = JSON.parse(savedData);
            console.log('Projects loaded from localStorage!'); // Optional
        } catch (error) {
            console.error('Error parsing saved data:', error);
            // If the saved data is corrupt, start with the default dummy data
            // (The original 'projects' array is already the default, so we don't need to set it)
        }
    } else {
        console.log('No saved data found. Using default projects.');
        // If nothing was saved, just use the default dummy data
        // No need to do anything, 'projects' is already the dummy array
    }
}
// setupTaskClickHandlers function
function setupTaskClickHandlers() {
    const taskListElement = document.getElementById('taskList');
    
    if (taskListElement) {
        taskListElement.addEventListener('click', (event) => {
            // 1. Handle Checkbox Toggles
            if (event.target.classList.contains('task-checkbox')) {
                const taskElement = event.target.closest('.task-item');
                const taskId = parseInt(taskElement.dataset.taskId);
                toggleTaskCompletion(taskId);
            }
            
            // 2. Handle Delete Button Clicks
            if (event.target.classList.contains('task-delete-btn')) {
                const taskElement = event.target.closest('.task-item');
                const taskId = parseInt(taskElement.dataset.taskId);
                deleteTask(taskId);
            }
        });

        // NEW: Handle double-click to edit task text
        taskListElement.addEventListener('dblclick', (event) => {
            // Check if double-click is on the task text
            if (event.target.classList.contains('task-text')) {
                const taskElement = event.target.closest('.task-item');
                const taskId = parseInt(taskElement.dataset.taskId);
                enableTaskEdit(taskId, event.target);
            }
        });

        // NEW: Handle pressing 'Enter' to save the edit
        taskListElement.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && event.target.classList.contains('task-edit-input')) {
                const taskElement = event.target.closest('.task-item');
                const taskId = parseInt(taskElement.dataset.taskId);
                saveTaskEdit(taskId, event.target.value);
            }
        });
    }
}
// function enableTaskEdit
function enableTaskEdit(taskId, textElement) {
    // Find the elements
    const textContainer = textElement.parentElement;
    const displayText = textContainer.querySelector('.task-text');
    const editInput = textContainer.querySelector('.task-edit-input');
    
    // Switch to edit mode
    displayText.style.display = 'none';
    editInput.style.display = 'block';
    editInput.focus();
    // Highlight the text for easy editing
    editInput.select();
}

function saveTaskEdit(taskId, newTitle) {
    const trimmedTitle = newTitle.trim();
    
    // Basic validation
    if (trimmedTitle === '') {
        alert('Task title cannot be empty.');
        return;
    }

    // Find the currently selected project and the specific task
    const selectedProject = projects.find(project => project.id === currentProjectId);
    const taskToUpdate = selectedProject.tasks.find(task => task.id === taskId);
    
    if (taskToUpdate && trimmedTitle !== taskToUpdate.title) {
        // Update the task title
        taskToUpdate.title = trimmedTitle;
        
        // Re-render the tasks to show the updated text
        renderTasks(selectedProject.tasks);
        
        // Save the updated data to localStorage
        saveProjectsToStorage();
    }
    
    // Exit edit mode
    const taskElement = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
    if (taskElement) {
        const textContainer = taskElement.querySelector('.task-text-container');
        textContainer.querySelector('.task-text').style.display = 'block';
        textContainer.querySelector('.task-edit-input').style.display = 'none';
    }
}

function deleteTask(taskId) {
    // Find the currently selected project
    const selectedProject = projects.find(project => project.id === currentProjectId);
    
    if (selectedProject) {
        // REPLACED: confirm() with custom modal
        showConfirmationModal('Are you sure you want to delete this task?', () => {
            // This function runs only if user clicks "Confirm"
            // Find the index of the task in the array
            const taskIndex = selectedProject.tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex !== -1) {
                // Remove the task from the array using splice()
                selectedProject.tasks.splice(taskIndex, 1);
                
                // Re-render the tasks to update the UI
                renderTasks(selectedProject.tasks);
                
                // Save the updated data to localStorage
                saveProjectsToStorage();
            }
        });
    }
}

function toggleTaskCompletion(taskId) {
    // 1. Find the currently selected project
    const selectedProject = projects.find(project => project.id === currentProjectId);
    
    if (selectedProject) {
        // 2. Find the specific task within that project's tasks array
        const taskToUpdate = selectedProject.tasks.find(task => task.id === taskId);
        
        if (taskToUpdate) {
            // 3. Toggle the completed status
            taskToUpdate.completed = !taskToUpdate.completed;
            
            // 4. Re-render the tasks to show the updated visual state
            renderTasks(selectedProject.tasks);
            
            // 5. Save the updated data to localStorage
            saveProjectsToStorage();
        }
    }
}

// 3. MODAL FUNCTIONS   //
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    // Focus on the first input field in the modal for better UX
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    // Find and reset the form inside the modal
    const form = modal.querySelector('form');
    if (form) form.reset();
}
// --- Confirmation Modal Function ---
function showConfirmationModal(message, onConfirm) {
    const modal = document.getElementById('confirmationModal');
    const messageElement = document.getElementById('confirmationModalMessage');
    const confirmBtn = document.getElementById('confirmationConfirmBtn');
    
    // Set the message
    messageElement.textContent = message;
    
    // Remove any old listeners to avoid duplicates
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Add the new confirm listener
    newConfirmBtn.addEventListener('click', () => {
        onConfirm();
        closeModal('confirmationModal');
    });
    
    // Also setup escape key to close
    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            closeModal('confirmationModal');
            document.removeEventListener('keydown', handleEscape);
        }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Open the modal
    openModal('confirmationModal');
    
    // Focus on the cancel button for better keyboard navigation
    document.getElementById('confirmationCancelBtn').focus();
}

// --- Project Form Handling ---
function handleProjectFormSubmit(event) {
    event.preventDefault(); // CRITICAL: Prevent the form from refreshing the page

    const projectNameInput = document.getElementById('projectName');
    const projectName = projectNameInput.value.trim();

    if (projectName === '') {
        alert('Please enter a project name.');
        return;
    }

    createNewProject(projectName);
    closeModal('projectModal');
}

// --- Task Form Handling ---
function handleTaskFormSubmit(event) {
    event.preventDefault(); // CRITICAL: Prevent the form from refreshing the page

    const taskTitleInput = document.getElementById('taskTitle');
    const taskTitle = taskTitleInput.value.trim();

    if (taskTitle === '') {
        alert('Please enter a task title.');
        return;
    }

    // Create the task object
    const newTask = {
        id: Date.now(),
        title: taskTitle,
        completed: false
    };

    addTaskToCurrentProject(newTask);
    closeModal('taskModal');
}

function addTaskToCurrentProject(newTask) {
    const selectedProject = projects.find(project => project.id === currentProjectId);

    if (selectedProject) {
        selectedProject.tasks.push(newTask);
        renderTasks(selectedProject.tasks);
        saveProjectsToStorage(); // SAVE: Persist the change to localStorage
    } else {
        console.error("No project selected!");
    }
}

// 4. MOBILE MENU       //
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const projectSidebar = document.querySelector('.project-sidebar');

    if (mobileMenuBtn && projectSidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            projectSidebar.classList.toggle('mobile-open');
        });
    }
}


// 5. INITIALIZATION    //
document.addEventListener('DOMContentLoaded', () => {
    // -- LOAD SAVED DATA FIRST -- //
    loadProjectsFromStorage();

    // -- RENDER THE UI -- //
    renderProjects();
    setupMobileMenu();
    setupTaskClickHandlers();
     setupProjectClickHandlers(); // <-- NEW: Initialize task checkbox handlers

    // --- Project Modal Event Listeners ---
    const newProjectBtn = document.getElementById('newProjectBtn');
    const projectForm = document.getElementById('projectForm');
    const projectModal = document.getElementById('projectModal');

    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', () => openModal('projectModal'));
    }
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectFormSubmit);
    }
    if (projectModal) {
        // Close modal on background click
        projectModal.addEventListener('click', (event) => {
            if (event.target.id === 'projectModal') {
                closeModal('projectModal');
            }
        });
    }
    // --- Logout Button ---
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // For now, just reset the view to a clean state
        currentProjectId = null;
        document.getElementById('currentProjectName').textContent = 'Select a Project';
        document.getElementById('newTaskBtn').disabled = true;
        document.getElementById('taskList').innerHTML = '<p>Select a project from the sidebar to view its tasks.</p>';
        
        // Remove active class from any project
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('active');
        });
        
        alert("You've been logged out. (This will connect to a real backend in the future!)");
    });
}

    // --- Task Modal Event Listeners ---
    const newTaskBtn = document.getElementById('newTaskBtn');
    const taskForm = document.getElementById('taskForm');
    const taskModal = document.getElementById('taskModal');

    if (newTaskBtn) {
        newTaskBtn.addEventListener('click', () => {
            if (currentProjectId !== null) {
                openModal('taskModal');
            }
        });
    }
    if (taskForm) {
        taskForm.addEventListener('submit', handleTaskFormSubmit);
    }
    if (taskModal) {
        // Close modal on background click
        taskModal.addEventListener('click', (event) => {
            if (event.target.id === 'taskModal') {
                closeModal('taskModal');
            }
        });
    }


// --- Confirmation Modal Event Listeners ---
const confirmationModal = document.getElementById('confirmationModal');
const confirmationCancelBtn = document.getElementById('confirmationCancelBtn');

if (confirmationCancelBtn) {
    confirmationCancelBtn.addEventListener('click', () => {
        closeModal('confirmationModal');
        // Clean up the escape key listener
        document.removeEventListener('keydown', handleEscape);
    });
}

if (confirmationCancelBtn) {
    confirmationCancelBtn.addEventListener('click', () => {
        closeModal('confirmationModal');
    });
}

    // --- Close buttons (using event delegation) ---
    // Listen for clicks on any element with the 'modal-close' class or 'data-modal-close' attribute
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal-close')) {
            const modalId = event.target.closest('.modal').id;
            closeModal(modalId);
        }
        if (event.target.dataset.modalClose) {
            closeModal(event.target.dataset.modalClose);
        }
    });
}); // <-- This is the correct closing for DOMContentLoaded