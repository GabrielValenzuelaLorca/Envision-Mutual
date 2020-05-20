var plantaStreamPage = $.extend(true, {}, listStreamPage)

plantaStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

plantaStreamPage.methods.getListView = function(){
    return "ListadoPlantaItemVariable"
}

plantaStreamPage.methods.getTitle = function(){
    return "Planta"
}

plantaStreamPage.methods.getListTitle = function(){
    return "Planta"
}

plantaStreamPage.methods.beforeStartComponent = function(success,failure){
    var context = this._getPageContext();
    loaded = {};
    function startItemComponent2(){
        if (loaded.globalState){
            success();
        }else{
            failure();
        }
    }
    spo.getListInfo('EstadosGlobales',
        function (response) {
            var query = spo.encodeUrlListQuery(response, {
                view: 'Todos los elementos',
                odata: {
                    'select' : '*',
                    'top': 5000
                }
            });

            spo.getListItems(spo.getSiteUrl(), "EstadosGlobales", query,
                function (response) {
                    context.globalState = response.d.results.length>0 ? response.d.results : null;
                    loaded.globalState = true;
                    startItemComponent2();
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

plantaStreamPage.methods.onItemDblClick = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
        context = self._getPageContext();
    
        // case 'Informes Desaprobados':
        // // case 'Informes':
        // // case 'Informes Históricos':
        // mainView.router.navigate('/informe?listItemId='+item.ID);
}

plantaStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    let cargandoPlanta = context.globalState.filter(function(x){
        return x.Title == 'ActualizandoPlanta'
    });
    if(cargandoPlanta[0].Value == 'NO'){
        buttons.push(localButtons.toCreateEmployeeForm());
        buttons.push(localButtons.toUploadPlanta());
    }else{
        app.dialog.create({
            title: 'Atención',
            text: 'En estos momentos se está realizando una carga masiva de planta. Usted sera notificado vía email cuando el proceso termine.',
            buttons: [{
                text: 'Aceptar'
            }],
            verticalButtons: false
        }).open();
    } 

    return buttons;
}

plantaStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];
    
    return buttons;
}

plantaStreamPage.methods.getMultiItemsSelectedButtons = function(items){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [];

    return buttons;
}

plantaStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();

    return `
        <Or>
            <Eq>
                <FieldRef Name="EstadoContrato" /><Value Type="Choice">Activo</Value>
            </Eq>
            <Eq>
                <FieldRef Name="EstadoContrato" /><Value Type="Choice">Pendiente</Value>
            </Eq>
        </Or>
    `
}