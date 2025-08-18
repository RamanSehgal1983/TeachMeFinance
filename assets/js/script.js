document.addEventListener("DOMContentLoaded", function() {

    // This function sets up the hover dropdowns for the main navigation.
    const setupDropdowns = () => {
        // Configuration for each year's navigation item and its corresponding data.
        const yearNavItems = [
            { containerId: 'year-1-nav', dropdownId: 'year-1-dropdown', data: curriculum.year1 },
            { containerId: 'year-2-nav', dropdownId: 'year-2-dropdown', data: curriculum.year2 },
            { containerId: 'year-3-nav', dropdownId: 'year-3-dropdown', data: curriculum.year3 }
        ];

        // This function creates the two-column HTML content for a dropdown.
        const createDropdownContent = (subjects) => {
            // Split the subjects array into two halves for the two columns.
            const midPoint = Math.ceil(subjects.length / 2);
            const column1Subjects = subjects.slice(0, midPoint);
            const column2Subjects = subjects.slice(midPoint);

            // Generate the HTML for the first column.
            const column1Html = `
                <div class="p-4">
                    ${column1Subjects.map(subject => `<a href="#" class="block text-slate-700 hover:text-blue-600 py-1 rounded-md transition-colors">${subject.title}</a>`).join('')}
                </div>
            `;
            
            // Generate the HTML for the second column.
            const column2Html = `
                <div class="p-4">
                    ${column2Subjects.map(subject => `<a href="#" class="block text-slate-700 hover:text-blue-600 py-1 rounded-md transition-colors">${subject.title}</a>`).join('')}
                </div>
            `;

            // Combine the columns into a grid layout.
            return `<div class="grid grid-cols-2 gap-x-4">${column1Html}${column2Html}</div>`;
        };

        // Iterate over each navigation item to attach event listeners and populate content.
        yearNavItems.forEach(item => {
            const container = document.getElementById(item.containerId);
            const dropdown = document.getElementById(item.dropdownId);

            if (container && dropdown) {
                // Populate the dropdown with the subject list.
                dropdown.innerHTML = createDropdownContent(item.data);

                // Show the dropdown on mouse enter.
                container.addEventListener('mouseenter', () => {
                    dropdown.classList.remove('hidden');
                });

                // Hide the dropdown on mouse leave.
                container.addEventListener('mouseleave', () => {
                    dropdown.classList.add('hidden');
                });
            }
        });
    };

    // This function fetches and inserts HTML content for components like the header and footer.
    // It now accepts a callback function to run after the component is loaded.
    const loadComponent = (placeholderId, url, callback) => {
        const element = document.getElementById(placeholderId);
        if (element) {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`File not found: ${url}`);
                    }
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;
                    // If a callback function is provided, execute it.
                    if (callback) {
                        callback();
                    }
                })
                .catch(error => console.error(`Error loading ${url}:`, error));
        }
    };

    // Load the header and, once it's loaded, set up the dropdowns.
    loadComponent('header-placeholder', 'header.html', () => {
        // This code runs *after* the header has been loaded into the page.
        setupDropdowns();
        
        // Re-initialize the mobile menu toggle functionality.
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    });

    // Load the footer.
    loadComponent('footer-placeholder', 'footer.html');

    // This function generates a subject card for the main index page.
    const createSubjectCard = (subject, cardBgClass) => {
        return `
            <article class="${cardBgClass} p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow flex flex-col">
                <h3 class="text-xl font-semibold text-slate-900">${subject.title}</h3>
                <p class="mt-2 text-slate-500 flex-grow">${subject.description}</p>
            </article>
        `;
    };

    // Populate the subject card grids on the index page.
    const year1Grid = document.getElementById('year-1-grid');
    const year2Grid = document.getElementById('year-2-grid');
    const year3Grid = document.getElementById('year-3-grid');

    if (year1Grid && year2Grid && year3Grid && typeof curriculum !== 'undefined') {
        year1Grid.innerHTML = curriculum.year1.map(subject => createSubjectCard(subject, 'bg-slate-50')).join('');
        year2Grid.innerHTML = curriculum.year2.map(subject => createSubjectCard(subject, 'bg-white')).join('');
        year3Grid.innerHTML = curriculum.year3.map(subject => createSubjectCard(subject, 'bg-slate-50')).join('');
    }

    // Populate the detailed subject content on the individual year pages.
    const yearPageContent = document.querySelector('[data-year-content]');
    if (yearPageContent && typeof curriculum !== 'undefined') {
        const year = yearPageContent.dataset.yearContent;
        const yearData = curriculum[year];

        if (yearData && yearData.every(s => s.details && s.details.trim() !== '')) {
            const articlesHTML = yearData.map(subject => {
                return `
                    <article class="prose lg:prose-lg mx-auto bg-white p-8 rounded-xl shadow-md">
                        ${subject.details}
                    </article>
                `;
            }).join('');
            
            const subjectsContainer = document.getElementById('subjects-container');
            if (subjectsContainer) {
                subjectsContainer.innerHTML = articlesHTML;
            }
        }
    }
});
