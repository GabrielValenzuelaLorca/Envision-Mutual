var solicitudStreamPage = $.extend(true, {}, listStreamPage)

solicitudStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

solicitudStreamPage.methods.getListView = function(){
    return "Todos los elementos"
}

solicitudStreamPage.methods.getTitle = function(){
    return "Mis Solicitudes"
}

solicitudStreamPage.methods.getListTitle = function(){
    return "SolicitudSDP"
}

solicitudStreamPage.methods.onItemDblClick = function(item){
     mainView.router.navigate('/formSolicitante?listItemId='+item.ID);
}

solicitudStreamPage.methods.getOneItemSelectedButtons = function(){
    return [localButtons.toSeeDetailsSolicitud()]
}
//console para saber que metodos puedo usar
solicitudStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

// solicitudStreamPage.methods.getCamlQueryConditions = function(){
//     return '<And><Eq><FieldRef Name="Rol"/><Value Type="Choice">Coordinador</Value></Eq><Eq><FieldRef Name="EstadoContrato"/><Value Type="Choice">Activo</Value></Eq></And>' 
// }