var cooStreamPage = $.extend(true, {}, listStreamPage)

cooStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

cooStreamPage.methods.getListView = function(){
    return "Mantenedor Coordinador"
}

cooStreamPage.methods.getTitle = function(){
    return "Haga doble click sobre un coordinador para asociar haberes"
}

cooStreamPage.methods.getListTitle = function(){
    return "Planta"
}

cooStreamPage.methods.onItemDblClick = function(item){
    mainView.router.navigate('/haberTemporal?listItemId='+item.ID+'&editable=true');
}

cooStreamPage.methods.getOneItemSelectedButtons = function(){
    return false;
}
//console para saber que metodos puedo usar
cooStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

cooStreamPage.methods.getCamlQueryConditions = function(){
    return '<And><Eq><FieldRef Name="Rol"/><Value Type="Choice">Coordinador</Value></Eq><Eq><FieldRef Name="EstadoContrato"/><Value Type="Choice">Activo</Value></Eq></And>' 
}