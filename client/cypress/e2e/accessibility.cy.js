// cypress/e2e/accessibility.spec.js

describe('Accessibility of Pages', () => {
    const baseUrl = 'http://localhost:3000'; 
  
    const pages = [
      { path: '/', name: 'Home' },
      { path: '/catalogue', name: 'Catalogue' },
      { path: '/login', name: 'Login' },
      { path: '/register', name: 'Register' },
      { path: '/profil', name: 'Profil' },
      { path: '/admin', name: 'AdminDashboard' },
      { path: '/manga/naruto', name: 'Manga' }, 
      { path: '/manga/naruto/naruto1.pdf', name: 'Mangaread' }, 
    ];
  
    pages.forEach((page) => {
      it(`should load the ${page.name} page`, () => {
        cy.visit(`${baseUrl}${page.path}`);
        cy.url().should('include', page.path);
      });
    });
  
  });
  