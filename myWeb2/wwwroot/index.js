(function myWeb2() {

    function showPageEmployees() {
        document.getElementById("pageDepartments").classList.add("my-page-hidden");
        document.getElementById("linkNavDepartments").classList.remove("active");

        document.getElementById("pageEmployees").classList.remove("my-page-hidden");
        document.getElementById("linkNavEmployees").classList.add("active");
    }

    function showPageDepartments() {
        document.getElementById("pageEmployees").classList.add("my-page-hidden");
        document.getElementById("linkNavEmployees").classList.remove("active");

        document.getElementById("pageDepartments").classList.remove("my-page-hidden");
        document.getElementById("linkNavDepartments").classList.add("active");
    }

    function handleNavToEmployees(e) {
        showPageEmployees();
        window.history.pushState(null, "", "/employees");
        e.preventDefault();
    }

    function handleNavToDepartments(e) {
        showPageDepartments();
        window.history.pushState(null, "", "/departments");
        e.preventDefault();
    }

    function showCorrectPage() {
        var url = window.location.href;
        var page = url.split('/')[3];

        if (page != null) {

            if (page === "employees") {
                showPageEmployees();
                //window.history.replaceState(null, "", "/employees");
            }

            if (page === "departments") {
                showPageDepartments();
                //window.history.replaceState(null, "", "/departments");
            }

        }
        else {
            navToEmployees();
            window.history.replaceState(null, "", "/employees");
        }
    }

    function toggleHeadFootColor() {

        var header1 = document.getElementById("my-navbar");

        if (header1.classList.contains("my-headfoot-one")) {
            header1.classList.remove("my-headfoot-one");
            header1.classList.add("my-headfoot-two");
        } else {
            header1.classList.remove("my-headfoot-two");
            header1.classList.add("my-headfoot-one");
        }

    }

    function toggleTableVisibility() {

        var table1 = document.getElementById("table1");

        if (table1 !== null) {
            if (table1.classList.contains("my-table-hidden")) {
                table1.classList.remove("my-table-hidden");
                table1.classList.add("my-table-visible");
            } else {
                table1.classList.remove("my-table-visible");
                table1.classList.add("my-table-hidden");
            }
        }
    }

    //Employee code

    function getEmployees() {
        var baseURL = "https://localhost:5001/Employees/GetEmployees";
        var queryString = "";

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = doAfterGetEmployees;

        xhr.open("GET", baseURL + queryString, true);
        xhr.send();

        function doAfterGetEmployees() {

            if (xhr.readyState === 4) { //done
                if (xhr.status === 200) { //ok
                    //alert(xhr.responseText);

                    var response = JSON.parse(xhr.responseText);

                    if (response.result === "success") {
                        var employees = response.employees;
                        refreshEmployeeTable(employees);
                    } else {
                        alert("API Error: " + response.message);
                    }

                } else {
                    alert("Server Error: " + xhr.statusText);
                }
            }
        }
    }

    function refreshEmployeeTable(employees) {
        var html;
        var dynamic;
        var employee;

        //Build an html table of the employees.
        html = "<table id='table1' class='table table-striped table-sm'>" +
            "<thead>" +
            "<tr>" +
            "<th scope='col'>Employee ID</th>" +
            "<th scope='col'>First Name</th>" +
            "<th scope='col'>Last Name</th>" +
            "<th scope='col'>Salary</th>" +
            "<th scope='col'>Department</th>" +
            "<th scope='col'></th>" +
            "<th scope='col'></th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>";

        for (var i = 0; i < employees.length; i++) {
            employee = employees[i];
            html = html + "<tr>" +
                "<th scope='row' data-field='employeeid'>" + employee.employeeId + "</th>" +
                "<td data-field='firstname'>" + employee.firstName + "</td>" +
                "<td data-field='lastname'>" + employee.lastName + "</td>" +
                "<td data-field='salary'>" + employee.salary + "</td>" +
                "<td data-field='departmentid' class='my-field-hidden'>" + employee.departmentId + "</td>" +
                "<td data-field='departmentname'>" + employee.departmentName + "</td>" +
                "<td data-field='edit'><button type='button' data-action='edit' data-employeeid=" + employee.employeeId + " class='btn btn-sm btn-outline-secondary'>Edit</button></td>" +
                "<td data-field='delete'><button type='button' data-action='delete' data-employeeid=" + employee.employeeId + " class='btn btn-sm btn-outline-secondary'>Delete</button></td>" +
                "</tr>";
        }

        html = html + "</tbody>" +
            "</table>";

        //Inject the new table into the DOM.
        dynamic = document.getElementById("dynamic");
        dynamic.innerHTML = html;

        //Add a click event listener to all buttons in the table.
        var buttons = document.querySelectorAll("#table1 .btn");

        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            button.addEventListener("click", handleEmployeeTableButtonClick);
        }
    }

    function handleEmployeeTableButtonClick(e) {
        var employeeId = e.target.dataset.employeeid;
        var action = e.target.dataset.action;

        if (action === "delete") {
            deleteEmployee(employeeId);
        }

        if (action === "edit") {
            //alert("You want to " + action + " employee " + employeeId);

            var employeeRow = e.target.parentNode.parentNode;
            var employeeRowFields = employeeRow.children;

            for (var i = 0; i < employeeRowFields.length; i++) {
                var employeeField = employeeRowFields[i];
                var fieldName = employeeField.dataset.field;

                if (fieldName === "employeeid") {
                    document.getElementById("employeeId2").value = employeeField.innerText;
                }

                if (fieldName === "firstname") {
                    document.getElementById("firstName2").value = employeeField.innerText;
                }

                if (fieldName === "lastname") {
                    document.getElementById("lastName2").value = employeeField.innerText;
                }

                if (fieldName === "salary") {
                    document.getElementById("salary2").value = employeeField.innerText;
                }

                if (fieldName === "departmentid") {
                    document.getElementById("department2").value = Number(employeeField.innerText);
                }
            }
        }
    }

    function insertEmployee(e) {
        var firstName1 = document.getElementById("firstName1");
        var lastName1 = document.getElementById("lastName1");
        var salary1 = document.getElementById("salary1");
        //var queryString = "?lastName=" + lastName + "&firstName=" + firstName + "&salary= " + salary;

        employee = {
            "employeeId": 0,
            "firstName": firstName1.value,
            "lastName": lastName1.value,
            "salary": Number(salary1.value),
            "departmentId": Number(department2.options[department1.selectedIndex].value),
            "departmentName": department2.options[department1.selectedIndex].innerText
        };

        firstName1.value = "";
        lastName1.value = "";
        salary1.value = "";
        department1.selectedIndex = 0;

        postBody = JSON.stringify(employee);

        var baseURL = "https://localhost:5001/Employees/InsertEmployee";

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = doAfterInsertEmployee;
        xhr.open("POST", baseURL, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(postBody);

        function doAfterInsertEmployee() {

            if (xhr.readyState === 4) { //done
                if (xhr.status === 200) { //ok
                    //alert(xhr.responseText);

                    var response = JSON.parse(xhr.responseText);

                    if (response.result === "success") {
                        var employees = response.employees;
                        refreshEmployeeTable(employees);
                    } else {
                        alert("API Error: " + response.message);
                    }

                } else {
                    alert(xhr.statusText);
                }
            }
        }

        e.preventDefault();
    }

    function updateEmployee(e) {
        var employeeId2 = document.getElementById("employeeId2");
        var firstName2 = document.getElementById("firstName2");
        var lastName2 = document.getElementById("lastName2");
        var salary2 = document.getElementById("salary2");
        var department2 = document.getElementById("department2");

        employee = {
            "employeeId": Number(employeeId2.value),
            "firstName": firstName2.value,
            "lastName": lastName2.value,
            "salary": Number(salary2.value),
            "departmentId": Number(department2.options[department2.selectedIndex].value),
            "departmentName": department2.options[department2.selectedIndex].innerText
        };

        employeeId2.value = "";
        firstName2.value = "";
        lastName2.value = "";
        salary2.value = "";
        department2.selectedIndex = 0;

        postBody = JSON.stringify(employee);

        var baseURL = "https://localhost:5001/Employees/UpdateEmployee";

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = doAfterUpdateEmployee;
        xhr.open("POST", baseURL, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(postBody);

        function doAfterUpdateEmployee() {

            if (xhr.readyState === 4) { //done
                if (xhr.status === 200) { //ok
                    //alert(xhr.responseText);

                    var response = JSON.parse(xhr.responseText);

                    if (response.result === "success") {
                        var employees = response.employees;
                        refreshEmployeeTable(employees);
                    } else {
                        alert("API Error: " + response.message);
                    }

                } else {
                    alert(xhr.statusText);
                }
            }
        }

        e.preventDefault();
    }

    function deleteEmployee(employeeId) {
        var baseURL = "https://localhost:5001/Employees/DeleteEmployee";
        var queryString = "?employeeId=" + employeeId;

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = doAfterDeleteEmployees;

        xhr.open("GET", baseURL + queryString, true);
        xhr.send();

        function doAfterDeleteEmployees() {

            if (xhr.readyState === 4) { //done
                if (xhr.status === 200) { //ok
                    //alert(xhr.responseText);

                    var response = JSON.parse(xhr.responseText);

                    if (response.result === "success") {
                        var employees = response.employees;
                        refreshEmployeeTable(employees);
                    } else {
                        alert("API Error: " + response.message);
                    }

                } else {
                    alert("Server Error: " + xhr.statusText);
                }
            }
        }
    }

    //Department code

    function getDepartments() {
        var baseURL = "https://localhost:5001/Departments/GetDepartments";
        var queryString = "";

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = doAfterGetDepartments;

        xhr.open("GET", baseURL + queryString, true);
        xhr.send();

        function doAfterGetDepartments() {

            if (xhr.readyState === 4) { //done
                if (xhr.status === 200) { //ok
                    //alert(xhr.responseText);

                    var response = JSON.parse(xhr.responseText);

                    if (response.result === "success") {
                        var departments = response.departments;
                        refreshDepartmentTable(departments);
                        refreshDepartmentDropdowns(departments);
                    } else {
                        alert("API Error: " + response.message);
                    }

                } else {
                    alert("Server Error: " + xhr.statusText);
                }
            }
        }
    }

    function refreshDepartmentTable(departments) {
        var html;
        var dynamic;
        var department;

        //Build an html table of the departments.
        html = "<table id='table2' class='table table-striped table-sm'>" +
            "<thead>" +
            "<tr>" +
            "<th scope='col'>Department ID</th>" +
            "<th scope='col'>Department</th>" +
            "<th scope='col'></th>" +
            "<th scope='col'></th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>";

        for (var i = 0; i < departments.length; i++) {
            department = departments[i];
            html = html + "<tr>" +
                "<th scope='row' data-field='departmentid'>" + department.departmentId + "</th>" +
                "<td data-field='departmentname'>" + department.departmentName + "</td>" +
                "<td data-field='edit'><button type='button' data-action='edit' data-departmentid=" + department.departmentId + " class='btn btn-sm btn-outline-secondary'>Edit</button></td>" +
                "<td data-field='delete'><button type='button' data-action='delete' data-departmentid=" + department.departmentId + " class='btn btn-sm btn-outline-secondary'>Delete</button></td>" +
                "</tr>";
        }

        html = html + "</tbody>" +
            "</table>";

        //Inject the new table into the DOM.
        dynamic = document.getElementById("dynamic2");
        dynamic.innerHTML = html;

        //Add a click event listener to all buttons in the table.
        var buttons = document.querySelectorAll("#table2 .btn");

        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            button.addEventListener("click", handleDepartmentTableButtonClick);
        }
    }

    function handleDepartmentTableButtonClick(e) {
        var departmentId = e.target.dataset.departmentid;
        var action = e.target.dataset.action;

        if (action === "delete") {
            deleteDepartment(departmentId);
        }

        if (action === "edit") {

            var departmentRow = e.target.parentNode.parentNode;
            var departmentRowFields = departmentRow.children;

            for (var i = 0; i < departmentRowFields.length; i++) {
                var departmentField = departmentRowFields[i];
                var fieldName = departmentField.dataset.field;

                if (fieldName === "departmentid") {
                    document.getElementById("departmentId2").value = departmentField.innerText;
                }

                if (fieldName === "departmentname") {
                    document.getElementById("departmentName2").value = departmentField.innerText;
                }
            }
        }
    }

    function refreshDepartmentDropdowns(departments) {
        var html = "<option value='0' selected>Choose department...</option>";

        for (var i = 0; i < departments.length; i++) {
            department = departments[i];
            html = html + "<option value='" + department.departmentId + "'>" + department.departmentName + "</option>";
        }

        //Inject the dynamic content into the DOM.
        dynamic = document.getElementById("department1");
        dynamic.innerHTML = html;

        dynamic2 = document.getElementById("department2");
        dynamic2.innerHTML = html;
    }

    function insertDepartment(e) {
        var departmentName1 = document.getElementById("departmentName1");

        department = {
            "departmentId": 0,
            "departmentName": departmentName1.value
        };

        departmentName1.value = "";

        postBody = JSON.stringify(department);

        var baseURL = "https://localhost:5001/Departments/InsertDepartment";

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = doAfterInsertDepartment;
        xhr.open("POST", baseURL, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(postBody);

        function doAfterInsertDepartment() {

            if (xhr.readyState === 4) { //done
                if (xhr.status === 200) { //ok
                    //alert(xhr.responseText);

                    var response = JSON.parse(xhr.responseText);

                    if (response.result === "success") {
                        var departments = response.departments;
                        refreshDepartmentTable(departments);
                        refreshDepartmentDropdowns(departments);
                    } else {
                        alert("API Error: " + response.message);
                    }

                } else {
                    alert(xhr.statusText);
                }
            }
        }

        e.preventDefault();
    }

    function updateDepartment(e) {
        var departmentId2 = document.getElementById("departmentId2");
        var departmentName2 = document.getElementById("departmentName2");

        department = {
            "departmentId": Number(departmentId2.value),
            "departmentName": departmentName2.value
        };

        departmentId2.value = "";
        departmentName2.value = "";

        postBody = JSON.stringify(department);

        var baseURL = "https://localhost:5001/Departments/UpdateDepartment";

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = doAfterUpdateDepartment;
        xhr.open("POST", baseURL, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(postBody);

        function doAfterUpdateDepartment() {

            if (xhr.readyState === 4) { //done
                if (xhr.status === 200) { //ok
                    //alert(xhr.responseText);

                    var response = JSON.parse(xhr.responseText);

                    if (response.result === "success") {
                        var departments = response.departments;
                        refreshDepartmentTable(departments);
                        refreshDepartmentDropdowns(departments);
                    } else {
                        alert("API Error: " + response.message);
                    }

                } else {
                    alert(xhr.statusText);
                }
            }
        }

        e.preventDefault();
    }

    function deleteDepartment(departmentId) {
        var baseURL = "https://localhost:5001/Departments/DeleteDepartment";
        var queryString = "?departmentId=" + departmentId;

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = doAfterDeleteDepartment;

        xhr.open("GET", baseURL + queryString, true);
        xhr.send();

        function doAfterDeleteDepartment() {

            if (xhr.readyState === 4) { //done
                if (xhr.status === 200) { //ok
                    //alert(xhr.responseText);

                    var response = JSON.parse(xhr.responseText);

                    if (response.result === "success") {
                        var departments = response.departments;
                        refreshDepartmentTable(departments);
                        refreshDepartmentDropdowns(departments);
                    } else {
                        alert("API Error: " + response.message);
                    }

                } else {
                    alert("Server Error: " + xhr.statusText);
                }
            }
        }
    }

    //Page Load

    // User clicked browser back/forward button
    window.addEventListener("popstate", function (event) {
        showCorrectPage();
    });

    document.getElementById("linkNavEmployees").addEventListener("click", handleNavToEmployees);
    document.getElementById("linkNavDepartments").addEventListener("click", handleNavToDepartments);

    document.getElementById("buttonToggleColors").addEventListener("click", toggleHeadFootColor);
    document.getElementById("buttonToggleTable").addEventListener("click", toggleTableVisibility);

    document.getElementById("buttonGetEmployees").addEventListener("click", getEmployees);
    document.getElementById("buttonInsertEmployee").addEventListener("click", insertEmployee);
    document.getElementById("buttonUpdateEmployee").addEventListener("click", updateEmployee);

    document.getElementById("buttonGetDepartments").addEventListener("click", getDepartments);
    document.getElementById("buttonInsertDepartment").addEventListener("click", insertDepartment);
    document.getElementById("buttonUpdateDepartment").addEventListener("click", updateDepartment);

    getEmployees();
    getDepartments();
    showCorrectPage();

}());