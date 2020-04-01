var licenciaStreamPage = $.extend(true, {}, listStreamPage)

licenciaStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

licenciaStreamPage.methods.getListView = function(){
    return "Todos los elementos"
}

licenciaStreamPage.methods.getTitle = function(){
    return "Licencias Médicas"
}

licenciaStreamPage.methods.getListTitle = function(){
    return "Licencia"
}

licenciaStreamPage.methods.beforeStartComponent = function(success,failure){
    var context = this._getPageContext();
    spo.getListInfo('Licencia',
        function (response) {
            var query = spo.encodeUrlListQuery(response, {
                view: 'Todos los elementos',
                odata: {
                    'top': 1
                }
            });
            spo.getListItems(spo.getSiteUrl(), "Licencia", query,
                function (response) {
                    context.lastLicencia = response.d.results.length>0 ? response.d.results[0] : null;
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

licenciaStreamPage.methods.onItemDblClick = function(item){
    // mainView.router.navigate('/periodo?listItemId='+item.ID);    
    return false    
}

licenciaStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    // if (self.allowUpdateItem()){
    //     buttons.push(localButtons.editPeriodButton());
    // }
    // if (item.Activo == "Sí"){
    //     buttons.push(localButtons.desactivatePeriodoButton());
    // } else {
    //     buttons.push(localButtons.activatePeriodoButton(context));
    // }
   
    return buttons;
}

licenciaStreamPage.methods.getMultiItemsSelectedButtons = function(items){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    return buttons;
}

licenciaStreamPage.methods.getNoItemsSelectedButtons = function(item){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    // buttons.push(localButtons.addPeriodButton(context));

    return buttons;
}

licenciaStreamPage.methods.afterFilterComponentInitializated = function () {
    var self = this;
    var context = self._getPageContext();
    var page = self._getPage();

    console.log(context.lastLicencia)
    console.log(context)
    if (context.lastLicencia){
        let anio = context.lastLicencia.MES_PROCESO.AnioCalculado
        let mes = context.lastLicencia.MES_PROCESO.MesCalculado
        context.components.itemsFilter.inputs.MES_PROCESO_x003a_AnioCalculado.setValue([{text: anio}]);
        context.components.itemsFilter.inputs.MES_PROCESO.setValue([{text: mes}]);

        var element = "<div class='added-filter' style='padding: 10px 0px 0px 20px; margin-top:0px;'><h4 style='margin-top:0px; margin-bottom:0px;'>Se están mostrando las licencias del último periodo registrado</h4>"
        element += "<p style='margin-top: 0px; margin-bottom: 5px;'>"+ mes +" - "+ anio +"</p>"
        element += "</div>"
        $(page.pageEl).find('.liststreampage-page-content-header').last().parent().last().append(element)
    }
    $(page.navbarEl).find('a.filter').click();
}

licenciaStreamPage.methods.onFilterCallback = function(filters){
    var self = this;
    var page = self._getPage();

    console.log(filters)
}
