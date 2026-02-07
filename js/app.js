// js/app.js - Main App Entry

const initApp = async () => {
    console.log('initApp started');
    const userEmail = localStorage.getItem('currentUser');
    if (!userEmail) return;

    const workspaces = await API.fetchUserWorkspaces(userEmail);
    if (!workspaces || workspaces.length === 0) return;

    Store.setWorkspaces(workspaces);
    
    // Restore previous active workspace if it exists, otherwise use the first one
    const savedWorkspaceId = localStorage.getItem('activeWorkspaceId');
    if (savedWorkspaceId && workspaces.find(ws => String(ws.workspaceId) === savedWorkspaceId)) {
        Store.setActiveWorkspace(savedWorkspaceId);
    }
    
    buildWorkspaceRail();
    
    let data = Store.getState();
    let ws = data.workspaces[data.activeWorkspace];
    if (!ws) return;

    // Fetch channels for active workspace
    const channels = await API.fetchChannels(Number(data.activeWorkspace), userEmail);
    Store.setChannels(channels);

    // Fetch members for active workspace
    const members = await API.fetchWorkspaceMembers(Number(data.activeWorkspace), userEmail);
    Store.setMembers(members);

    // Refresh data after setting channels and members
    data = Store.getState();
    ws = data.workspaces[data.activeWorkspace];

    const feed = document.getElementById('messageFeed');
    const textarea = document.querySelector('.input-wrapper textarea');
    const btn = document.querySelector('.send-btn');
    const title = document.querySelector('.chat-header h3');

    // Ensure elements exist before initializing messaging
    if (feed && textarea && btn && title) {
        initMessaging(feed, textarea, btn, title);
    } else {
        console.warn('Some messaging elements not found:', { feed, textarea, btn, title });
    }

    const titleEl = document.getElementById('workspaceTitle');
    if (titleEl) {
        titleEl.innerHTML = `${ws.name} <i class="fa-solid fa-chevron-down"></i>`;
    }

    initWorkspaceListeners();
    renderSidebar(data);
    renderDirectMessages(data);
    setupChannelListeners();
    setupDirectMessageListeners();
    setupCollapsibleSections();
    
    console.log('About to initialize modals');
    initWorkspaceModal();
    console.log('Workspace modal initialized');
    initChannelModal();
    console.log('Channel modal initialized');
    reinitializeChannelModalButtons();
    console.log('Channel modal buttons reinitialized');
    initInviteMemberModal();
    console.log('Invite member modal initialized');
    initAddChannelMemberModal();
    console.log('Add channel member modal initialized');

    // Auto-open create channel modal if no channels exist
    if (ws.channels.length === 0) {
        setTimeout(() => {
            document.getElementById('channelModal').classList.add('open');
            document.getElementById('newChannelName').focus();
        }, 500);
    }

    loadChannel(data.activeChannel);
};

const buildWorkspaceRail = () => {
    const rail = document.getElementById('workspaceRail');
    rail.innerHTML = '';

    const data = Store.getState();
    Object.values(data.workspaces).forEach(ws => {
        const item = document.createElement('div');
        item.className = 'rail-item';
        if (ws.id === data.activeWorkspace) item.classList.add('active');
        item.dataset.workspace = ws.id;
        item.innerHTML = `<span class="ws-initials">${getInitials(ws.name)}</span>`;
        rail.appendChild(item);
    });

    // Recreate the add-ws button
    const addBtn = document.createElement('div');
    addBtn.className = 'rail-item add-ws';
    addBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
    rail.appendChild(addBtn);
};

const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

document.addEventListener('DOMContentLoaded', initApp);
