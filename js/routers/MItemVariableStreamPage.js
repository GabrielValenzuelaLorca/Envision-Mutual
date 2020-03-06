var MItemVariableStreamPage = $.extend(true, {}, listStreamPage)

MItemVariableStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

MItemVariableStreamPage.methods.getListView = function(){
    return "Todos los elementos"
}

MItemVariableStreamPage.methods.getTitle = function(){
    return "Mantenedor Items Variables"
}

MItemVariableStreamPage.methods.getListTitle = function(){
    return "ListadoItemVariable"
}

MItemVariableStreamPage.methods.onItemDblClick = function(item){
    // mainView.router.navigate('/periodo?listItemId='+item.ID);        
}

MItemVariableStreamPage.methods.getOneItemSelectedButtons = function(item){
    return false;
}

MItemVariableStreamPage.methods.getNoItemsSelectedButtons = function(item){
    return false;
}
