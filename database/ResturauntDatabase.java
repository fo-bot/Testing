package database;
import backend.Resturaunt;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class ResturauntDatabase extends Resturaunt {
    private int resturauntID;
    private String restaurantName;

    public ResturauntDatabase(int id, String name) {
        super(id, name);
        this.resturauntID = id;
        this.restaurantName = name;
    }

    // Save user to the database
    public void saveToDatabase() {
        /*
         * AKASH DO THE NEXT 4 LINES WITH YOUR STUFF
         */
        String url = "jdbc:mysql://localhost:3306/your_database_name"; // Replace with your database URL
        String dbUsername = "root"; // Replace with your database username
        String dbPassword = "password"; // Replace with your database password
        String insertQuery = "INSERT INTO users (user_id, username, password) VALUES (?, ?, ?)";

        try (Connection connection = DriverManager.getConnection(url, dbUsername, dbPassword);
             PreparedStatement statement = connection.prepareStatement(insertQuery)) {

            // Set parameters for the query
            statement.setInt(1, this.getId());
            statement.setString(2,this.getName());

            // Execute the query
            int rowsInserted = statement.executeUpdate();
            if (rowsInserted > 0) {
                System.out.println("Resturaunt " + this.getId() + " was successfully saved to the database.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}