var plantaStreamPage = $.extend(true, {}, listStreamPage)

plantaStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

plantaStreamPage.methods.getListView = function(){
    return "Planta Usuario"
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
                            context.estadosGlobales = response.d.results;
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

plantaStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    let cargandoPlanta = context.globalState.filter(function(x){
        return x.Title == 'ActualizandoPlanta'
    });
    if(cargandoPlanta[0].Value == 'NO'){
        buttons.push(localButtons.fileButton());
        
    }else{
        app.dialog.create({
            title: 'Atención',
            text: 'En estos momentos se está realizando una carga masiva de planta. Usted sera notificado via email cuando el proceso termine.',
            buttons: [{
                text: 'Aceptar'
            }],
            verticalButtons: false
        }).open();
    } 

    return buttons;
}

plantaStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();

    return `
        <And><Or><Eq>
            <FieldRef Name="EstadoContrato" />
                <Value Type="Choice">Activo</Value>
        </Eq><Eq>
            <FieldRef Name="EstadoContrato" />
                <Value Type="Choice">Pendiente</Value>
        </Eq></Or><Or><Eq>
            <FieldRef Name="EstadoContrato" />
                <Value Type="Choice">Activo</Value>
        </Eq><Eq>
            <FieldRef Name="EstadoContrato" />
                <Value Type="Choice">Pendiente</Value>
        </Eq></Or></And>
    `
}