// <CONFIG>
var global = {};
global.appName = 'Mutual - Item variable';
global.theme = 'mutual';
global.efwVersion = '3.0.8';
global.efwDev = true;
global.env = "DEV" //DEV, MUTDSR, MUTQAS, MUTPRD
global.showUserMenu = true;
global.uris = {
    DEV: {
        tenantUrl: 'https://grupoenvision.sharepoint.com/',
        siteUrl: 'https://grupoenvision.sharepoint.com/sites/testMutual/devjaviera',
        tema: "https://grupoenvision.sharepoint.com/CDN/EFW/themes/mutual/mutual.png",
        excelCoord: 'https://grupoenvision.sharepoint.com/sites/testMutual/_layouts/15/download.aspx?UniqueId=13641310%2Dd85c%2D4fa6%2Da163%2D3fa9e03702a3',
        status: 'https://prod-56.westus.logic.azure.com:443/workflows/110553fb4b5345a0a6af184622fee095/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3Ypt3eyXmI3dML81jx1FHibucDD1qWjG_kEzs2iVDM0',
        items: 'https://prod-41.westus.logic.azure.com:443/workflows/7936281e1e9642b7bce907f3b5c79f98/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=M0U07-7TKCCEM1d_uwLaTyhGKUGed1dqJAwpJp-mBJg',
        planta: 'https://prod-09.westus.logic.azure.com:443/workflows/ebee079485634fdeb4f5cd060b424663/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2bv590n5l4kP0RSXvGeOtuqx3Gfvm5NnNk1Rmwt3g34',
    },
    TEST: {
        tenantUrl: 'https://grupoenvision.sharepoint.com/',
        siteUrl: 'https://grupoenvision.sharepoint.com/sites/testMutual/test',
        tema: "https://grupoenvision.sharepoint.com/CDN/EFW/themes/mutual/mutual.png",
        excelCoord: 'https://grupoenvision.sharepoint.com/sites/testMutual/_layouts/15/download.aspx?UniqueId=13641310%2Dd85c%2D4fa6%2Da163%2D3fa9e03702a3',
        status: 'https://prod-56.westus.logic.azure.com:443/workflows/110553fb4b5345a0a6af184622fee095/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3Ypt3eyXmI3dML81jx1FHibucDD1qWjG_kEzs2iVDM0',
        items: 'https://prod-41.westus.logic.azure.com:443/workflows/7936281e1e9642b7bce907f3b5c79f98/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=M0U07-7TKCCEM1d_uwLaTyhGKUGed1dqJAwpJp-mBJg',
        planta: 'https://prod-09.westus.logic.azure.com:443/workflows/ebee079485634fdeb4f5cd060b424663/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2bv590n5l4kP0RSXvGeOtuqx3Gfvm5NnNk1Rmwt3g34',
    },
    MUTDSR: {
        tenantUrl: 'https://mutualcl.sharepoint.com/',
        siteUrl: 'https://mutualcl.sharepoint.com/sites/aplicativoPersonasDSR/AplicativoPersona1.1/',
        excelCoord: 'https://mutualcl.sharepoint.com/sites/aplicativoPersonasDSR/AplicativoPersona1.1/_layouts/15/download.aspx?UniqueId=8f555238%2Dfb9c%2D48f3%2Da6da%2De641a010c989',
        status: 'https://prod-09.westus.logic.azure.com:443/workflows/5ce7ea7cf20e4246a75638f25fe4af15/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=rzMelItX7HWBMvy-sSWYlHuZeppw7E9uBSqdg_1BtdE',
        items: 'https://prod-62.westus.logic.azure.com:443/workflows/b8dd45a1d2654d8ca7672678290b867f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=VAMs_5rnIS0P3DMXr8VA9WXuhIhAXR67vOFgu8tHLws',
        planta: 'https://prod-14.westus.logic.azure.com:443/workflows/0e371514329c440a8522e540321cabb2/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fHhXuG6-GbDA79up1rWZSkLmIuL7yoSmNwqgxPg0qmI',
    }, 
    MUTQAS: {
        tenantUrl: 'https://mutualcl.sharepoint.com/',
        siteUrl: 'https://mutualcl.sharepoint.com/sites/aplicativoPersonasQAS/AplicativoPersona/',
        tema: 'https://mutualcl.sharepoint.com/sites/aplicativoPersonasQAS/AplicativoPersona/Tema/mutual.png',
        excelCoord: 'https://mutualcl.sharepoint.com/sites/aplicativoPersonasQAS/AplicativoPersona/_layouts/15/download.aspx?UniqueId=89b5e347%2Dc61e%2D4c75%2Da14d%2D45ba41bc37a4',
        status: 'https://prod-95.westus.logic.azure.com:443/workflows/71c183bfedab4bfbba7596de27f73376/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8HNuoFXg7TQdxFAiag_83nGgahXho1U1EG9aUo6zye0',
        items: 'https://prod-43.westus.logic.azure.com:443/workflows/a3e209540675467fbbfdf8e183983f39/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=pz1IX-0gg2cAaf7-AGMiCtdGTEFhBgFGqmCN_kl-R-Y',
        planta: 'https://prod-36.westus.logic.azure.com:443/workflows/981a3d3c32b24ab8901da9b56ab7902c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qKA0E3AM5Ds5mjweT6JPkl42wR3fkvQdcuaV3k15gXE',
    },
    MUTPRD: {

    }
}
var AppScriptsArray = [
    "js/utils/pdfImages.js",
    "js/utils/dialogs.js",
    "js/utils/buttons.js",
    "js/utils/rolefilter.js",

    //Carpeta Item Variable
    "js/routers/itemVariable/InformeDesaprobadoPage.js",
    "js/routers/itemVariable/InformeHistoricoPage.js",
    "js/routers/itemVariable/InformePage.js",
    "js/routers/itemVariable/InformePeriodoPage.js",
    "js/routers/itemVariable/ItemPage.js",
    "js/routers/itemVariable/ItemVariableStreamPage.js",
    "js/routers/itemVariable/ItemFormPage.js",
    "js/routers/itemVariable/LicenciaPage.js",
    "js/routers/itemVariable/LicenciaStreamPage.js",
    "js/routers/itemVariable/PeriodoPage.js",
    "js/routers/itemVariable/PeriodoStreamPage.js",
    "js/routers/itemVariable/SendStatusPage.js",
    "js/routers/itemVariable/SolicitudesPage.js",
    "js/routers/itemVariable/SolicitudesStreamPage.js",
    "js/routers/itemVariable/UploadItemsPage.js",
    "js/routers/itemVariable/TrabajadoresStreamPage.js",
    
    
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
    "js/routers/mantenedor/itemVariable/HaberesPage.js",
    "js/routers/mantenedor/itemVariable/TrabajadoresPage.js",
    "js/routers/mantenedor/itemVariable/TrabajadoresStreamPage.js",


    //Carpeta SDP
    "js/routers/SDP/SolicitantePage.js",
    "js/routers/SDP/SolicitudStreamPage.js",
    "js/routers/SDP/SolicitudCyE.js",
    "js/routers/SDP/CecoPage.js",
    "js/routers/SDP/CecoStreamPage.js",
    "js/routers/SDP/AproveSolicitudStreamPage.js",
    "js/routers/SDP/SolicitudesGuardadasPage.js",

    //Mantenedores SDP
    "js/routers/mantenedor/SDP/PosicionStreamPage.js",
    "js/routers/mantenedor/SDP/PosicionPage.js",
    
    //Carpeta Principal
    "js/routers/HomePage.js",
    "js/routers/LeftPage.js",
    "js/routes.js", // routes.js si,empre al penúltimo
    "js/app.js" // app.js siempre al último
];
// </CONFIG>