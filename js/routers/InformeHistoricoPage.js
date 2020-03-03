var informeHistoricoPage = $.extend(true, {}, listStreamPage)

informeHistoricoPage.methods.allowChangeTemplate = function(){
    return false;
}

informeHistoricoPage.methods.getListView = function(){
    if (admin == "Administrador") {
        return "Historico"    
    } else if (admin == "Coordinador"){
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
    if (admin=="Coordinador"){
        spo.getListInfo('Coordinador',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(UsuarioId eq '+ spo.getCurrentUserId() +')'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), "Coordinador", query,
                    function (response) {
                        context.coorId = response.d.results.length>0 ? response.d.results[0].ID : null;
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
    } else if (admin == "Administrador"){
        spo.getListInfo('Informe Haberes',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(Estado eq \'Aprobado por administración\')',
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
    }
}

informeHistoricoPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    if (admin=="Coordinador") {
        buttons.push(localButtons.downloadInformeCoord(context));    
    } else if(admin=="Administrador"){
        buttons.push(localButtons.downloadInformeAdmin(context));    
        buttons.push(localButtons.downloadInformePDF(context)); 
    }
    
    return buttons;
}

informeHistoricoPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
    
    if (admin=="Administrador"){
        buttons.push(localButtons.downloadInformeComplete(context));
    }

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
    }
    $(page.navbarEl).find('a.filter').click();
}

informeHistoricoPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var urlQuery = page.route.query;
    if (admin == "Administrador") {
        return ''+ 
            '<Eq>'+
                '<FieldRef Name="Estado" />'+
                    '<Value Type="Choice">Aprobado por administración</Value>'+
            '</Eq>'    
    } else if (admin == "Coordinador") {
        return ''+
            '<And><Eq>'+
                '<FieldRef Name="Estado" />'+
                    '<Value Type="Choice">Aprobado por administración</Value>'+
            '</Eq><Eq>'+
                '<FieldRef Name="Coordinador" LookupId="TRUE"/>'+
                    '<Value Type="Lookup">'+context.coorId+'</Value>'+
            '</Eq></And>'
    }
}