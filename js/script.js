const dataSource = {};

// Create Input for new item
$('.big-box').on('keyup', '.create-item-input', function(e) {
    if (e.keyCode == 13){
        //Enter keycode
        const itemName = $(this).val();
        const listId = $(this).data('id');
        $(this).addClass('d-none');
        $(this).val('');

        const itemId = uuidv4();
        const listParent = $(this).closest('.box');
        const contentField = listParent.find('.content');

        dataSource[listId].openItems[itemId] = itemName;

        createItem(contentField, listId, itemId, itemName);
    }else if (e.keyCode == 27){
        //Escape keycode
        $(this).val('');
        $(this).addClass('d-none');
    }
});

// Save title list after edit
$('.big-box').on('click', '.save-title-btn', function(e) {
    const listParent = $(this).closest('.box');
    const listId = listParent.data('id');
    const titleName = $(this).siblings('.edit-title-input').val();
    $(this).parent().addClass('d-none');
    const titleHeaderField = $(this).parent().siblings('.title-header-field');
    titleHeaderField.removeClass('d-none');
    titleHeaderField.find('.header-title').html(titleName);

    dataSource[listId].name = titleName;
});

// Well-done item 
$('.big-box').on('change', '.item-checkbox', function() {
    const itemId = $(this).data('id');
    const itemParent = $(this).closest('.item-field');
    const listId = itemParent.data('id');
    const itemLabel = $(this).siblings('label');
    if($(this).is(':checked')){
        itemLabel.addClass('text-line-through');

        const itemName = dataSource[listId].openItems[itemId];
        delete dataSource[listId].openItems[itemId];
        dataSource[listId].completedItems[itemId] = itemName;
    }else {
        itemLabel.removeClass('text-line-through');

        const itemName = dataSource[listId].completedItems[itemId];
        delete dataSource[listId].completedItems[itemId];
        dataSource[listId].openItems[itemId] = itemName;
    }
})

// Delete item
$('.big-box').on('click', '.delete-item-btn', function() {
    const itemId = $(this).data('id');
    $(`#item-${itemId}`).remove();
    const itemParent = $(this).closest('.item-field');
    const listId = itemParent.data('id');

    delete dataSource[listId].openItems[itemId];
});

// Create item
$('.big-box').on('click', '.create-item-icon', function() {   
    const listParent = $(this).closest('.box');
    const createItemInput = listParent.find('.create-item-input');
    createItemInput.removeClass('d-none');
});

// Delete To-do list
$('.big-box').on('click', '.delete-item-icon', function() {
    const listId = $(this).data('id');
    if (!listId) { return; }
    $(`#list-${listId}`).remove();
    delete dataSource[listId];
});

// Edit title list
$('.big-box').on('click', '.header-title', function() {
    const parent = $(this).parent();
    parent.addClass('d-none');

    const editHeaderField = parent.siblings('.edit-header-field');
    editHeaderField.removeClass('d-none');
    const editTitleInput = editHeaderField.find('.edit-title-input');
    editTitleInput.val($(this).html());
});

// Create To-do list
$('#list-create-btn').click(() => {
    const listText = $('#list-create-text').val();
    if (!listText){
        alert('Text can\'t be empty');
        return;
    }
    const listId = uuidv4();

    createTodoList(listId, listText, []);

    dataSource[listId] = {
        name: listText,
        openItems: {},
        completedItems: {}
    };

    $('#list-create-text').val('');
})

// Export group remain item
$('#export-btn').on('click', ()=> {
    const result = groupRemainItem();
    alert(JSON.stringify(result));
})

// Create To-do list
function createTodoList(listId, listName) {
    const listTemplate = `
    <div id="list-${listId}" data-id="${listId}" class="box">
        <div class="header title-header-field"> 
            <span class="header-title"></span>
            <div class="header-icon"> 
                <span class="create-item-icon"><i class="fas fa-folder-plus"></i></span>
                <span data-id="${listId}" class="delete-item-icon"><i class="fas fa-trash-alt"></i></span>
            </div>
        </div>
        <div class="header edit-header-field d-none">
            <input class="form-control edit-title-input" type="text" placeholder="List title">
            <i class="save-title-btn far fa-save"></i>
        </div>
        <div class="content"> 
            <input data-id="${listId}" class="form-control create-item-input d-none" type="text" placeholder="New item">
        </div>
    </div>
    `
    $('.big-box').append(listTemplate);

    $(`#list-${listId}`).find('.header-title').html(listName);
}

// Create To-do list item
function createItem(parentContent, listId, itemId, itemName) {
    const itemTemplate = `
        <div class="item-field" id="item-${itemId}" data-id="${listId}">
            <input data-id="${itemId}" id="cb-${itemId}" type="checkbox" class="item-checkbox">
            <label for="cb-${itemId}" >${itemName}</label>
            <span data-id="${itemId}" class="delete-item-btn">
                <i class="fas fa-times"></i>
            </span>
        </div>
    `
    parentContent.append(itemTemplate);
}

// Group remain item
function groupRemainItem() {
    const result = [];
    Object.keys(dataSource).forEach(key => {
        const listSource = dataSource[key];
        const listItem = {
            name: listSource.name,
            openItems: []
        };
        Object.keys(listSource.openItems).forEach(itemKey => {
            listItem.openItems.push(listSource.openItems[itemKey]);
        })
        result.push(listItem);
    })

    return result;
}

// Generate unique ID
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}