import javax.servlet.*; 
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.stream.Collectors;
import org.json.JSONArray;
import org.json.JSONObject;


@WebServlet("/restaurantProject/find")
public class RestaurantSearchServlet extends HttpServlet {
    //allow CORS
    private void setCORSHeaders(HttpServletResponse response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
    @Override//allow CORS
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setCORSHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setCORSHeaders(response);
        response.setContentType("application/json"); // set response content type to JSON so browser knows what to
                                                     // expect
        PrintWriter out = response.getWriter(); // this will be used to write back a response from the front end

        try {
            // 1. Read the JSON body sent by frontend req
            // Converts the req input stream (lines of text) into one single string
            String requestBody = request.getReader().lines().collect(Collectors.joining());
            JSONObject body = new JSONObject(requestBody); // parse JSON body into JSON obj

            String address = body.optString("location"); // extract location
            JSONObject filters = body.optJSONObject("filters"); // extracts filters

            String cuisineType = filters.optString("cuisineType", "restaurant"); // think this might need to be altered
            long radius = filters.optLong("distance", 5000);
            double rating = filters.optDouble("rating", 0);
            int priceLevel = filters.optInt("priceLevel", 0); // level 1-4

            MapSearchApi.setFilter(cuisineType); //get cuisine type
            MapSearchApi.setRadius(radius); //get radius
            MapSearchApi.setMinRating(rating); //get rating
            MapSearchApi.setPriceLevel(priceLevel); //get priceLevel

            // 2. Convert address to coordinates CAN ALSO TAKE coords on their own, unless
            // putting in coords as address will just return the same coords?
            double[] coords = MapSearchApi.AddressToCoords(address);
            if (coords == null) {
                out.print("[]"); // Return empty array if no coords
                return;
            }

            // 3. Use your existing search and parseRandom method
            String responseJson = MapSearchApi.search(coords[0], coords[1]);
            JSONArray restaurant = MapSearchApi.parseRandom(responseJson); // returns [name, address, placeId, rating]

            // 4. Return result to frontend
            out.print(restaurant.toString()); //

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Server error occurred\"}");
        }
    }
}
