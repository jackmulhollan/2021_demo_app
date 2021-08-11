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
    public class DepartmentsController : ControllerBase
    {
        string connectionString = @"data source=LAPTOP-T24FIB73\SQLEXPRESS; database=db01; Integrated Security=true;";

        private readonly ILogger<DepartmentsController> _logger;
        public DepartmentsController(ILogger<DepartmentsController> logger)
        {
            _logger = logger;
        }

        // Select
        [HttpGet]
        [Route("/Departments/GetDepartments")]
        public Response GetDepartment()
        {
            Response response = new Response();
            List<Department> departments = new List<Department>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    departments = Department.GetDepartments(con);
                }

                response.result = "success";
                response.message = $"{departments.Count()} rows selected.";
                response.departments = departments;
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
        [Route("/Departments/InsertDepartment")]
        public Response InsertDepartment([FromBody] Department department)
        {
            Response response = new Response();
            int rowsInserted = 0;
            List<Department> departments = new List<Department>();

            try
            {
                string departmentName = department.DepartmentName;

                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    rowsInserted = Department.InsertDepartment(con, departmentName);
                    departments = Department.GetDepartments(con);
                }

                response.result = "success";
                response.message = $"{rowsInserted} rows inserted.";
                response.departments = departments;
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
        [Route("/Departments/UpdateDepartment")]
        public Response UpdateDepartment([FromBody] Department Department)
        {
            Response response = new Response();
            int rowsUpdated = 0;
            List<Department> Departments = new List<Department>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    rowsUpdated = Department.UpdateDepartment(con, Department);
                    Departments = Department.GetDepartments(con);
                }

                response.result = "success";
                response.message = $"{rowsUpdated} rows updated.";
                response.departments = Departments;
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
        [Route("/Departments/DeleteDepartment")]
        public Response DeleteDepartment(int DepartmentId)
        {
            Response response = new Response();
            int rowsDeleted = 0;
            List<Department> Departments = new List<Department>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    rowsDeleted = Department.DeleteDepartment(con, DepartmentId);
                    Departments = Department.GetDepartments(con);
                }

                response.result = "success";
                response.message = $"{rowsDeleted} rows deleted.";
                response.departments = Departments;
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
