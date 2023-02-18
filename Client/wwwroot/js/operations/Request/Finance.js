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
    $("#dataTablesRequestFinance").DataTable({
        "ajax": {
            url: `/Request/GetAllFinance/`,
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
                        <button class="btn btn-secondary" onclick="approvingRequestFinance(${row.id})" data-toggle="modal" data-target="#modalRequestFinanceConfirmation">
                            <a class="iconify" data-tooltip=tooltip data-icon="octicon-check" data-toggle="tooltip" data-placement="top" title="Approve Request Finance"></a>
                        </button>
                        <button class="btn btn-secondary" onclick="editBudgetFinance(event, ${row.id})" data-toggle="modal" data-target="#modalRequestFinance">
                            <a class="iconify" data-tooltip=tooltip data-icon="octicon-pencil" data-toggle="tooltip" data-placement="top" title="Edit Budget"></a>
                        </button>
                    `;
                }
            }
        ]
    })
})

async function editBudgetFinance(event, id) {
    event.preventDefault();
    let request;
    let expenses = [];
    let restOfExpenses = [];
    let optionsSelection = ["Conference", "Consulting", "Meeting", "Recruiting", "Site Visit", "Team Travel", "Training", "Other"]
    let options = "";
    let checkOther = false;
    let otherStyling = "display:none;";
    let optionalDefaultIdRequest = ""
    let optionalDefaultIdExpense = "";
    let optionalDefaultPurpose = "";
    let optionalDefaultDestination = "";
    let optionalDefaultStartDate = "";
    let optionalDefaultEndDate = "";
    let optionalDefaultTotalBudget = "";
    let optionalDefaultType = "";
    let optionalDefaultBudget = "";
    let optionalDefaultDescription = "";
    await $.ajax({
        type: 'GET',
        url: `/Request/GetById/${id}`,
        dataType: "JSON",
        datasrc: ""
    }).done(result => {
        request = result;
        if (!optionsSelection.includes(request.typeOfExpense)) {
            checkOther = true
            optionalDefaultPurpose = `value="${result.travelPurpose}"`;
            otherStyling = "display:inline;";
        }
        optionalDefaultIdRequest = `value="${result.id}"`;
        optionalDefaultDestination = `value="${result.destination}"`;
        var startDate = new Date(result.dateFrom);
        var endDate = new Date(result.dateTo);
        optionalDefaultStartDate = `value="${formatDate(startDate).formatInsert}"`;
        optionalDefaultEndDate = `value="${formatDate(endDate).formatInsert}"`;
        optionalDefaultTotalBudget = `value="${result.totalBudget}"`;
    }).fail(e => {
        $("#modalRequestFinance").modal('hide');
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
        })
    })
    await $.ajax({
        type: 'GET',
        url: `/Expense/GetAllByParentId/${id}`,
        dataType: "JSON",
        datasrc: ""
    }).done(result => {
        // result = array
        expenses = result;
        var firstOnTheIndex = result[0]; // first expense (this will always present)
        optionalDefaultIdExpense = `value="${firstOnTheIndex.id}"`;
        optionalDefaultType = `value="${firstOnTheIndex.typeOfExpense}"`;
        optionalDefaultBudget = `value="${firstOnTheIndex.budget}"`;
        optionalDefaultDescription = `${firstOnTheIndex.description}`;
        restOfExpenses = result.slice(1, result.length); // the rest of the expense
    }).fail(e => {
        $("#modalRequestFinance").modal('hide');
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
        })
    })

    let html = `
        <form>
              <div style="display:inline-block;" class="col-xl-6">
                <div class="form-row">
                    <div class="form-group" id="selection-input-div">
                        <label for="travelPurposeSelection">Travel Purpose</label>
                        <select id="travelPurposeSelection" class="form-control" onChange="travelPurposeSelect(this);" disabled>
                        </select>
                    </div>
                    <div class="form-group ml-2" style="${otherStyling}" id="otherTravelPurpose">
                        <label class="control-label">If 'Other' is selected, please explain.</label>
                        <input class="form-control" style="display:none;" id="idRequest" ${optionalDefaultIdRequest}/>
                        <input class="form-control" id="otherTravelPurposeInput" ${optionalDefaultPurpose}/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="destinationInput">Destination</label>
                    <input class="form-control" id="destinationInput" ${optionalDefaultDestination} disabled/>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="control-label">From</label>
                        <input type="date" class="form-control" id="startDateInput" ${optionalDefaultStartDate} disabled/>
                    </div>
                    <div class="form-group ml-2">
                        <label class="control-label">To</label>
                        <input type="date" class="form-control" id="endDateInput" ${optionalDefaultEndDate} disabled/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="budgetInput">Total Budget</label>
                    <input type="number" class="form-control input-lg" id="budgetInput" name="budget" ${optionalDefaultTotalBudget} disabled>
                </div>
            </div>
            <div style="display:inline-block;height:350px;overflow:auto;position:relative;" class="col-xl-5">
                <h5>Expenses Details</h5>
                <div id="expenses" class="vertical-scrollable">
                    <div id="expense-0" class="expenseClass">
                        <div class="form-row">
                            <div class="form-group">
                                <input class="form-control" style="display:none;" id="idExpense" ${optionalDefaultIdExpense}/>
                                <label class="control-label">Type Of Expense</label>
                                <input class="form-control" id="typeDetailInput" ${optionalDefaultType} disabled/>
                            </div>
                            <div class="form-group ml-2">
                                <label class="control-label">Budget</label>
                                <input class="form-control" id="budgetDetailInput" onkeyup="calculateBudget()" ${optionalDefaultBudget}/>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-9">
                                <label class="control-label">Description</label>
                                <textarea class="form-control" id="descriptionDetailInput" disabled>${optionalDefaultDescription}</textarea>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </form>
        <button class="btn btn-primary" id="edit-operation-Request" style="float:right;">Edit</button>
    `
    $("#modalContentRequest").html(html);

    optionsSelection.forEach(_data => {
        //  ["Conference", "Consulting", "Meeting", "Recruiting", "Site Visit", "Team Travel", "Training", "Other"]
        // test
        if (id != null && (request.typeOfExpense === _data || (checkOther && _data === "Other"))) {
            optionalPropertySelect = "selected"
        } else {
            optionalPropertySelect = ""
        }
        options += `<option value="${_data}" ${optionalPropertySelect}>${_data}</option>`
    })
    $("#travelPurposeSelection").html(options);

    if (restOfExpenses.length > 0) {
        restOfExpenses.forEach(element => {
            let o = new Object();
            o.id = element.id;
            o.type = element.typeOfExpense;
            o.budget = element.budget;
            o.description = element.description;
            addingMoreExpenses(o);
        })
    }

    // Edit operation 
    document.getElementById("edit-operation-Request").addEventListener("click", async (event) => {
        let idInput = $("#idRequest").val();
        let Obj = new Object();
        if ($("#travelPurposeSelection").val() != "Other") {
            Obj.travelPurpose = $("#travelPurposeSelection").val();
        } else {
            Obj.travelPurpose = $("#otherTravelPurposeInput").val();
        }
        Obj.destination = $("#destinationInput").val();
        Obj.dateFrom = $("#startDateInput").val();
        Obj.dateTo = $("#endDateInput").val();
        Obj.totalBudget = $("#budgetInput").val();
        Obj.status = "2nd review";
        Obj.employee_Id = request.employee_Id; // edit this part later please
        await $.ajax({
            type: 'PUT',
            url: `/Request/Put/${idInput.toString()}`,
            data: Obj,
            dataType: "JSON"
        }).done(async result => {
            await expensesInsert(idInput);
            $("#modalRequestFinance").modal('hide');
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Request Approved!'
            })
            let table = $("#dataTablesRequestFinance").DataTable();
            table.ajax.reload();
        }).fail(e => {
            $("#modalRequestFinance").modal('hide');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })
    })
}

async function approvingRequestFinance(id) {
    let html = `
        <div class="modal-header" >
            <h5 class="modal-title" id="exampleModalLabel">Request delete</h5>
        </div>
        <div class="modal-body">
            <p>Are you sure you want to approve the request?</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="approve-operation-Request-Finance">Approve</button>
        </div>
    `
    $("#modalContentRequestFinanceConfirmation").html(html);
    let buttonApproveFinance = document.getElementById("approve-operation-Request-Finance");
    buttonApproveFinance.addEventListener("click", async function () {
        let request;
        await $.ajax({
            type: 'GET',
            url: `/Request/GetById/${id}`,
            dataType: "JSON",
            datasrc: ""
        }).done(result => {
            request = result;
        }).fail(e => {
            $("#modalRequestFinanceConfirmation").modal('hide');
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
        Obj.status = "2nd review";
        Obj.employee_Id = request.employee_Id;
        await $.ajax({
            type: 'PUT',
            url: `/Request/Put/${id.toString()}`,
            data: Obj,
            dataType: "JSON"
        }).done(result => {
            $("#modalRequestFinanceConfirmation").modal('hide');
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Request Approved!'
            })
            let table = $("#dataTablesRequestFinance").DataTable();
            table.ajax.reload();
        }).fail(e => {
            $("#modalRequestFinanceConfirmation").modal('hide');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })
    })
}

// adding more expenses 
function addingMoreExpenses(object = null) {
    let optionalOtherExpenseType = "";
    let optionalOtherExpenseBudget = "";
    let optionalOtherExpenseDesc = "";
    let optionalDefaultIdExpense = "";
    let optionalOnClickRemove = "removeClonedElement(this, event)";
    let clonedExpenseId = "clonedExpense";
    if (object != null) {
        clonedExpenseId = `clonedExpense${object.id}`;
        optionalDefaultIdExpense = `value="${object.id}"`;
        optionalOtherExpenseType = `value="${object.type}"`;
        optionalOtherExpenseBudget = `value="${object.budget}"`;
        optionalOtherExpenseDesc = `${object.description}`;
        optionalOnClickRemove = `return removeClonedElement(this, event, ${object.id})`;
    }
    let clonedExpense = `
        <div id="${clonedExpenseId}" class="expenseClass">
             <div class="form-row">
                    <div class="form-group">
                        <input class="form-control" style="display:none;" id="idExpense" ${optionalDefaultIdExpense}/>
                        <label class="control-label">Type Of Expense</label>
                        <input class="form-control" id="typeDetailInput" ${optionalOtherExpenseType}/>
                    </div>
                    <div class="form-group ml-2">
                        <label class="control-label">Budget</label>
                        <input class="form-control" id="budgetDetailInput" onkeyup="calculateBudget()" ${optionalOtherExpenseBudget}/>
                    </div>
             </div>
             <div class="form-row">
                    <div class="form-group col-md-9">
                        <label class="control-label">Description</label>
                        <textarea class="form-control" id="descriptionDetailInput">${optionalOtherExpenseDesc}</textarea>
                    </div>
                    <div class="form-group col-md-2">
                        <button class="btn btn-danger mt-5" onClick="${optionalOnClickRemove}" id="buttonCloneRemoval">
                            <a class="iconify" data-tooltip=tooltip data-icon="octicon-x" data-toggle="tooltip" data-placement="top" title="Delete"></a>
                        </button>
                    </div>
             </div>
        </div>
    `;
    $('#expenses').append(clonedExpense);
}

// deleting cloned expense
async function removeClonedElement(element, event, id = null) {
    event.preventDefault();
    if (id != null) {
        await $.ajax({
            type: 'DELETE',
            url: `/Expense/Delete/${id}`
        }).done(result => {
        }).fail(e => { console.log(e) })
    }
    element.parentNode.parentNode.parentNode.remove();
}