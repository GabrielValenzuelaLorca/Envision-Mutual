class Role{
    getModuleCards(){}
    getButtons(context){}
}

class RoleItemVariable extends Role{
    constructor(role){
        super()
        this.Administrador = role === "Administrador"? true:false
        this.Aprobador = role === "Aprobador"? true:false
        this.Coordinador = role === "Coordinador"? true:false
        this.LicenciasMedicas = role === "LicenciasMedicas"? true:false

    }
    getModuleCard(){
        if(this.Administrador || this.Aprobador || this.Coordinador || this.LicenciasMedicas){
            return {
                Title: 'Item Variables',
                IDModulo:'IV',
                Href: '#'
            }
        }
        else{
            return undefined
        }
    }
    getButtons(context){
        var settings = []
        
        function showAlertFirstOpened(){
            let dias = moment(context.onPeriod.FechaTermino).diff( moment(), 'days')
            app.dialog.create({
                title: 'Atención',
                text: `Recuerde que le quedan ${dias} dia(s) para enviar sus items variables del periodo ${context.onPeriod.PeriodoCompleto}.\r\nFecha de cierre del periodo: ${moment(context.onPeriod.FechaTermino).format("DD/MM/YYYY")}`,
                buttons: [{
                    text: 'Aceptar',
                    onClick: function () {
                        return
                    }
                }],
                verticalButtons: false
            }).open();
        }    

        if(this.Administrador){

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
        if(this.Aprobador){
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
        if(this.Coordinador){
            let canSendInform = true;
            let outPeriod = false;
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
    
            if(moment(context.onPeriod.FechaTermino).diff( moment(), 'days') <=0){
                outPeriod = true;
            }
    
            if (canSendInform && context.onPeriod && !outPeriod) {
                if(plantaAdmin.Rol == "Coordinador" && showAlert == true && canSendInform){
                    showAlertFirstOpened()
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
        if(this.LicenciasMedicas){
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
        return settings
    }
}

class RoleSDP extends Role{
    constructor(role){
        super()
        this.JefeSolicitante = role.includes("Jefe Solicitante")? true:false
        this.Validador = role.includes("Validador")? true:false
        this.CyE = role.includes("CyE")? true:false
        this.CeCo = role.includes("Encargado CeCo")? true:false
    }
    getModuleCard(){
        if(this.JefeSolicitante || this.Validador || this.CyE || this.CeCo){
            return {
                Title: 'Solicitud Personal',
                IDModulo:'SDP',
                Href: '#'
            }
        }
        else{
            return undefined
        }

       
    }
    getButtons(context){
        var settings = []

        if (this.JefeSolicitante){
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
        if (this.Validador){
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
        if (this.CyE){
            let cecoSection = {
                inset: true,
                header: 'Panel de Centros de Costos',
                footer: '',
                options: []
            };
    
            cecoSection.options = cecoSection.options.concat([
                {
                    href: '/cecoStream',                    
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
        if (this.CeCo){
            let cyeSection = {
                inset: true,
                header: 'CyE',
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
        }

        return settings
    }
}



//Factorys
class RoleHandler{
    constructor(){
        this.IV = new RoleItemVariable("")
        this.SDP = new RoleSDP([])
        this.module = ""
    }
    setItemVariableRol(IV){
        if(IV != null){
            this.IV = new RoleItemVariable(IV)
        }
    }
    setSDPRol(SDP){
        if(SDP != null){
            this.SDP = new RoleSDP(SDP.results)
        }
    }
    setModule(option){
        this.module = option
    }

    getModules(){
        var modules = []
        modules.push(this.IV.getModuleCard())
        modules.push(this.SDP.getModuleCard())
        return modules.filter(c => c != undefined)
    }

    getOptions(context){
        app.panel.left.$el.show()
        app.view.main.$el.css("margin-left", "260px")

        var defecto = [{
            inset: true,
            footer: '',
            options: [{
                href: '/homePage',
                title: 'Inicio',
                after: '',
                header: '',
                footer: '',
                panelClose: true,
                externalLink: false,
                f7view: '.view-main',
                media: '<i class="ms-Icon ms-Icon--Home"></i>',
            }]
        }]

        if(this.module === "IV"){
            var aux = this.IV.getButtons(context)
            mainView.router.navigate(aux[0].options[0].href)
            return defecto.concat(aux)
        }
        else if(this.module === "SDP"){
            var aux = this.SDP.getButtons(context)
            mainView.router.navigate(aux[0].options[0].href)
            return defecto.concat(aux)
        }
        else{
            app.panel.left.$el.hide()
            app.view.main.$el.css("margin-left", 0) //260px
            mainView.router.navigate("/homePage")
            return []
        }
    }
}
