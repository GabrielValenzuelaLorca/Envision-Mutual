var rolStreamPage = $.extend(true, {}, listStreamPage)

rolStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

rolStreamPage.methods.getListView = function(){
    return "Roles"
}

rolStreamPage.methods.getTitle = function(){
    return "Roles de Sistema"
}

rolStreamPage.methods.getListTitle = function(){
    return "Planta"
}

rolStreamPage.methods.onItemDblClick = function(item){
    mainView.router.navigate('/rol?listItemId='+item.ID);
}

rolStreamPage.methods.getOneItemSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    buttons.push(localButtons.deleteRol(context));

    return buttons;
}

rolStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

rolStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    buttons.push(localButtons.toAssignRol(context));

    return buttons;
}

rolStreamPage.methods.getCamlQueryConditions = function(){
    return '<IsNotNull><FieldRef Name="Rol"/></IsNotNull>';
}

rolStreamPage.methods.getCamlOrderBy = function() {
    return '<FieldRef Name="Rol" Ascending="True" />';
}