using System;
using System.Collections.Generic;

namespace mywebapi2
{
    public class Response
    {
        public string result { get; set; }
        public string message { get; set; }
        public List<Employee> employees { get; set; }
        public List<Department> departments { get; set; }
    }
}