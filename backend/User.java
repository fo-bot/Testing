package Backend;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

public class User{

    /*
     * CREATING THE OBJECT CHARACTERISTICS
     * Contributed By: Ahmad W
     */
    private int id;
    private String name;
    //super the location somehow
    private List<String> favourites;
    private String searchHistory[]; //use an array because lets not store more than like 5 searches
    private Map<String,Object> preferences;
    private float maxPay; //variables to go check my preferences hashmap
    private float radius;

    /*
     * INITIALIZING THE OBJECT
     * Contributed By: Ahmad W
     */

    public User(int id, String name, float radius,String[] searchHistory){
        this.id = id;
        this.name = name;
        this.searchHistory = searchHistory;
        //creating the hashmap object:
        this.preferences = new HashMap<>();
        this.preferences.put("Price Range", null);
        this.preferences.put("Radius: ", radius);
        this.preferences.put("Cuisine: ", null);
    }
    
    //action methods:

     public List<String> removeFavourites(String resturantName){
        //loop through the list, if we find where it is we remove it
        return null;
     }

     public void addToFavourites(String resturantName){
        //add a resturaunt to our favourites list,
     }

     public String[] updateSearchHistory(){
        //we just move all elements int eh history down 1, check for edge cases like if were fill
        return this.searchHistory[];
     }
     
     public void addToSearchHistory(String restaurantName) {
        updateSearchHistory();
        this.searchHistory[-1] = (restaurantName);
        //
    }

    public String[] viewSearchHistory() {
        return this.searchHistory;
    }

    public String[] clearSearchHistory() {
        for(int i = 0; i <=5; i++){
            this.searchHistory[i] = null;
        }
        return this.searchHistory;
    }


     public void updatePreferences(String priceRange, String radius, List<String> cuisine) {
        if (priceRange != null) {
            this.preferences.put("price_range", priceRange);
        }
        if (radius != null) {
            this.preferences.put("radius", radius);
        }
        if (cuisine != null) {
            this.preferences.put("cuisine", cuisine);
        }
    }


    //getter methods:
    public int getId(){
        return this.id;
    }
    
    public String getName(){
        return this.name;
    }

    public List<String> getFavourites(){
        return this.favourites;
    }

    public Map<String, Object> getPreferences() {
        return this.preferences;
    }
    
    //setter methods:
    public void setID(int id){
        this.id = id;
    }
    public void setName(String name){
        this.name = name;
    }

    public void setMaxPay(float maxPay){
        this.maxPay=maxPay;
    }

    public void setRadius(float radius){
        this.radius = radius;
    }
}
