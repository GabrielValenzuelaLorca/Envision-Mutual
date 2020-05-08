/* --- Moment language --- */                 
moment.locale('es');

var $$ = Dom7;
var app = null;
var leftView = null;
var mainView = null;
var XHRrequests = [];
var translations = {};
var plantaAdmin = null;
var SDP = {
    roles:[],
    routes:[],
    menu:[]
}

var showAlert = true;
var clipboard = null;
var spo = new EnvisionSPO({
    tenantUrl: global.uris[global.env].tenantUrl,
    siteUrl: global.uris[global.env].siteUrl,
});
spo.addNewUserGroup = function(site, groupname, loginame, success, failure) {
    var self = this;
    var metadata = {
        __metadata: {  
            'type': 'SP.User'  
        },  
        LoginName: loginame
    };

    $.ajax({  
        url: site + '/_api/web/sitegroups/getbyname(\'' + groupname + '\')/users',  
        type: "POST",  
        headers: {  
            "accept": "application/json;odata=verbose",  
            "X-RequestDigest": self.formDigestValue,
            "content-Type": "application/json;odata=verbose"
        },  
        data: JSON.stringify(metadata),  
        success: function(data) {  
            if (success) success(data);
        },  
        failure: function(error) {  
            if (failure) failure(error);
        },
        error: function(error) {  
            if (failure) failure(error);
        }  
    });  
}


var initInformation = new Promise((resolve)=>{
    spo.getCurrentUserInformation().done(function(){
        spo.getContextWebInformation().done(function(){
            resolve()
        })
    })
})
.then(_ =>{
    return getPromiseListItems(spo.getSiteUrl(),'Planta','?$select=*&$filter=UsuarioId eq '+ spo.getCurrentUserId())
})
.then(response =>{
    var buildQuery = function(array){
        let query = []
        array.forEach(id =>{
            query.push("(Id eq "+ id +")")
        })
        return query.join(" or ")
    }

    plantaAdmin = response.d.results[0];
    if(plantaAdmin.RolSDPDinamicoId.results.length > 0){
        return getPromiseListItems(spo.getSiteUrl(),'RolesSDP','?$select=*&$filter=' + buildQuery(plantaAdmin.RolSDPDinamicoId.results))
        .then(roles =>{
            var modulosActivos = []
            roles.d.results.forEach(c =>{
                SDP.roles.push(c.Title)
                modulosActivos = modulosActivos.concat(c.ModulosActivosId.results)
            })
            return getPromiseListItems(spo.getSiteUrl(),'ModulosSDP','?$select=*&$filter=' + buildQuery(Array.from(new Set(modulosActivos))))
            
        })
        .then(modulos =>{
            var botonesActivos = []
            modulos.d.results.forEach(c =>{
                botonesActivos = botonesActivos.concat(c.BotonesModuloId.results)
            })
            return getPromiseListItems(spo.getSiteUrl(),'BotonesRouter','?$select=*&$filter=' + buildQuery(Array.from(new Set(botonesActivos)))) 
        })
        .then(botones =>{
            var grupoBotones = groupBy(botones.d.results,'GrupoBoton')
            var groups = []
            var routes = []
            for(i in grupoBotones){
                var botones = grupoBotones[i]
                var aux =  {
                    inset: true,
                    header: i,
                    footer: '',
                    options: []
                }

                for (let index = 0; index < botones.length; index++) {
                    const element = botones[index];
                    routes.push(element.hrefBoton)
                    aux.options.push( {
                        href:  element.hrefBoton,
                        title: element.Title,
                        panelClose: true,
                        externalLink: false,
                        f7view: '.view-main',
                        media: element.IconBoton,
                    })
                }
                groups.push(aux)
            }

            SDP.routes = routes
            SDP.menu = groups
        

            return Promise.resolve(true)
        })

    }
    else{
        return Promise.resolve(true)
    }

}).then(c =>{
    function startApp(){
        app = new Framework7({
            id: 'io.framework7.envision', // App bundle ID
            root: '#app', // App root element
            name: "Envision", //'Envision', // App name
            theme: 'ios', // Automatic theme detection
            lazy: {
                threshold: 50,
                sequential: false,
            },
            // App root data
            data: function () {
                return {
                    siteUrl: spo.getSiteUrl(),
                    tenantUrl: spo.getTenantUrl(),
                    currentUser: spo.getCurrentUser()
                };
            },
            // App root methods
            methods: {
                generateUUID: function () {
                    var d = new Date().getTime();
                    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = (d + Math.random() * 16) % 16 | 0;
                        d = Math.floor(d / 16);
                        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
                    });
                    return uuid;
                }
            },
            // App routes
            routes: getRoutes(),
            // Enable panel left visibility breakpoint
            panel: {
                leftBreakpoint: 700,
            },
        });
    
        debugger
        var roleHandler = new RoleHandler()
        roleHandler.setItemVariableRol(plantaAdmin.Rol)
        roleHandler.setSDPRol(SDP.roles)
        roleHandler.setModule(localStorage.getItem("rhandler"))
        app.data.roleHandler = roleHandler
    
        // router a la aplicación al componente correcto con sus parámetros
        var urlQuery = app.utils.parseUrlQuery(window.location.href);
        if (urlQuery.hasOwnProperty('lang')) {
            var location = window.location.href.split('?');
            app.language = urlQuery.lang;
            try {
                localStorage.setItem('language', urlQuery.lang);
            } catch (err) {
    
            }
    
            if (location.length >= 2)
                window.history.pushState({}, document.title, location[0]);
        }
        //app.language = localStorage.getItem('language') || 'es-ES';
        app.language = 'es-ES';
        app.params.language = 'es-ES';
    
        // Init/Create left panel view
        leftView = app.views.create('.view-left', {
            url: '/',
            iosSwipeBack: false,
        });
    
        // Init/Create main view
        mainView = app.views.create('.view-main', {
            url: '/',
            pushState: true,
            iosSwipeBack: false,
            iosSwipeBackAnimateShadow: false,
            iosSwipeBackAnimateOpacity: false
        });
    
        //Editar el menu lateral
        leftView.router.navigate(encodeURI('/menu'), {
            animate: false
        });
    }

    function startAppNoAccess(){
        app = new Framework7({
            id: 'io.framework7.envision', // App bundle ID
            root: '#app', // App root element
            name: "Envision", //'Envision', // App name
            theme: 'ios', // Automatic theme detection
            lazy: {
                threshold: 50,
                sequential: false,
            },
            // App routes
            routes: [{
                path: '(.*)',
                url: './pages/404.html',
            }],
            // Enable panel left visibility breakpoint
            panel: {
                leftBreakpoint: 700,
            },
        });

        // Init/Create main view
        mainView = app.views.create('.view-main', {
            url: './pages/404.html',
            pushState: true,
            iosSwipeBack: false,
            iosSwipeBackAnimateShadow: false,
            iosSwipeBackAnimateOpacity: false
        });
    }

   
    if ((plantaAdmin.Rol != null || plantaAdmin.RolSDP != null) && plantaAdmin.EstadoContrato == "Activo"){
        startApp()
    }
    else{
        startAppNoAccess()
    }
})
.catch(error =>{
    var responseText = JSON.parse(error.responseText);
    console.log(responseText.error.message.value);
})