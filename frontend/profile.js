document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Parse user data
    const userData = JSON.parse(currentUser);
    
    // Update user information in the sidebar
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    
    if (userData.firstName && userData.lastName) {
        userName.textContent = `${userData.firstName} ${userData.lastName}`;
    } else if (userData.fullName) {
        userName.textContent = userData.fullName;
    } else {
        userName.textContent = userData.name || userData.email.split('@')[0];
    }
    
    userEmail.textContent = userData.email;
    
    // Update auth buttons to show logged in state
    updateAuthButtons(userData);
    
    // Handle tab switching
    const menuItems = document.querySelectorAll('.profile-menu li');
    const tabs = document.querySelectorAll('.profile-tab');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all tabs
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Show the corresponding tab
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Handle logout
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
    // Load profile data
    loadProfileData(userData);
    
    // Handle profile form submission
    const saveProfileButton = document.getElementById('save-profile');
    saveProfileButton.addEventListener('click', function() {
        saveProfileData();
    });
    
    // Handle preferences form submission
    const savePreferencesButton = document.getElementById('save-preferences');
    savePreferencesButton.addEventListener('click', function() {
        savePreferencesData();
    });
    
    // Handle range input changes
    const radiusInput = document.getElementById('pref-radius');
    const radiusValue = document.getElementById('radius-value');
    
    radiusInput.addEventListener('input', function() {
        radiusValue.textContent = `${this.value} miles`;
    });
    
    const ratingInput = document.getElementById('min-rating');
    const ratingValue = document.getElementById('rating-value');
    
    ratingInput.addEventListener('input', function() {
        ratingValue.textContent = `${this.value} stars`;
    });
    
    // Handle password change
    const changePasswordButton = document.getElementById('change-password');
    changePasswordButton.addEventListener('click', function() {
        changePassword();
    });
    
    // Handle account deletion
    const deleteAccountButton = document.getElementById('delete-account');
    deleteAccountButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            deleteAccount();
        }
    });
});

