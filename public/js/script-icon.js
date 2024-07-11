document.addEventListener('DOMContentLoaded', function() {
        const hamburger = document.querySelector('.drop');
        const filterDropdown = document.querySelector('.drop-icon');

        hamburger.addEventListener('click', function() {
            if (filterDropdown.style.display === 'none' || filterDropdown.style.display === '') {
                filterDropdown.style.display = 'flex';
            } else {
                filterDropdown.style.display = 'none';
            }
        });
    });