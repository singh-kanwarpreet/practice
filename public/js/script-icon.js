document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.drop');
    const check = document.querySelectorAll('.tax');
    const displayTax = document.querySelectorAll('.display');
    const filterDropdown = document.querySelector('.drop-icon');

    // Event listener for the hamburger menu
    hamburger.addEventListener('click', function() {
        if (filterDropdown.style.display === 'none' || filterDropdown.style.display === '') {
            filterDropdown.style.display = 'flex';
        } else {
            filterDropdown.style.display = 'none';
        }
    });

    // Event listener for each checkbox
    for (let y = 0; y < check.length; y++) {
        check[y].addEventListener('click', function() {
            for (let i = 0; i < displayTax.length; i++) {
                if (displayTax[i].style.display === 'none' || displayTax[i].style.display === '') {
                    displayTax[i].style.display = 'inline';
                } else {
                    displayTax[i].style.display = 'none';
                }
            }
        });
    }
});
