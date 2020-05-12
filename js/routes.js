//quita de listStreamPage las miniaturas
listStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

listStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var context = this._getPageContext();
    var title = page.route.query.title
    var buttons = [];
    
    switch(title){
        case 'Mantenedor Convenio Capex':{
            buttons.push(localButtons.deleteCapex(context));
            break;
        }
        case 'Asociar Trabajador a CAPEX':{
            buttons.push(localButtons.addCapex(context));
            break;
        }
        case 'Mantenedor Items Variables':{
            buttons.push(localButtons.toItemVariablePage());
            break;
        }

    }
    
    return buttons; 
}

listStreamPage.methods.getNoItemsSelectedButtons = function(item){
    var page = this._getPage();
    var context = this._getPageContext();
    var title = page.route.query.title  
    var buttons = [];
    
    switch(title){
        case 'Mantenedor Convenio Capex':{
            buttons.push(localButtons.addCapexView(context));
            break;
        }
        case 'Mantenedor Items Variables':{
            buttons.push(localButtons.toAddItemVariable());
            break;
        }
    }
    
    return buttons;
}

listStreamPage.methods.getMultiItemsSelectedButtons = function(item){
    var page = this._getPage();
    var context = this._getPageContext();
    var title = page.route.query.title
    var buttons = [];
    
    switch(title){
        case 'Mantenedor Convenio Capex':{
            buttons.push(localButtons.multiDeleteCapex(context));
            break;
        }
        case 'Asociar Trabajador a CAPEX':{
            buttons.push(localButtons.multiAddCapex(context));
            break;
        }
    }
    
    return buttons;
}

listStreamPage.methods.onItemDblClick = function(item){

    var page = this._getPage();
    var context = this._getPageContext();
    var title = page.route.query.title
    switch(title){
        case 'Mantenedor Items Variables':{
            mainView.router.navigate('/itemVariable?listItemId='+item.ID); 
            return;
        }
    }     
}

listStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var title = page.route.query.title

    switch(title){
        case 'Mantenedor Convenio Capex':{
            return `
                <And>
                    <Or>
                        <Eq>
                            <FieldRef Name="EstadoContrato" /><Value Type="Choice">Activo</Value>
                        </Eq>
                        <Eq>
                            <FieldRef Name="EstadoContrato" /><Value Type="Choice">Pendiente</Value>
                        </Eq>
                    </Or>
                    <Eq>
                        <FieldRef Name="Capex" /><Value Type="Boolean">1</Value>
                    </Eq>
                </And>
            `
        }
        case 'Asociar Trabajador a CAPEX':{
            return `
                <And>
                    <Or>
                        <Eq>
                            <FieldRef Name="EstadoContrato" /><Value Type="Choice">Activo</Value>
                        </Eq>
                        <Eq>
                            <FieldRef Name="EstadoContrato" /><Value Type="Choice">Pendiente</Value>
                        </Eq>
                    </Or>
                        <Eq>
                            <FieldRef Name="Capex" /><Value Type="Boolean">0</Value>
                        </Eq>
                    
                </And>
            `
        }
    }

    
}

function getRoutes(){
    //Routes Excenciales para el sistema
    var mainRoutes = [
        {
            path: '/liststream',
            component: listStreamPage
        },
        {
            path: '/menu',
            component: menuPage
        },
        {
            path: '/menuHome',
            component: menuHomePage
        },
        {
            path: '/homepage',
            component: homePage
        },
        // Default route (404 page). MUST BE THE LAST
        {
            path: '(.*)',
            url: './pages/404.html',
        },
    ]

    //Routes de uso exclusivo a usuario coordinador
    var cooRoutes = [
        {
            path: '/item',
            component: itemPage
        },
        {
            path: '/informeDesaprobado',
            component: informePendientePage
        },
        {
            path: '/itemVariableStream',
            component: itemVariableStreamPage
        },
        {
            path: '/uploadItems',
            component: uploadItemsPage
        },
    ];

    //Routes de uso exclusivo de Administrador item variable
    var adminIVRoutes = [
        {
            path: '/periodo',
            component: periodoPage
        },
        {
            path: '/uploadPlanta',
            component: uploadPlantaPage
        },
        {
            path: '/periodoStream',
            component: periodoStreamPage
        },
        {
            path: '/plantaStream',
            component: plantaStreamPage
        },
        {
            path: '/sendStatusStream',
            component: sendStatusPage
        },        
        {
            path: '/coordinadorStream',
            component: coordinadorStreamPage
        },
        {
            path: '/trabajadorPorCoordinador',
            component: trabajadoresStreamPage
        },
        {
            path: '/trabajadorTemporal',
            component: trabajadoresPage
        },
        {
            path: '/haberTemporal',
            component: haberesPage
        },
        {
            path: '/newEmployee',
            component: plantaPage
        },
        {
            path: '/rolStream',
            component: rolStreamPage
        },
        {
            path: '/assignRol',
            component: assignRolPage
        },
        {
            path: '/rol',
            component: rolPage
        },
        {
            path: '/Trabajadores',
            component: TrabajadoresStreamPage
        },
    ]

    //Routes compartidas de Item Variable
    var sharedItemRoutes = [
        {
            path: '/informe',
            component: informePage
        },
        {
            path: '/informeHistorico',
            component: informeHistoricoPage
        },
        {
            path: '/informePeriodo',
            component: informePeriodoPage
        },
        {
            path: '/itemVariable',
            component: ItemVariablePage
        },
        {
            path: '/Solicitudes',
            component: SolicitudesStreamPage
        },
        {
            path: '/Solicitud',
            component: solicitudesPage
        },
        {
            path: '/licenciaHistorico',
            component: licenciaStreamPage
        },
        {
            path: '/licencia',
            component: licenciaPage
        },
        {
            path: '/itemFormPage',
            component: itemFormPage
        },
    ];

    //Routes compartidas SDP
    var SDPRoutes = [
        {
            path: '/formSolicitante',
            component: solicitantePage
        },
        {
            path: '/SolicitudStream',
            component: solicitudStreamPage
        },
        {
            path: '/SolicitudesPorValidar',
            component: aproveSolicitudStreamPage
        },
        {
            path: '/SolicitudesCyE',
            component: solicitudCyEStream
        },
        {
            path: '/cecoStream',
            component: cecoStreamPage
        },
        {
            path: '/cecoTemporal',
            component: cecoPage
        },
        {
            path: '/PosicionStream',
            component: posicionStreamPage
        },
        {
            path: '/Posicion',
            component: posicionPage
        },
        {
            path: '/SolicitudesGuardadas',
            component: SolicitudesGuardadasPage
        },


    ]

    var routes = [];

    //Agregamos las rutas de coordinador
    if(plantaAdmin.Rol == "Coordinador"){
        routes = routes.concat(cooRoutes);
    }

    //Agregamos las rutas de Administrador Item Variable
    if(plantaAdmin.Rol == "Administrador"){
        routes = routes.concat(adminIVRoutes);
    }

    //Asignamos las rutas compartidos 
    if(plantaAdmin.Rol){
        routes = routes.concat(sharedItemRoutes);
    }
    
    if(plantaAdmin.RolSDP){
        routes = routes.concat(SDPRoutes);
    }
    
    
    routes = routes.concat(mainRoutes);
    return routes;
    // For test
}

// cambiar los colores :D
function efwSwapTheme(newT){
    global.theme = newT;
    global["currentThemeCSS"].href = "https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/themes/" + newT + "/" + newT + ".css";
    l(global["currentThemeCSS"])
    localStorage.setItem('globalTheme', newT)
}