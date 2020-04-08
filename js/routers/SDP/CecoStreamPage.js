var cecoStreamPage = $.extend(true, {}, listStreamPage)

cecoStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

cecoStreamPage.methods.getListView = function(){
    return "Mantenedor Ceco"
}

cecoStreamPage.methods.getTitle = function(){
    return "Seleccióne un centro de costo para ver las opciónes"
}

cecoStreamPage.methods.getListTitle = function(){
    return "CentroCosto"
}

cecoStreamPage.methods.onItemDblClick = function(item){
    mainView.router.navigate('/cecoTemporal?listItemId='+item.ID+'&editable=true');
}

cecoStreamPage.methods.getOneItemSelectedButtons = function(){
    return false;
}
//console para saber que metodos puedo usar
cecoStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

// cecoStreamPage.methods.getCamlQueryConditions = function(){
//     return '<And><Eq><FieldRef Name="Rol"/><Value Type="Choice">Coordinador</Value></Eq><Eq><FieldRef Name="EstadoContrato"/><Value Type="Choice">Activo</Value></Eq></And>' 
// }