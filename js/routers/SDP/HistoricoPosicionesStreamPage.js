var HistoricoPosicionesStreamPage = $.extend(true, {}, listStreamPage)

HistoricoPosicionesStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

HistoricoPosicionesStreamPage.methods.getListView = function(){
    return "Todos los elementos"
}

HistoricoPosicionesStreamPage.methods.getTitle = function(){
    return "Historico de Posiciones"
}

HistoricoPosicionesStreamPage.methods.getListTitle = function(){
    return "Posicion"
}

HistoricoPosicionesStreamPage.methods.onItemDblClick = function(item){
     mainView.router.navigate('/Posicion?listItemId='+item.ID);
}

HistoricoPosicionesStreamPage.methods.getOneItemSelectedButtons = function(item){
    

    return false ;
}

HistoricoPosicionesStreamPage.methods.getMultiItemsSelectedButtons = function(items){
    

    return false;
}

HistoricoPosicionesStreamPage.methods.getCamlQueryConditions = function(){
    return '<Or><Eq><FieldRef Name="Estado"/><Value Type="Choice">Desaprobada</Value></Eq><Eq><FieldRef Name="Estado"/><Value Type="Choice">Disponible para uso</Value></Eq></Or>'
}

HistoricoPosicionesStreamPage.methods.getCamlOrderBy = function() {
    return '<FieldRef Name="NPosicion" Ascending="True" />';
}
