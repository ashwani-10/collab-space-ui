// js/modals/workspace-modal.js - Workspace creation modal

let _workspaceModalInitialized = false;

function reinitializeWorkspaceModalButtons() {
    const workspaceModal = document.getElementById('workspaceModal');
    const workspaceNameInput = document.getElementById('newWorkspaceName');
    
    if (!workspaceModal || !workspaceNameInput) return;
    
    document.querySelectorAll('.add-ws').forEach(btn => {
        if (!btn._addWsListenerAdded) {
            btn.addEventListener('click', (e) => {
                console.log('Add workspace button clicked');
                e.preventDefault();
                e.stopPropagation();
                workspaceModal.classList.add('open');
                workspaceNameInput.focus();
            });
            btn._addWsListenerAdded = true;
        }
    });
}

function initWorkspaceModal() {
    if (_workspaceModalInitialized) return;
    _workspaceModalInitialized = true;
    
    const workspaceModal = document.getElementById('workspaceModal');
    const createWorkspaceForm = document.getElementById('createWorkspaceForm');
    const workspaceNameInput = document.getElementById('newWorkspaceName');
    const createWorkspaceBtn = document.getElementById('createWorkspaceBtn');

    console.log('initWorkspaceModal called');

    if (!workspaceModal || !createWorkspaceForm) {
        console.error('Workspace modal or form not found');
        return;
    }

    // Initial button setup
    reinitializeWorkspaceModalButtons();

    // Close Modal
    workspaceModal.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            workspaceModal.classList.remove('open');
        });
    });

    // Handle Form Submit
    createWorkspaceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const workspaceName = workspaceNameInput.value.trim();
        
        if (workspaceName) {
            createWorkspaceBtn.disabled = true;
            createWorkspaceBtn.textContent = 'Creating...';
            
            try {
                const loggedInEmail = localStorage.getItem('currentUser');
                const result = await API.createWorkspace(workspaceName, loggedInEmail);
                
                if (result.ok) {
                    workspaceModal.classList.remove('open');
                    createWorkspaceForm.reset();
                    
                    // Refresh workspace list from API
                    const workspaces = await API.fetchUserWorkspaces(loggedInEmail);
                    Store.setWorkspaces(workspaces);
                    buildWorkspaceRail();
                    
                    alert(result.message || `Workspace "${workspaceName}" created successfully!`);
                } else {
                    alert(result.message || 'Failed to create workspace. Please try again.');
                }
            } catch (error) {
                console.error('Error creating workspace:', error);
                alert('Failed to create workspace. Please try again.');
            } finally {
                createWorkspaceBtn.disabled = false;
                createWorkspaceBtn.textContent = 'Create';
            }
        }
    });

    // Close Modal on Outside Click
    workspaceModal.addEventListener('click', (e) => {
        if (e.target === workspaceModal) {
            workspaceModal.classList.remove('open');
        }
    });
}
