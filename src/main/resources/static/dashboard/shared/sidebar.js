// Shared sidebar logic for AEDES dashboard management pages
(function() {
    // Role-based nav config
    const NAV = {
        ADMIN: [
            { label: 'Main', items: [
                { icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>', name: 'Dashboard', link: '../dashboard.html' }
            ]},
            { label: 'Management', items: [
                { icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>', name: 'Campuses', link: '../campuses/campuses.html' },
                { icon: '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="9" y1="12" x2="9" y2="12.01"/><line x1="9" y1="18" x2="9" y2="18.01"/>', name: 'Buildings', link: '../buildings/buildings.html' },
                { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>', name: 'Rooms', link: '../rooms/rooms.html' },
                { icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', name: 'Users', link: '../users/users.html' }
            ]},
            { label: 'Reservations', items: [
                { icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', name: 'All Reservations', link: '../reservations/reservations.html' },
                { icon: '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>', name: 'Approvals', link: '../approvals/approvals.html' }
            ]},
            { label: 'Analytics', items: [
                { icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>', name: 'Reports', link: '../reports/reports.html' },
                { icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>', name: 'Utilization', link: '../utilization/utilization.html' }
            ]}
        ],
        FACULTY: [
            { label: 'Main', items: [
                { icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>', name: 'Dashboard', link: '../dashboard.html' }
            ]},
            { label: 'Browse', items: [
                { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>', name: 'Browse Rooms', link: '../rooms/browse.html' },
                { icon: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>', name: 'Campus Map', link: '../map/map.html' }
            ]},
            { label: 'My Reservations', items: [
                { icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', name: 'Reservations', link: '../reservations/reservations.html' }
            ]}
        ],
        STUDENT: [
            { label: 'Main', items: [
                { icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>', name: 'Dashboard', link: '../dashboard.html' }
            ]},
            { label: 'Browse', items: [
                { icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>', name: 'Browse Rooms', link: '../rooms/browse.html' },
                { icon: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>', name: 'Campus Map', link: '../map/map.html' }
            ]},
            { label: 'My Reservations', items: [
                { icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', name: 'Reservations', link: '../reservations/reservations.html' }
            ]}
        ]
    };

    // Build sidebar HTML
    function buildSidebar(activePage) {
        const role = getRole();
        const nav = NAV[role] || NAV.ADMIN;
        const user = getUser();
        const name = user?.name || user?.username || 'User';
        const userRole = user?.role || role;
        const initial = name.charAt(0).toUpperCase();

        let sections = nav.map(s => `
            <div class="nav-section">
                <div class="nav-label">${s.label}</div>
                ${s.items.map(i => `
                    <a href="${i.link}" class="nav-item${i.name === activePage ? ' active' : ''}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${i.icon}</svg>
                        ${i.name}
                    </a>
                `).join('')}
            </div>
        `).join('');

        document.getElementById('sidebar').innerHTML = `
            <div class="sidebar-hdr">
                <a href="../dashboard.html" class="sidebar-logo">AEDES</a>
            </div>
            <nav class="sidebar-nav">${sections}</nav>
            <div class="sidebar-ftr">
                <a href="../../profile/profile.html" class="sidebar-avatar">${initial}</a>
                <div class="sidebar-user">
                    <div class="sidebar-user-name">${name}</div>
                    <div class="sidebar-user-role">${userRole.charAt(0) + userRole.slice(1).toLowerCase()}</div>
                </div>
            </div>
        `;
    }

    function getRole() {
        try { return JSON.parse(localStorage.getItem('aedes_user'))?.role || 'ADMIN'; } catch(e) { return 'ADMIN'; }
    }

    function getUser() {
        try { return JSON.parse(localStorage.getItem('aedes_user')); } catch(e) { return null; }
    }

    // Sidebar toggle
    function initSidebarToggle() {
        var toggle = document.getElementById('sidebar-toggle');
        var sidebar = document.getElementById('sidebar');
        var overlay = document.getElementById('sidebar-overlay');
        var body = document.body;
        var STORAGE_KEY = 'aedes-sidebar-collapsed';

        var isCollapsed = localStorage.getItem(STORAGE_KEY) === 'true';
        if (isCollapsed && window.innerWidth > 768) {
            body.classList.add('sidebar-collapsed');
        }

        if (toggle) toggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('active');
                toggle.classList.toggle('hidden');
                return;
            }
            body.classList.toggle('sidebar-collapsed');
            var collapsed = body.classList.contains('sidebar-collapsed');
            localStorage.setItem(STORAGE_KEY, collapsed);
        });

        if (overlay) overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            if (toggle) toggle.classList.remove('hidden');
        });
    }

    // Expose init
    // Populate header user
    function populateHeaderUser() {
        var name = 'User';
        try { var u = JSON.parse(localStorage.getItem('aedes_user')); if (u) name = u.name || u.username || 'User'; } catch(e) {}
        var initial = name.charAt(0).toUpperCase();
        var avatar = document.getElementById('hdr-avatar');
        var nameEl = document.getElementById('hdr-name');
        if (avatar) avatar.textContent = initial;
        if (nameEl) nameEl.textContent = name;
    }

    // Expose
    window.AedesSidebar = { buildSidebar, initSidebarToggle, populateHeaderUser };
})();
