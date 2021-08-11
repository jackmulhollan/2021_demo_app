using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Data.SqlClient;


namespace mywebapi2.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        string connectionString = @"data source=LAPTOP-T24FIB73\SQLEXPRESS; database=db01; Integrated Security=true;";

        private readonly ILogger<EmployeesController> _logger;
        public EmployeesController(ILogger<EmployeesController> logger)
        {
            _logger = logger;
        }

        // Select
        [HttpGet]
        [Route("/Employees/GetEmployees")]
        public Response GetEmployees()
        {
            Response response = new Response();
            List<Employee> employees = new List<Employee>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    employees = Employee.GetEmployees(con);
                }

                response.result = "success";
                response.message = $"{employees.Count()} rows selected.";
                response.employees = employees;
            }
            catch (Exception ex)
            {
                response.result = "failure";
                response.message = ex.Message;
            }

            return response;
        }

        // Insert
        [HttpPost]
        [Route("/Employees/InsertEmployee")]
        public Response InsertEmployee([FromBody] Employee employee)
        {
            Response response = new Response();
            int rowsInserted = 0;
            List<Employee> employees = new List<Employee>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    rowsInserted = Employee.InsertEmployee(con, employee);
                    employees = Employee.GetEmployees(con);
                }

                response.result = "success";
                response.message = $"{rowsInserted} rows inserted.";
                response.employees = employees;
            }
            catch (Exception ex)
            {
                response.result = "failure";
                response.message = ex.Message;
            }

            return response;
        }

        // Update
        [HttpPost]
        [Route("/Employees/UpdateEmployee")]
        public Response UpdateEmployee([FromBody] Employee employee)
        {
            Response response = new Response();
            int rowsUpdated = 0;
            List<Employee> employees = new List<Employee>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    rowsUpdated = Employee.UpdateEmployee(con, employee);
                    employees = Employee.GetEmployees(con);
                }

                response.result = "success";
                response.message = $"{rowsUpdated} rows updated.";
                response.employees = employees;
            }
            catch (Exception ex)
            {
                response.result = "failure";
                response.message = ex.Message;
            }

            return response;
        }

        // Delete
        [HttpGet]
        [Route("/Employees/DeleteEmployee")]
        public Response DeleteEmployee(int employeeId)
        {
            Response response = new Response();
            int rowsDeleted = 0;
            List<Employee> employees = new List<Employee>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    rowsDeleted = Employee.DeleteEmployee(con, employeeId);
                    employees = Employee.GetEmployees(con);
                }

                response.result = "success";
                response.message = $"{rowsDeleted} rows deleted.";
                response.employees = employees;
            }
            catch (Exception ex)
            {
                response.result = "failure";
                response.message = ex.Message;
            }

            return response;
        }

    }
}
