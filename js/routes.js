// funciona auxiliar para hacer console.log as l('var')
l = function() {
    try {
        for(k in arguments){
            console.log(arguments[k]);
        }
    } catch(e){}
}

listStreamPage.methods.beforeStartComponent = function(success,failure){
    var context = this._getPageContext();
    switch (context.title){
        case 'Items variables':
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
            break;
        case 'Informes':
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
            break;
        case 'Informes Desaprobados':
            loaded = {}
            function startPendingComponent(){
                if (loaded.Coordinador && loaded.Periodo){
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
                            startPendingComponent()
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
                            loaded.Coordinador = true;
                            startPendingComponent()
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
            break;
        default:
            if (success) success();
            break;
    }
}

listStreamPage.methods.onItemDblClick = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
        context = self._getPageContext();
    
    switch (page.route.query.title){
        case 'Periodos':
            mainView.router.navigate('/periodo?listItemId='+item.ID);        
            break;
        case 'ItemsVariables':
            mainView.router.navigate('/itemVariable?listItemId='+item.ID);
            break;
    }
}

listStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
        context = self._getPageContext();

    switch (page.route.query.title){
        case 'Periodos':
            if (self.allowUpdateItem()){
                buttons.push(localButtons.editPeriodButton());
            }
            if (item.Activo == "Sí"){
                buttons.push(localButtons.desactivatePeriodoButton());
            } else {
                buttons.push(localButtons.activatePeriodoButton(context));
            }
            break;
        case 'Informes':
            buttons.push(localButtons.disableItemSended(context));
            if (admin == "Aprobador"){
                buttons.push(localButtons.approveItemSended(context));
            } else if (admin == "Administrador"){
                buttons.push(localButtons.approveAdminItemSended(context));
                buttons.push(localButtons.requireJustificationItem(context));
            }
            break;
        case 'Informes Desaprobados':
            if (item.Estado == "En espera de justificación") {
                buttons.push(localButtons.sendJustification(context));
            }
        default:
            break;
    }
    return buttons;

}

listStreamPage.methods.multiItemsSelectedButtons = function(item){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
    return buttons
}

listStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
    
    switch (page.route.query.title){
        case 'Planta':
            buttons.push(localButtons.fileButton());    
            break;
        case 'Periodos':
            buttons.push(localButtons.addPeriodButton(context));
            break;
        case 'Items variables':
            if (context.informes.length == 0 ) {
                buttons.push(localButtons.sendButton(context));
            } else {
                if (context.informes[0].Estado == "Desaprobado"){
                    buttons.push(localButtons.sendButton(context));
                }
            }
            
            break;
    }
    return buttons;
}

listStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var urlQuery = page.route.query;

    function buildInCaml(array, type){
        var query = '';
        array.forEach(function(element) {
            var value = '<Value Type="'+ type +'">'+ element +'</Value>'
            query = query + value;
        });
        return query;
    }

    switch (urlQuery.title){
        case 'Items variables':
            if (context.informes.length == 0 ) {
                return '<And><Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">'+context.coorId+'</Value></Eq><Eq><FieldRef Name="Periodo" LookupId="TRUE"/><Value Type="Lookup">'+context.periodId+'</Value></Eq></And>'
            } else {
                if (context.informes[0].Estado == "Desaprobado"){
                    return '<And><Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">'+context.coorId+'</Value></Eq><Eq><FieldRef Name="Periodo" LookupId="TRUE"/><Value Type="Lookup">'+context.periodId+'</Value></Eq></And>'
                } else {
                    return '<Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">Nono</Value></Eq>'
                }
            }

        case 'Informes':
            if (admin=="Aprobador"){
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
            } else if (admin == "Administrador"){
                return '<And><Eq><FieldRef Name="Estado" LookupId="TRUE"/><Value Type="Lookup">Aprobado y enviado a administración</Value></Eq><Eq><FieldRef Name="Periodo" LookupId="TRUE"/><Value Type="Lookup">'+context.periodId+'</Value></Eq></And>'
            }
        case 'Informes Desaprobados':
            return ''+
                    '<And><Eq>'+
                        '<FieldRef Name="Coordinador" LookupId="TRUE"/>'+
                            '<Value Type="Lookup">'+context.coorId+'</Value>'+
                    '</Eq><Eq>'+
                        '<FieldRef Name="Periodo" LookupId="TRUE"/>'+
                            '<Value Type="Lookup">'+context.periodId+'</Value>'+
                    '</Eq></And>'  
    }
}

function getRoutes(){
    return [
        {
            path: '/liststream',
            component: listStreamPage
        },
        {
            path: '/menu',
            component: menuPage
        },
        {
            path: '/homepage',
            component: homePage
        },
        {
            path: '/item',
            component: itemPage
        },
        {
            path: '/periodo',
            component: periodoPage
        },
        {
            path: '/itemVariable',
            component: itemVariablePage
        },
        {
            path: '/uploadPlanta',
            component: uploadPlantaPage
        },
        // Default route (404 page). MUST BE THE LAST
        {
            path: '(.*)',
            url: './pages/404.html',
        },
    ];

}

// cambiar los colores :D
function efwSwapTheme(newT){
    global.theme = newT;
    global["currentThemeCSS"].href = "https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/themes/" + newT + "/" + newT + ".css";
    l(global["currentThemeCSS"])
    localStorage.setItem('globalTheme', newT)
}
