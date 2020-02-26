var itemVariableStreamPage = $.extend(true, {}, listStreamPage)

itemVariableStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

itemVariableStreamPage.methods.getListView = function(){
    return "Coordinador"    
}

itemVariableStreamPage.methods.getTitle = function(){
    return "Items Variables"
}

itemVariableStreamPage.methods.getListTitle = function(){
    return "ItemVariable"
}

itemVariableStreamPage.methods.onItemDblClick = function(item){
    //mainView.router.navigate('/itemVariable?listItemId='+item.ID);
}

itemVariableStreamPage.methods.beforeStartComponent = function(success,failure){
    var context = this._getPageContext();
    loaded = {}
    function startItemComponent(){
        if (loaded.Coordinador && loaded.Periodo){
            spo.getListInfo('Informe Haberes',
                function (response) {
                    var query = spo.encodeUrlListQuery(response, {
                        view: 'Todos los elementos',
                        odata: {
                            'filter': '(CoordinadorId eq ' + context.coorId + ' and PeriodoId eq '+context.periodId+')'
                        }
                    });
                    spo.getListItems(spo.getSiteUrl(), "Informe Haberes", query,
                        function (response) {
                            context.informes = response.d.results;
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
                    startItemComponent()
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
    spo.getListInfo('Coordinador',
        function (response) {
            var query = spo.encodeUrlListQuery(response, {
                view: 'Todos los elementos',
                odata: {
                    'filter': '(UsuarioId eq '+ spo.getCurrentUserId() +')',
                    'select': '*,AttachmentFiles',
                    'expand': 'AttachmentFiles'
                }
            });
            spo.getListItems(spo.getSiteUrl(), "Coordinador", query,
                function (response) {
                    context.coorId = response.d.results.length>0 ? response.d.results[0].ID : null;
                    context.Aprobador = response.d.results[0].Aprobador.Title;
                    loaded.Coordinador = true;
                    startItemComponent()
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

itemVariableStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
    
    if (context.informes.length == 0 ) {
        buttons.push(localButtons.sendButton(context));
    } else {
        if (context.informes[0].Estado == "Desaprobado"){
            buttons.push(localButtons.sendButton(context));
        }
    }
    return buttons;
}

itemVariableStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var urlQuery = page.route.query;

    if (context.informes.length == 0 ) {
        return '<And><Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">'+context.coorId+'</Value></Eq><Eq><FieldRef Name="Periodo" LookupId="TRUE"/><Value Type="Lookup">'+context.periodId+'</Value></Eq></And>'
    } else {
        if (context.informes[0].Estado == "Desaprobado"){
            return '<And><Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">'+context.coorId+'</Value></Eq><Eq><FieldRef Name="Periodo" LookupId="TRUE"/><Value Type="Lookup">'+context.periodId+'</Value></Eq></And>'
        } else {
            return '<Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">Nono</Value></Eq>'
        }
    } 
}