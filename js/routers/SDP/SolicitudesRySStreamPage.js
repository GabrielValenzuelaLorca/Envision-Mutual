var solicitudesRySStreamPage = $.extend(true, {}, listStreamPage)

solicitudesRySStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

solicitudesRySStreamPage.methods.getListView = function(){
    return "Todos los elementos"
}

solicitudesRySStreamPage.methods.getTitle = function(){
    return "Solicitudes RyS"
}

solicitudesRySStreamPage.methods.getListTitle = function(){
    return "SolicitudRyS"
}

solicitudesRySStreamPage.methods.onItemDblClick = function(item){
     return false;
}

solicitudesRySStreamPage.methods.getOneItemSelectedButtons = function(item){
    return false;
}

solicitudesRySStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}
