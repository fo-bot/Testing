import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
 /*
  * How it works:
  * user clicks "Scan location" (geolocator.html) and we get their location as a JSON file to pass it to the
  * Local server (here), where we unencrypt it into a GSON file so java can read it and pass it to the
  * Location class.
  */
  /*
   * NEXT STEPS:
   * store the location of the users in the database, 
   * resturantsNearMe should take the info from the database and serach for resturaunts
   * by usingthe user preferences
   */
@WebServlet({"/LocalServer", "/getLocation"})//supports both paths
public class LocalServer extends HttpServlet{
    private static final long serialVersionUID = 1L;
    private static Location storedLocation;
    @Override
    public void init() throws ServletException {//for testing
        System.out.println("LocalServer Servlet Init");
    }
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("recieved OPTIONS request for CORS.");//for testing
        //also deals with CORS
        response.setHeader("Access-Control-Allow-Origin", "*");  // Allow all origins
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");  // Allow these methods
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");  // Allow Content-Type header
        response.setStatus(HttpServletResponse.SC_OK);
        System.out.println("CORS headers set for OPTIONS request");//for testing
    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        //this deals with CORS(cross-origin resource sharing)
        response.setHeader("Access-Control-Allow-Origin", "*");//allow any origin to access resource(location)
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");//allow POST request and Options
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");//allow content-type header for requests
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String Line;
        while((Line = reader.readLine()) != null){
            sb.append((Line));
        }
        String jsonData = sb.toString();
        Gson gson = new Gson();
        storedLocation = gson.fromJson(jsonData,Location.class);
        response.getWriter().write("Location received and stored");
    }
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*"); //CORS
        response.setContentType("application/json");
        Gson gson = new Gson();
        String jsonResponse;
        if (storedLocation == null) {
            //use hashmap because otherwise another class is created after compile
            java.util.Map<String, String> errorResponse = new java.util.HashMap<>();
            errorResponse.put("error", "no location data available");
            jsonResponse = gson.toJson(errorResponse);
        } else {
            jsonResponse = gson.toJson(storedLocation); //gson to serialize object instead of manual formatting because i cant get it right
        }
        response.getWriter().write(jsonResponse);
    }
    public static Location getStoredLocation() {
        if (storedLocation == null) {
            System.out.println("err: no location data stored in LocalServer."); //for testing
        } else {
            System.out.println("Stored location data found: Latitude= " + storedLocation.getLatitude() + ", Longitude= " +storedLocation.getLongitude());//for testing
        }
        return storedLocation;
    }
}
