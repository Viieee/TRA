$(document).ready(() => {
    $("#dataTablesEmployee").DataTable({
        "ajax": {
            url: "/Employee/GetAll",
            type: "GET",
            dataSrc: "",
            dataType: "JSON"
        },
        "columns": [
            {
                "data": "",
                "render": function (data, type, row) {
                    return `${row.firstName} ${row.lastName}`;
                }
            },
            {
                "data": "",
                "render": function (data, type, row) {
                    return `${row.department.name}`;
                }
            },
        ]
    })
})