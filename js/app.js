/* --- Moment language --- */                 
moment.locale('es');

var $$ = Dom7;
var app = null;
var leftView = null;
var mainView = null;
var XHRrequests = [];
var translations = {};
var plantaId = null;
var planta = null;
var admin = null;
var spo = new EnvisionSPO({
    tenantUrl: global.tenantUrl,
    siteUrl: global.siteUrl,
});

spo.getCurrentUserInformation().done(function(){
    spo.getContextWebInformation().done(function(){

        var loaded = {};

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

        function shouldStartApp(){
            if (loaded.PlantaInfo && loaded.Planta && loaded.AdminInfo && loaded.Admin){
                if (planta) {
                    if (planta.EstadoContrato == "Activo") {
                        startApp();        
                    } else {
                        startAppNoAccess();
                    }
                } else {
                    startAppNoAccess();
                }
            }
        }

        spo.getListInfo('Planta',
            function (response2) {
                loaded.PlantaInfo = true;
                var query2 = spo.encodeUrlListQuery(response2, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(Email eq \'' + spo.getCurrentUser()['EMail'] + '\')',
                        'select': '*,AttachmentFiles',
                        'expand': 'AttachmentFiles'
                    }
                });

                spo.getListItems(spo.getSiteUrl(), 'Planta', query2,
                    function (response2) {
                        plantaId = response2.d.results.length > 0 ? response2.d.results[0].ID : null;
                        planta = response2.d.results.length > 0 ? response2.d.results[0] : null;
                        loaded.Planta = true;
                        shouldStartApp();

                    },
                    function (response2) {
                        var responseText = JSON.parse(response2.responseText);
                        console.log(responseText.error.message.value);
                        resolve(failCond);
                    }
                );
            },
            function (response) {
                var responseText = JSON.parse(response.responseText);
                console.log(responseText.error.message.value);
                resolve(failCond);
            }
        );

        spo.getListInfo('Administrador',
            function(response){
                loaded.AdminInfo = true;
                var query = spo.encodeUrlListQuery(response, {
                    view: 'Todos los elementos',
                    odata: {
                        'filter': '(Usuario/Email eq \'' + spo.getCurrentUser()['EMail'] + '\')',
                        'select': '*,AttachmentFiles',
                        'expand': 'AttachmentFiles'
                    }
                });
                spo.getListItems(spo.getSiteUrl(), 'Administrador', query,
                    function(response){
                        admin = response.d.results.length > 0 ? response.d.results[0].Cargo : null;
                        loaded.Admin = true;
                        shouldStartApp();
                    },
                    function(response){
                        var responseText = JSON.parse(response.responseText);
                        console.log(responseText.error.message.value);
                        resolve(failCond);
                    }
                );
            },
            function(response){
                var responseText = JSON.parse(response.responseText);
                console.log(responseText.error.message.value);
                resolve(failCond);
            }
        );
    });
});