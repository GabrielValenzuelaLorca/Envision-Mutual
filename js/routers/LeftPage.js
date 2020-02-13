var menuPage = $.extend(true, {}, indexPage);

menuPage.methods.beforeStartComponent = function(success, failure){
    var context = this._getPageContext();
    function informesCoordinador(){
        spo.getListInfo('Coordinador',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(UsuarioId eq '+spo.getCurrentUserId()+')'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), "Coordinador", query,
                    function (response) {
                        context.coordinadorId = response.d.results.length>0 ? response.d.results[0].ID : false;
                        spo.getListInfo('Informe Haberes',
                            function (response) {
                                var query = spo.encodeUrlListQuery(response, {
                                    view: 'Todos los elementos',
                                    odata: {
                                        'filter': '(CoordinadorId eq ' + context.coordinadorId + ' and PeriodoId eq '+context.onPeriod+')'
                                    }
                                });
                                spo.getListItems(spo.getSiteUrl(), "Informe Haberes", query,
                                    function (response) {
                                        context.informes = response.d.results;
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
                    context.onPeriod = response.d.results.length>0 ? response.d.results[0].ID : false;
                    if (admin == "Coordinador"){
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

// {array} obtiene las optiones de configuración para el menú
menuPage.methods.getListBlocksData = function(){
    var page = this._getPage();
    var app = page.app;
    var context = this._getPageContext();

    // configuración de menú
    var settings = []
    if (admin == "Coordinador"){
        let canSendInform = true;
        let coorSection = {
            inset: true,
            header: 'Coordinación',
            footer: '',
            options: []
        };
        
        if (context.informes.length > 0 ) {
            if (context.informes[0].Estado != "Desaprobado") 
            canSendInform = false;    
        }
        
        if (context.onPeriod && canSendInform){
            coorSection.options = coorSection.options.concat([ 
                {
                    href: '/item',
                    title: 'Nuevo item',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--BoxAdditionSolid"></i>',
                },
                {
                    href: '/liststream?title=Items variables&listtitle=ItemVariable&listview=Todos los elementos&panel=filter-close&template=list-row&context=',
                    title: 'Items variables',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--CheckList"></i>',
                },
                {
                    href: '/liststream?title=Informes Desaprobados&listtitle=Informe Haberes&listview=Pendientes&panel=filter-close&template=list-row&context=',
                    title: 'Informes',
                    after: '',
                    header: '',
                    footer: 'Desaprobados',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--Blocked"></i>',
                }
            ]);
        } else if (!context.onPeriod) {

            coorSection.footer = 'No hay un periodo vigente para añadir items';

        } else if (!context.canSendInform) {
            coorSection.footer = 'Tu informe ya ha sido enviado';
            coorSection.options = coorSection.options.concat([
                {
                    href: '/liststream?title=Informes Desaprobados&listtitle=Informe Haberes&listview=Pendientes&panel=filter-close&template=list-row&context=',
                    title: 'Informes',
                    after: '',
                    header: '',
                    footer: 'Desaprobados',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--Blocked"></i>',
                }
            ]);
        }

        coorSection.options = coorSection.options.concat([
            {
                href: '/liststream?title=Informes Históricos&listtitle=Informe Haberes&listview=Historico Coordinador&panel=filter-close&template=list-row&context=',
                title: 'Informes',
                after: '',
                header: '',
                footer: 'Históricos',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--AnalyticsReport"></i>',
            }
        ]);

        settings.push(coorSection);  
    }

    if (admin == "Aprobador"){
        let aprobSection = {
            inset: true,
            header: 'Aprobación',
            footer: '',
            options: []
        };
        if (context.onPeriod){
            aprobSection.options = aprobSection.options.concat([ 
                {
                    href: '/liststream?title=Informes&listtitle=Informe Haberes&listview=Aprobador&panel=filter-close&template=list-row&context=',
                    title: 'Informes',
                    after: '',
                    header: '',
                    footer: 'Items Variables',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--Documentation"></i>',
                }
            ])
        } else {

            aprobSection.footer = 'No hay un periodo vigente para mostrar informes por aprobar';

        }
        settings.push(aprobSection);
    } 

    if (admin == "Administrador"){
        let admSection = {
            inset: true,
            header: 'Administración',
            footer: '',
            options: []
        };

        if (context.onPeriod){
            admSection.options = admSection.options.concat([
                {
                    href: '/liststream?title=Informes&listtitle=Informe Haberes&listview=Administrador&panel=filter-close&template=list-row&context=',
                    title: 'Informes Pendientes',
                    after: '',
                    header: '',
                    footer: 'Items Variables',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--Documentation"></i>',
                }
            ]);
        } else {

            admSection.footer = 'No hay un periodo vigente para mostrar informes por aprobar';

        }

        admSection.options = admSection.options.concat([
            {
                href: '/liststream?title=Planta&listtitle=Planta&listview=Planta Usuario&panel=filter-open&template=list-row&context=',
                title: 'Planta',
                after: '',
                header: '',
                footer: '',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--People"></i>',
            },
            {
                href: '/liststream?title=Periodos&listtitle=Periodo&listview=Todos los elementos&panel=filter-open&template=list-row&context=',
                title: 'Periodos',
                after: '',
                header: '',
                footer: '',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--EventDate"></i>',
            },
            {
                href: '/liststream?title=ItemsVariables&listtitle=ListadoItemVariable&listview=Todos los elementos&panel=filter-close&template=list-row&context=',
                title: 'Mantenedor Haberes',
                after: '',
                header: '',
                footer: '',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--EventDate"></i>',
            },
            {
                href: '/liststream?title=Informes Históricos&listtitle=Informe Haberes&listview=Historico&panel=filter-close&template=list-row&context=',
                title: 'Informes',
                after: '',
                header: '',
                footer: 'Históricos',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--AnalyticsReport"></i>',
            }
        ]);
        settings.push(admSection);
    }

    return settings;
};

// {string} logo de empresa
menuPage.methods.getPageComponentImage = function(){
    return "https://grupoenvision.sharepoint.com/CDN/EFW/themes/" + global.theme + "/" + global.theme + ".png";
};