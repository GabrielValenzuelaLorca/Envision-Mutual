function getMenu(roles){
    var buildQuery = function(array){
        let query = []
        array.forEach(id =>{
            query.push("(Id eq "+ id +")")
        })
        return query.join(" or ")
    }
    if(roles.length <=0) return Promise.resolve([])

    return getPromiseListItems(spo.getSiteUrl(),'RolesSDP','?$select=*&$filter=' + buildQuery(roles))
    .then(roles =>{
        var modulosActivos = []
        roles.d.results.forEach(c =>{
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
        return Promise.resolve(groups)
    })
}


var MantenedorRolSDPPage = $.extend(true, {}, listStreamPage)

MantenedorRolSDPPage.methods.allowChangeTemplate = function(){
    return false;
}

MantenedorRolSDPPage.methods.getListView = function(){
    return "ListaMantenedor"
}

MantenedorRolSDPPage.methods.getTitle = function(){
    return "Modulos por Rol"
}

MantenedorRolSDPPage.methods.getListTitle = function(){
    return "RolesSDP"
}


MantenedorRolSDPPage.methods.getOneItemSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
    return buttons;
}

MantenedorRolSDPPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

MantenedorRolSDPPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    return buttons;
}

MantenedorRolSDPPage.methods.getCamlQueryConditions = function(){
    return '';
}

MantenedorRolSDPPage.methods.getCamlOrderBy = function() {
    return '<FieldRef Name="ID" Ascending="True" />';
}


//-------------------------------------------------------
var MantenedorModuloSDPPage = $.extend(true, {}, listStreamPage)

MantenedorModuloSDPPage.methods.allowChangeTemplate = function(){
    return false;
}

MantenedorModuloSDPPage.methods.getListView = function(){
    return "ListaMantenedor"
}

MantenedorModuloSDPPage.methods.getTitle = function(){
    return "Botones por Modulo"
}

MantenedorModuloSDPPage.methods.getListTitle = function(){
    return "ModulosSDP"
}


MantenedorModuloSDPPage.methods.getOneItemSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
    return buttons;
}

MantenedorModuloSDPPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

MantenedorModuloSDPPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    return buttons;
}

MantenedorModuloSDPPage.methods.getCamlQueryConditions = function(){
    return '';
}

MantenedorModuloSDPPage.methods.getCamlOrderBy = function() {
    return '<FieldRef Name="ID" Ascending="True" />';
}

// ------------------------------------------------------
var MantenedorUsuarioSDPPage = $.extend(true, {}, listStreamPage)

MantenedorUsuarioSDPPage.methods.allowChangeTemplate = function(){
    return false;
}

MantenedorUsuarioSDPPage.methods.getListView = function(){
    return "RolesSDP"
}

MantenedorUsuarioSDPPage.methods.getTitle = function(){
    return "Roles por Usuario"
}

MantenedorUsuarioSDPPage.methods.getListTitle = function(){
    return "Planta"
}


MantenedorUsuarioSDPPage.methods.getOneItemSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
    buttons.push({
        icon: 'Add',
        class: 'AddUserSDP',
        text: 'Asignar Rol',
        onClick: function (page, items) {
            getListInfoPromise("Planta").then(c => {
                var form = null
                var html = `
                <div class="page">
                    <div class="navbar">
                        <div class="navbar-inner">
                            <div class="title">Asignar Rol a Usuario</div>
                            <div class="right">
                                <a href="#" data-panel="right" class="link panel-close panel-index">
                                    <i class="ms-Icon ms-Icon--Cancel"></i>
                                    <span class="ios-only"></span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="page-content">
                        <div class="block">
                            <div class="row">
    
                                <div class="col-50">
                                    <div class="card">
                                        <div class="card-content card-content-padding panelForm"></div>
                                        <div class="card-footer">
                                            <a></a>
                                            <a href="#" class="link save">Guardar <i class="ms-Icon ms-Icon--Save"></i></a>
                                        </div>
                                    </div>
                                </div>
    
                                <div class="col-50 panelPreview">
                                </div>
                            </div>
    
                        </div>
                    </div>
                </div>
                `
                $(app.panel.right.$el).html(html);
    
                form = new EFWForm({
                    container: $(app.panel.right.$el).find('.panelForm'),
                    title: 'Asignar Rol',
                    editable: true,
                    // editable: formItem ? false : true,
                    description: '',
                    fields: spo.getViewFields(c, 'RolesSDPForm')
                });

                form.inputs.Usuario.setEditable(false)
                form.inputs.ApellidoMaterno.setEditable(false)
                form.inputs.ApellidoPaterno.setEditable(false)
                form.inputs.Nombre.setEditable(false)
                form.setValues(items)

                var renderPreview = function(ids){
                    getMenu(ids).then(c =>{
                        var blocks = c || []
                        var htmlBlocks = ""
                        for (var i = 0; i < blocks.length; i++){
                            for (var j = 0; j < blocks[i].options.length; j++){
                                blocks[i].options[j].id = generateUUID();
                            }
                    
                            htmlBlocks += blockTemplate(blocks[i]);
                        }

                        $(app.panel.right.$el).find(".panelPreview").html(htmlBlocks);
                    })
                }
                renderPreview(form.inputs.RolSDPDinamico.values.map(c => c.key))
                
                form.inputs.RolSDPDinamico.params.onChange = function(){
                    renderPreview(form.inputs.RolSDPDinamico.values.map(c => c.key))
                }

    
                $(app.panel.right.$el).find(".save").on('click', function (e) {
                    var meta = form.getMetadata();
                    app.toast.create({
                        text: 'Actualizando',
                        icon: '<i class="ms-Icon ms-Icon--Sync"></i>',
                        position: 'top',
                        closeTimeout: 2000,
                    }).open();

                    updatePromiseListItem(spo.getSiteUrl(), 'Planta', items.ID, meta)
                    .then(c =>{
                        app.toast.create({
                            text: 'Exito',
                            icon: '<i class="ms-Icon ms-Icon--CheckMark"></i>',
                            position: 'top',
                            closeTimeout: 2000,
                          }).open();
                          page.requestItems()
                    })
                    .catch(error =>{
                        app.toast.create({
                            text: 'Error',
                            icon: '<i class="ms-Icon ms-Icon--Cancel"></i>',
                            position: 'top',
                            closeTimeout: 2000,
                          }).open();
                    })
                });
    

                $(app.panel.right.$el).find(".panel-close").on('click', function (e) {
                    app.panel.close("right");
                    $(app.panel.get("right").$el).css("min-width", "")
                });
    
                $(app.panel.get("right").$el).css("min-width", "100vw")
                app.panel.open("right");
            })
        }
    })

    return buttons;
}

MantenedorUsuarioSDPPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}

MantenedorUsuarioSDPPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];

    return buttons;
}

MantenedorUsuarioSDPPage.methods.getCamlQueryConditions = function(){
    return '';
}

MantenedorUsuarioSDPPage.methods.getCamlOrderBy = function() {
    return '<FieldRef Name="RolSDPDinamico" Ascending="True" />';
}

