/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Mypack1;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author DELL
 */
public class AddNew extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        MySession ms = new MySession();
        String action = request.getParameter("action");
        if (action.equalsIgnoreCase("update")) {
            String sid = request.getParameter("id");
            int id = Integer.parseInt(sid);
            System.out.println(sid);
            HttpSession session = request.getSession();
            ms.setId(id);
            session.setAttribute("ms", ms);
            response.sendRedirect("Update.jsp");
        }
        else if (action.equalsIgnoreCase("delete")) {
            String sid = request.getParameter("id");
            int id = Integer.parseInt(sid);
            MysqlConnector m = new MysqlConnector();
            m.setConnectionWithMySql();
            m.delete(id);
            response.sendRedirect("StudentInfo.jsp");
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String name = request.getParameter("name");
        String regno = request.getParameter("regno");
        String cgpa = request.getParameter("cgpa");
        System.out.println(name);
        System.out.println(regno);
        System.out.println(cgpa);

        MysqlConnector mc = new MysqlConnector();
        mc.setConnectionWithMySql();
        mc.insert(name, Long.parseLong(regno), Float.parseFloat(cgpa));
        response.sendRedirect("StudentInfo.jsp");
        //}

    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
