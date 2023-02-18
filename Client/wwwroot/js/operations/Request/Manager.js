function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    let date1 = padTo2Digits(date.getDate());
    let month = padTo2Digits(date.getMonth() + 1);
    let year = date.getFullYear()
    let formatDisplay = [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
    let formatInsert = [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate())
    ].join('-');

    return {
        date1, month, year, formatDisplay, formatInsert
    }
}

function calculateBudget() {
    let b = document.querySelectorAll("#budgetDetailInput");
    let tb = 0;


    b.forEach(function (element) {
        let value = element.value;
        tb += parseInt(value);
    })

    document.getElementById("budgetInput").value = tb;
}

$(document).ready(() => {
    $("#dataTablesRequestManager").DataTable({
        "ajax": {
            url: `/Request/GetAllManager/${document.getElementById("idUser").value}`,
            type: "GET",
            dataSrc: "",
            dataType: "JSON"
        },
        "columns": [
            {
                "data": "",
                "render": function (data, type, row) {
                    return `${row.travelPurpose}`;
                }
            },
            {
                "data": "",
                "render": function (data, type, row) {
                    return `${row.destination}`;
                }
            },
            {
                "data": "",
                "render": function (data, type, row) {
                    var startDate = new Date(row.dateFrom);
                    return `${formatDate(startDate).formatDisplay}`;
                }
            },
            {
                "data": "",
                "render": function (data, type, row) {
                    var endDate = new Date(row.dateTo);
                    return `${formatDate(endDate).formatDisplay}`;
                }
            },
            {
                "data": "",
                "render": function (data, type, row) {
                    return `${row.totalBudget}`;
                }
            },
            {
                "data": "",
                "render": function (data, type, row) {
                    return `${row.status}`;
                }
            },
            {
                "data": "",
                "render": function (data, type, row) {
                    return `${row.employee.firstName} ${row.employee.lastName}`;
                }
            },
            {
                "data": "",
                "render": function (data, type, row) {
                    $('body').tooltip({
                        selector: "[data-tooltip=tooltip]",
                        container: "body"
                    }); // activating the tooltip
                    return `
                        <button class="btn btn-secondary" onclick="approvingRequestManager(${row.id})" data-toggle="modal" data-target="#modalRequestManager">
                            <a class="iconify" data-tooltip=tooltip data-icon="octicon-check" data-toggle="tooltip" data-placement="top" title="Approve Request"></a>
                        </button>
                        <button class="btn btn-secondary" onclick="rejectRequestManager(${row.id})" data-toggle="modal" data-target="#modalRequestManager">
                            <a class="iconify" data-tooltip=tooltip data-icon="octicon-x" data-toggle="tooltip" data-placement="top" title="Reject Request"></a>
                        </button>
                    `;
                }
            }
        ]
    })
})

async function approvingRequestManager(id) {
    let html = `
        <div class="modal-header" >
            <h5 class="modal-title" id="exampleModalLabel">Request delete</h5>
        </div>
        <div class="modal-body">
            <p>Are you sure you want to approve the request?</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="approve-operation-Request-Manager">Approve</button>
        </div>
    `
    $("#modalContentRequestManager").html(html);
    let buttonApprove = document.getElementById("approve-operation-Request-Manager");
    buttonApprove.addEventListener("click", async function () {
        let request;
        let newReq;
        await $.ajax({
            type: 'GET',
            url: `/Request/GetById/${id}`,
            dataType: "JSON",
            datasrc: ""
        }).done(result => {
            request = result;
        }).fail(e => {
            $("#modalRequestManager").modal('hide');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })

        let Obj = new Object();
        Obj.travelPurpose = request.travelPurpose;
        Obj.destination = request.destination;
        Obj.dateFrom = formatDate(new Date(request.dateFrom)).formatInsert;
        Obj.dateTo = formatDate(new Date(request.dateTo)).formatInsert;
        Obj.totalBudget = request.totalBudget;
        Obj.status = "Approved";
        Obj.employee_Id = request.employee_Id;
        await $.ajax({
            type: 'PUT',
            url: `/Request/Put/${id.toString()}`,
            data: Obj,
            dataType: "JSON"
        }).done(async result => {
            $("#modalRequestManager").modal('hide');
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Request Approved!'
            })
            let table = $("#dataTablesRequestManager").DataTable();
            table.ajax.reload();
        }).fail(e => {
            $("#modalRequestManager").modal('hide');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })

        // sending email
        await $.ajax({
            type: 'GET',
            url: `/Request/GetById/${id}`,
            dataType: "JSON",
            datasrc: ""
        }).done(result => {
            newReq = result;
        }).fail(e => console.log(e));
        await $.ajax({
            type: 'POST',
            url: `/Request/SendEmail`,
            data: newReq
        }).done(result => {
        }).fail(e => console.log(e));
    })
}

async function rejectRequestManager(id) {
    let html = `
        <div class="modal-header" >
            <h5 class="modal-title" id="exampleModalLabel">Request delete</h5>
        </div>
        <div class="modal-body">
            <p>Are you sure you want to reject the request?</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="reject-operation-Request-Manager">Reject</button>
        </div>
    `
    $("#modalContentRequestManager").html(html);
    let buttonReject = document.getElementById("reject-operation-Request-Manager");
    buttonReject.addEventListener("click", async function (event) {
        let request;
        let newReq;
        await $.ajax({
            type: 'GET',
            url: `/Request/GetById/${id}`,
            dataType: "JSON",
            datasrc: ""
        }).done(result => {
            request = result;
        }).fail(e => {
            $("#modalRequestManager").modal('hide');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })
        let Obj = new Object();
        Obj.travelPurpose = request.travelPurpose
        Obj.destination = request.destination;
        Obj.dateFrom = formatDate(new Date(request.dateFrom)).formatInsert;
        Obj.dateTo = formatDate(new Date(request.dateTo)).formatInsert;
        Obj.totalBudget = request.totalBudget;
        Obj.status = "Rejected";
        Obj.employee_Id = request.employee_Id;
        await $.ajax({
            type: 'PUT',
            url: `/Request/Put/${id.toString()}`,
            data: Obj,
            dataType: "JSON"
        }).done(async result => {
            $("#modalRequestManager").modal('hide');
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Request Rejected!'
            })
            let table = $("#dataTablesRequestManager").DataTable();
            table.ajax.reload();
        }).fail(e => {
            $("#modalRequestManager").modal('hide');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })
        // sending email 
        await $.ajax({
            type: 'GET',
            url: `/Request/GetById/${id}`,
            dataType: "JSON",
            datasrc: ""
        }).done(result => {
            newReq = result;
        }).fail(e => console.log(e));
        await $.ajax({
            type: 'POST',
            url: `/Request/SendEmail`,
            data: newReq
        }).done(result => {
        }).fail(e => console.log(e));
    })
}