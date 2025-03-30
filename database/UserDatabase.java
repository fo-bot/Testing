package database;
import backend.User;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class UserDatabase extends User {
    private int userId;
    private String userName;
    private String userEmail;
    private String userPassword;

    // Constructor to copy our user object information
    public UserDatabase(int id, String name, String email, String password) {
        super(id, name, email, password);
        this.userId = id;
        this.userName = name;
        this.userEmail = email;
        this.userPassword = password;
        
        /* 
         * Test with this alternatively:
         *   super.setID(id);
            super.setPassword(password); 
            super.setName(name);
            super.setEmail(email);
        */

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
            statement.setString(2,this.getEmail());
            statement.setString(3, this.getPassword());

            // Execute the query
            int rowsInserted = statement.executeUpdate();
            if (rowsInserted > 0) {
                System.out.println("User " + this.getId() + " was successfully saved to the database.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}