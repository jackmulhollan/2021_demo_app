using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;


namespace mywebapi2
{
    public class Department
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }

        // Select
        public static List<Department> GetDepartments(SqlConnection con)
        {
            List<Department> departments = new List<Department>();

            SqlCommand cmd = new SqlCommand("select DepartmentId, DepartmentName from Department", con);
            cmd.CommandType = System.Data.CommandType.Text;

            SqlDataReader rdr = cmd.ExecuteReader();

            while (rdr.Read())
            {
                Department department = new Department();
                department.DepartmentId = Convert.ToInt32(rdr["DepartmentId"]);
                department.DepartmentName = rdr["DepartmentName"].ToString();
                departments.Add(department);
            }

            return departments;
        }

        // Insert
        public static int InsertDepartment(SqlConnection con, string departmentName)
        {
            int rowsInserted = 0;
            SqlCommand cmd = new SqlCommand("insert into Department (DepartmentName) values (@DepartmentName)", con);
            cmd.CommandType = CommandType.Text;

            cmd.Parameters.Add("@DepartmentName", SqlDbType.VarChar);

            cmd.Parameters["@DepartmentName"].Value = departmentName;

            rowsInserted = cmd.ExecuteNonQuery();
            return rowsInserted;
        }

        // Update
        public static int UpdateDepartment(SqlConnection con, Department Department)
        {
            int rowsUpdated = 0;

            SqlCommand cmd = new SqlCommand("update Department set DepartmentName = @DepartmentName where DepartmentId = @DepartmentId", con);
            cmd.CommandType = CommandType.Text;

            cmd.Parameters.Add("@DepartmentId", SqlDbType.Int);
            cmd.Parameters.Add("@DepartmentName", SqlDbType.VarChar);

            cmd.Parameters["@DepartmentId"].Value = Department.DepartmentId;
            cmd.Parameters["@DepartmentName"].Value = Department.DepartmentName;

            rowsUpdated = cmd.ExecuteNonQuery();

            return rowsUpdated;
        }

        // Delete
        public static int DeleteDepartment(SqlConnection con, int DepartmentId)
        {
            int rowsDeleted = 0;

            SqlCommand cmd = new SqlCommand("delete from Department where DepartmentId = @DepartmentId", con);
            cmd.CommandType = CommandType.Text;

            cmd.Parameters.Add("@DepartmentId", SqlDbType.Int);
            cmd.Parameters["@DepartmentId"].Value = DepartmentId;

            rowsDeleted = cmd.ExecuteNonQuery();

            return rowsDeleted;
        }

    }
}
