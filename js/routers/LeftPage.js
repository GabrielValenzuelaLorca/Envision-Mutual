var menuPage = $.extend(true, {}, indexPage);

menuPage.methods.beforeStartComponent = function(success, failure){
    var context = this._getPageContext();
    function informesCoordinador(){
        spo.getListInfo('Coordinador',
            function (response) {
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(UsuarioId eq '+spo.getCurrentUserId()+')',
                        'select': '*'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), "Coordinador", query,
                    function (response) {
                        context.coordinadorId = response.d.results.length>0 ? response.d.results[0] : false;
                        //Carga Informe Haberes
                        spo.getListInfo('Informe Haberes',
                            function (response) {
                                var query = spo.encodeUrlListQuery(response, {
                                    view: 'Todos los elementos',
                                    odata: {
                                        'filter': '(CoordinadorId eq ' + context.coordinadorId.ID + ' and PeriodoId eq '+context.onPeriod+')'
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

                        //Carga Planta del coordinador
                        spo.getListInfo('Planta',
                            function (response) {
                                var query = spo.encodeUrlListQuery(response, {
                                    view: 'Todos los elementos',
                                    odata: {
                                        'filter': '(Coordinador eq ' + context.coordinadorId.ID + ')',
                                        'top': 5000
                                        
                                    }
                                });
                                spo.getListItems(spo.getSiteUrl(), "Planta", query,
                                    function (response) {
                                        context.planta = response.d.results;
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
        let coorSection2 = {
            inset: true,
            header: 'Descargas',
            footer: '',
            options: []
        };
        
        if (context.informes.length > 0 ) {
            if (context.informes[0].Estado != "Desaprobado") 
            canSendInform = false;    
        }
        
        if (canSendInform && context.onPeriod) {
            coorSection.options = coorSection.options.concat([ 
                {
                    href: '/item',
                    title: 'Nuevo Item',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--BoxAdditionSolid"></i>',
                },
                {
                    href: '/liststream?title=Items variables&listtitle=ItemVariable&listview=Coordinador&panel=filter-close&template=list-row&context=',
                    title: 'Items Variables',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--CheckList"></i>',
                }
            ]);
        } else if(!canSendInform) {
            coorSection.footer = 'Tu informe ya ha sido enviado';
        } else if(!context.onPeriod){
            coorSection.footer = 'No hay un periodo vigente para añadir items';
        }

        if (context.onPeriod) {
            coorSection.options = coorSection.options.concat([ 
                {
                    href: '/liststream?title=Informes Desaprobados&listtitle=Informe Haberes&listview=Pendientes&panel=filter-close&template=list-row&context=',
                    title: 'Informes',
                    after: '',
                    header: '',
                    footer: 'En periodo',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--TimeEntry"></i>',
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
                media: '<i class="ms-Icon ms-Icon--ActivateOrders"></i>',
            }
        ]);



        settings.push(coorSection);  

        coorSection2.options = coorSection2.options.concat([
            {
                href: 'https://grupoenvision.sharepoint.com/sites/testMutual/_layouts/15/download.aspx?UniqueId=13641310%2Dd85c%2D4fa6%2Da163%2D3fa9e03702a3',
                title: 'Excel Tipo',
                after: '',
                header: '',
                footer: 'Carga Masiva',
                panelClose: true,
                externalLink: true,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--ExcelLogo"></i>',
            },
            {
                //href: '/liststream?title=Informes Históricos&listtitle=Informe Haberes&listview=Historico Coordinador&panel=filter-close&template=list-row&context=',
                title: 'Información Complementaria',
                after: '',
                header: '',
                footer: 'Trabajadores y haberes',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--ExcelLogo"></i>',
                onClick: function(){
                    //Almacenamos todos los haberes asignados a el coordinador.
                    var selfHaber = context.coordinadorId.HaberesId.results.map(function(y){
                            let encontrado = context.haber.filter(function(x){
                                return x.ID == y
                            })[0]
                            return {
                                "Codigo Item Variable": encontrado.Title,
                                "Nombre Item Variable": encontrado.NombreItem,
                                "Tipo de ingreso": encontrado.TipoIngreso,
                            };
                    });
                    let selfJobs = context.planta.map(function(x){
                        let categoria = context.Categoria.filter(c => c.ID == x.CategoriaId)[0];
                        return {
                            "Rut": x.Rut,
                            "Codigo Payroll": x.Title,
                            "Nombre Completo": x.NombreCompleto,
                            "Tipo Contrato": x.TipoContrato,
                            "Categoria": categoria.Categoria,
                            "Cargo": x.d_cargo
                        }
                    });


                    let colSizes1 = [{"width":30},{"width":50},{"width":15}];
                    let colSizes2 = [{"width":20},{"width":20},{"width":50},{"width":20},{"width":15},{"width":20}];
                    
                    generateXLSX(["Listado Haberes","Listado Trabajadores"], 'Excel Generado', [selfHaber, selfJobs], true, [colSizes1,colSizes2] ,
                        function(response){},
                        function(response){
                            var responseText = JSON.parse(response.Error);
                            console.log('responseText', responseText);
                            dialogs.infoDialog(
                                'Error al descargar el archivo',
                                responseText
                            );
                        }
                    );

                }
            }
        ]);

        settings.push(coorSection2); 
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
                    media: '<i class="ms-Icon ms-Icon--TimeEntry"></i>',
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
                    media: '<i class="ms-Icon ms-Icon--TimeEntry"></i>',
                }
            ]);
        } else {

            admSection.footer = 'No hay un periodo vigente para mostrar informes por aprobar';

        }

        admSection.options = admSection.options.concat([
            {
                href: '/liststream?title=Planta&listtitle=Planta&listview=Planta Usuario&panel=filter-close&template=list-row&context=',
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
                href: '/liststream?title=Informes Históricos&listtitle=Informe Haberes&listview=Historico&panel=filter-open&template=list-row&context=&',
                title: 'Informes',
                after: '',
                header: '',
                footer: 'Históricos',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--ActivateOrders"></i>',
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