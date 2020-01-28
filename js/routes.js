// funciona auxiliar para hacer console.log as l('var')
l = function() {
    try {
        for(k in arguments){
            console.log(arguments[k]);
        }
    } catch(e){}
}

// sobre escribiendo el metodo
listStreamPage.methods.onItemDblClick = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
        context = self._getPageContext();
    
    switch (page.route.query.title){
        case 'Periodos':
            mainView.router.navigate('/periodo?listItemId='+item.ID);        
            break;
    }
}

// sobre escribiendo el metodo
listStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
        context = self._getPageContext();

    var editPeriodButton = {
        text: 'Editar',
        class: 'editPeriodo',
        icon: 'Edit',
        onClick: function(component, item){
            mainView.router.navigate('/periodo?listItemId='+item.ID);        
        }
    }
    var desactivatePeriodoButton = {
        text: 'Desactivar Periodo',
        class: 'desactivatePeriodo',
        icon: 'PowerButton',
        onClick: function(component, item){
            var dialogTitle = 'Desactivando periodo';
            function save() {
                var dialog = app.dialog.progress(dialogTitle);

                spo.updateListItem(spo.getSiteUrl(), "Periodo", item.ID, {"Activo":false}, function (response) {
                    dialog.close();

                    app.dialog.create({
                        title: dialogTitle,
                        text: 'Desactivado con éxito',
                        buttons: [{
                            text: 'Aceptar',
                            onClick: function () {
                                location.reload(true);
                            }
                        }],
                        verticalButtons: false
                    }).open();


                }, function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log('responseText', responseText);

                    dialog.close();
                    app.dialog.create({
                        title: 'Error al guardar el periodo',
                        text: responseText.error.message.value,
                        buttons: [{
                            text: 'Aceptar'
                        }],
                        verticalButtons: false
                    }).open();
                });
            }
            app.dialog.create({
                title: dialogTitle,
                text: 'Se desactivará el periodo seleccionado.',
                buttons: [{
                    text: 'Cancelar'
                }, {
                    text: 'Aceptar',
                    onClick: function onClick() {
                        save();
                    }
                }],
                verticalButtons: false
            }).open();
        }
    }
    var activatePeriodoButton = {
        text: 'Activar Periodo',
        class: 'activatePeriodo',
        icon: 'PowerButton',
        onClick: function(component, item){
            var query = spo.encodeUrlListQuery(context.list, {
                view: 'Todos los elementos',
                odata: {
                    'filter': '(Activo eq 1)'
                }
            });

            spo.getListItems(spo.getSiteUrl(), context.list.Title, query,
                function (response) {
                    if (response.d.results.length>0){
                        app.dialog.create({
                            title: 'No se puede activar este periodo',
                            text: "Hay otro periodo activo",
                            buttons: [{
                                text: 'Aceptar'
                            }],
                            verticalButtons: false
                        }).open();
                    } else {
                        var dialogTitle = 'Activando periodo';
                        function save() {
                            var dialog = app.dialog.progress(dialogTitle);

                            spo.updateListItem(spo.getSiteUrl(), "Periodo", item.ID, {"Activo":true}, function (response) {
                                dialog.close();

                                app.dialog.create({
                                    title: dialogTitle,
                                    text: 'Activado con éxito',
                                    buttons: [{
                                        text: 'Aceptar',
                                        onClick: function () {
                                            location.reload(true);
                                        }
                                    }],
                                    verticalButtons: false
                                }).open();


                            }, function (response) {
                                var responseText = JSON.parse(response.responseText);
                                console.log('responseText', responseText);

                                dialog.close();
                                app.dialog.create({
                                    title: 'Error al guardar el periodo',
                                    text: responseText.error.message.value,
                                    buttons: [{
                                        text: 'Aceptar'
                                    }],
                                    verticalButtons: false
                                }).open();
                            });
                        }
                        app.dialog.create({
                            title: dialogTitle,
                            text: 'Se activará el periodo seleccionado.',
                            buttons: [{
                                text: 'Cancelar'
                            }, {
                                text: 'Aceptar',
                                onClick: function onClick() {
                                    save();
                                }
                            }],
                            verticalButtons: false
                        }).open();
                    }


                },
                function (response) {
                    var responseText = JSON.parse(response.responseText);
                    console.log(responseText.error.message.value);
                }
            );
        }
    }
    
    if (self.allowUpdateItem()){
        buttons.push(editPeriodButton);
    }
    
    if (self.allowDeleteItem()){
        buttons.push(context.navbar.deleteButton);
    }

    switch (page.route.query.title){
        case 'Periodos':
            if (item.Activo == "Sí"){
                buttons.push(desactivatePeriodoButton)
            } else {
                buttons.push(activatePeriodoButton)
            }
            break;
    }
    return buttons;

}

// sobre escribiendo el metodo
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
    }
    return buttons;
}

// sobre escribiendo el metodo (IMPORTANTE)
listStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var urlQuery = page.route.query;
    var currentUserId = spo.getCurrentUserId();

    console.log('context', context);

    if (page.route.query.context == 'tareas'){
        var cond = '<Eq><FieldRef Name="Encargado" LookupId="TRUE" /><Value Type="Lookup">' +
            usuarioId + '</Value></Eq>';
        return cond;
    } else if (page.route.query.context == 'usuarios'){
        return ''
    } else {
        return ''
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
