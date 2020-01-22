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

    console.log('item', item);
    /*if (page.route.query.imputations == 'true'){
        mainView.router.navigate('/timelog?listItemId='+item.ID);
    } else {*/
        mainView.router.navigate('/item?listItemId='+item.ID);
    //}
}

// sobre escribiendo el metodo
listStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
        context = self._getPageContext();

    // mostrar el boton de abrir?
    if (page.route.query.nopen != 'true'){
        buttons.push(context.navbar.openButton);
    }

    if (self.allowUpdateItem()){
        buttons.push(context.navbar.updateButton);
    }

    // BaseType == 0 cuando es lista, 1 cuando es biblioteca
    if (item.File_x0020_Type || (item.FSObjType == '0' && context.list.BaseType === 1)) {
        buttons.push(context.navbar.downloadButton);
    }
    
    if (self.allowDeleteItem()){
        buttons.push(context.navbar.deleteButton);
    }

    return buttons;
}

// sobre escribiendo el metodo
listStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    // Button template
    var fileButton = {
        text: 'Cargar Planta',
        class: 'uploadPlanta',
        icon: 'ExcelLogo',
        onClick: function(component, item){
            mainView.router.navigate(encodeURI('/uploadPlanta'));
        }
    }
    
    switch (page.route.query.title){
        case 'Planta':
            buttons.push(fileButton);    
            break;
        case 'Periodos':
            buttons.push(context.navbar.addButton)    
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
