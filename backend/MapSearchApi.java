import java.io.*; //for handling input/output
import java.net.HttpURLConnection; //for making HTTP requests
import java.net.URL; //for handling URLs
import java.util.Random;
import java.util.Scanner;//used in main() for testing, maybe taken out if main() is removed.
import com.google.gson.Gson;
import org.json.JSONObject;
import org.json.JSONArray;
import java.net.URLEncoder;//to encode address properly for legacy places API textsearch

public class MapSearchApi {
    private static final String key = "AIzaSyDGYZDBalEh2oeJP6SnU6mffWQNj4FPDt0";
    private static final String key2 = "AIzaSyAl4OsSbGOk8wIOCrwVP7gAkq-R3IYMti0";// for old places api, for text search
    static double x = 43.24; // default/placeholder latitude for testing
    static double y = -79.89; // default/placeholder longitude for testing
    static long rad = 5000; // radius in metres
    static String filter = "\"restaurant\""; // to be changed base on the user input on
    static double ratingThreshold = 0;
    static int priceFilter = 0;// for price level

    public static void setPriceLevel(int level) {
        priceFilter = level;
    }

    public static void setMinRating(double minRating) {
        ratingThreshold = minRating;
    }

    public static void setFilter(String cuisineType) { // get cuisine type
        if (cuisineType == null || cuisineType.isEmpty()) {
            filter = "\"restaurant\"";
        } else {
            // Convert "Mexican" to "mexican_restaurant"
            String converted = cuisineType.toLowerCase().replace(" ", "_") + "_restaurant";
            filter = "\"" + converted + "\"";
        }

        System.out.println("Applied Filter: " + filter); // Log for debugging
    }

    public static void setRadius(long r) {// get radius
        if (r > 0) rad = r;
    }

    public static void main(String[] args) { //just used for testing backend by itself
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter address (or Enter empty to use stored location):");
        String userAddress = scanner.nextLine().trim();

        double latitude, longitude;
        if (!userAddress.isEmpty()) {
            double[] coords = AddressToCoords(userAddress);
            if (coords == null) { // CASE 1: address is input from text box, fetch coords with textSearch from
                                  // Places API
                System.out.println("could not retrieve coordinates for the inputted address.");
                return;
            }
            latitude = coords[0];
            longitude = coords[1];
        } else { // CASE 2: address not entered, use grabbed location thats stored in localServer
            Location userLocation = StoredLocationFetch();
            if (userLocation == null) {
                System.out.println("user location data not available.");
                return;
            }
            latitude = userLocation.getLatitude();
            longitude = userLocation.getLongitude();
        }
        // always call search, despite origin of the user's latitude/longitude
        System.out.println("location retreived: latitude= " + latitude + ", longitude= " + longitude);
        String response = search(latitude, longitude);
        // always parse to return 1 random restaurant fitting parameters
        if (response != null) {
            parseRandom(response);
        } else {
            System.out.println("API returned no results.");
        }
    }

    // front end should go here to get user location from an inputed address. this
    // converts the input to latitude/longitude to work with the search().
    public static double[] AddressToCoords(String address) {
        try {
            String addressEncoded = URLEncoder.encode(address, "UTF-8");
            String urlString = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + addressEncoded
                    + "&key=" + key2;
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            // reader
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            // parse json repsonse
            JSONObject jsonObject = new JSONObject(response.toString());
            JSONArray results = jsonObject.optJSONArray("results");
            if (results != null && results.length() > 0) {
                JSONObject first = results.getJSONObject(0);
                JSONObject location = first.getJSONObject("geometry").getJSONObject("location");
                double lat = location.getDouble("lat");
                double lng = location.getDouble("lng");
                String name = first.optString("name", "Unkown");
                String addressF = first.optString("formatted_address", "No address");
                System.out.println("name: " + name);
                System.out.println("address: " + addressF);
                // System.out.println("latitude: " + lat); // for testing
                // System.out.println("longitude: " + lng); // ^
                return new double[] { lat, lng };
            } else {
                System.out.println("no results found for query/address.");
                return null;
            }
        } catch (Exception e) {
            System.out.println("error during legacy placesAPI text search:");
            e.printStackTrace();
            return null;
        }
    }

