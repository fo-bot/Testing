document.addEventListener('DOMContentLoaded', function() {
    // Handle password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Validation patterns
    const patterns = {
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
    };

    // Error messages
    const errorMessages = {
        email: 'Please enter a valid email address',
        password: 'Password must be at least 8 characters with letters and numbers',
        confirmPassword: 'Passwords do not match',
        firstName: 'First name is required',
        lastName: 'Last name is required',
        terms: 'You must agree to the Terms of Service and Privacy Policy',
        noAccount: 'No account found with this email. Please sign up first.',
        wrongPassword: 'Incorrect password. Please try again.',
        accountExists: 'An account with this email already exists. Please log in instead.'
    };

    // Login form validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Validate email
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            
            if (!patterns.email.test(emailInput.value)) {
                showError(emailInput, emailError, errorMessages.email);
                isValid = false;
            } else {
                hideError(emailInput, emailError);
            }
            
            // Validate password (just check if not empty for login)
            const passwordInput = document.getElementById('password');
            const passwordError = document.getElementById('password-error');
            
            if (passwordInput.value.trim() === '') {
                showError(passwordInput, passwordError, 'Password is required');
                isValid = false;
            } else {
                hideError(passwordInput, passwordError);
            }
            
            // If valid, simulate login
            if (isValid) {
                simulateLogin(emailInput.value, passwordInput.value);
            }
        });
    }

    // Signup form validation
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Validate first name
            const firstNameInput = document.getElementById('first-name');
            const firstNameError = document.getElementById('first-name-error');
            
            if (firstNameInput.value.trim() === '') {
                showError(firstNameInput, firstNameError, errorMessages.firstName);
                isValid = false;
            } else {
                hideError(firstNameInput, firstNameError);
            }
            
            // Validate last name
            const lastNameInput = document.getElementById('last-name');
            const lastNameError = document.getElementById('last-name-error');
            
            if (lastNameInput.value.trim() === '') {
                showError(lastNameInput, lastNameError, errorMessages.lastName);
                isValid = false;
            } else {
                hideError(lastNameInput, lastNameError);
            }
            
            // Validate email
            const emailInput = document.getElementById('signup-email');
            const emailError = document.getElementById('signup-email-error');
            
            if (!patterns.email.test(emailInput.value)) {
                showError(emailInput, emailError, errorMessages.email);
                isValid = false;
            } else {
                hideError(emailInput, emailError);
            }
            
            // Validate password
            const passwordInput = document.getElementById('signup-password');
            const passwordError = document.getElementById('signup-password-error');
            
            if (!patterns.password.test(passwordInput.value)) {
                showError(passwordInput, passwordError, errorMessages.password);
                isValid = false;
            } else {
                hideError(passwordInput, passwordError);
            }
            
            // Validate confirm password
            const confirmPasswordInput = document.getElementById('confirm-password');
            const confirmPasswordError = document.getElementById('confirm-password-error');
            
            if (confirmPasswordInput.value !== passwordInput.value) {
                showError(confirmPasswordInput, confirmPasswordError, errorMessages.confirmPassword);
                isValid = false;
            } else {
                hideError(confirmPasswordInput, confirmPasswordError);
            }
            
            // Validate terms checkbox
            const termsInput = document.getElementById('terms');
            const termsError = document.getElementById('terms-error');
            
            if (!termsInput.checked) {
                termsError.textContent = errorMessages.terms;
                termsError.classList.add('visible');
                isValid = false;
            } else {
                termsError.textContent = '';
                termsError.classList.remove('visible');
            }
            
            // If valid, simulate registration
            if (isValid) {
                simulateRegistration(firstNameInput.value, lastNameInput.value, emailInput.value, passwordInput.value);
            }
        });
    }

    // Helper function to show error message
    function showError(input, errorElement, message) {
        input.classList.add('input-error');
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }

    // Helper function to hide error message
    function hideError(input, errorElement) {
        input.classList.remove('input-error');
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }

    // Simulate login (would be replaced with actual API call)
    function simulateLogin(email, password) {
        // Show loading state
        const loginButton = loginForm.querySelector('.btn-auth');
        const originalText = loginButton.textContent;
        loginButton.textContent = 'Logging in...';
        loginButton.disabled = true;

        // Simulate API call with timeout
        setTimeout(() => {
            // Check if user exists (search in localStorage for demo purposes)
            const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
            const userExists = allUsers.some(user => user.email === email);
            
            if (!userExists) {
                // User doesn't exist - show error
                loginButton.textContent = originalText;
                loginButton.disabled = false;
                
                const emailInput = document.getElementById('email');
                const emailError = document.getElementById('email-error');
                showError(emailInput, emailError, errorMessages.noAccount);
                return;
            }
            
            // In a real app, you would verify the password here
            // For demo purposes, we'll just get the user and proceed
            const user = allUsers.find(user => user.email === email);
            
            // Verify password (simple check for demo)
            if (user.password !== password) {
                loginButton.textContent = originalText;
                loginButton.disabled = false;
                
                const passwordInput = document.getElementById('password');
                const passwordError = document.getElementById('password-error');
                showError(passwordInput, passwordError, errorMessages.wrongPassword);
                return;
            }
            
            // Update login state
            user.isLoggedIn = true;
            user.loginTime = new Date().toISOString();
            
            // Update user in allUsers
            const updatedUsers = allUsers.map(u => u.email === email ? user : u);
            localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
            
            // Set current user
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect to home page
            window.location.href = "index.html";
        }, 1500);
    }

    // Simulate registration (would be replaced with actual API call)
    function simulateRegistration(firstName, lastName, email, password) {
        // Show loading state
        const signupButton = signupForm.querySelector('.btn-auth');
        const originalText = signupButton.textContent;
        signupButton.textContent = 'Creating Account...';
        signupButton.disabled = true;

        // Simulate API call with timeout
        setTimeout(() => {
            // Check if user already exists
            const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
            const userExists = allUsers.some(user => user.email === email);
            
            if (userExists) {
                // User already exists - show error
                signupButton.textContent = originalText;
                signupButton.disabled = false;
                
                const emailInput = document.getElementById('signup-email');
                const emailError = document.getElementById('signup-email-error');
                showError(emailInput, emailError, errorMessages.accountExists);
                return;
            }
            
            // Create user record
            const user = {
                email: email,
                password: password, // In a real app, this would be hashed
                firstName: firstName,
                lastName: lastName,
                fullName: `${firstName} ${lastName}`,
                isLoggedIn: true,
                registrationTime: new Date().toISOString()
            };
            
            // Add to users collection
            allUsers.push(user);
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
            
            // Set as current user
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Show success message and replace form
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message visible';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Account Created Successfully!</h3>
                <p>Welcome to Restaurant Roulette, ${firstName}!</p>
                <p>You'll be redirected to the home page shortly.</p>
            `;
            
            const authForm = document.querySelector('.auth-form');
            authForm.parentNode.replaceChild(successMessage, authForm);
            
            // Redirect to home page after delay
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        }, 1500);
    }

    // Check if user is already logged in
    function checkLoggedInStatus() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            if (userData.isLoggedIn) {
                // Update navigation - this would be more comprehensive in a real app
                updateNavForLoggedInUser(userData);
            }
        }
    }

    // Update navigation for logged in users
    function updateNavForLoggedInUser(user) {
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            authButtons.innerHTML = `
                <div class="user-menu">
                    <button class="btn btn-user">
                        <i class="fas fa-user-circle"></i>
                        <span>${user.firstName || user.name}</span>
                    </button>
                    <div class="user-dropdown">
                        <a href="profile.html"><i class="fas fa-user"></i> My Profile</a>
                        <a href="preferences.html"><i class="fas fa-sliders-h"></i> Preferences</a>
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
                    
                    // Update user's isLoggedIn state in allUsers
                    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                    if (currentUser && currentUser.email) {
                        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
                        const updatedUsers = allUsers.map(user => {
                            if (user.email === currentUser.email) {
                                user.isLoggedIn = false;
                            }
                            return user;
                        });
                        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
                    }
                    
                    // Remove current user
                    localStorage.removeItem('currentUser');
                    window.location.reload();
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
    }

    // Initialize logged in status check
    checkLoggedInStatus();

    // Add style for user dropdown
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

    // Update buttons on index.html
    function updateMainPageButtons() {
        // Only run this if we're on the index page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                // Update the CTA button
                const ctaButton = document.querySelector('.btn-cta');
                if (ctaButton) {
                    ctaButton.textContent = 'Find Restaurants Now';
                }

                // Update the header buttons in the landing page button
                const findRestaurantBtn = document.querySelector('.search-container .btn-primary');
                if (findRestaurantBtn) {
                    findRestaurantBtn.textContent = 'Find A Restaurant';
                }
            }
        }
    }

    // Run this function to update buttons on the main page
    updateMainPageButtons();
});