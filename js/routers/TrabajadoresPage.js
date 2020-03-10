var trabajadoresPage = $.extend(true, {}, listStreamPage)

trabajadoresPage.methods.allowChangeTemplate = function(){
    return false;
}

trabajadoresPage.methods.getListView = function(){
    return "Trabajadores por Coordinadores"
}

trabajadoresPage.methods.getTitle = function(){
    return "Trabajadores por Coordinadores"
}

trabajadoresPage.methods.getListTitle = function(){
    return "Planta"
}

trabajadoresPage.methods.onItemDblClick = function(item){
   return(false)
}

trabajadoresPage.methods.getListView = function(){
    // if (admin == "Administrador") {
    //     return "Mantenedor Coordinador"    
    // } else if (admin == "Coordinador"){
    //     return "Personas Asociadas"
    // }    
}

trabajadoresPage.methods.beforeStartComponent = function(success,failure){
    var page = this._getPage();
    var context = this._getPageContext();
    var listItemId = page.route.query.listItemId;
    spo.getListInfo('Planta',
        function (response) {
            var query = spo.encodeUrlListQuery(response, {
                view: 'Trabajadores por coordinadores',
                odata: {
                    'top': 5000,
                    'filter': 'CoordinadorId ne ' + listItemId,
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

trabajadoresPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var listItemId = page.route.query.listItemId;
//aqui puse la query que me salio en la consola de la pagina
     return '<Neq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">'+listItemId+'</Value></Neq>'
}

trabajadoresPage.methods.getMultiItemsSelectedButtons = function(){
    var self = this,
    page = self._getPage(),
    context = self._getPageContext(),
    buttons = [];
    var coordinador = page.route.query.listItemId;

    buttons.push(localButtons.addListTrabajadoresButton(context, coordinador));
    

    return buttons;
}
trabajadoresPage.methods.getOneItemSelectedButtons = function(){
    var self = this,
    page = self._getPage(),
    context = self._getPageContext(),
    buttons = [];
    var coordinador = page.route.query.listItemId;

    buttons.push(localButtons.addListTrabajadorButton(context, coordinador));

    return buttons;
}
trabajadoresPage.methods.getNoItemsSelectedButtons = function(){return []}