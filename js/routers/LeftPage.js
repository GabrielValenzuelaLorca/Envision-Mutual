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

    function showAlertFirstOpened(dias){

        let msg1 = `Recuerde que le quedan ${dias} dia(s) para enviar sus items variables del periodo ${context.onPeriod.PeriodoCompleto}.\r\nFecha de cierre del periodo: ${moment(context.onPeriod.FechaTermino).format("DD/MM/YYYY")}`;
        let msg2 = `Recuerde que hoy es el ultimo dia para enviar sus items variables del periodo ${context.onPeriod.PeriodoCompleto}.\r\nFecha de cierre del periodo: ${moment(context.onPeriod.FechaTermino).format("DD/MM/YYYY")}`
        app.dialog.create({
            title: 'Atención',
            text: dias > 0 ? msg1 : msg2,
            buttons: [{
                text: 'Aceptar',
                onClick: function () {
                    return
                }
            }],
            verticalButtons: false
        }).open();
    }    
    
    /*** 
     * Seccion Item Variable
     * ***/

    var settings = []
    if (plantaAdmin.Rol == "Coordinador"){
        let canSendInform = true;
        var outPeriod = false;
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
        
        if (context.informes){
            if (context.informes.length > 0 ) {
                canSendInform = context.informes[0].Estado == "Desaprobado" ? true : false
            }
        }

        let formated1 = moment().format('YYYY-MM-DD');
        let formated2 = moment(context.onPeriod.FechaTermino).format('YYYY-MM-DD');

        let replaced1 = formated1.replace(/-/gi,'')
        let replaced2 = formated2.replace(/-/gi,'')

        let hasta = parseInt(replaced1);
        let desde = parseInt(replaced2);
        
        var dias = desde - hasta;

        if(dias < 0){
            outPeriod = true;
        }

        if (canSendInform && context.onPeriod && !outPeriod) {
            if(plantaAdmin.Rol == "Coordinador" && showAlert == true && canSendInform){
                showAlertFirstOpened(dias)
                showAlert = false;
            }
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
                    href: '/itemVariableStream',
                    title: 'Items Variables',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--CheckList"></i>',
                },
                {
                    href: '/uploadItems',
                    title: 'Carga Masiva Items',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--ExcelLogo"></i>',
                },
                {
                    href: '/Solicitudes?panel=filter-open',
                    title: 'Solicitudes',
                    after: '',
                    header: '',
                    footer: 'Centro de costos',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--DocumentApproval"></i>',
                }
            ]);
        } else if(outPeriod){
            coorSection.footer = 'Se ha vencido el periodo de envio. Contactese con el administrador';
        } else if(!canSendInform) {
            coorSection.footer = 'Tu informe ya ha sido enviado';
        } else if(!context.onPeriod){
            coorSection.footer = 'No hay un periodo vigente para añadir items';
        }

        if (context.onPeriod) {
            coorSection.options = coorSection.options.concat([ 
                {
                    href: '/informeDesaprobado',
                    title: 'Informes',
                    after: '',
                    header: '',
                    footer: 'En periodo',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--TimeEntry"></i>',
                },
                {
                    href: '/licenciaHistorico',
                    title: 'Ingreso Licencias',
                    after: '',
                    header: '',
                    footer: 'En Periodo',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--HealthSolid"></i>',
                }
            ]);
        }

        coorSection.options = coorSection.options.concat([
            {
                href: '/informeHistorico',
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
                href: global.uris[global.env].excelCoord,
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
                    var selfHaber = plantaAdmin.HaberesId.results.map(function(y){
                            let encontrado = context.haber.filter(function(x){
                                return x.ID == y
                            })[0]
                            console.log('Haber disponible', encontrado)
                            return {
                                "Codigo Item Variable": encontrado.Title,
                                "Nombre Item Variable": encontrado.NombreItem,
                                "Tipo de ingreso": encontrado.TipoIngreso,
                                "Minimo": encontrado.Minimo,
                                "Maximo": encontrado.Maximo
                            };
                    });
                    let selfJobs = context.planta.map(function(x){
                        let categoria = context.Categoria.filter(c => c.ID == x.CategoriaId)[0];
                        return {
                            "Rut": x.Rut,
                            "Codigo Payroll": x.Title,
                            "Nombre Completo": x.NombreCompleto,
                            "Tipo Contrato": x.TipoContrato,
                            "Categoria": categoria.Categoria.charAt(0),
                            "Cargo": x.d_cargo.NombreCargo
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

    if (plantaAdmin.Rol == "Aprobador"){
        let aprobSection = {
            inset: true,
            header: 'Aprobación',
            footer: '',
            options: []
        };
        if (context.onPeriod){
            aprobSection.options = aprobSection.options.concat([ 
                {
                    href: '/informePeriodo',
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

    if (plantaAdmin.Rol == "Administrador"){
        let admSection = {
            inset: true,
            header: 'Administración',
            footer: '',
            options: []
        };
        let admSection2 = {
            inset: true,
            header: 'Mantenedores',
            footer: '',
            options: []
        };

        if (context.onPeriod){
            admSection.options = admSection.options.concat([
                {
                    href: '/sendStatusStream',
                    title: 'Estados de envio',
                    after: '',
                    header: '',
                    footer: 'Items Variables',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--TimeEntry"></i>',
                },
                {
                    href: '/Solicitudes?panel=filter-open',
                    title: 'Solicitudes',
                    after: '',
                    header: '',
                    footer: 'Centro de costos',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--DocumentApproval"></i>',
                },
                {
                    href: '/licenciaHistorico?panel=filter-open',
                    title: 'Licencias',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--HealthSolid"></i>',
                },
            ]);
        } else {
            admSection.footer = 'No hay un periodo vigente para mostrar informes por aprobar';
        }

        admSection.options = admSection.options.concat([
            {
                href: '/plantaStream',
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
                href: '/periodoStream',
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
                href: '/informeHistorico?&panel=filter-open',
                title: 'Informes',
                after: '',
                header: '',
                footer: 'Históricos',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--ActivateOrders"></i>',
            },
            
            
        ]);
        settings.push(admSection);


        admSection2.options = admSection2.options.concat([
            {
                href: '/rolStream',
                title: 'Mantenedor Roles',
                after: '',
                header: '',
                footer: '',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--AccountManagement"></i>',
            },
            {
                href: '/liststream?title=Mantenedor Items Variables&listtitle=ListadoItemVariable&listview=Todos los elementos&template=list-row&panel=filter-close',
                title: 'Mantenedor Haberes',
                after: '',
                header: '',
                footer: '',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--Archive"></i>',
            },
            {
                href: '/liststream?title=Mantenedor Convenio Capex&listtitle=Planta&listview=Capex&template=list-row&panel=filter-close',
                title: 'Mantenedor Capex',
                after: '',
                header: '',
                footer: '',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--Accounts"></i>',
            },
            {
                href: '/coordinadorStream',
                title: 'Mantenedor Coordinador',
                after: '',
                header: '',
                footer: 'Haberes y Trabajadores',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--AddGroup"></i>',
            },
            {
                href: '/EjemploStream',
                title: 'Mantenedor Centro de costo',
                after: '',
                header: '',
                footer: '',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--Archive"></i>',
            },
        ]);

        settings.push(admSection2);
    }

    if (plantaAdmin.Rol == "Encargado de Licencias Médicas"){
        let licSection = {
            inset: true,
            header: 'Encargado de Licencias Médicas',
            footer: '',
            options: []
        };

        licSection.options = licSection.options.concat([
            {
                href: '/licenciaHistorico?panel=filter-open',
                title: 'Licencias',
                after: '',
                header: '',
                footer: '',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--HealthSolid"></i>',
            },
        ]);
      
        settings.push(licSection);
    }

    /*** 
     * Seccion Solicitud de Personal
     * ***/

    if(plantaAdmin.RolSDP){
        if (plantaAdmin.RolSDP.results.includes("Jefe Solicitante")){
            let solSection = {
                inset: true,
                header: 'Solicitud de permisos',
                footer: '',
                options: []
            };
    
            solSection.options = solSection.options.concat([
                {
                    href: '/formSolicitante',
                    title: 'Crear Solicitud',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--HealthSolid"></i>',
                },
                {
                    href: '/SolicitudStream',
                    title: 'Solicitudes SDP',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--HealthSolid"></i>',
                },
            ]);
          
            settings.push(solSection);
        }
    
        if (plantaAdmin.RolSDP.results.includes("Validador")){
            let valSection = {
                inset: true,
                header: 'Validación de solicitudes',
                footer: '',
                options: []
            };
    
            valSection.options = valSection.options.concat([
                {
                    href: '/SolicitudesPorValidar',
                    title: 'Solicitudes SDP',
                    after: '',
                    header: '',
                    footer: 'Por aprobar',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--AwayStatus"></i>',
                },
            ]);
          
            settings.push(valSection);
        }

        if (plantaAdmin.RolSDP.results.includes("Encargado CeCo")){
            let cecoSection = {
                inset: true,
                header: 'Panel de Centros de Costos',
                footer: '',
                options: []
            };
    
            cecoSection.options = cecoSection.options.concat([
                {
                    href: '/EjemploStream',                    
                    title: 'Mantenedor de CeCo',                    
                    after: '',
                    header: '',
                    footer: 'Centro de costo',                    
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--Archive"></i>',
                },
            ]);
          
            settings.push(cecoSection);
        }
    
        if (plantaAdmin.RolSDP.results.includes("CyE")){
            let cyeSection = {
                inset: true,
                header: 'CyE',
                footer: '',
                options: []
            };

            let cyeMantenedorSection = {
                inset: true,
                header: 'Mantenedores CyE',
                footer: '',
                options: []
            };
    
            cyeSection.options = cyeSection.options.concat([
                {
                    href: '/SolicitudesCyE',
                    title: 'Solicitudes',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--DocumentSet"></i>',
                },
            ]);
          
            settings.push(cyeSection);

            cyeMantenedorSection.options = cyeMantenedorSection.options.concat([
                {
                    href: '/PosicionStream',
                    title: 'Posiciones',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--DocumentSet"></i>',
                },
            ]);
          
            settings.push(cyeMantenedorSection);
        }
    }

    return settings;
};

// {string} logo de empresa
menuPage.methods.getPageComponentImage = function(){
    return global.uris[global.env].tema;
};