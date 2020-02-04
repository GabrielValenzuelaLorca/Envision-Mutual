// funciona auxiliar para hacer console.log as l('var')
l = function() {
    try {
        for(k in arguments){
            console.log(arguments[k]);
        }
    } catch(e){}
}

listStreamPage.methods.onItemDblClick = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
        context = self._getPageContext();
    
    switch (page.route.query.title){
        case 'Periodos':
            mainView.router.navigate('/periodo?listItemId='+item.ID);        
            break;
    }
}

listStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
        context = self._getPageContext();

    if (self.allowDeleteItem()){
        buttons.push(context.navbar.deleteButton);
    }

    switch (page.route.query.title){
        case 'Periodos':
            if (self.allowUpdateItem()){
                buttons.push(localButtons.editPeriodButton());
            }
            if (item.Activo == "Sí"){
                buttons.push(localButtons.desactivatePeriodoButton());
            } else {
                buttons.push(localButtons.activatePeriodoButton(context));
            }
            break;
        default:
            if (self.allowUpdateItem()){
                buttons.push(context.navbar.updateButton);
            }
            break;
    }
    return buttons;

}

listStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
    
    switch (page.route.query.title){
        case 'Planta':
            buttons.push(localButtons.fileButton());    
            break;
        case 'Periodos':
            buttons.push(localButtons.addPeriodButton(context));
            break;
        case 'Items variables':
            buttons.push(localButtons.sendButton(context));
            break;
    }
    return buttons;
}

listStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var urlQuery = page.route.query;
    var currentUserId = spo.getCurrentUserId();

    switch (urlQuery.title){
        case 'Items variables':
            return '<Eq><FieldRef Name="Author" LookupId="TRUE"/><Value Type="Lookup">'+currentUserId+'</Value></Eq>';
    }
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
            path: '/uploadPlanta',
            component: uploadPlantaPage
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
