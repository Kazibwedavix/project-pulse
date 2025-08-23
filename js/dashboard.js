// js/dashboard.js

// --- Modal Control Functions ---
function openProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.add('show');
    // Focus on the input field for better UX
    document.getElementById('projectName').focus();
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
    // Reset the form when closing
    document.getElementById('projectForm').reset();
}

// --- Project Form Handling ---
function handleProjectFormSubmit(event) {
    event.preventDefault(); // CRITICAL: Prevent the form from refreshing the page

    // 1. Get the value from the input field
    const projectNameInput = document.getElementById('projectName');
    const projectName = projectNameInput.value.trim();

    // 2. Basic validation
    if (projectName === '') {
        alert('Please enter a project name.');
        return;
    }

    // 3. Create the project
    createNewProject(projectName);

    // 4. Close the modal
    closeProjectModal();
}

// --- Connect Everything ---
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();

    // Connect the "New Project" button to open the modal
    const newProjectBtn = document.getElementById('newProjectBtn');
    newProjectBtn.addEventListener('click', openProjectModal);

    // Connect the modal's form submit event
    const projectForm = document.getElementById('projectForm');
    projectForm.addEventListener('submit', handleProjectFormSubmit);

    // Connect the close (X) button and the cancel button
    document.querySelector('.modal-close').addEventListener('click', closeProjectModal);
    document.getElementById('modalCancelBtn').addEventListener('click', closeProjectModal);

    // Bonus: Close modal if user clicks on the background overlay
    document.getElementById('projectModal').addEventListener('click', (event) => {
        if (event.target.id === 'projectModal') {
            closeProjectModal();
        }
    });
});

// menu item
function setupMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const projectSidebar = document.querySelector('.project-sidebar');

  if (mobileMenuBtn && projectSidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      projectSidebar.classList.toggle('mobile-open');
    });
  }
}

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  setupMobileMenu(); // Initialize mobile menu functionality
  // ... keep the rest of your existing code ...
});