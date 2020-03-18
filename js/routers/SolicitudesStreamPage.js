var SolicitudesStreamPage = $.extend(true, {}, listStreamPage)

var self = SolicitudesStreamPage;
    var context = self.methods._getPageContext();
    var page = self.methods._getPage();

SolicitudesStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

SolicitudesStreamPage.methods.getListView = function(){
    if (plantaAdmin.Rol == "Coordinador"){
        return "Solicitud centro de costo" 
    }else if (plantaAdmin.Rol == "Administrador"){
        return "Solicitud centro de costo Admin"
    }
}

SolicitudesStreamPage.methods.getTitle = function(){
    return "Portal de solicitudes filtradas por el período actual" 
}

SolicitudesStreamPage.methods.getListTitle = function(){
    return "Solicitudes"
}

SolicitudesStreamPage.methods.onItemDblClick = function(item){
    mainView.router.navigate('/Solicitud?listItemId='+item.ID);
}

SolicitudesStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
        if(plantaAdmin.Rol == "Coordinador"){
            buttons.push(localButtons.toSolicitudPage());
        }else if (plantaAdmin.Rol == "Administrador"){
            buttons = [];
        }
            
    return buttons;
}

SolicitudesStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    buttons.push(localButtons.resolveRequest());

    return buttons;
}

SolicitudesStreamPage.methods.getMultiItemsSelectedButtons = function(items){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];
    
    return buttons;
}

SolicitudesStreamPage.methods.beforeStartComponent = function(success,failure){
    var context = this._getPageContext();
    loaded = {};
    var shouldInitForms = function () {
        if (loaded.Periodo){
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
                    context.periodId = response.d.results.length>0 ? response.d.results[0] : null;
                    loaded.Periodo = true;
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

SolicitudesStreamPage.methods.afterFilterComponentInitializated = function () {
    var self = this;
    var context = self._getPageContext();
    var page = self._getPage();

    if(plantaAdmin.Rol == "Administrador"){
        if (context.periodId){
            let periodo = context.periodId.PeriodoCompleto;
            context.components.itemsFilter.inputs.Periodo.setValue([{key: context.periodId.ID ,text: periodo}]);
        }
    }
    $(page.navbarEl).find('a.filter').click();
}

SolicitudesStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var urlQuery = page.route.query;
    if (plantaAdmin.Rol == "Coordinador") {
        return '<And><Eq><FieldRef Name="Coordinador" LookupId="TRUE"/><Value Type="Lookup">'+ plantaAdmin.ID +'</Value></Eq><Eq><FieldRef Name="Periodo" LookupId="TRUE"/><Value Type="Lookup">'+ context.periodId.ID+'</Value></Eq></And>'
    }
}