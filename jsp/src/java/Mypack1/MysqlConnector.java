package Mypack1;

//STEP 1. Import required packages
import java.sql.*;

public class MysqlConnector {

    // JDBC driver name and database URL
    public static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    public static final String DB_URL = "jdbc:mysql://localhost:3306/myproject";

    //  Database credentials
    public static final String USER = "root";
    public static final String PASS = "";
    public Connection conn = null;
    public Statement stmt = null;

    public void setConnectionWithMySql() {

        try {
            //STEP 2: Register JDBC driver
            Class.forName("com.mysql.jdbc.Driver");

            //STEP 3: Open a connection
            conn = DriverManager.getConnection(DB_URL, USER, PASS);

            //STEP 4: Execute a query
            stmt = conn.createStatement();
            String sql;
            sql = "SELECT * FROM student";
            ResultSet rs = stmt.executeQuery(sql);

            //STEP 5: Extract data from result set
            while (rs.next()) {
                //Retrieve by column name
                String id = rs.getString("id").toString();

                //Display values
                System.out.println(id);

            }
            //STEP 6: Clean-up environment
            /*rs.close();
             stmt.close();
             conn.close(); */
        } catch (Exception e) {
            //Handle errors for JDBC

        }
        System.out.println("Goodbye!");
    }//end main

    public void insert(String name, Long regno, float cgpa) {
        try {
            PreparedStatement preparedStatement = conn.prepareStatement("insert into student(student_name,regno,cgpa) values (?, ?, ?)");
            // Parameters start with 1
            preparedStatement.setString(1, name);
            preparedStatement.setLong(2, regno);
            preparedStatement.setFloat(3, cgpa);
            preparedStatement.executeUpdate();
            System.out.println("INSIDE");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void update(int id, String name, long regno, float cgpa) {
        try {
            PreparedStatement preparedStatement = conn.prepareStatement("update student set cgpa=?,student_name=?,regno=? where student_id=?");
            // Parameters start with 1
            preparedStatement.setFloat(1, cgpa);
            preparedStatement.setString(2, name);
            preparedStatement.setLong(3, regno);

            preparedStatement.setInt(4, id);
            preparedStatement.executeUpdate();
            System.out.println("UPDATEINSIDE");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void delete(int id) {
        try {
            PreparedStatement preparedStatement = conn.prepareStatement("delete from student where student_id=?");

            preparedStatement.setInt(1, id);
            preparedStatement.executeUpdate();
            System.out.println("DELETEINSIDE");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}//end FirstExample
