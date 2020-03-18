var assignRolPage = $.extend(true, {}, listStreamPage)

assignRolPage.methods.allowChangeTemplate = function(){
    return false;
}

assignRolPage.methods.getListView = function(){
    return "Sin Rol"
}

assignRolPage.methods.getTitle = function(){
    return "Asignación de Roles"
}

assignRolPage.methods.getListTitle = function(){
    return "Planta"
}

assignRolPage.methods.onItemDblClick = function(item){
    //  mainView.router.navigate('/trabajadorPorCoordinador?listItemId='+item.ID);
    return false;
}

assignRolPage.methods.getOneItemSelectedButtons = function(){
    return false;
}
//console para saber que metodos puedo usar
assignRolPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

assignRolPage.methods.getCamlQueryConditions = function(){
    return '<And><IsNull><FieldRef Name="Rol"/></IsNull><Eq><FieldRef Name="EstadoContrato" /><Value Type="Choice">Activo</Value></Eq></And>';
}