var trabajadoresStreamPage = $.extend(true, {}, listStreamPage)

trabajadoresStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

trabajadoresStreamPage.methods.getListView = function(){
    return "Trabajadores por Coordinadores"
}

trabajadoresStreamPage.methods.getListTitle = function(){
    return "Planta"
}

trabajadoresStreamPage.methods.onItemDblClick = function(item){
   return false
}

trabajadoresStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var listItemId = page.route.query.listItemId;
    //aqui puse la query que me salio en la consola de la pagina
     return '<Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">'+listItemId+'</Value></Eq>'
}

trabajadoresStreamPage.methods.getMultiItemsSelectedButtons = function(){
    var self = this,
    page = self._getPage(),
    context = self._getPageContext(),
    buttons = [];

    buttons.push(localButtons.deleteListTrabajadoresButton(context));

    return buttons;
}

trabajadoresStreamPage.methods.getOneItemSelectedButtons = function(){
    var self = this,
    page = self._getPage(),
    context = self._getPageContext(),
    buttons = [];
    
    buttons.push(localButtons.deleteTrabajador(context));

    return buttons;
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

trabajadoresStreamPage.methods.beforeStartComponent = function(success,failure){
    var page = this._getPage();
    var context = this._getPageContext();
    var listItemId = page.route.query.listItemId;
    loaded = {};
    var shouldInitForms = function () {
        if (loaded.coo){
            if (success) success();
        } 
    }
    spo.getListInfo('Planta',
        function (response) {
            var query = spo.encodeUrlListQuery(response, {
                view: 'Todos los elementos',
                odata: {
                    'filter': '(ID eq '+listItemId+')'
                }
            });
            spo.getListItems(spo.getSiteUrl(), "Planta", query,
                function (response) {
                    context.coo = response.d.results.length>0 ? response.d.results[0] : null;
                    loaded.coo = true;
                    shouldInitForms()
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

trabajadoresStreamPage.methods.renderHeader = function($header){
        var context = this._getPageContext();
        var name = '';
        if(context.coo){
            name = context.coo.Nombre+' '+context.coo.ApellidoPaterno+' '+context.coo.ApellidoMaterno;
        }

        var title = "Colaboradores por coordinador: "+ name;

    // tempalte con titulo, descripción opcional y un tabs
    var templateHtml = `
        <div class="form-header">
            <div class="Title" style="margin-left: 5%; margin-right: 5%; margin-top: 8px; margin-buttom: 10px; font-size: 20px;">` + title +  `</div>
        </div>
    `;

    // agregar html
    $header.html(templateHtml);
}


