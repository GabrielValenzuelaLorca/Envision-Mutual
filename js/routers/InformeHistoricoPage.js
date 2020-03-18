var informeHistoricoPage = $.extend(true, {}, listStreamPage)

informeHistoricoPage.methods.allowChangeTemplate = function(){
    return false;
}

informeHistoricoPage.methods.getListView = function(){
    if (plantaAdmin.Rol == "Administrador") {
        return "Historico"    
    } else if (plantaAdmin.Rol == "Coordinador"){
        return "Historico Coordinador"
    }
}

informeHistoricoPage.methods.getTitle = function(){
    return "Informes Históricos"
}

informeHistoricoPage.methods.getListTitle = function(){
    return "Informe Haberes"
}

informeHistoricoPage.methods.onItemDblClick = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
        context = self._getPageContext();
    
        // case 'Informes Desaprobados':
        // case 'Informes':
        // case 'Informes Históricos':
        mainView.router.navigate('/informe?listItemId='+item.ID);
}

informeHistoricoPage.methods.beforeStartComponent = function(success,failure){
    var context = this._getPageContext();
    if (plantaAdmin.Rol == "Administrador"){
        spo.getListInfo('Informe Haberes',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(Estado eq \'Aprobado\')',
                        'top': 1
                    }
                });
                spo.getListItems(spo.getSiteUrl(), "Informe Haberes", query,
                    function (response) {
                        context.lastInforme = response.d.results.length>0 ? response.d.results[0] : null;
                        if (success) success();
                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                        if (failure) failure();
                    }
                );
            },
            function(response){
                var responseText = JSON.parse(response.responseText);
                console.log(responseText.error.message.value);
                resolve(failCond);
                if (failure) failure();
            }
        );
    } else if (plantaAdmin.Rol == "Coordinador"){
        if (success) success();
    } 
}

informeHistoricoPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    if(plantaAdmin.Rol == "Administrador"){
        buttons.push(localButtons.downloadInformeAdmin(context));    
        buttons.push(localButtons.downloadInformePDF(context)); 
    } else if (plantaAdmin.Rol == "Coordinador") {
        buttons.push(localButtons.downloadInformeCoord(context));    
    }
    return buttons;
}

informeHistoricoPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
    
    if (plantaAdmin.Rol == "Administrador"){
        buttons.push(localButtons.downloadInformeComplete(context));
    }

    return buttons;
}

informeHistoricoPage.methods.getMultiItemsSelectedButtons = function(items){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    return buttons;
}

informeHistoricoPage.methods.afterFilterComponentInitializated = function () {
    var self = this;
    var context = self._getPageContext();
    var page = self._getPage();

    if (context.lastInforme){
        let anio = context.lastInforme.Periodo.AnioCalculado
        let mes = context.lastInforme.Periodo.MesCalculado
        context.components.itemsFilter.inputs.Periodo_x003a_AnioCalculado.setValue([{text: anio}]);
        context.components.itemsFilter.inputs.Periodo_x003a_MesCalculado.setValue([{text: mes}]);

        var element = "<div class='added-filter' style='padding: 10px 0px 0px 20px; margin-top:0px;'><h4 style='margin-top:0px; margin-bottom:0px;'>Se están mostrando los informes del último periodo registrado</h4>"
        element += "<p style='margin-top: 0px; margin-bottom: 5px;'>"+ mes +" - "+ anio +"</p>"
        element += "</div>"
        $(page.pageEl).find('.liststreampage-page-content-header').last().parent().last().append(element)
    }
    $(page.navbarEl).find('a.filter').click();
}

// informeHistoricoPage.methods.onFilterCallback = function(filters){
//     var self = this;
//     var page = self._getPage();

//     $(page.pageEl).find('.added-filter').remove();
//     informeHistoricoPage.methods.onFilterCallback = listStreamPage.methods.onFilterCallback;
// }

informeHistoricoPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var urlQuery = page.route.query;
    if (plantaAdmin.Rol == "Administrador") {
        return ''+ 
            '<Eq>'+
                '<FieldRef Name="Estado" />'+
                    '<Value Type="Choice">Aprobado</Value>'+
            '</Eq>'    
    } else if (plantaAdmin.Rol == "Coordinador") {
        return ''+
            '<And><Eq>'+
                '<FieldRef Name="Estado" />'+
                    '<Value Type="Choice">Aprobado</Value>'+
            '</Eq><Eq>'+
                '<FieldRef Name="Coordinador" LookupId="TRUE"/>'+
                    '<Value Type="Lookup">'+plantaAdmin.ID+'</Value>'+
            '</Eq></And>'
    }
}