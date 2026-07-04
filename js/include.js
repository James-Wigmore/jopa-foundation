// ============================================================================
// JOPA Foundation Uganda
// Shared Components Loader
// ============================================================================

async function loadComponent(elementId, filePath) {

    try {

        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}`);
        }

        const html = await response.text();

        document.getElementById(elementId).innerHTML = html;

    } catch (error) {

        console.error(error);

    }

}

// ============================
// Load Navbar
// ============================

loadComponent("navbar", "components/navbar.html")
.then(() => {

    // Highlight current page

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-link").forEach(link => {

        if (link.getAttribute("href") === currentPage) {

            link.classList.add("active");

        }

    });

});

// ============================
// Load Footer
// ============================

loadComponent("footer", "components/footer.html");