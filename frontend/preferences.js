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
    
    // Update auth buttons with user info
    updateAuthButtons(userData);
    
    // Set up range inputs
    const radiusInput = document.getElementById('search-radius');
    const radiusValue = document.getElementById('radius-value');
    
    radiusInput.addEventListener('input', function() {
        radiusValue.textContent = this.value;
    });
    
    const ratingInput = document.getElementById('min-rating');
    const ratingValue = document.getElementById('rating-value');
    const ratingDisplay = document.querySelector('.rating-display');
    
    ratingInput.addEventListener('input', function() {
        ratingValue.textContent = this.value;
        updateStarRating(this.value);
    });
    
    // Function to update star rating display
    function updateStarRating(rating) {
        const stars = ratingDisplay.querySelectorAll('i');
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        stars.forEach((star, index) => {
            // Remove all classes first
            star.className = '';
            
            // Add appropriate star class
            if (index < fullStars) {
                star.className = 'fas fa-star'; // Full star
            } else if (index === fullStars && hasHalfStar) {
                star.className = 'fas fa-star-half-alt'; // Half star
            } else {
                star.className = 'far fa-star'; // Empty star
            }
        });
    }
    
    // Initialize star rating
    updateStarRating(ratingInput.value);
    
    // Set up cuisine search
    const cuisineSearch = document.getElementById('cuisine-search');
    const cuisineItems = document.querySelectorAll('.cuisine-item');
    
    cuisineSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        cuisineItems.forEach(item => {
            const cuisineName = item.querySelector('span').textContent.toLowerCase();
            if (cuisineName.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Load saved preferences
    loadPreferences();
    
    // Save preferences
    const saveButton = document.getElementById('save-preferences');
    saveButton.addEventListener('click', function() {
        savePreferences();
    });
    
    // Reset preferences
    const resetButton = document.getElementById('reset-preferences');
    resetButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all preferences to default values?')) {
            resetPreferences();
        }
    });
    
    // Use current location
    const useLocationButton = document.getElementById('use-current-location');
    useLocationButton.addEventListener('click', function() {
        if (navigator.geolocation) {
            useLocationButton.textContent = 'Getting location...';
            useLocationButton.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // Success - in a real app, we would use a geocoding service to get the address
                    // For this demo, we'll just use coordinates
                    const locationInput = document.getElementById('default-location');
                    locationInput.value = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
                    
                    // Reset button
                    useLocationButton.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
                    useLocationButton.disabled = false;
                },
                function(error) {
                    // Error
                    alert(`Could not get your location: ${error.message}`);
                    
                    // Reset button
                    useLocationButton.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
                    useLocationButton.disabled = false;
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    });
});

