var trabajadoresStreamPage = $.extend(true, {}, listStreamPage)

trabajadoresStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

trabajadoresStreamPage.methods.getListView = function(){
    return "Trabajadores por Coordinadores"
}

trabajadoresStreamPage.methods.getTitle = function(){
    return "Trabajadores por Coordinadores"
}

trabajadoresStreamPage.methods.getListTitle = function(){
    return "Planta"
}

trabajadoresStreamPage.methods.onItemDblClick = function(item){
   return false
}

trabajadoresStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var listItemId = page.route.query.listItemId;
    //aqui puse la query que me salio en la consola de la pagina
     return '<Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">'+listItemId+'</Value></Eq>'
}

trabajadoresStreamPage.methods.getMultiItemsSelectedButtons = function(){
    var self = this,
    page = self._getPage(),
    context = self._getPageContext(),
    buttons = [];

    buttons.push(localButtons.deleteListTrabajadoresButton(context));

    return buttons;
}
trabajadoresStreamPage.methods.getOneItemSelectedButtons = function(){
    var self = this,
    page = self._getPage(),
    context = self._getPageContext(),
    buttons = [];
    
    buttons.push(localButtons.deleteTrabajador(context));

    return buttons;
}
trabajadoresStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        listItemId = page.route.query.listItemId,
        buttons = [];

    buttons.push(localButtons.addTrabajadorButton(context, listItemId));

    return buttons;
}