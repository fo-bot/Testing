// Restaurant finder implementation using real API with array response support

document.addEventListener('DOMContentLoaded', function() {
    const findRestaurantBtn = document.querySelector('.search-container .btn-primary');
    if (findRestaurantBtn) {
        findRestaurantBtn.addEventListener('click', findRandomRestaurant);
    }

    function findRandomRestaurant() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            if (confirm('Please log in or sign up to use this feature. Would you like to go to the login page?')) {
                window.location.href = 'login.html';
            }
            return;
        }

        const locationInput = document.querySelector('.location-input');
        if (!locationInput || locationInput.value.trim() === '') {
            alert('Please enter your location');
            locationInput.focus();
            return;
        }

        const location = locationInput.value.trim();
        const filters = collectFilters();

        console.log('Search parameters:', { location, filters });

        showLoadingState();

        fetchRestaurantFromAPI(location, filters)
            .then(restaurant => {
                if (restaurant) {
                    displayRestaurant(restaurant);
                } else {
                    showError("No matching restaurants found.");
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                showError("Something went wrong. Please try again.");
            });
    }

    async function fetchRestaurantFromAPI(location, filters) {
        try {
            const apiResponse = await fetch("http://localhost:8080/restaurantProject/findRestaurant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ location, filters })
            }).then(res => {
                if (!res.ok) throw new Error("Backend error");
                return res.json();
            });

            console.log("API Response from backend:", apiResponse);

            if (Array.isArray(apiResponse) && apiResponse.length >= 5) {
                return {
                    name: apiResponse[0],
                    address: apiResponse[1],
                    cuisine: filters.cuisineType || "Various",
                    rating: apiResponse[3] || 4.0,
                    price: apiResponse[4] || 2
                };
            }

            if (apiResponse.name) {
                return {
                    name: apiResponse.name,
                    address: apiResponse.address,
                    cuisine: apiResponse.cuisine || "Various",
                    price: apiResponse.price || 2,
                    rating: apiResponse.rating || 4.0
                };
            }

            return null;
        } catch (error) {
            console.error("Error in fetchRestaurantFromAPI:", error);
            showError("Error talking to backend API");
            return null;
        }
    }

    function collectFilters() {
        const filters = {
            cuisineType: null,
            priceLevel: null,
            distance: null,
            rating: null
        };

        const filterElements = document.querySelectorAll('.filter');
        filterElements.forEach(filter => {
            const filterText = filter.textContent.trim();

            if (filterText.includes('Cuisine:')) {
                filters.cuisineType = filterText.split('Cuisine:')[1].trim();
            } else if (filterText.includes('Price:')) {
                filters.priceLevel = (filterText.split('Price:')[1].match(/\$/g) || []).length;
            } else if (filterText.includes('Distance:')) {
                const distanceText = filterText.split('Distance:')[1].trim();
                filters.distance = parseDistanceToMeters(distanceText);
            } else if (filterText.includes('Rating:')) {
                const ratingText = filterText.split('Rating:')[1].trim();
                filters.rating = parseRating(ratingText);
            }
        });

        const userData = JSON.parse(localStorage.getItem('currentUser'));
        if (userData && userData.preferences) {
            if (!filters.cuisineType && userData.preferences.cuisines?.length > 0) {
                filters.cuisinesToInclude = userData.preferences.cuisines;
            }
            if (!filters.priceLevel && userData.preferences.priceLevel?.length > 0) {
                filters.priceLevelArray = userData.preferences.priceLevel;
            }
            if (!filters.distance && userData.preferences.radius) {
                filters.distance = parseInt(userData.preferences.radius) * 1609;
            }
            if (!filters.rating && userData.preferences.minRating) {
                filters.rating = parseFloat(userData.preferences.minRating);
            }
        }

        return filters;
    }

    function parseDistanceToMeters(distanceText) {
        const match = distanceText.match(/(\d+(?:\.\d+)?)/);
        return match ? parseFloat(match[1]) * 1609 : 5000;
    }

    function parseRating(ratingText) {
        const stars = (ratingText.match(/★/g) || []).length;
        if (stars) return stars;
        const match = ratingText.match(/(\d+(?:\.\d+)?)/);
        return match ? parseFloat(match[1]) : 0;
    }

    function showLoadingState() {
        let overlay = document.getElementById('loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-utensils fa-spin"></i>
                    <p>Finding your perfect restaurant...</p>
                </div>
            `;
            const style = document.createElement('style');
            style.textContent = `
                #loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .loading-spinner {
                    background-color: white;
                    padding: 2rem;
                    border-radius: 10px;
                    text-align: center;
                }
                .loading-spinner i {
                    font-size: 3rem;
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                }
                .fa-spin {
                    animation: fa-spin 2s infinite linear;
                }
                @keyframes fa-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(overlay);
        } else {
            overlay.style.display = 'flex';
        }
    }

    function hideLoadingState() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    function showError(message) {
        hideLoadingState();
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = message;
        toast.style = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: red;
            color: white;
            padding: 1rem;
            border-radius: 4px;
            z-index: 1000;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    function displayRestaurant(restaurant) {
        hideLoadingState();
        alert(`We found: ${restaurant.name}\n${restaurant.address}\nCuisine: ${restaurant.cuisine}\nRating: ${restaurant.rating}\nPrice: ${'$'.repeat(restaurant.price)}`);
        // You can replace this with your modal or fancy UI
    }
});