// Update auth buttons
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
                    <a href="profile.html"><i class="fas fa-user"></i> My Profile</a>
                    <a href="preferences.html" class="active"><i class="fas fa-sliders-h"></i> Preferences</a>
                    <a href="history.html"><i class="fas fa-history"></i> History</a>
                    <a href="#" id="logout-button"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        `;

        // Add event listener for logout button
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }

        // Add user menu dropdown toggle
        const userMenuButton = document.querySelector('.btn-user');
        const userDropdown = document.querySelector('.user-dropdown');
        if (userMenuButton && userDropdown) {
            userMenuButton.addEventListener('click', function() {
                userDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('active');
                }
            });
        }
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

// Load user preferences
function loadPreferences() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const userData = JSON.parse(currentUser);
    const prefs = userData.preferences || {};
    
    // Set location if available
    if (prefs.location) {
        document.getElementById('default-location').value = prefs.location;
    }
    
    // Set radius
    if (prefs.radius) {
        const radiusInput = document.getElementById('search-radius');
        const radiusValue = document.getElementById('radius-value');
        radiusInput.value = prefs.radius;
        radiusValue.textContent = prefs.radius;
    }
    
    // Set price range
    if (prefs.priceRange) {
        for (let i = 1; i <= 4; i++) {
            const priceCheck = document.getElementById(`price-${i}`);
            if (priceCheck) {
                priceCheck.checked = prefs.priceRange.includes(i);
            }
        }
    }
    
    // Set cuisines
    if (prefs.cuisines) {
        const cuisineTypes = ['italian', 'chinese', 'mexican', 'indian', 'japanese', 'thai', 'american', 'mediterranean', 'french', 'korean', 'bbq', 'vegan'];
        cuisineTypes.forEach(cuisine => {
            const cuisineCheck = document.getElementById(`cuisine-${cuisine}`);
            if (cuisineCheck) {
                cuisineCheck.checked = prefs.cuisines.includes(cuisine);
            }
        });
    }
    
    // Set minimum rating
    if (prefs.minRating) {
        const ratingInput = document.getElementById('min-rating');
        const ratingValue = document.getElementById('rating-value');
        
        ratingInput.value = prefs.minRating;
        ratingValue.textContent = prefs.minRating;
        
        // Update star display
        updateStarRating(prefs.minRating);
    }
    
    // Set additional filters
    if (prefs.additionalFilters) {
        const filters = ['open-now', 'reservations', 'delivery', 'takeout', 'outdoor'];
        filters.forEach(filter => {
            const filterCheck = document.getElementById(`filter-${filter}`);
            if (filterCheck && prefs.additionalFilters[filter] !== undefined) {
                filterCheck.checked = prefs.additionalFilters[filter];
            }
        });
    }
}

// Update star rating display
function updateStarRating(rating) {
    const ratingDisplay = document.querySelector('.rating-display');
    if (!ratingDisplay) return;
    
    const stars = ratingDisplay.querySelectorAll('i');
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    stars.forEach((star, index) => {
        // Remove all classes first
        star.className = '';
        
        // Add appropriate star class
        if (index < fullStars) {
            star.className = 'fas fa-star'; // Full star
        } else if (index === fullStars && hasHalfStar) {
            star.className = 'fas fa-star-half-alt'; // Half star
        } else {
            star.className = 'far fa-star'; // Empty star
        }
    });
}

// Save preferences
function savePreferences() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const userData = JSON.parse(currentUser);
    
    // Get location
    const location = document.getElementById('default-location').value;
    
    // Get radius
    const radius = document.getElementById('search-radius').value;
    
    // Get price range
    const priceRange = [];
    for (let i = 1; i <= 4; i++) {
        const priceCheck = document.getElementById(`price-${i}`);
        if (priceCheck && priceCheck.checked) {
            priceRange.push(i);
        }
    }
    
    // Get cuisines
    const cuisines = [];
    const cuisineTypes = ['italian', 'chinese', 'mexican', 'indian', 'japanese', 'thai', 'american', 'mediterranean', 'french', 'korean', 'bbq', 'vegan'];
    cuisineTypes.forEach(cuisine => {
        const cuisineCheck = document.getElementById(`cuisine-${cuisine}`);
        if (cuisineCheck && cuisineCheck.checked) {
            cuisines.push(cuisine);
        }
    });
    
    // Get minimum rating
    const minRating = document.getElementById('min-rating').value;
    
    // Get additional filters
    const additionalFilters = {};
    const filters = ['open-now', 'reservations', 'delivery', 'takeout', 'outdoor'];
    filters.forEach(filter => {
        const filterCheck = document.getElementById(`filter-${filter}`);
        if (filterCheck) {
            additionalFilters[filter] = filterCheck.checked;
        }
    });
    
    // Create preferences object
    const preferences = {
        location,
        radius,
        priceRange,
        cuisines,
        minRating,
        additionalFilters
    };
    
    // Save to user data
    userData.preferences = preferences;
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Show success message
    alert('Preferences saved successfully!');
}

// Reset preferences to default values
function resetPreferences() {
    // Reset location
    document.getElementById('default-location').value = '';
    
    // Reset radius
    const radiusInput = document.getElementById('search-radius');
    const radiusValue = document.getElementById('radius-value');
    radiusInput.value = 5;
    radiusValue.textContent = 5;
    
    // Reset price range
    for (let i = 1; i <= 4; i++) {
        const priceCheck = document.getElementById(`price-${i}`);
        if (priceCheck) {
            priceCheck.checked = i <= 3; // $, $$, $$$ checked by default
        }
    }
    
    // Reset cuisines
    const defaultCuisines = ['italian', 'chinese', 'mexican', 'japanese', 'american'];
    const cuisineTypes = ['italian', 'chinese', 'mexican', 'indian', 'japanese', 'thai', 'american', 'mediterranean', 'french', 'korean', 'bbq', 'vegan'];
    cuisineTypes.forEach(cuisine => {
        const cuisineCheck = document.getElementById(`cuisine-${cuisine}`);
        if (cuisineCheck) {
            cuisineCheck.checked = defaultCuisines.includes(cuisine);
        }
    });
    
    // Reset minimum rating
    const ratingInput = document.getElementById('min-rating');
    const ratingValue = document.getElementById('rating-value');
    ratingInput.value = 3.5;
    ratingValue.textContent = 3.5;
    updateStarRating(3.5);
    
    // Reset additional filters
    const filters = ['open-now', 'reservations', 'delivery', 'takeout', 'outdoor'];
    filters.forEach(filter => {
        const filterCheck = document.getElementById(`filter-${filter}`);
        if (filterCheck) {
            filterCheck.checked = false;
        }
    });
}