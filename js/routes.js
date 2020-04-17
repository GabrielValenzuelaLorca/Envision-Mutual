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
                    <And>
                        <Eq>
                            <FieldRef Name="Capex" /><Value Type="Boolean">0</Value>
                        </Eq>
                        <Eq>
                            <FieldRef Name="Categoria_x003a_ESC" /><Value Type="Lookup">E</Value>
                        </Eq>
                    </And>
                </And>
            `
        }
    }

    
}

function getRoutes(){
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
            path: '/homepage',
            component: homePage
        },
        // Default route (404 page). MUST BE THE LAST
        {
            path: '(.*)',
            url: './pages/404.html',
        },
    ]

    var itemRoutes = [
        
        {
            path: '/item',
            component: itemPage
        },
        {
            path: '/periodo',
            component: periodoPage
        },
        {
            path: '/uploadPlanta',
            component: uploadPlantaPage
        },
        {
            path: '/informe',
            component: informePage
        },
        {
            path: '/uploadItems',
            component: uploadItemsPage
        },
        {
            path: '/informeHistorico',
            component: informeHistoricoPage
        },
        {
            path: '/informeDesaprobado',
            component: informePendientePage
        },
        {
            path: '/informePeriodo',
            component: informePeriodoPage
        },
        {
            path: '/itemVariableStream',
            component: itemVariableStreamPage
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
            path: '/itemVariable',
            component: ItemVariablePage
        },
        {
            path: '/coordinadorStream',
            component: coordinadorStreamPage
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
            path: '/Solicitudes',
            component: SolicitudesStreamPage
        },
        {
            path: '/Solicitud',
            component: solicitudesPage
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
            path: '/licenciaHistorico',
            component: licenciaStreamPage
        },
        {
            path: '/licencia',
            component: licenciaPage
        },
    ];

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
        }
    ]

    var routes = [];
    
    routes = routes.concat(itemRoutes);

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