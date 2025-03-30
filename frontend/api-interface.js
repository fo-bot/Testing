// Enhanced API interface with proper backend URL configuration

class RestaurantAPI {
    constructor() {
        // Base URL for the API - configure this based on your backend deployment
        // During development, this might be something like http://localhost:8080/restaurantProject
        // In production, it might be a relative path like '/api' or an absolute URL
        this.baseUrl = 'http://localhost:8080/restaurantProject';
        
        // Log the API configuration
        console.log('Restaurant API initialized with base URL:', this.baseUrl);
    }

    /**
     * Find a random restaurant based on location and filters
     * @param {Object} params - Search parameters
     * @param {string} params.location - Location string (address or coordinates)
     * @param {Object} params.filters - Filter criteria
     * @returns {Promise} - Promise that resolves with restaurant data
     */
    async findRandomRestaurant(params) {
        try {
            console.log('findRandomRestaurant called with params:', params);
            
            // Determine if location is coordinates or address
            let endpoint;
            let requestData = {};
            
            if (params.location.includes(',')) {
                // Appears to be coordinates, parse and use directly
                const coordinates = params.location.split(',');
                const latitude = parseFloat(coordinates[0].trim());
                const longitude = parseFloat(coordinates[1].trim());
                
                if (isNaN(latitude) || isNaN(longitude)) {
                    throw new Error('Invalid coordinates format');
                }
                
                // Use the coordinates directly with the search endpoint
                endpoint = '/search';
                requestData = {
                    latitude,
                    longitude,
                    filters: this.#formatFilters(params.filters)
                };
            } else {
                // Location is an address, use the address-based search
                endpoint = '/searchByAddress';
                requestData = {
                    address: params.location,
                    filters: this.#formatFilters(params.filters)
                };
            }
            
            console.log('API endpoint:', endpoint);
            console.log('Request data:', JSON.stringify(requestData));
            
            // Make POST request to the appropriate endpoint
            try {
                const response = await fetch(this.baseUrl + endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`API request failed with status: ${response.status}`, errorText);
                    throw new Error(`API request failed with status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('API response data:', data);
                return data;
            } catch (fetchError) {
                console.error('Fetch error:', fetchError);
                
                // Check if backend is running
                try {
                    const pingResponse = await fetch(`${this.baseUrl}/getLocation`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        },
                        // Short timeout to avoid long waiting times
                        signal: AbortSignal.timeout(3000)
                    });
                    
                    if (pingResponse.ok) {
                        console.warn('Backend is running but request failed:', fetchError.message);
                    } else {
                        console.error('Backend returned error status:', pingResponse.status);
                    }
                } catch (pingError) {
                    console.error('Backend server appears to be unreachable:', pingError);
                    alert('Unable to connect to the restaurant service. Please try again later.');
                }
                
                throw fetchError;
            }
        } catch (error) {
            console.error('Error in findRandomRestaurant:', error);
            throw error;
        }
    }
    
    /**
     * Format filters for the backend API
     * @param {Object} filters - Filter criteria from the frontend
     * @returns {Object} - Formatted filters for the backend
     * @private
     */
    #formatFilters(filters) {
        console.log('Formatting filters:', filters);
        
        const result = {};
        
        // Handle cuisine types
        if (filters.cuisineType) {
            result.cuisineTypes = [filters.cuisineType];
        } else if (filters.cuisinesToInclude && filters.cuisinesToInclude.length > 0) {
            result.cuisineTypes = filters.cuisinesToInclude;
        }
        
        // Handle price range
        if (filters.priceRange) {
            if (typeof filters.priceRange === 'string') {
                const priceValue = (filters.priceRange.match(/\$/g) || []).length;
                result.priceRange = [priceValue];
            } else {
                result.priceRange = [filters.priceRange]; 
            }
        } else if (filters.priceRangeArray && filters.priceRangeArray.length > 0) {
            result.priceRange = filters.priceRangeArray;
        }
        
        // Handle distance/radius (convert to meters if needed)
        if (filters.distance) {
            result.radius = filters.distance;
        }
        
        // Handle minimum rating
        if (filters.rating > 0) {
            result.minRating = filters.rating;
        }
        
        console.log('Formatted filters:', result);
        return result;
    }
    
    /**
     * Get the user's current location from the browser
     * @returns {Promise} - Promise that resolves with coordinates
     */
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        resolve({ latitude, longitude });
                    },
                    (error) => {
                        reject(new Error(`Geolocation error: ${error.message}`));
                    }
                );
            } else {
                reject(new Error('Geolocation is not supported by this browser'));
            }
        });
    }
    
    /**
     * Send user location to the backend server
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate  
     * @returns {Promise} - Promise that resolves when location is sent
     */
    async sendLocationToServer(latitude, longitude) {
        try {
            console.log(`Sending location to server: ${latitude}, ${longitude}`);
            const response = await fetch(`${this.baseUrl}/LocalServer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ latitude, longitude })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to send location: ${response.status}`);
            }
            
            return await response.text();
        } catch (error) {
            console.error('Error sending location to server:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const restaurantAPI = new RestaurantAPI();

// Export for use in other modules
export default restaurantAPI;