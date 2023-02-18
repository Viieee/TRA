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
    $("#dataTablesRequest").DataTable({
        "ajax": {
            url: `/Request/GetAllByEmployee/${document.getElementById("idUser").value}`,
            type: "GET",
            dataSrc: "",
            dataType: "JSON"
        },
        "columns": [
            {
                "data": "",
                "render": function (data, type, row) {
                    console.log(row);
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

                    if (row.status == "Approved") {
                        return `
                            <button class="btn btn-secondary" onclick="downloadPdfRequest(event, ${row.id})">
                                <a class="iconify" data-tooltip=tooltip data-icon="octicon-arrow-down" data-toggle="tooltip" data-placement="top" title="Download Document"></a>
                            </button>
                        `;
                    } if (row.status != "Approved") {
                        return `
                            <button class="btn btn-secondary" onclick="editModalRequest(${row.id})" data-toggle="modal" data-target="#modalRequest">
                                <a class="iconify" data-tooltip=tooltip data-icon="octicon-pencil" data-toggle="tooltip" data-placement="top" title="Edit"></a>
                            </button>
                            <button class="btn btn-secondary" onclick="deleteModalRequest(${row.id})" data-toggle="modal" data-target="#cancelConfirmationRequestModal">
                                <a class="iconify" data-tooltip=tooltip data-icon="octicon-x" data-toggle="tooltip" data-placement="top" title="Delete"></a>
                            </button>
                        `;
                    }
                }
            }
        ]
    })
})

function travelPurposeSelect(selection) {
    if (selection) {
        // if selection exist
        let otherInput = document.getElementById("otherTravelPurpose")
        if (selection.value === "Other") {
            otherInput.style.display = "inline";
        }
        else {
            document.getElementById("otherTravelPurpose").style.display = "none";
        }
    } else {
        document.getElementById("otherTravelPurpose").style.display = "none";
    }
}

async function addModalRequest(id) {
    let html = `
        <div class="modal-header">
            <h5 class="modal-title">Request</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form>
                <div style="display:inline-block;" class="col-xl-6">
                    <div class="form-row">
                        <div class="form-group" id="selection-input-div">
                            <label for="travelPurposeSelection">Travel Purpose</label>
                            <select id="travelPurposeSelection" class="form-control" onChange="travelPurposeSelect(this);">
                                <option value="Conference">Conference</option>
                                <option value="Consulting">Consulting</option>
                                <option value="Meeting">Meeting</option>
                                <option value="Recruiting" selected>Recruiting</option>
                                <option value="Site Visit">Site Visit</option>
                                <option value="Team Travel">Team Travel</option>
                                <option value="Training">Training</option>
                                <option value="Other" id="otherValueCheck">Other</option>
                            </select>
                        </div>
                        <div class="form-group ml-2" style="display:none;" id="otherTravelPurpose">
                            <label class="control-label">If 'Other' is selected, please explain.</label>
                            <input class="form-control" id="otherTravelPurposeInput"/>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="destinationInput">Destination</label>
                        <input class="form-control" id="destinationInput"/>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="control-label">From</label>
                            <input type="date" class="form-control" id="startDateInput"/>
                        </div>
                        <div class="form-group ml-2">
                            <label class="control-label">To</label>
                            <input type="date" class="form-control" id="endDateInput"/>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="budgetInput">Total Budget</label>
                        <input type="number" class="form-control input-lg" id="budgetInput" name="budget" value="0" disabled>
                    </div>
                </div>
                <div style="display:inline-block;height:350px;overflow:auto;position:relative;" class="col-xl-5">
                    <h5>Expenses Details</h5>
                    <div id="expenses" class="vertical-scrollable">
                        <div id="expense-0" class="expenseClass">
                            <div class="form-row">
                                <div class="form-group">
                                    <input class="form-control" style="display:none;" id="idExpense"/>
                                    <label class="control-label">Type Of Expense</label>
                                    <input class="form-control" id="typeDetailInput"/>
                                </div>
                                <div class="form-group ml-2">
                                    <label class="control-label">Budget</label>
                                    <input type="number" class="form-control" id="budgetDetailInput" onkeyup="calculateBudget()"/>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-9">
                                    <label class="control-label">Description</label>
                                    <textarea class="form-control" id="descriptionDetailInput"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <button class="btn btn-success" id="buttonCloneExpense">Add</button>
                    </div>
                </div>
            </form>
            <button class="btn btn-primary" id="add-operation-Request" style="float:right;">Send</button>
        </div>
    `
    $("#modalContentRequest").html(html);

    let buttonClone = document.getElementById("buttonCloneExpense");
    // cloning expense
    buttonClone.addEventListener("click", function (event) {
        event.preventDefault();
        addingMoreExpenses();
    });

    // Create operation 
    document.getElementById("add-operation-Request").addEventListener("click", async (event) => {
        event.preventDefault();
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
        Obj.status = "1st review"
        Obj.employee_Id = parseInt(id);
        await $.ajax({
            type: 'POST',
            url: '/Request/Post',
            data: Obj,
            dataType: "JSON"
        }).done(result => {
            expensesInsert(result.entity.id);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Data added successfully.'
            })
            $('#modalRequest').modal('hide');
            let table = $("#dataTablesRequest").DataTable();
            table.ajax.reload();
        }).fail(e => { console.log(e) })
    })
}

