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
    mainView.router.navigate('/rol?listItemId='+item.ID);
    
}

assignRolPage.methods.getOneItemSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    buttons.push(localButtons.assignRol(context));

    return buttons;
}
//console para saber que metodos puedo usar
assignRolPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

assignRolPage.methods.getCamlQueryConditions = function(){
    return '<And><IsNull><FieldRef Name="Rol"/></IsNull><Eq><FieldRef Name="EstadoContrato" /><Value Type="Choice">Activo</Value></Eq></And>';
}

assignRolPage.methods.getNoItemsSelectedButtons = function(){
    return false;
}