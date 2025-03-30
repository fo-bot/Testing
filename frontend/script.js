document.addEventListener('DOMContentLoaded', function() {
    // Run the login check when page loads
    checkUserLoginStatus();
    
    // Initialize navigation active state
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Filter click functionality
    const filters = document.querySelectorAll('.filter');
    
    // Create filter options for each filter type with expanded cuisine list
    const filterOptions = {
        'Cuisine': [
            'Afghani',
            'African',
            'American',
            'Brazilian',
            'Chinese',
            'French',
            'Greek',
            'Indian',
            'Indonesian',
            'Italian',
            'Japanese',
            'Korean',
            'Lebanese',
            'Mediterranean',
            'Mexican',
            'Middle Eastern',
            'Spanish',
            'Thai',
            'Turkish',
            'Vietnamese'
        ],
        'Price': ['$', '$$', '$$$', '$$$$'],
        'Distance': ['0.5 miles', '1 mile', '3 miles', '5 miles', '10+ miles'],
        'Rating': ['★★★★★', '★★★★☆ & up', '★★★☆☆ & up', '★★☆☆☆ & up']
    };

    // Function to get filter type
    function getFilterType(element) {
        const text = element.textContent.trim();
        if (text.includes('Cuisine')) return 'Cuisine';
        if (text.includes('Price')) return 'Price';
        if (text.includes('Distance')) return 'Distance';
        if (text.includes('Rating')) return 'Rating';
        return '';
    }

    // Close any open dropdowns
    function closeDropdowns() {
        const dropdowns = document.querySelectorAll('.filter-dropdown');
        dropdowns.forEach(dropdown => dropdown.remove());
    }

    // Handle filter click
    filters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Get filter type
            const filterType = getFilterType(this);
            if (!filterType) return;
            
            // Check if this filter already has an open dropdown
            const existingDropdown = document.querySelector('.filter-dropdown');
            if (existingDropdown && existingDropdown.dataset.filterType === filterType) {
                existingDropdown.remove();
                return;
            }
            
            // Close any open dropdowns
            closeDropdowns();
            
            // Toggle active state
            filters.forEach(f => {
                if (f !== this) f.classList.remove('active');
            });
            this.classList.toggle('active');
            
            // If active, create and show dropdown
            if (this.classList.contains('active')) {
                const options = filterOptions[filterType];
                
                // Create dropdown element
                const dropdown = document.createElement('div');
                dropdown.className = 'filter-dropdown';
                dropdown.dataset.filterType = filterType;
                
                // Style the dropdown
                dropdown.style.position = 'absolute';
                dropdown.style.backgroundColor = 'white';
                dropdown.style.borderRadius = '8px';
                dropdown.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                dropdown.style.padding = '0.8rem';
                dropdown.style.zIndex = '100';
                dropdown.style.minWidth = '150px';
                
                // Special handling for the longer cuisine list
                if (filterType === 'Cuisine') {
                    dropdown.style.maxHeight = '300px';
                    dropdown.style.overflowY = 'auto';
                }
                
                // Add options to dropdown
                options.forEach(option => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'filter-option';
                    optionElement.style.padding = '0.5rem 1rem';
                    optionElement.style.cursor = 'pointer';
                    optionElement.style.borderRadius = '4px';
                    optionElement.style.margin = '0.2rem 0';
                    optionElement.textContent = option;
                    
                    optionElement.addEventListener('mouseenter', function() {
                        this.style.backgroundColor = '#f8f9fa';
                    });
                    
                    optionElement.addEventListener('mouseleave', function() {
                        this.style.backgroundColor = 'transparent';
                    });
                    
                    optionElement.addEventListener('click', function() {
                        // Update filter text to show selection
                        const iconElement = filter.querySelector('i').cloneNode(true);
                        filter.innerHTML = '';
                        filter.appendChild(iconElement);
                        filter.appendChild(document.createTextNode(' ' + filterType + ': ' + option));
                        
                        // Close dropdown
                        dropdown.remove();
                    });
                    
                    dropdown.appendChild(optionElement);
                });
                
                // Add dropdown to document body
                document.body.appendChild(dropdown);
                
                // Position dropdown below filter
                const filterRect = this.getBoundingClientRect();
                dropdown.style.top = (filterRect.bottom + window.scrollY) + 'px';
                dropdown.style.left = (filterRect.left + window.scrollX) + 'px';
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        closeDropdowns();
        filters.forEach(filter => filter.classList.remove('active'));
    });

    // Get Location button click event
    const getLocationBtn = document.querySelector('.btn-location');
    
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                getLocationBtn.textContent = 'Getting location...';
                getLocationBtn.disabled = true;
                
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        // Success - in a real app, we would use a geocoding service to get the address
                        const locationInput = document.querySelector('.location-input');
                        if (locationInput) {
                            locationInput.value = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
                        }
                        
                        // Reset button
                        getLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Get Location';
                        getLocationBtn.disabled = false;
                    },
                    function(error) {
                        // Error
                        alert(`Could not get your location: ${error.message}`);
                        
                        // Reset button
                        getLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Get Location';
                        getLocationBtn.disabled = false;
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser');
            }
        });
    }

    // Find Restaurant button click event
    const findRestaurantBtn = document.querySelector('.search-container .btn-primary');
    const locationInput = document.querySelector('.location-input');
    
    if (findRestaurantBtn && locationInput) {
        findRestaurantBtn.addEventListener('click', function() {
            if (locationInput.value.trim() === '') {
                alert('Please enter your location to find restaurants.');
                locationInput.focus();
            } else {
                // In a real app, this would trigger the search functionality
                alert(`Searching for restaurants near ${locationInput.value}...`);
                // You would typically redirect to a results page or show results here
            }
        });
    }

    // Check if user is already logged in and update UI accordingly
    function checkUserLoginStatus() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            if (userData.isLoggedIn) {
                // Update the auth buttons section
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
                                <a href="preferences.html"><i class="fas fa-sliders-h"></i> Preferences</a>
                                <a href="history.html"><i class="fas fa-history"></i> History</a>
                                <a href="#" id="logout-button"><i class="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                    `;

                    // Style the user menu
                    const style = document.createElement('style');
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
                        .user-dropdown a:hover {
                            background-color: var(--light-color);
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

                    // Handle user dropdown toggle
                    const userMenuButton = document.querySelector('.btn-user');
                    const userDropdown = document.querySelector('.user-dropdown');
                    
                    if (userMenuButton && userDropdown) {
                        userMenuButton.addEventListener('click', function(e) {
                            e.stopPropagation();
                            userDropdown.classList.toggle('active');
                        });

                        // Close dropdown when clicking outside
                        document.addEventListener('click', function(e) {
                            if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
                                userDropdown.classList.remove('active');
                            }
                        });

                        // Handle logout
                        const logoutButton = document.getElementById('logout-button');
                        if (logoutButton) {
                            logoutButton.addEventListener('click', function(e) {
                                e.preventDefault();
                                localStorage.removeItem('currentUser');
                                window.location.reload();
                            });
                        }
                    }
                }

                // Update CTA button text
                const ctaButton = document.querySelector('.btn-cta');
                if (ctaButton) {
                    ctaButton.textContent = 'Find Restaurants Now';
                }
            }
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // CTA button redirect
    const ctaButton = document.querySelector('.btn-cta');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Check if user is logged in
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                // Redirect to restaurant search page (will be implemented later)
                alert('Taking you to find restaurants...');
                // This would navigate to the search page in a full implementation
            } else {
                // Redirect to sign-up page
                window.location.href = 'signup.html';
            }
        });
    }
});

// Add CSS styles for filter dropdown
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .filter-dropdown {
            display: block;
        }
        .filter-option:hover {
            background-color: #f8f9fa;
        }
    `;
    document.head.appendChild(style);
});