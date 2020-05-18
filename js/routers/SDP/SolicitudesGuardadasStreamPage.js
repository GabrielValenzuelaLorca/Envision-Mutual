var SolicitudesGuardadasStreamPage = $.extend(true, {}, listStreamPage)

SolicitudesGuardadasStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

SolicitudesGuardadasStreamPage.methods.getListView = function(){
    return "Todos los elementos"
}

SolicitudesGuardadasStreamPage.methods.getTitle = function(){
    return "Posiciones por Aprobar"
}

SolicitudesGuardadasStreamPage.methods.getListTitle = function(){
    return "Posicion"
}

SolicitudesGuardadasStreamPage.methods.onItemDblClick = function(item){
     mainView.router.navigate('/Posicion?listItemId='+item.ID);
}

SolicitudesGuardadasStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [    
        localButtons.toEditPosition(),    
        localButtons.aprobarUnCyE(),
        localButtons.desaprobarUnCyE()
    ];


    return buttons;
}

SolicitudesGuardadasStreamPage.methods.getMultiItemsSelectedButtons = function(items){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [      
        localButtons.toEditPosition(),  
        localButtons.aprobarMultiplesCyE(),
        localButtons.desaprobarMultiplesCyE()
    ];
    buttons.push()

    return buttons;
}
SolicitudesGuardadasStreamPage.methods.getCamlQueryConditions = function(){
    return ` <Contains><FieldRef Name="Estado" /><Value Type="Choice">Validación Jefe CyE</Value></Contains>  `
}

SolicitudesGuardadasStreamPage.methods.getCamlOrderBy = function() {
    return '<FieldRef Name="NPosicion" Ascending="True" />';
}