// Update auth buttons to show logged in state
function updateAuthButtons(userData) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <button class="btn btn-user">
                    <i class="fas fa-user-circle"></i>
                    <span>${userData.firstName || userData.name}</span>
                </button>
                <div class="user-dropdown">
                    <a href="profile.html" class="active"><i class="fas fa-user"></i> My Profile</a>
                    <a href="preferences.html"><i class="fas fa-sliders-h"></i> Preferences</a>
                    <a href="history.html"><i class="fas fa-history"></i> History</a>
                    <a href="#" id="navbar-logout-button"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        `;

        // Add user menu dropdown toggle
        const userMenuButton = document.querySelector('.btn-user');
        const userDropdown = document.querySelector('.user-dropdown');
        
        userMenuButton.addEventListener('click', function() {
            userDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });

        // Handle navbar logout
        const navbarLogoutButton = document.getElementById('navbar-logout-button');
        navbarLogoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // Add user dropdown styles if not already added
    if (!document.getElementById('user-dropdown-styles')) {
        const style = document.createElement('style');
        style.id = 'user-dropdown-styles';
        style.textContent = `
            .user-menu {
                position: relative;
            }
            .btn-user {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background-color: var(--light-color);
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
            }
            .btn-user i {
                font-size: 1.2rem;
                color: var(--primary-color);
            }
            .user-dropdown {
                position: absolute;
                top: calc(100% + 0.5rem);
                right: 0;
                background-color: white;
                border-radius: 4px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                min-width: 200px;
                z-index: 100;
                display: none;
            }
            .user-dropdown.active {
                display: block;
            }
            .user-dropdown a {
                display: flex;
                align-items: center;
                padding: 0.8rem 1rem;
                color: var(--dark-color);
                transition: background-color 0.3s ease;
            }
            .user-dropdown a:hover, .user-dropdown a.active {
                background-color: var(--light-color);
            }
            .user-dropdown a.active {
                color: var(--primary-color);
                font-weight: 500;
            }
            .user-dropdown a i {
                margin-right: 0.8rem;
                width: 1rem;
                text-align: center;
            }
            .user-dropdown a:not(:last-child) {
                border-bottom: 1px solid #eee;
            }
        `;
        document.head.appendChild(style);
    }
}

// Load profile data from localStorage
function loadProfileData(userData) {
    // Profile details
    const firstNameInput = document.getElementById('profile-first-name');
    const lastNameInput = document.getElementById('profile-last-name');
    const emailInput = document.getElementById('profile-email');
    const phoneInput = document.getElementById('profile-phone');
    const locationInput = document.getElementById('profile-location');
    
    if (firstNameInput && lastNameInput && emailInput) {
        firstNameInput.value = userData.firstName || '';
        lastNameInput.value = userData.lastName || '';
        emailInput.value = userData.email || '';
        phoneInput.value = userData.phone || '';
        locationInput.value = userData.location || '';
    }
    
    // Preferences (load from localStorage if exists, otherwise use defaults)
    if (userData.preferences) {
        const prefs = userData.preferences;
        
        // Set radius preference
        const radiusInput = document.getElementById('pref-radius');
        const radiusValue = document.getElementById('radius-value');
        if (radiusInput && radiusValue && prefs.radius) {
            radiusInput.value = prefs.radius;
            radiusValue.textContent = `${prefs.radius} miles`;
        }
        
        // Set price range preferences
        if (prefs.priceRange) {
            for (let i = 1; i <= 4; i++) {
                const priceCheckbox = document.getElementById(`price-${i}`);
                if (priceCheckbox) {
                    priceCheckbox.checked = prefs.priceRange.includes(i);
                }
            }
        }
        
        // Set cuisine preferences
        if (prefs.cuisines) {
            const cuisines = ['italian', 'chinese', 'mexican', 'indian', 'japanese', 'thai', 'american', 'mediterranean'];
            cuisines.forEach(cuisine => {
                const cuisineCheckbox = document.getElementById(`cuisine-${cuisine}`);
                if (cuisineCheckbox) {
                    cuisineCheckbox.checked = prefs.cuisines.includes(cuisine);
                }
            });
        }
        
        // Set rating preference
        const ratingInput = document.getElementById('min-rating');
        const ratingValue = document.getElementById('rating-value');
        if (ratingInput && ratingValue && prefs.minRating) {
            ratingInput.value = prefs.minRating;
            ratingValue.textContent = `${prefs.minRating} stars`;
        }
    }
}

// Save profile data to localStorage
function saveProfileData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const firstNameInput = document.getElementById('profile-first-name');
    const lastNameInput = document.getElementById('profile-last-name');
    const phoneInput = document.getElementById('profile-phone');
    const locationInput = document.getElementById('profile-location');
    
    // Update user data
    currentUser.firstName = firstNameInput.value;
    currentUser.lastName = lastNameInput.value;
    currentUser.fullName = `${firstNameInput.value} ${lastNameInput.value}`;
    currentUser.phone = phoneInput.value;
    currentUser.location = locationInput.value;
    
    // Save updated user data
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Show success message
    alert('Profile updated successfully!');
    
    // Update sidebar and auth buttons
    const userName = document.getElementById('user-name');
    userName.textContent = currentUser.fullName;
    
    updateAuthButtons(currentUser);
}

// Save preferences data to localStorage
function savePreferencesData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get preferences values
    const radius = document.getElementById('pref-radius').value;
    
    // Get selected price ranges
    const priceRange = [];
    for (let i = 1; i <= 4; i++) {
        if (document.getElementById(`price-${i}`).checked) {
            priceRange.push(i);
        }
    }
    
    // Get selected cuisines
    const cuisines = [];
    const cuisineTypes = ['italian', 'chinese', 'mexican', 'indian', 'japanese', 'thai', 'american', 'mediterranean'];
    cuisineTypes.forEach(cuisine => {
        if (document.getElementById(`cuisine-${cuisine}`).checked) {
            cuisines.push(cuisine);
        }
    });
    
    // Get minimum rating
    const minRating = document.getElementById('min-rating').value;
    
    // Create preferences object
    const preferences = {
        radius,
        priceRange,
        cuisines,
        minRating
    };
    
    // Save to user data
    currentUser.preferences = preferences;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Show success message
    alert('Preferences saved successfully!');
}

// Change password
function changePassword() {
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    
    // Basic validation
    if (!currentPasswordInput.value) {
        alert('Please enter your current password');
        return;
    }
    
    if (!newPasswordInput.value) {
        alert('Please enter a new password');
        return;
    }
    
    if (newPasswordInput.value !== confirmNewPasswordInput.value) {
        alert('New passwords do not match');
        return;
    }
    
    // Password strength validation
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(newPasswordInput.value)) {
        alert('Password must be at least 8 characters with letters and numbers');
        return;
    }
    
    // In a real app, we would verify the current password and update with the new one
    // For this demo, we'll just show a success message
    alert('Password updated successfully!');
    
    // Clear inputs
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmNewPasswordInput.value = '';
}

// Delete account
function deleteAccount() {
    // In a real app, we would send a request to delete the user's account
    // For this demo, we'll just remove from localStorage and redirect
    localStorage.removeItem('currentUser');
    alert('Your account has been deleted. You will be redirected to the home page.');
    window.location.href = 'index.html';
}