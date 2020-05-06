var menuPage = $.extend(true, {}, indexPage);

menuPage.methods.beforeStartComponent = function(success, failure){
    var context = this._getPageContext();
    loaded = {}

    function shouldStart(){
        if (loaded.Informe && loaded.Planta && loaded.Categoria && loaded.Item) {
            if (success) success();   
        }
    }

    function informesCoordinador(){
        //Carga Informe Haberes
        spo.getListInfo('Informe Haberes',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(CoordinadorId eq ' + plantaAdmin.ID + ' and PeriodoId eq '+context.onPeriod.ID+')'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), "Informe Haberes", query,
                    function (response) {
                        context.informes = response.d.results;
                        loaded.Informe = true;
                        shouldStart();
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

        //Carga Planta del coordinador
        spo.getListInfo('Planta',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(Coordinador eq ' + plantaAdmin.ID + ')',
                        'top': 5000
                        
                    }
                });
                spo.getListItems(spo.getSiteUrl(), "Planta", query,
                    function (response) {
                        context.planta = response.d.results;
                        loaded.Planta = true;
                        shouldStart();                                 
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

        //Carga Categorias del coordinador
        spo.getListInfo('Categoria',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'top': 5000
                        
                    }
                });
                spo.getListItems(spo.getSiteUrl(), "Categoria", query,
                    function (response) {
                        context.Categoria = response.d.results;
                        loaded.Categoria = true;
                        shouldStart();                                  
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

        //Carga Haberes del coordinador
        spo.getListInfo('ListadoItemVariable',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'top': 5000,
                        'select': '*'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), "ListadoItemVariable", query,
                    function (response) {
                        context.haber = response.d.results;
                        loaded.Item = true;
                        shouldStart();                      
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
                    context.onPeriod = response.d.results.length>0 ? response.d.results[0] : false;
                    if (plantaAdmin.Rol == "Coordinador" && context.onPeriod){
                        informesCoordinador();    
                    } else {
                        if (success) success();
                    }
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

// {array} obtiene las opciones de configuración para el menú
menuPage.methods.getListBlocksData = function(){
    var page = this._getPage();
    var app = page.app;
    var context = this._getPageContext();

    /*** 
     * Seccion Item Variable
     * ***/
    debugger
    return app.data.roleHandler.getOptions(context);
};

// {string} logo de empresa
menuPage.methods.getPageComponentImage = function(){
    return global.uris[global.env].tema;
};


//----------

var menuHomePage = $.extend(true, {}, indexPage);
// {array} obtiene las opciones de configuración para el menú
menuHomePage.methods.getListBlocksData = function(){
    var page = this._getPage();
    var app = page.app;
    var context = this._getPageContext();

    var settings = [{
        inset: true,
        header: 'Coordinación',
        footer: '',
        options: [{
            href: '/homePage',
            title: 'Home',
            after: '',
            header: '',
            footer: '',
            panelClose: true,
            externalLink: false,
            f7view: '.view-main',
            media: '<i class="ms-Icon ms-Icon--Home"></i>',
        }]
    }]


    return settings;
};

// {string} logo de empresa
menuPage.methods.getPageComponentImage = function(){
    return global.uris[global.env].tema;
};

menuPage.methods.getTitle = function(){
    return plantaAdmin.NombreCompleto
}
