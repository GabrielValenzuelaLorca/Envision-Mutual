var menuPage = $.extend(true, {}, indexPage);

// {array} obtiene las optiones de configuración para el menú
menuPage.methods.getListBlocksData = function(){
    var page = this._getPage();
    var app = page.app;

    // configuración de menú
    var settings = []
    
    if (true){

        settings.push({
            inset: true,
            header: '',
            footer: '',
            options: [ 
                {
                    href: '/item',
                    title: 'Nuevo item',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--BoxAdditionSolid"></i>',
                },
                {
                    href: '/liststream?title=Items variables&listtitle=ItemVariable&listview=Todos los elementos&panel=filter-open&template=list-row&context=',
                    title: 'Items variables',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--CheckList"></i>',
                },
                {
                    href: '/liststream?title=Planta&listtitle=Planta&listview=Todos los elementos&panel=filter-open&template=list-row&context=',
                    title: 'Usuarios',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--Accounts"></i>',
                }
            ]
        });
    }

    /*
    if (consultant['Roles'] == 'Project manager' || consultant['Roles'] == 'General project manager' || consultant['Roles'] == 'Business Developer'){
        settings.push({
            inset: true,
            header: '',
            footer: '',
            collapsable: true,
            collapsed: true,
            options: [
                {
                    href: '/liststream?nopen=true&title=Client&listtitle=Client&listview=Todos los elementos&template=list-row',
                    title: 'Clientes',
                    after: '',
                    header: '',
                    footer: '',
                    panelClose: true,
                    externalLink: false,
                    f7view: '.view-main',
                    media: '<i class="ms-Icon ms-Icon--CheckList"></i>',
                },
            ]
        });
    }*/

    return settings;
};

menuPage.methods.getDescription = function () {
    return 'holi';
};

/* menuPage.methods.renderHeader = function ($header) {
    var self = this,
        page = self._getPage(),
        context = self._getPageContext();

    var header = '' + 
        '<div>'
        '<div class="ms-font-xl" style="padding:20px 20px 0 20px;">' + context.title + '</div>';
    $header.html(header);
}; */

menuPage.methods.renderFooter = function ($header) {
    var self = this,
        page = self._getPage(),
        context = self._getPageContext();
        var $html = `<div class="theme-switcher"><a onclick="efwSwapTheme('envisionLight')">Claro</a> | <a onclick="efwSwapTheme('envisionDark')">Oscuro</a></div>`
    $header.html($html);
};

// {string} logo de empresa
/*menuPage.methods.getPageComponentImage = function(){
    return "https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/themes/" + global.theme + "/" + global.theme + ".png";
};*/