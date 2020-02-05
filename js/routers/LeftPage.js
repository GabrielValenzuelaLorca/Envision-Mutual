var menuPage = $.extend(true, {}, indexPage);

menuPage.methods.beforeStartComponent = function(success, failure){
    var context = this._getPageContext();

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
                    context.onPeriod = response.d.results.length>0 ? true : false;
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

// {array} obtiene las optiones de configuración para el menú
menuPage.methods.getListBlocksData = function(){
    var page = this._getPage();
    var app = page.app;
    var context = this._getPageContext();

    // configuración de menú
    var settings = []
    if (admin == "Coordinador" || admin=="Administrador"){
        if (context.onPeriod){
            settings.push({
                inset: true,
                header: 'Coordinación',
                footer: '',
                options: [ 
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
                    }
                ]
            });
        } else {
            settings.push({
                inset: true,
                header: 'Coordinación',
                footer: 'No hay un periodo vigente para añadir items',
                options: []
            });
        }  
    }

    if (admin == "Aprobador"){
        if (context.onPeriod){
            settings.push({
                inset: true,
                header: 'Aprobación',
                footer: '',
                options: [ 
                    {
                        href: '/liststream?title=Informes&listtitle=Informe Haberes&listview=Todos los elementos&panel=filter-close&template=list-row&context=',
                        title: 'Informes',
                        after: '',
                        header: '',
                        footer: 'Items Variables',
                        panelClose: true,
                        externalLink: false,
                        f7view: '.view-main',
                        media: '<i class="ms-Icon ms-Icon--Documentation"></i>',
                    }
                ]
            });
        } else {
            settings.push({
                inset: true,
                header: 'Aprobación',
                footer: 'No hay un periodo vigente para mostrar informes por aprobar',
                options: []
            });
        }
    } 

    if (admin == "Administrador"){
        options = [];
        if (context.onPeriod){
            options.push( 
                {
                    href: '/liststream?title=Informes&listtitle=Informe Haberes&listview=Todos los elementos&panel=filter-close&template=list-row&context=',
                    title: 'Informes',
                    after: '',
                    header: '',
                    footer: 'Items Variables',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--Documentation"></i>',
                }
            )
        } else {
            options.push( 
                {
                    href: '#',
                    title: 'Informes',
                    after: '',
                    header: 'Sin periodo vigente',
                    footer: 'Items Variables',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--Documentation"></i>',
                }
            )
        }

        commonOptions = [
            {
                href: '/liststream?title=Planta&listtitle=Planta&listview=No Capex&panel=filter-open&template=list-row&context=',
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
            }
        ]

        options = options.concat(commonOptions)

        settings.push({
            inset: true,
            header: 'Administración',
            footer: '',
            collapsable: false,
            collapsed: false,
            options: options
        });
    }

    return settings;
};

// {string} logo de empresa
menuPage.methods.getPageComponentImage = function(){
    return "https://grupoenvision.sharepoint.com/CDN/EFW/themes/" + global.theme + "/" + global.theme + ".png";
};