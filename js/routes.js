// funciona auxiliar para hacer console.log as l('var')
l = function() {
    try {
        for(k in arguments){
            console.log(arguments[k]);
        }
    } catch(e){}
}

// sobre escribiendo el metodo
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

// sobre escribiendo el metodo
listStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
        context = self._getPageContext();
    
    if (self.allowUpdateItem()){
        buttons.push(localButtons.editPeriodButton());
    }
    
    if (self.allowDeleteItem()){
        buttons.push(context.navbar.deleteButton);
    }

    switch (page.route.query.title){
        case 'Periodos':
            if (item.Activo == "Sí"){
                buttons.push(localButtons.desactivatePeriodoButton())
            } else {
                buttons.push(localButtons.activatePeriodoButton(context))
            }
            break;
    }
    return buttons;

}

// sobre escribiendo el metodo
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
    }
    return buttons;
}

// sobre escribiendo el metodo (IMPORTANTE)
listStreamPage.methods.getCamlQueryConditions = function(){
    var page = this._getPage();
    var context = this._getPageContext();
    var urlQuery = page.route.query;
    var currentUserId = spo.getCurrentUserId();

    console.log('context', context);

    if (page.route.query.context == 'tareas'){
        var cond = '<Eq><FieldRef Name="Encargado" LookupId="TRUE" /><Value Type="Lookup">' +
            usuarioId + '</Value></Eq>';
        return cond;
    } else if (page.route.query.context == 'usuarios'){
        return ''
    } else {
        return ''
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
