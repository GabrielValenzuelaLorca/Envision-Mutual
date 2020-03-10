var trabajadoresStreamPage = $.extend(true, {}, listStreamPage)

trabajadoresStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

trabajadoresStreamPage.methods.getListView = function(){
    return "Trabajadores por Coordinadores"
}

trabajadoresStreamPage.methods.getTitle = function(){
    return "Trabajadores por Coordinadores"
}

trabajadoresStreamPage.methods.getListTitle = function(){
    return "Planta"
}

trabajadoresStreamPage.methods.onItemDblClick = function(item){
   return(false)
}

trabajadoresStreamPage.methods.getListView = function(){
    // if (admin == "Administrador") {
    //     return "Mantenedor Coordinador"    
    // } else if (admin == "Coordinador"){
    //     return "Personas Asociadas"
    // }    
}

trabajadoresStreamPage.methods.beforeStartComponent = function(success,failure){
    var page = this._getPage();
    var context = this._getPageContext();
    console.log('context', trabajadoresStreamPage.methods)
    var listItemId = page.route.query.listItemId
    spo.getListInfo('Planta',
        function (response) {
            var query = spo.encodeUrlListQuery(response, {
                view: 'Trabajadores por coordinadores',
                odata: {
                    'filter': 'CoordinadorId eq ' + listItemId, 
                    'top': 5000 
                }
            });
            spo.getListItems(spo.getSiteUrl(), "Planta", query,
                function (response) {
                    context.planta = response.d.results.length>0 ? response.d.results: null;
                    loaded.Planta= true;
                    console.log('listado planta', context.planta) 
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

trabajadoresStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var listItemId = page.route.query.listItemId;
//aqui puse la query que me salio en la consola de la pagina
     return '<Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">'+listItemId+'</Value></Eq>'
}

trabajadoresStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}
trabajadoresStreamPage.methods.getOneItemSelectedButtons = function(){
    return false;
}
trabajadoresStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        listItemId = page.route.query.listItemId,
        buttons = [];

    buttons.push(localButtons.addTrabajadorButton(context, listItemId));

    return buttons;
}