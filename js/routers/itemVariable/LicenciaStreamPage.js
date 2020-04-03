var licenciaStreamPage = $.extend(true, {}, listStreamPage)

licenciaStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

licenciaStreamPage.methods.getListView = function(){
    if (plantaAdmin.Rol == "Coordinador"){
        return "Form"
    } else if (plantaAdmin.Rol == "Administrador" || plantaAdmin.Rol == "Encargado de Licencias Médicas") {
        return "Todos los elementos"
    }
}

licenciaStreamPage.methods.getTitle = function(){
    return "Licencias Médicas"
}

licenciaStreamPage.methods.getListTitle = function(){
    return "Licencia"
}

licenciaStreamPage.methods.beforeStartComponent = function(success,failure){
    var context = this._getPageContext();
    if (plantaAdmin.Rol == "Coordinador"){
        spo.getListInfo("Periodo",
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(Activo eq 1)'
                    }
                });

                spo.getListItems(spo.getSiteUrl(), "Periodo", query,
                    function (response) {
                        context.periodId = response.d.results.length > 0 ? response.d.results[0].ID : null;
                        if (success) success();
                    },
                    function (response) {
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                        if (failure) failure();
                    }
                );
            }, 
            function (response) {
                var responseText = JSON.parse(response.responseText);
                console.log(responseText.error.message.value);
                if (failure) failure();
            }
        );
    } else if (plantaAdmin.Rol == "Administrador" || plantaAdmin.Rol == "Encargado de Licencias Médicas") {
        spo.getListInfo('Licencia',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'top': 1
                    }
                });
                spo.getListItems(spo.getSiteUrl(), "Licencia", query,
                    function (response) {
                        context.lastLicencia = response.d.results.length>0 ? response.d.results[0] : null;
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

licenciaStreamPage.methods.onItemDblClick = function(item){
    mainView.router.navigate('/licencia?listItemId='+item.ID);    
    return false    
}

licenciaStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    buttons.push(localButtons.toLicencia());
    if (plantaAdmin.Rol == "Coordinador"){
        buttons.push(localButtons.deleteLicencia());
    }
   
    return buttons;
}

licenciaStreamPage.methods.getMultiItemsSelectedButtons = function(items){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    return buttons;
}

licenciaStreamPage.methods.getNoItemsSelectedButtons = function(item){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    if (plantaAdmin.Rol == "Coordinador"){
        buttons.push(localButtons.addLicencia(context));
    } else if (plantaAdmin.Rol == "Administrador" || plantaAdmin.Rol == "Encargado de Licencias Médicas"){
        buttons.push(localButtons.downloadLicenciaPeriodo(context));
        buttons.push(localButtons.downloadLicenciaComplete(context));
    }

    return buttons;
}

licenciaStreamPage.methods.afterFilterComponentInitializated = function () {
    var self = this;
    var context = self._getPageContext();
    var page = self._getPage();

    if (plantaAdmin.Rol == "Administrador" || plantaAdmin.Rol == "Encargado de Licencias Médicas") {
        if (context.lastLicencia){
            let anio = context.lastLicencia.Periodo.AnioCalculado
            let mes = context.lastLicencia.Periodo.MesCalculado
            context.components.itemsFilter.inputs.Periodo_x003a_AnioCalculado.setValue([{text: anio}]);
            context.components.itemsFilter.inputs.Periodo_x003a_MesCalculado.setValue([{text: mes}]);
    
            var element = "<div class='added-filter' style='padding: 10px 0px 0px 20px; margin-top:0px;'><h4 style='margin-top:0px; margin-bottom:0px;'>Se están mostrando las licencias del último periodo registrado</h4>"
            element += "<p style='margin-top: 0px; margin-bottom: 5px;'>"+ mes +" - "+ anio +"</p>"
            element += "</div>"
            $(page.pageEl).find('.liststreampage-page-content-header').last().parent().last().append(element)
        }
        $(page.navbarEl).find('a.filter').click();
    }
    
}

licenciaStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();

    if (plantaAdmin.Rol == "Coordinador"){
        return '<And><Eq><FieldRef Name="RUT_RESP" LookupId="TRUE"/><Value Type="Lookup">'+ plantaAdmin.ID +'</Value></Eq><Eq><FieldRef Name="Periodo" LookupId="TRUE"/><Value Type="Lookup">'+context.periodId+'</Value></Eq></And>'
    }
}