async function editModalRequest(id) {
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
        console.log("result of request getbyid " + result);
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
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
        })
    })

    let html = `
        <div class="modal-header">
            <h5 class="modal-title">Request</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
             <form>
                  <div style="display:inline-block;" class="col-xl-6">
                    <div class="form-row">
                        <div class="form-group" id="selection-input-div">
                            <label for="travelPurposeSelection">Travel Purpose</label>
                            <select id="travelPurposeSelection" class="form-control" onChange="travelPurposeSelect(this);">
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
                        <input class="form-control" id="destinationInput" ${optionalDefaultDestination}/>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="control-label">From</label>
                            <input type="date" class="form-control" id="startDateInput" ${optionalDefaultStartDate}/>
                        </div>
                        <div class="form-group ml-2">
                            <label class="control-label">To</label>
                            <input type="date" class="form-control" id="endDateInput" ${optionalDefaultEndDate}/>
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
                                    <input class="form-control" id="typeDetailInput" ${optionalDefaultType}/>
                                </div>
                                <div class="form-group ml-2">
                                    <label class="control-label">Budget</label>
                                    <input class="form-control" id="budgetDetailInput" onkeyup="calculateBudget()" ${optionalDefaultBudget}/>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-9">
                                    <label class="control-label">Description</label>
                                    <textarea class="form-control" id="descriptionDetailInput">${optionalDefaultDescription}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-success" id="buttonCloneExpense">Add</button>
                    </div>
                 </div>
            </form>
            <button class="btn btn-primary" id="edit-operation-Request" style="float:right;">Edit</button>
        </div>
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
            addingMoreExpenses(o, restOfExpenses);
        })
    }
    let buttonClone = document.getElementById("buttonCloneExpense");
    // cloning expense
    buttonClone.addEventListener("click", function (event) {
        event.preventDefault();
        addingMoreExpenses();
    });

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
        Obj.status = "1st review";
        Obj.employee_Id = parseInt(document.getElementById("idUser").value); // edit this part later please
        await $.ajax({
            type: 'PUT',
            url: `/Request/Put/${idInput.toString()}`,
            data: Obj,
            dataType: "JSON",
            enctype: 'multipart/form-data'
        }).done(result => {
            expensesInsert(idInput);
            $('#modalRequest').modal('hide');
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Data edited successfully.'
            })
            let table = $("#dataTablesRequest").DataTable();
            table.ajax.reload();
        }).fail(e => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })
    })
}

async function deleteModalRequest(id) {
    let html = `
        <div class="modal-header" >
            <h5 class="modal-title" id="exampleModalLabel">Request delete</h5>
        </div>
        <div class="modal-body">
            <p>Are you sure you want to delete this record?</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="delete-operation-Request">Delete</button>
        </div>
    `
    $("#modalContentRequestConfirmation").html(html);

    let buttonDelete = document.getElementById("delete-operation-Request");
    buttonDelete.addEventListener("click", async function (event) {
        await $.ajax({
            type: 'GET',
            url: `/Expense/GetAllByParentId/${id}`,
            dataType: "JSON",
            datasrc: ""
        }).done(result => {
            result.forEach(async function (element) {
                await $.ajax({
                    type: 'DELETE',
                    url: `/Expense/Delete/${element.id}`
                }).done(result => {
                }).fail(e => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!'
                    })
                })
            })
        }).fail(e => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })
        await $.ajax({
            type: 'DELETE',
            url: `/Request/Delete/${id}`
        }).done(result => {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Data deleted successfully.'
            })
            $("#cancelConfirmationRequestModal").modal('hide');
            let table = $("#dataTablesRequest").DataTable();
            table.ajax.reload();
        }).fail(e => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })
    })
}

async function expensesInsert(requestId) {
    // create expenses based on the request
    let expenses = document.getElementById("expenses");
    let expenseArray = expenses.getElementsByClassName("expenseClass");
    // getting the value from the expense detail form
    [].forEach.call(expenseArray, async function (element) {
        var idInput = element.querySelector("#idExpense").value;
        var typeDetailInput = element.querySelector("#typeDetailInput").value;
        var budgetDetailInput = element.querySelector("#budgetDetailInput").value;
        var descriptionDetailInput = element.querySelector("#descriptionDetailInput").value;
        let Obj = new Object();
        Obj.typeOfExpense = typeDetailInput;
        Obj.description = descriptionDetailInput;
        Obj.budget = budgetDetailInput;
        Obj.request_Id = requestId;
        if (idInput.trim().length > 0) {
            // if id is present, edit
            await $.ajax({
                type: 'PUT',
                url: `/Expense/Put/${idInput}`,
                data: Obj
            }).done(result => {
            }).fail(e => { console.log(e) })
        }
        else {
            await $.ajax({
                type: 'POST',
                url: '/Expense/Post',
                data: Obj
            }).done(result => {
            }).fail(e => { console.log(e) })
        }
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
                        <input type="number" class="form-control" id="budgetDetailInput" onkeyup="calculateBudget()" ${optionalOtherExpenseBudget}/>
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

