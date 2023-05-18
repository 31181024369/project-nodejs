let areaListTask    = $('#area-list-task');
let areaForm        = $('#area-form');
let btnToggleForm   = $('#btn-toggle-form');
let inputID         = $('#input-id');
let inputName       = $('#input-name');
let inputStatus     = $('#input-status');
let sortDisplay     = $('#sort-display');
let params          = [];
let API_URL         = 'http://localhost:3000/api/v1/';
params.orderBy      = 'name';
params.orderDir     = 'asc';

const ITEM_STATUS = [
    { name: 'Small' , status: 'small' , class: 'dark' },
    { name: 'Medium', status: 'medium', class: 'info' },
    { name: 'High'  , status: 'high'  , class: 'danger'},
];

$(document).ready(function () {
    showItems(params);
});



$('.sort-value').click(function (e) { 
    params.orderBy = $(this).data('order-by');
    params.orderDir = $(this).data('order-dir');
    let display = `${params.orderBy.toUpperCase()} - ${params.orderDir.toUpperCase()}`;
    showItems(params);
    sortDisplay.html(display);
});

$('#btn-search').click(function (e) { 
    params.keyword = $('#input-search').val();    
    showItems(params);
});

$('#btn-toggle-form').click(function (e) { 
    let isShow = $(this).data('toggle-form');
    $(this).data('toggle-form', !isShow);
    toggleForm(!isShow);
});

$('#btn-submit').click(function (e) { 
    if(inputID.val()){
        startEditItem(inputID.val())
    }else{
        addItem();
    }
});

$('#btn-cancel').click(function (e) { 
    toggleForm(false);
    $('#btn-toggle-form').data('toggle-form', false);
    resetInput();
    
});

showItems = (params = null) => {
    let url = '';
    if(params && params.orderBy){
        url += `orderBy=${params.orderBy}&orderDir=${params.orderDir}&`
    }
    if(params && params.keyword){
        url += `keyword=${params.keyword}`
    }
    $.getJSON(  API_URL + "items?" + url, function( data ) {
        let content = '';
        if(data && data.success){
            $.map(data.data, function (item, index) {
                let idx = index + 1;
                let id = item.id;
                let name = item.name;
                let status = showItemStatus(item.status);
                if (params && params.keyword) {
                    name = name.replace(new RegExp(params.keyword, 'ig'), (searchResult) => {
                        return `<mark>${searchResult}</mark>`;
                    });
                }
                content += `
                        <tr>
                            <td>${idx}</th>
                            <td>${name}</td>
                            <td>${status}</td>
                            <td>
                                <button onclick="javascript:editItem('${id}')" class="btn btn-warning">Edit</button>
                                <button onclick="javascript:deleteItem('${id}')" class="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                `
            });
        }
        $(areaListTask).html(content);
    });
}

editItem = (id) => {
    toggleForm();
    $.getJSON(  API_URL + "items/" + id, function( data ) {
       if(data){
            inputID.val(id);
            inputName.val(data.data[0].name);
            inputStatus.val(data.data[0].status);
       }
    });


}

startEditItem = async (id) => {
    if(inputName.val().trim()){
        let name    = inputName.val();
        let status  = inputStatus.val();
        const response = await fetch( API_URL + "items/edit/" + id, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                name,
                status
            }) // body data type must match "Content-Type" header
          });
        showItems();
        toggleForm(false);
        resetInput();
    }else{
        alert("Vui lòng nhập Task Name");
    }
}

deleteItem = async (id) => {
    let yes = confirm('Bạn có muốn xoá ? ');
    if(yes){
        const response = await fetch( API_URL + "items/delete/" + id, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        showItems();
    }
    
}

addItem = async () => {
    if(inputName.val().trim()){
        let name    = inputName.val();
        let status  = inputStatus.val();
        const response = await fetch( API_URL + "items/add", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                name,
                status
            }) // body data type must match "Content-Type" header
          });
        showItems();
        toggleForm(false);
        resetInput();

    }else{
        alert("Vui lòng nhập Task Name");
    }
}

showItemStatus = (status) => {
    let itemLevel = ITEM_STATUS.find((element) => element.status == status);
    return `<span class="badge bg-${itemLevel.class}">${itemLevel.name}</span>`;
}

toggleForm = (isShow = true) => {
    if (isShow) {
        $(areaForm).removeClass('d-none');
        $(btnToggleForm).html('Close');
        $(btnToggleForm).removeClass('btn-info');
        $(btnToggleForm).addClass('btn-danger');
    } else {
        $(areaForm).addClass('d-none');
        $(btnToggleForm).html('Add Task');
        $(btnToggleForm).addClass('btn-info');
        $(btnToggleForm).removeClass('btn-danger');
    }
}

resetInput = () => {
    inputID.val('');
    inputName.val('');
    inputStatus.val('small');
}