    // get the stored location data from Location.java
    // currently works by looking at LocalServer via local TomCat server
    // installation
    public static Location StoredLocationFetch() {
        try {
            URL url = new URL("http://localhost:8080/restaurantProject/getLocation");// where the POST is on localserver
                                                                                     // to get location data
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            Gson gson = new Gson();
            return gson.fromJson(response.toString(), Location.class);
        } catch (Exception e) {
            e.printStackTrace();
            ;
            return null;
        }
    }

    /*
     * grabs raw restaurant info from google maps api, using json.
     */
    public static String search(double lat, double lon) {
        try {
            // url for google places api
            URL url = new URL("https://places.googleapis.com/v1/places:searchNearby");

            // for creating a HTTP connection
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json"); // this specifies were sending json data
            conn.setRequestProperty("X-Goog-Api-Key", key);
            conn.setRequestProperty("X-Goog-FieldMask",
                    "places.displayName,places.id,places.shortFormattedAddress,places.types,places.rating");

            String jsonBody = "{"
                    + "\"includedTypes\": [" + filter + "]," // search for restaurants
                    + "\"locationRestriction\": {"
                    + "  \"circle\": {"
                    + "    \"center\": { \"latitude\": " + lat + ", \"longitude\": " + lon + " }," // use provided
                                                                                                   // lat/lon
                    + "    \"radius\": " + rad + "" // search within radius
                    + "  }"
                    + "}}";

            conn.setDoOutput(true); // allows sending data in the request
            try (OutputStream os = conn.getOutputStream()) { // open a stream to send json body
                os.write(jsonBody.getBytes("utf-8")); // convert json to bites and send
            }

            // reader to get response from google
            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
            StringBuilder response = new StringBuilder();
            String line;
            // read response line by line
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            // convert response to string to print
            return response.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static JSONArray parseRandom(String jsonResponse) {
    try {
            JSONObject json = new JSONObject(jsonResponse);
            JSONArray places = json.optJSONArray("places");
            //1:2
            if (places != null && places.length() > 0) {
                JSONArray filtered = new JSONArray();
                for (int i = 0; i < places.length(); i++) {
                    JSONObject place = places.getJSONObject(i);
                    int level = place.optInt("priceLevel", -1);
                    if (priceFilter == 0 || level == priceFilter) {
                        filtered.put(place);
                    }
                }
                if (filtered.length() == 0) {
                    System.out.println("No restaurants matched the price level filter.");
                    return null;
                }
                //1:2 up is for the price level
                Random rand = new Random();
                JSONObject selected = filtered.getJSONObject(rand.nextInt(filtered.length()));

                String name = selected.optJSONObject("displayName").optString("text", "Unknown");
                String address = selected.optString("shortFormattedAddress", "no Address Available");
                String placeId = selected.optString("id", "no ID");
                double rating = selected.has("rating") ? selected.getDouble("rating") : -1;
                int priceLevel = selected.has("priceLevel") ? selected.getInt("priceLevel") : 2;
                //this block is for testing backend by printing result to console
                System.out.println("Randomly Selected Restaurant: ");
                System.out.println("Name: " + name);
                System.out.println("Address: " + address);
                System.out.println("Place ID: " + placeId);
                System.out.println("Rating: " + (rating != -1 ? rating : "N/A"));

                JSONArray result = new JSONArray();
                result.put(name);
                result.put(address);
                result.put(placeId);
                result.put(rating);
                result.put(priceLevel);
                return result;
            } else {
                System.out.println("No restaurants found fitting description.");
            }
        } catch (Exception e) {
            System.out.println("Error while parsing JSON:");
            e.printStackTrace();
        }

        return null;
    }
}
