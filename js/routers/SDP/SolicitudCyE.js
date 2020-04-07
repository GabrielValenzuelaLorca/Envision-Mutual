var solicitudCyEStream = $.extend(true, {}, listStreamPage)

solicitudCyEStream.methods.allowChangeTemplate = function(){
    return false;
}

solicitudCyEStream.methods.getListView = function(){
    return "CyE"
}

solicitudCyEStream.methods.getTitle = function(){
    return "Solicitudes"
}

solicitudCyEStream.methods.getListTitle = function(){
    return "SolicitudSDP"
}

solicitudCyEStream.methods.onItemDblClick = function(item){
     mainView.router.navigate('/formSolicitante?listItemId='+item.ID);
}

solicitudCyEStream.methods.getOneItemSelectedButtons = function(){
    return [localButtons.toSeeDetailsSolicitud(), localButtons.gestionar()]
}

solicitudCyEStream.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

// solicitudCyEStream.methods.getCamlQueryConditions = function(){
//     var page = this._getPage();
//     var url = page.route.url
// }