// Gestion du bouton compte
const accountBtn = document.getElementById("account");
const userMenu = document.getElementById("user-menu");
const logoutBtn = document.getElementById("logout-btn");

if (accountBtn) {
    accountBtn.addEventListener("click", function(e) {
        e.preventDefault();
        
        // Vérifier si un utilisateur est connecté
        const userJSON = sessionStorage.getItem("currentUser");
        
        if (!userJSON) {
            // Pas connecté -> rediriger vers auth.html
            window.location.href = "auth.html";
        } else {
            // Connecté -> afficher/cacher le menu
            if (userMenu.style.display === "none" || userMenu.style.display === "") {
                const user = JSON.parse(userJSON);
                document.getElementById("user-fullname").textContent = user.firstname + " " + user.name;
                document.getElementById("user-email").textContent = user.email;
                userMenu.style.display = "block";
            } else {
                userMenu.style.display = "none";
            }
        }
    });
}

// Gestion de la déconnexion
if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        sessionStorage.removeItem("currentUser");
        window.location.href = "auth.html";
    });
}

// Fermer le menu si on clique ailleurs
document.addEventListener("click", function(e) {
    if (accountBtn && userMenu && !accountBtn.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.style.display = "none";
    }
});