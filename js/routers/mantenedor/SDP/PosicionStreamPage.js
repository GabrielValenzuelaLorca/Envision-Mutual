var posicionStreamPage = $.extend(true, {}, listStreamPage)

posicionStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

posicionStreamPage.methods.getListView = function(){
    return "Todos los Elementos"    
}

posicionStreamPage.methods.getTitle = function(){
    return "Listado de posiciones"
}

posicionStreamPage.methods.getListTitle = function(){
    return "Posicion"
}

posicionStreamPage.methods.onItemDblClick = function(item){
    // mainView.router.navigate('/itemVariable?listItemId='+item.ID);
    return;
}

posicionStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [
            localButtons.toCreatePosition()
        ];
    return buttons;
}

posicionStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [
        localButtons.toEditPosition(),
        localButtons.enviarUnCyE()
    ];


    return buttons;
}

posicionStreamPage.methods.getMultiItemsSelectedButtons = function(items){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [
        localButtons.toEditPosition(),
        localButtons.enviarMultiplesCyE()
    ];
    buttons.push()

    return buttons;
}

posicionStreamPage.methods.getCamlQueryConditions = function(){
    return `    
                    
                <Contains><FieldRef Name="Estado" /><Value Type="Choice">En revisión</Value></Contains>
            `
}

posicionStreamPage.methods.getCamlOrderBy = function() {
    return '<FieldRef Name="NPosicion" Ascending="True" />';
}
