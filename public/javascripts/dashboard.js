// public/scripts.js
const detailsElements = document.querySelectorAll('details');

detailsElements.forEach(details => {
    details.addEventListener('click', () => {
        details.nextElementSibling.classList.toggle('active');
    });
});
