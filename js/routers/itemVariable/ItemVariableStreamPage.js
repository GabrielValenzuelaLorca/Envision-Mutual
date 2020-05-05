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
    // mainView.router.navigate('/itemVariable?listItemId='+item.ID);
    return;
}

itemVariableStreamPage.methods.beforeStartComponent = function(success,failure){
    var context = this._getPageContext();
    loaded = {}
    function startItemComponent(){
        if (loaded.Periodo){
            spo.getListInfo('Informe Haberes',
                function (response) {
                    var query = spo.encodeUrlListQuery(response, {
                        view: 'Todos los elementos',
                        odata: {
                            'filter': '(CoordinadorId eq ' + plantaAdmin.ID + ' and PeriodoId eq '+context.periodId+')'
                        }
                    });
                    spo.getListItems(spo.getSiteUrl(), "Informe Haberes", query,
                        function (response) {
                            context.informes = response.d.results;
                            spo.getListInfo('ItemVariable',
                                function (response) {
                                    var query = spo.encodeUrlListQuery(response, {
                                        view: 'Todos los elementos',
                                        odata: {
                                            'filter': '(CoordinadorId eq ' + plantaAdmin.ID + ' and PeriodoId eq '+context.periodId+')',
                                            'count': true
                                        }
                                    });
                                    spo.getListItems(spo.getSiteUrl(), "ItemVariable", query,
                                        function (response) {
                                            context.items = response.d.results;
                                            if(success) success();
                                            
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
}

itemVariableStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
    

    if(context.items.length > 0){
        if (context.informes.length == 0 ) {
            buttons.push(localButtons.sendButton(context));
        } else {
            if (context.informes[0].Estado == "Desaprobado"){
                buttons.push(localButtons.sendButton(context));
            }
        }
    }
    return buttons;
}

itemVariableStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [localButtons.deleteItemButton()];
    
    return buttons;
}

itemVariableStreamPage.methods.getMultiItemsSelectedButtons = function(items){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [localButtons.deleteItemsButton()];

    return buttons;
}

itemVariableStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var urlQuery = page.route.query;

    if (context.informes.length == 0 ) {
        return '<And><Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">'+plantaAdmin.ID+'</Value></Eq><Eq><FieldRef Name="Periodo" LookupId="TRUE"/><Value Type="Lookup">'+context.periodId+'</Value></Eq></And>'
    } else {
        if (context.informes[0].Estado == "Desaprobado"){
            return '<And><Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">'+plantaAdmin.ID+'</Value></Eq><Eq><FieldRef Name="Periodo" LookupId="TRUE"/><Value Type="Lookup">'+context.periodId+'</Value></Eq></And>'
        } else {
            return '<Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">Nono</Value></Eq>'
        }
    } 
}