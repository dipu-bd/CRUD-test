/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package myproject;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

/**
 *
 * @author Dipu
 */
public class MyServer {

    private static final Database database = new Database();

    public static void List(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String query = "SELECT * FROM student";
            String result = database.runQuery(query);
            response.getWriter().write(result);
        } catch (Exception ex) {
            JSONObject output = new JSONObject();
            output.put("error", "Connection failed: " + ex.getMessage());
            response.getWriter().write(JSONValue.toJSONString(output));
        }
    }

    public static void Query(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String jsonString = IOUtils.toString(request.getInputStream());
            JSONObject json = (JSONObject) JSONValue.parse(jsonString);
            String query = (String) json.get("query");
            String result = database.runQuery(query);
            response.getWriter().write(result);
        } catch (Exception ex) {
            JSONObject output = new JSONObject();
            output.put("error", "Connection failed: " + ex.getMessage());
            response.getWriter().write(JSONValue.toJSONString(output));
        }
    }

    public static void Add(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String jsonString = IOUtils.toString(request.getInputStream());
            JSONObject json = (JSONObject) JSONValue.parse(jsonString);
            String student_name = (String) json.get("student_name");
            Long regno = (Long) json.get("regno");
            Double cgpa = (Double) json.get("cgpa");
 
            String query = String.format(
                    "INSERT INTO student "
                    + "(student_name, regno, cgpa) "
                    + "VALUES('%s',%d,%f)",
                    JSONValue.escape(student_name), regno, cgpa);

            database.runUpdate(query);

            String result = database.getStudent(regno);
            response.getWriter().write(result);
        } catch (Exception ex) {
            JSONObject output = new JSONObject();
            output.put("error", "Connection failed: " + ex.getMessage());
            response.getWriter().write(JSONValue.toJSONString(output));
        }
    }

    public static void Update(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String jsonString = IOUtils.toString(request.getInputStream());
            JSONObject json = (JSONObject) JSONValue.parse(jsonString);
            Long student_id = (Long) json.get("student_id");
            String student_name = (String) json.get("student_name");
            Long regno = (Long) json.get("regno");
            Double cgpa = (Double) json.get("cgpa");
 
            String query = String.format(
                    "UPDATE student "
                    + "SET student_name='%s',"
                    + "regno=%d,"
                    + "cgpa=%f "
                    + "WHERE student_id=%d",
                    JSONValue.escape(student_name), regno, cgpa, student_id
            );

            database.runUpdate(query);

            String result = database.getStudent(regno);
            response.getWriter().write(result);
        } catch (Exception ex) {
            JSONObject output = new JSONObject();
            output.put("error", "Connection failed: " + ex.getMessage());
            response.getWriter().write(JSONValue.toJSONString(output));
        }
    }

    public static void Delete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            String jsonString = IOUtils.toString(request.getInputStream());
            JSONObject json = (JSONObject) JSONValue.parse(jsonString);
            Long student_id = (Long) json.get("student_id");

            String query = String.format(
                    "DELETE FROM student "
                    + "WHERE student_id=%d",
                    student_id
            );

            database.runUpdate(query);

            JSONObject output = new JSONObject();
            output.put("result", true);
            response.getWriter().write(JSONValue.toJSONString(output));
        } catch (Exception ex) {
            JSONObject output = new JSONObject();
            output.put("error", "Connection failed: " + ex.getMessage());
            response.getWriter().write(JSONValue.toJSONString(output));
        }
    }
}
