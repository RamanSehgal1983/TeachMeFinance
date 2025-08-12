document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch and insert HTML content
    const loadComponent = (selector, url) => {
        const element = document.querySelector(selector);
        if (element) {
            fetch(url)
                .then(response => response.ok ? response.text() : Promise.reject('File not found'))
                .then(data => {
                    element.innerHTML = data;
                    // Re-initialize mobile menu toggle after header is loaded
                    if (selector === 'header') {
                        const menuToggle = document.getElementById('menu-toggle');
                        const mobileMenu = document.getElementById('mobile-menu');
                        if (menuToggle && mobileMenu) {
                            menuToggle.addEventListener('click', () => {
                                mobileMenu.classList.toggle('hidden');
                            });
                        }
                    }
                })
                .catch(error => console.error(`Error loading ${url}:`, error));
        }
    };

    loadComponent('header', 'header.html');
    loadComponent('footer', 'footer.html');

    // Function to generate subject cards
    const createSubjectCard = (subject, cardBgClass) => {
        return `
            <article class="${cardBgClass} p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <h3 class="text-xl font-semibold text-slate-900">${subject.title}</h3>
                <p class="mt-2 text-slate-500">${subject.description}</p>
            </article>
        `;
    };

    // Populate subject cards if on the index page
    const year1Grid = document.getElementById('year-1-grid');
    const year2Grid = document.getElementById('year-2-grid');
    const year3Grid = document.getElementById('year-3-grid');

    if (year1Grid && year2Grid && year3Grid && typeof curriculum !== 'undefined') {
        year1Grid.innerHTML = curriculum.year1.map(subject => createSubjectCard(subject, 'bg-slate-50')).join('');
        year2Grid.innerHTML = curriculum.year2.map(subject => createSubjectCard(subject, 'bg-white')).join('');
        year3Grid.innerHTML = curriculum.year3.map(subject => createSubjectCard(subject, 'bg-slate-50')).join('');
    }

    // Populate detailed subject content if on a year page
    const yearPageContent = document.querySelector('[data-year-content]');
    if (yearPageContent && typeof curriculum !== 'undefined') {
        const year = yearPageContent.dataset.yearContent; // e.g., "year1"
        const yearData = curriculum[year];

        if (yearData && yearData.every(s => s.details && s.details.trim() !== '')) {
            const articlesHTML = yearData.map(subject => {
                return `
                    <article class="prose lg:prose-lg mx-auto bg-slate-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                        ${subject.details}
                    </article>
                `;
            }).join('');
            
            const subjectsContainer = document.getElementById('subjects-container');
            if (subjectsContainer) subjectsContainer.innerHTML = articlesHTML;
        }
    }
});