class Role{
    getModuleCards(){}
    getButtons(context){}
}

class RoleItemVariable extends Role{
    constructor(role){
        super()
        this.roles = role
        this.Administrador = role === "Administrador"? true:false
        this.Aprobador = role === "Aprobador"? true:false
        this.Coordinador = role === "Coordinador"? true:false
        this.LicenciasMedicas = role === "Encargado de Licencias Médicas"? true:false

    }
    getModuleCard(){
        if(this.roles != undefined && this.roles != ""){
            return {
                Title: 'Ítem Variables',
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
        
        function showAlertFirstOpened(dias){

            let msg1 = `Recuerde que le quedan ${dias} día(s) para enviar sus ítems variables del periodo ${context.onPeriod.PeriodoCompleto}.\r\nFecha de cierre del periodo: ${moment(context.onPeriod.FechaTermino).format("DD/MM/YYYY")}`;
            let msg2 = `Recuerde que hoy es el último día para enviar sus ítems variables del periodo ${context.onPeriod.PeriodoCompleto}.\r\nFecha de cierre del periodo: ${moment(context.onPeriod.FechaTermino).format("DD/MM/YYYY")}`
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
                        title: 'Estados de envío',
                        after: '',
                        header: '',
                        footer: 'Ítems Variables',
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
                    href: '/ReasignarCoordinador',
                    title: 'Transpaso de coordinación',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--Transition"></i>',
                },
                {
                    href: '/CargarCentroCosto',
                    title: 'Mantenedor Coordinador',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--AddGroup"></i>',
                },
                
            ]);
    
            settings.push(admSection2);
            
           
        }
        if(this.LicenciasMedicas){
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
                        title: 'Nuevo Ítem',
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
                        title: 'Ítems Variables',
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
                        title: 'Carga Masiva Ítems',
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
                coorSection.footer = 'Se ha vencido el periodo de envío. Contactese con el administrador';
            } else if(!canSendInform) {
                coorSection.footer = 'Tu informe ya ha sido enviado';
            } else if(!context.onPeriod){
                coorSection.footer = 'No hay un periodo vigente para añadir ítems';
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
                        
                        generateXLSX(["Listado Haberes","Listado Trabajadores"], 'Excel Generado', [selfHaber, selfJobs], false, [colSizes1,colSizes2] ,
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
        if(this.Aprobador){
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
        this.roles = role
    }
    getModuleCard(){
        if(this.roles.length > 0){
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
        return SDP.menu
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
            this.SDP = new RoleSDP(SDP)
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
        if(Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 700){
            app.view.main.$el.css("margin-left", "260px")
        }
        

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
            var url = "/homePage"

            if(aux.length > 0){
                var allow = undefined
                if(mainView.router.url === "/homePage"){
                    url = aux[0].options[0].href
                }
                else{
                    allow = aux.map(c => c.options).flat().map(c => c.href).find(c => c === mainView.router.url)
                    url = allow!=undefined?allow:"/homePage"
                } 
            }
            
            mainView.router.navigate(url,{
                clearPreviousHistory:true,
                reloadCurrent:true
            })
           
            return defecto.concat(aux)
        }
        else if(this.module === "SDP"){
            var aux = this.SDP.getButtons(context)
            var url = "/homePage"
            if(aux.length > 0){
                var allow = undefined
                if(mainView.router.url === "/homePage"){
                    url = aux[0].options[0].href
                }
                else{
                    allow = aux.map(c => c.options).flat().map(c => c.href).find(c => c === mainView.router.url)
                    url = allow!=undefined?allow:"/homePage"
                } 
            }
            
            mainView.router.navigate(url,{
                clearPreviousHistory:true,
                reloadCurrent:true
            })

            return defecto.concat(aux)
        }
        else{
            app.panel.left.$el.hide()
            app.view.main.$el.css("margin-left", 0) //260px
            return defecto
        }
    }
}
