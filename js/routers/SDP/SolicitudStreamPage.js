var solicitudStreamPage = $.extend(true, {}, listStreamPage)

solicitudStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

solicitudStreamPage.methods.getListView = function(){
    return "SolicitudesStream"
}

solicitudStreamPage.methods.getTitle = function(){
    return "Mis Solicitudes"
}

solicitudStreamPage.methods.getListTitle = function(){
    return "SolicitudSDP"
}

solicitudStreamPage.methods.onItemDblClick = function(item){
     mainView.router.navigate('/formSolicitante?listItemId='+item.ID);
}

solicitudStreamPage.methods.getOneItemSelectedButtons = function(){
    return [localButtons.toSeeDetailsSolicitud()]
}

solicitudStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

solicitudStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var url = page.route.url
    
    if (url == "/SolicitudesPorValidar"){
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
}