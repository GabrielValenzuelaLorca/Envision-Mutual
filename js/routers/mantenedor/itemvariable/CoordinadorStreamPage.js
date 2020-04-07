var coordinadorStreamPage = $.extend(true, {}, listStreamPage)

coordinadorStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

coordinadorStreamPage.methods.getListView = function(){
    return "Mantenedor Coordinadores"
}

coordinadorStreamPage.methods.getTitle = function(){
    return "Seleccióne un coordinador para ver las opciónes"
}

coordinadorStreamPage.methods.getListTitle = function(){
    return "Planta"
}

coordinadorStreamPage.methods.onItemDblClick = function(item){
    //  mainView.router.navigate('/trabajadorPorCoordinador?listItemId='+item.ID);
    return false;
}

coordinadorStreamPage.methods.getOneItemSelectedButtons = function(){
    return [localButtons.ToHaberesPage(), localButtons.ToAsociateTrabajadorPage()];
}
//console para saber que metodos puedo usar
coordinadorStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

coordinadorStreamPage.methods.getCamlQueryConditions = function(){
    return '<And><Eq><FieldRef Name="Rol"/><Value Type="Choice">Coordinador</Value></Eq><Eq><FieldRef Name="EstadoContrato"/><Value Type="Choice">Activo</Value></Eq></And>' 
}