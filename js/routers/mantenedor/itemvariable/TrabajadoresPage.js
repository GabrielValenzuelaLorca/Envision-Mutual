var trabajadoresPage = $.extend(true, {}, listStreamPage)

trabajadoresPage.methods.allowChangeTemplate = function(){
    return false;
}

trabajadoresPage.methods.getListView = function(){
    return "Trabajadores por Coordinadores"
}

trabajadoresPage.methods.getTitle = function(){
    return "Trabajadores sin Coordinadores"
}

trabajadoresPage.methods.getListTitle = function(){
    return "Planta"
}

trabajadoresPage.methods.onItemDblClick = function(item){
   return false
}

trabajadoresPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var listItemId = page.route.query.listItemId;

     return '<And><IsNull><FieldRef Name="Coordinador"/></IsNull><Eq><FieldRef Name="EstadoContrato"/><Value Type="Choice">Activo</Value></Eq></And>'
}

trabajadoresPage.methods.getMultiItemsSelectedButtons = function(){
    var self = this,
    page = self._getPage(),
    context = self._getPageContext(),
    buttons = [];
    var coordinador = page.route.query.listItemId;

    buttons.push(localButtons.addListTrabajadoresButton(context, coordinador));
    
    return buttons;
}
trabajadoresPage.methods.getOneItemSelectedButtons = function(){
    var self = this,
    page = self._getPage(),
    context = self._getPageContext(),
    buttons = [];
    var coordinador = page.route.query.listItemId;

    buttons.push(localButtons.addListTrabajadorButton(context, coordinador));

    return buttons;
}
trabajadoresPage.methods.getNoItemsSelectedButtons = function(){
    return false
}