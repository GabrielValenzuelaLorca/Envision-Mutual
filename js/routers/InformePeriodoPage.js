var informePeriodoPage = $.extend(true, {}, listStreamPage)

informePeriodoPage.methods.allowChangeTemplate = function(){
    return false;
}

informePeriodoPage.methods.getListView = function(){
    if (admin == "Aprobador") {
        return "Aprobador"    
    } else if (admin == "Administrador") {
        return "Administrador"
    }
}

informePeriodoPage.methods.getTitle = function(){
    return "Informes en Periodo"
}

informePeriodoPage.methods.getListTitle = function(){
    return "Informe Haberes"
}

informePeriodoPage.methods.onItemDblClick = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
        context = self._getPageContext();
    
    // case 'Informes Desaprobados':
    // case 'Informes':
    // case 'Informes Históricos':
    mainView.router.navigate('/informe?listItemId='+item.ID);
}

informePeriodoPage.methods.beforeStartComponent = function(success,failure){
    var context = this._getPageContext();
    loaded = {}
    function startInformeComponent(){
        if ((loaded.Aprobador || admin == "Administrador") && loaded.Periodo){
            if (success) success();
        }
    }
    spo.getListInfo('Periodo',
        function (response) {
            var query = spo.encodeUrlListQuery(response, {
                view: 'Todos los elementos',
                odata: {
                    'filter': '(Activo eq 1)'
                }
            });
            spo.getListItems(spo.getSiteUrl(), "Periodo", query,
                function (response) {
                    context.periodId = response.d.results.length>0 ? response.d.results[0].ID : null;
                    loaded.Periodo = true;
                    startInformeComponent()
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
    if (admin == "Aprobador"){
        spo.getListInfo('Aprobador',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(UsuarioId eq '+ spo.getCurrentUserId() +')',
                        'select': '*,AttachmentFiles',
                        'expand': 'AttachmentFiles'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), "Aprobador", query,
                    function (response) {
                        context.aprobadorId = response.d.results.length>0 ? response.d.results[0].ID : null;
                        // Busco a los coordinadores que me envían haberes
                        spo.getListInfo('Coordinador',
                            function (response) {
                                var query = spo.encodeUrlListQuery(response, {
                                    view: 'Todos los elementos',
                                    odata: {
                                        'filter': '(AprobadorId eq '+ context.aprobadorId +')'
                                    }
                                });
                                spo.getListItems(spo.getSiteUrl(), "Coordinador", query,
                                    function (response) {
                                        context.coordinadoresId = response.d.results.map(function(coord){
                                            return coord.ID
                                        })
                                        loaded.Aprobador = true;
                                        startInformeComponent()
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

informePeriodoPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    buttons.push(localButtons.disableItemSended(context));
    buttons.push(localButtons.approveItemSended(context));
    buttons.push(localButtons.requireJustificationItem(context));
    
    return buttons;
}

informePeriodoPage.methods.getMultiItemsSelectedButtons = function(items){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    return buttons;
}

informePeriodoPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    return buttons;
}

informePeriodoPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();

    if (context.coordinadoresId.length > 0){
        return ''+
        '<And><And><In>'+
            '<FieldRef Name="Coordinador" LookupId="TRUE"/>'+
                '<Values>'+buildInCaml(context.coordinadoresId,'LookUp')+'</Values>'+
        '</In><Eq>'+
            '<FieldRef Name="Estado" />'+
                '<Value Type="Choice">Enviado para aprobar</Value>'+
        '</Eq></And><Eq>'+
            '<FieldRef Name="Periodo" LookupId="TRUE"/>'+
                '<Value Type="Lookup">'+context.periodId+'</Value>'+
        '</Eq></And>'  
    } else {
        return ''+
            '<Eq>'+
                '<FieldRef Name="Estado" />'+
                    '<Value Type="Choice">Nono</Value>'+
            '</Eq>'  
    }
}