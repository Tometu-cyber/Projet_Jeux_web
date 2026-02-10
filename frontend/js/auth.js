// Récupérer les éléments HTML
const indicator = document.getElementById("indicator");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const messageContainer = document.getElementById("message-container");

// Fonction pour basculer vers la connexion
function showLogin() {
    document.title = "Connexion - Projet Jeux Web - L3 MIAGE";
    indicator.style.transform = "translateX(0)";
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    authTitle.textContent = "Connexion";
    authSubtitle.textContent = "Accédez à votre compte";
    messageContainer.style.display = "none";
}

// Fonction pour basculer vers l'inscription
function showRegister() {
    document.title = "Inscription - Projet Jeux Web - L3 MIAGE";
    indicator.style.transform = "translateX(100%)";
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
    authTitle.textContent = "Inscription";
    authSubtitle.textContent = "Créez votre compte";
    messageContainer.style.display = "none";
}

// Afficher un message d'erreur ou de succès
function afficherMessage(message, type) {
    messageContainer.textContent = message;
    messageContainer.className = "message-container " + type;
    messageContainer.style.display = "block";
}

// INSCRIPTION
registerForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Récupérer les valeurs
    const firstname = document.getElementById("register-firstname").value;
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const passwordConfirm = document.getElementById("register-password-confirm").value;
    
    // Vérifier que le prénom est rempli
    if (firstname.trim().length < 2) {
        afficherMessage("Le prénom doit contenir au moins 2 caractères", "error");
        return;
    }
    
    // Vérifier que le nom est rempli
    if (name.trim().length < 2) {
        afficherMessage("Le nom doit contenir au moins 2 caractères", "error");
        return;
    }
    
    // Vérifier que l'email est valide
    if (!email.includes("@")) {
        afficherMessage("L'adresse email n'est pas valide", "error");
        return;
    }
    
    // Vérifier que le mot de passe fait au moins 6 caractères
    if (password.length < 6) {
        afficherMessage("Le mot de passe doit contenir au moins 6 caractères", "error");
        return;
    }
    
    // Vérifier que les mots de passe correspondent
    if (password !== passwordConfirm) {
        afficherMessage("Les mots de passe ne correspondent pas", "error");
        return;
    }
    
    // Récupérer les utilisateurs existants
    const usersJSON = localStorage.getItem("users");
    const users = usersJSON ? JSON.parse(usersJSON) : [];
    
    // Vérifier si l'email existe déjà
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            afficherMessage("Un compte existe déjà avec cette adresse email", "error");
            return;
        }
    }
    
    // Créer le nouvel utilisateur
    const nouvelUtilisateur = {
        firstname: firstname,
        name: name,
        email: email,
        password: password,
        dateInscription: new Date().toISOString()
    };
    
    // Ajouter le nouvel utilisateur à la liste
    users.push(nouvelUtilisateur);
    
    // Sauvegarder dans localStorage
    localStorage.setItem("users", JSON.stringify(users));
    
    // Afficher un message de succès
    afficherMessage("Compte créé avec succès ! Bienvenue " + firstname + " " + name + ".", "success");
    
    // Vider le formulaire
    registerForm.reset();
    
    // Passer à la page de connexion après 0.5 seconde
    setTimeout(function() {
        showLogin();
    }, 500);
});

// CONNEXION
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Récupérer les valeurs
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    
    // Vérifier que l'email est valide
    if (!email.includes("@")) {
        afficherMessage("L'adresse email n'est pas valide", "error");
        return;
    }
    
    // Vérifier que le mot de passe fait au moins 6 caractères
    if (password.length < 6) {
        afficherMessage("Le mot de passe doit contenir au moins 6 caractères", "error");
        return;
    }
    
    // Récupérer les utilisateurs enregistrés
    const usersJSON = localStorage.getItem("users");
    const users = usersJSON ? JSON.parse(usersJSON) : [];
    
    // Chercher l'utilisateur
    let utilisateurTrouve = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            utilisateurTrouve = users[i];
            break;
        }
    }
    
    // Vérifier si l'utilisateur existe
    if (!utilisateurTrouve) {
        afficherMessage("Aucun compte n'existe avec cette adresse email", "error");
        return;
    }
    
    // Vérifier le mot de passe
    if (utilisateurTrouve.password !== password) {
        afficherMessage("Mot de passe incorrect", "error");
        return;
    }
    
    // Sauvegarder l'utilisateur connecté dans sessionStorage
    const userConnecte = {
        email: utilisateurTrouve.email,
        firstname: utilisateurTrouve.firstname,
        name: utilisateurTrouve.name,
        dateConnexion: new Date().toISOString(),
        isConnected: true
    };
    sessionStorage.setItem("currentUser", JSON.stringify(userConnecte));
    
    // Afficher un message de succès
    afficherMessage("Bienvenue " + utilisateurTrouve.firstname + " " + utilisateurTrouve.name + " !", "success");
    
    // Rediriger après 1 seconde
    setTimeout(function() {
        window.location.href = "./landing.html";
    }, 1000);
});