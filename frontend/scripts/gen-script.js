const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Sidebar toggle
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    sidebar.classList.toggle('show');
});

// Theme toggle
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.add(savedTheme);
}
themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark-theme');
    }
    else {
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme');
    }
});
const settingsPanel = document.getElementById('settings-panel');
const Settings = document.getElementById('sett-display');
const closeSettings = document.getElementById('close');

Settings.addEventListener('click', () => {
    settingsPanel.classList.add('active');
    menuBtn.classList.remove('active');
    sidebar.classList.remove('show');

})

closeSettings.addEventListener('click', () => {
    settingsPanel.classList.remove('active');
    menuBtn.classList.toggle('active');
    sidebar.classList.toggle('show');
});

