var aproveSolicitudStreamPage = $.extend(true, {}, listStreamPage)

aproveSolicitudStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

aproveSolicitudStreamPage.methods.getListView = function(){
    return "SolicitudesStream"
}

aproveSolicitudStreamPage.methods.getTitle = function(){
    return "Mis Solicitudes"
}

aproveSolicitudStreamPage.methods.getListTitle = function(){
    return "SolicitudSDP"
}

aproveSolicitudStreamPage.methods.onItemDblClick = function(item){
     mainView.router.navigate('/formSolicitante?listItemId='+item.ID);
}

aproveSolicitudStreamPage.methods.getOneItemSelectedButtons = function(){
    return [localButtons.toSeeDetailsSolicitud()]
}

aproveSolicitudStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

aproveSolicitudStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var url = page.route.url

        if (plantaAdmin.Confianza){
            return ''+
                '<Or><Eq>'+
                    '<FieldRef Name="Estado" />'+
                        '<Value Type="Choice">Última Validación</Value>'+
                '</Eq>'+
                    '<Contains><FieldRef Name="NextVal" />' +
                        '<Value Type="Text">'+ plantaAdmin.Email +'</Value>' +
                    '</Contains>' +
                '</Or>'  
        } else {
            return ''+
                '<Contains><FieldRef Name="NextVal" />' +
                    '<Value Type="Text">'+ plantaAdmin.Email +'</Value>' +
                '</Contains>'               
        }
}