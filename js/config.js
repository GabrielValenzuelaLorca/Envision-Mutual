// <CONFIG>
var global = {};
global.appName = 'Mutual - Item variable'
global.theme = 'mutual';
global.efwVersion = '3.0.8';
global.efwDev = true;
global.showUserMenu = true;
global.tenantUrl = 'https://grupoenvision.sharepoint.com/';
global.siteUrl = 'https://grupoenvision.sharepoint.com/sites/testMutual/';
var AppScriptsArray = [
    "js/utils/pdfImages.js",
    "js/utils/dialogs.js",
    "js/utils/buttons.js",

    //Carpeta Item Variable
    "js/routers/itemVariable/InformeDesaprobadoPage.js",
    "js/routers/itemVariable/InformeHistoricoPage.js",
    "js/routers/itemVariable/InformePage.js",
    "js/routers/itemVariable/InformePeriodoPage.js",
    "js/routers/itemVariable/ItemPage.js",
    "js/routers/itemVariable/ItemVariableStreamPage.js",
    "js/routers/itemVariable/LicenciaPage.js",
    "js/routers/itemVariable/LicenciaStreamPage.js",
    "js/routers/itemVariable/PeriodoPage.js",
    "js/routers/itemVariable/PeriodoStreamPage.js",
    "js/routers/itemVariable/SendStatusPage.js",
    "js/routers/itemVariable/SolicitudesPage.js",
    "js/routers/itemVariable/SolicitudesStreamPage.js",
    "js/routers/itemVariable/UploadItemsPage.js",    
    
    
    //Carpeta mantenedores general
    "js/routers/mantenedor/general/PlantaPage.js",
    "js/routers/mantenedor/general/PlantaStreamPage.js",
    "js/routers/mantenedor/general/UploadPlantaPage.js",


    //Carpeta mantenedor itemVariable
    "js/routers/mantenedor/itemVariable/AssignRolPage.js",
    "js/routers/mantenedor/itemVariable/ItemVariablePage.js",
    "js/routers/mantenedor/itemVariable/RolPage.js",
    "js/routers/mantenedor/itemVariable/RolStreamPage.js",
    "js/routers/mantenedor/itemVariable/CoordinadorStreamPage.js",
    "js/routers/mantenedor/itemVariable/CooStreamPage.js",
    "js/routers/mantenedor/itemVariable/HaberesPage.js",
    "js/routers/mantenedor/itemVariable/TrabajadoresPage.js",
    "js/routers/mantenedor/itemVariable/TrabajadoresStreamPage.js",


    //Carpeta SDP
    "js/routers/SDP/SolicitantePage.js",
   
    
    //Carpeta Principal
    "js/routers/HomePage.js",
    "js/routers/LeftPage.js",
    "js/routes.js", // routes.js si,empre al penúltimo
    "js/app.js" // app.js siempre al último
];
// </CONFIG>