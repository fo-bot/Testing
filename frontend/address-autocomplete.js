/**
 * Address Autocomplete
 * 
 * This file handles the address autocomplete functionality using Google Places API.
 * It provides suggestions as users type in the location input field.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if Google Maps API is loaded
    const checkGoogleMapsLoaded = setInterval(function() {
        if (typeof google !== 'undefined' && 
            typeof google.maps !== 'undefined' && 
            typeof google.maps.places !== 'undefined' &&
            typeof google.maps.places.Autocomplete !== 'undefined') {
            
            console.log('Google Maps Places API loaded successfully');
            clearInterval(checkGoogleMapsLoaded);
            initializeAddressAutocomplete();
        } else {
            console.log('Waiting for Google Maps Places API to load...');
        }
    }, 1000);
    
    // Stop checking after 10 seconds to prevent infinite loops
    setTimeout(function() {
        clearInterval(checkGoogleMapsLoaded);
        console.log('Timed out waiting for Google Maps API');
    }, 10000);
});

/**
 * Initialize the Google Places Autocomplete feature
 */
function initializeAddressAutocomplete() {
    // Find the location input
    const locationInput = document.querySelector('.location-input');
    
    if (!locationInput) return; // Exit if input doesn't exist
    
    // Create the autocomplete object
    const autocomplete = new google.maps.places.Autocomplete(locationInput, {
        types: ['geocode', 'establishment'], // Return both addresses and establishments (businesses)
        fields: ['formatted_address', 'geometry', 'name'], // The data we want from Place Details
        componentRestrictions: { country: [] } // No country restriction
    });
    
    // When a place is selected from the dropdown
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) {
            // User entered the name of a Place that wasn't suggested and pressed Enter
            console.log("No details available for input: '" + place.name + "'");
            return;
        }
        
        // Fill the input with the selected address
        if (place.formatted_address) {
            locationInput.value = place.formatted_address;
        } else {
            locationInput.value = place.name;
        }
        
        // Store the latitude and longitude as data attributes
        locationInput.dataset.latitude = place.geometry.location.lat();
        locationInput.dataset.longitude = place.geometry.location.lng();
        
        // Optionally trigger an event that other parts of your code could listen for
        const placeSelectedEvent = new CustomEvent('place-selected', { 
            detail: {
                address: locationInput.value,
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng()
            }
        });
        locationInput.dispatchEvent(placeSelectedEvent);
    });
    
    // Prevent form submission when selecting with Enter key
    locationInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement === locationInput) {
            if (document.querySelector('.pac-container:visible')) {
                e.preventDefault();
            }
        }
    });
    
    // Add some styling for the autocomplete dropdown
    addAutocompleteStyles();
}

/**
 * Add custom styles for the autocomplete dropdown
 */
function addAutocompleteStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .pac-container {
            border-radius: 4px;
            margin-top: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            z-index: 9999;
        }
        
        .pac-item {
            padding: 8px 10px;
            cursor: pointer;
        }
        
        .pac-item:hover {
            background-color: #f8f9fa;
        }
        
        .pac-item-selected {
            background-color: #f0f0f0;
        }
        
        .pac-icon {
            margin-right: 10px;
        }
        
        .pac-item-query {
            font-size: 14px;
            color: #333;
        }
        
        .pac-matched {
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}