using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;


namespace mywebapi2
{
    public class Employee
    {
        public int EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public decimal Salary { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }

        // Select
        public static List<Employee> GetEmployees(SqlConnection con)
        {
            List<Employee> employees = new List<Employee>();

            SqlCommand cmd = new SqlCommand("select e.EmployeeId, e.LastName, e.FirstName, e.Salary, e.DepartmentId, d.DepartmentName from Employee e left outer join Department d on e.DepartmentId = d.DepartmentId", con);
            cmd.CommandType = System.Data.CommandType.Text;

            SqlDataReader rdr = cmd.ExecuteReader();

            while (rdr.Read())
            {
                Employee emp = new Employee();
                emp.EmployeeId = Convert.ToInt32(rdr["EmployeeId"]);
                emp.FirstName = rdr["FirstName"].ToString();
                emp.LastName = rdr["LastName"].ToString();
                emp.Salary = Convert.ToDecimal(rdr["Salary"]);
                emp.DepartmentId = rdr["DepartmentId"].ToString() == "" ? 0 : Convert.ToInt32(rdr["DepartmentId"]);
                emp.DepartmentName = rdr["DepartmentName"].ToString();
                employees.Add(emp);
            }

            return employees;
        }

        // Insert
        public static int InsertEmployee(SqlConnection con, Employee employee)
        {
            int rowsInserted = 0;
            SqlCommand cmd = new SqlCommand("insert into Employee (LastName, FirstName, Salary, DepartmentId) values (@LastName, @FirstName, @Salary, (case when @DepartmentId = 0 then null else @DepartmentId end))", con);
            cmd.CommandType = CommandType.Text;

            cmd.Parameters.Add("@LastName", SqlDbType.VarChar);
            cmd.Parameters.Add("@FirstName", SqlDbType.VarChar);
            cmd.Parameters.Add("@Salary", SqlDbType.Decimal);
            cmd.Parameters.Add("@DepartmentId", SqlDbType.Int);

            cmd.Parameters["@LastName"].Value = employee.LastName;
            cmd.Parameters["@FirstName"].Value = employee.FirstName;
            cmd.Parameters["@Salary"].Value = employee.Salary;
            cmd.Parameters["@DepartmentId"].Value = employee.DepartmentId;

            rowsInserted = cmd.ExecuteNonQuery();
            return rowsInserted;
        }

        // Update
        public static int UpdateEmployee(SqlConnection con, Employee employee)
        {
            int rowsUpdated = 0;

            SqlCommand cmd = new SqlCommand("update Employee set Firstname = @FirstName, LastName = @LastName, Salary = @Salary, DepartmentId = (case when @DepartmentId = 0 then null else @DepartmentId end) where employeeId = @EmployeeId", con);
            cmd.CommandType = CommandType.Text;

            cmd.Parameters.Add("@EmployeeId", SqlDbType.Int);
            cmd.Parameters.Add("@FirstName", SqlDbType.VarChar);
            cmd.Parameters.Add("@LastName", SqlDbType.VarChar);
            cmd.Parameters.Add("@Salary", SqlDbType.Decimal);
            cmd.Parameters.Add("@DepartmentId", SqlDbType.Int);

            cmd.Parameters["@EmployeeId"].Value = employee.EmployeeId;
            cmd.Parameters["@FirstName"].Value = employee.FirstName;
            cmd.Parameters["@LastName"].Value = employee.LastName;
            cmd.Parameters["@Salary"].Value = employee.Salary;
            cmd.Parameters["@DepartmentId"].Value = employee.DepartmentId;

            rowsUpdated = cmd.ExecuteNonQuery();

            return rowsUpdated;
        }

        // Delete
        public static int DeleteEmployee(SqlConnection con, int employeeId)
        {
            int rowsDeleted = 0;

            SqlCommand cmd = new SqlCommand("delete from Employee where employeeId = @employeeId", con);
            cmd.CommandType = CommandType.Text;

            cmd.Parameters.Add("@employeeId", SqlDbType.Int);
            cmd.Parameters["@employeeId"].Value = employeeId;

            rowsDeleted = cmd.ExecuteNonQuery();

            return rowsDeleted;
        }

    }
}
