//quita de listStreamPage las miniaturas
listStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

function getRoutes(){
    return [
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
        {
            path: '/item',
            component: itemPage
        },
        {
            path: '/periodo',
            component: periodoPage
        },
        {
            path: '/itemVariable',
            component: itemVariablePage
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
        // Default route (404 page). MUST BE THE LAST
        {
            path: '(.*)',
            url: './pages/404.html',
        },
    ];

}

// cambiar los colores :D
function efwSwapTheme(newT){
    global.theme = newT;
    global["currentThemeCSS"].href = "https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/themes/" + newT + "/" + newT + ".css";
    l(global["currentThemeCSS"])
    localStorage.setItem('globalTheme', newT)
}