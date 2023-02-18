$(document).ready(() => {
    $("#dataTablesDepartment").DataTable({
        "ajax": {
            url: "/Department/GetAll",
            type: "GET",
            dataSrc: "",
            dataType: "JSON"
        },
        "columns": [
            {
                "data": "",
                "render": function (data, type, row) {
                    return `${row.name}`;
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
                        <button class="btn btn-secondary" onclick="addModalDepartment(${row.id})" data-toggle="modal" data-target="#modalDepartment">
                            <a class="iconify" data-tooltip=tooltip data-icon="octicon-pencil" data-toggle="tooltip" data-placement="top" title="Edit"></a>
                        </button>
                        <button class="btn btn-secondary" onclick="deleteModalDepartment(${row.id})" data-toggle="modal" data-target="#modalDepartment">
                            <a class="iconify" data-tooltip=tooltip data-icon="octicon-x" data-toggle="tooltip" data-placement="top" title="Delete"></a>
                        </button>
                    `;
                }
            }
        ]
    })
})

// add and edit
async function addModalDepartment(id = null) {
    let data;
    let optionalPropertyInput = "";
    let operation = "add";
    let ButtonName = "Add";
    if (id != null) {
        await $.ajax({
            type: 'GET',
            url: `/Department/GetById/${id}`,
            dataSrc: "",
            dataType: "JSON"
        }).done(result => {
            console.log(result);
            data = result;
            operation = "edit";
            ButtonName = "Edit";
            optionalPropertyInput = `value="${result.name}"`;
        }).fail(e => {
            $('#modalDepartment').modal('hide');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        });
    }
    let html = `
        <div class="modal-header" >
            <h5 class="modal-title" id="exampleModalLabel">Department ${operation}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-4">
                    <form>
                        <div class="form-group">
                            <label class="control-label">Name</label>
                            <input class="form-control" id="nameInput" ${optionalPropertyInput}/>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" id="${operation}-operation-Department">${ButtonName}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
    $("#modalContentDepartment").html(html);

    if (id == null) {
        // button add
        let buttonAdd = document.getElementById("add-operation-Department");
        buttonAdd.addEventListener("click", function (event) {
            event.preventDefault();
            let Obj = new Object();
            Obj.name = $("#nameInput").val();
            $.ajax({
                type: 'POST',
                url: '/Department/Post',
                data: Obj
            }).done(result => {
                $('#modalDepartment').modal('hide');
                let table = $("#dataTablesDepartment").DataTable();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Data added successfully.'
                })
                table.ajax.reload();
            }).fail(e => {
                $('#modalDepartment').modal('hide');
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!'
                })
            })
        });
    } else {
        // button edit
        let buttonEdit = document.getElementById("edit-operation-Department");
        buttonEdit.addEventListener("click", function (event) {
            event.preventDefault();
            let Obj = new Object();
            Obj.name = $("#nameInput").val();
            console.log(Obj);
            $.ajax({
                type: 'PUT',
                url: `/Department/Put/${data.id}`,
                data: Obj
            }).done(result => {
                $('#modalDepartment').modal('hide');
                let table = $("#dataTablesDepartment").DataTable();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Data edited successfully.'
                })
                table.ajax.reload();
            }).fail(e => {
                $('#modalDepartment').modal('hide');
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!'
                })
            })
        });
    }
}

// delete
async function deleteModalDepartment(id) {
    let html = `
        <div class="modal-header" >
            <h5 class="modal-title" id="exampleModalLabel">Department delete</h5>
        </div>
        <div class="modal-body">
            <p>Are you sure you want to delete this record?</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="delete-operation-Department">Delete</button>
        </div>
    `
    $("#modalContentDepartment").html(html);

    let buttonDelete = document.getElementById("delete-operation-Department");
    buttonDelete.addEventListener("click", function (event) {
        event.preventDefault();
        $.ajax({
            type: 'DELETE',
            url: `/Department/Delete/${id}`
        }).done(result => {
            $('#modalDepartment').modal('hide');
            let table = $("#dataTablesDepartment").DataTable();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Data deleted successfully.'
            })
            table.ajax.reload();
        }).fail(e => {
            $('#modalDepartment').modal('hide');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        })
    })
}