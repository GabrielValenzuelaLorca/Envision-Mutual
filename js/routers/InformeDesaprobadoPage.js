var informePendientePage = $.extend(true, {}, listStreamPage)

informePendientePage.methods.allowChangeTemplate = function(){
    return false;
}

informePendientePage.methods.getListView = function(){
    return "Pendientes"
}

informePendientePage.methods.getTitle = function(){
    return "Informes Pendientes"
}

informePendientePage.methods.getListTitle = function(){
    return "Informe Haberes"
}

informePendientePage.methods.onItemDblClick = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
        context = self._getPageContext();
    
        // case 'Informes Desaprobados':
        // case 'Informes':
        // case 'Informes Históricos':
        mainView.router.navigate('/informe?listItemId='+item.ID);
}

informePendientePage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    return buttons;
}

informePendientePage.methods.beforeStartComponent = function(success,failure){
    var context = this._getPageContext();
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
}

informePendientePage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    if (item.Estado == "En espera de justificación") {
        buttons.push(localButtons.sendJustification(context));
    }

    return buttons;
}

informePendientePage.methods.getMultiItemsSelectedButtons = function(items){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    return buttons;
}

informePendientePage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var urlQuery = page.route.query;

    return ''+
        '<And><Eq>'+
            '<FieldRef Name="Coordinador" LookupId="TRUE"/>'+
                '<Value Type="Lookup">'+context.coorId+'</Value>'+
        '</Eq><Eq>'+
            '<FieldRef Name="Periodo" LookupId="TRUE"/>'+
                '<Value Type="Lookup">'+context.periodId+'</Value>'+
        '</Eq></And>'  
}