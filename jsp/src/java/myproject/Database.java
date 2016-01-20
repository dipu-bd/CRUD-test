/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package myproject;

import java.sql.Connection;
import java.sql.DriverManager; 
import java.sql.ResultSet;
import java.sql.SQLException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

/**
 * To connect with database
 */
public class Database {

    final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    final String DB_URL = "jdbc:mysql://localhost:3306/myproject";
    final String USER = "root";
    final String PASS = "";

    public String runQuery(String sql) throws ClassNotFoundException, SQLException, Exception {
        JSONObject output = new JSONObject();
        Class.forName(JDBC_DRIVER);
        Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
        ResultSet rs = conn.prepareStatement(sql).executeQuery();
        //retrieve list of rows
        retrieveRows(rs, output);
        //close connections
        rs.close();
        conn.close();
        return JSONValue.toJSONString(output);
    }

    public void runUpdate(String sql) throws ClassNotFoundException, SQLException {
        Class.forName(JDBC_DRIVER);
        Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
        conn.prepareStatement(sql).execute();
        conn.close();
    }

    public void retrieveRows(ResultSet resultSet, JSONObject output) throws Exception {
        try {
            JSONArray arr = new JSONArray();
            while (resultSet.next()) {
                JSONObject row = new JSONObject();
                row.put("student_id", resultSet.getLong("student_id"));
                row.put("student_name", resultSet.getString("student_name"));
                row.put("regno", resultSet.getLong("regno"));
                row.put("cgpa", resultSet.getDouble("cgpa"));
                arr.add(row);
            }
            output.put("result", arr);
        } catch (Exception ex) {
            throw new Exception("Fetch failed: " + ex.getMessage());
        }
    } 
    
    public String getStudent(long regno) throws ClassNotFoundException, SQLException {
        JSONObject output = new JSONObject();
        Class.forName(JDBC_DRIVER);
        Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
        String sql = "SELECT * FROM student WHERE regno=" + String.valueOf(regno);
        ResultSet resultSet = conn.prepareStatement(sql).executeQuery();
        //retrieve list of rows
        if (resultSet.next()) {
            JSONObject row = new JSONObject();
            row.put("student_id", resultSet.getLong("student_id"));
            row.put("student_name", resultSet.getString("student_name"));
            row.put("regno", resultSet.getLong("regno"));
            row.put("cgpa", resultSet.getDouble("cgpa"));
            output.put("result", row);
        }
        //close connections
        resultSet.close();
        conn.close();
        return JSONValue.toJSONString(output);
    }
}
