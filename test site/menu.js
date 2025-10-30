// Функция для открытия/закрытия меню
function toggleDropdown() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}

// Закрытие меню при клике вне его области
window.onclick = function(event) {
    const menu = document.getElementById('dropdownMenu');
    const btn = document.querySelector('.dropbtn');
    
    // Если клик не по кнопке и не по меню — закрываем
    if (!event.target.matches('.dropbtn') && !menu.contains(event.target)) {
        menu.classList.remove('show');
    }
}
