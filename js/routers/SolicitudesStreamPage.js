var SolicitudesStreamPage = $.extend(true, {}, listStreamPage)

SolicitudesStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

SolicitudesStreamPage.methods.getListView = function(){
    return "Solicitud centro de costo"    
}

SolicitudesStreamPage.methods.getTitle = function(){
    return "Solicitudes de centro de Costo"
}

SolicitudesStreamPage.methods.getListTitle = function(){
    return "Solicitudes"
}

SolicitudesStreamPage.methods.onItemDblClick = function(item){
    // mainView.router.navigate('/itemVariable?listItemId='+item.ID);
}

SolicitudesStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
        buttons.push(localButtons.toSolicitudPage());
    return buttons;
}

SolicitudesStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];
    
    return buttons;
}

SolicitudesStreamPage.methods.getMultiItemsSelectedButtons = function(items){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];
    
    return buttons;
}

SolicitudesStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var urlQuery = page.route.query;

     return `
        <And>
            <And>
                <Eq>
                    <FieldRef Name="TipoSolicitud" /><Value Type="Choice">Centro de costo diferente</Value>
                </Eq>
                <Eq>
                    <FieldRef Name="Periodo" LookupId="TRUE"/><Value Type="Lookup">${context.periodId.ID}</Value>
                </Eq>
            </And>
            <Eq>
                <FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">${context.coorId}</Value>
            </Eq>
        </And>
    `
}

SolicitudesStreamPage.methods.beforeStartComponent = function(success,failure){
    var context = this._getPageContext();
    loaded = {};
    function startItemComponent(){
        if (loaded.Periodo && loaded.Coordinador){
            console.log('Hola')
            success();
            return;
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
                    context.periodId = response.d.results.length>0 ? response.d.results[0] : null;
                    console.log('perodId',context.periodId )
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
                    'select': '*'
                }
            });
            spo.getListItems(spo.getSiteUrl(), "Coordinador", query,
                function (response) {
                    context.coorId = response.d.results.length>0 ? response.d.results[0].ID : null;
                    console.log('context.coorId', context.coorId)
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