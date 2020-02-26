var periodoStreamPage = $.extend(true, {}, listStreamPage)

periodoStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

periodoStreamPage.methods.getListView = function(){
    return "Todos los elementos"
}

periodoStreamPage.methods.getTitle = function(){
    return "Periodos"
}

periodoStreamPage.methods.getListTitle = function(){
    return "Periodo"
}

periodoStreamPage.methods.onItemDblClick = function(item){
    mainView.router.navigate('/periodo?listItemId='+item.ID);        
}

periodoStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    if (self.allowUpdateItem()){
        buttons.push(localButtons.editPeriodButton());
    }
    if (item.Activo == "Sí"){
        buttons.push(localButtons.desactivatePeriodoButton());
    } else {
        buttons.push(localButtons.activatePeriodoButton(context));
    }
   
    return buttons;
}

periodoStreamPage.methods.getNoItemsSelectedButtons = function(item){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    buttons.push(localButtons.addPeriodButton(context));

    return buttons;
}
