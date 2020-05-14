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
        var botonesActivos = []
        roles.d.results.forEach(c =>{
            botonesActivos = botonesActivos.concat(c.BotonesRolId.results)
        })
        if(botonesActivos.length <= 0) return Promise.resolve({d:{results:[]}})
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


function getButtons(ids){
    var buildQuery = function(array){
        let query = []
        array.forEach(id =>{
            query.push("(Id eq "+ id +")")
        })
        return query.join(" or ")
    }
    return getPromiseListItems(spo.getSiteUrl(),'BotonesRouter','?$select=*&$filter=' + buildQuery(Array.from(new Set(ids)))) 
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
    return "Botones por Rol"
}

MantenedorRolSDPPage.methods.getListTitle = function(){
    return "RolesSDP"
}

MantenedorRolSDPPage.methods.CreateEditRol = function(page,item){
    var listInfo = getListInfoPromise("RolesSDP")
    var buttons = getPromiseListItems(spo.getSiteUrl(),'BotonesRouter','?$select=*')

    Promise.all([listInfo,buttons]).then(args => {
        var form = null
        var html = `
        <div class="page">
            <div class="navbar">
                <div class="navbar-inner">
                    <div class="title">Asignar Botones a Rol</div>
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
                        <div class="col-50">
                            <div class="card">
                                <div class="card-header">Asignar Botones</div>
                                <div class="card-content card-content-padding ButtonSelector"></div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
        `
        $(app.panel.right.$el).html(html);

        form = new EFWForm({
            container: $(app.panel.right.$el).find('.panelForm'),
            editable: true,
            // editable: formItem ? false : true,
            description: '',
            fields: spo.getViewFields(args[0], 'Rolform')
        });

        form.inputs.NombreRol.setRequired(true)
        if(item != undefined){
            form.setValues(item)
        }

        var buttonsGrouped = groupBy(args[1].d.results, 'GrupoBoton')
        var htmlList = ""
        for(aux in buttonsGrouped){
            var buttons = buttonsGrouped[aux]
            htmlList += ` <li class="list-group-title">`+aux+`</li>`
            buttons.forEach(b =>{
                var checkBoxInput = ""
                if(item != undefined && item.BotonesRol.find(c => c.lookupId === b.Id)){
                    checkBoxInput = `<input type="checkbox" data-id="`+b.Id+`" checked/>`
                }
                else{
                    checkBoxInput = `<input type="checkbox" data-id="`+b.Id+`"/>`
                }

                htmlList += `
                <li>
                    <div class="item-content">
                        <div class="item-media">`+b.IconBoton+`</div>
                        <div class="item-inner">
                            <div class="item-title">`+b.Title+`</div>
                            <div class="item-after">
                                <label class="toggle toggle-init">
                                `+checkBoxInput+`
                                <span class="toggle-icon"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </li>`
            })
        }

        $(app.panel.right.$el).find(".ButtonSelector").html(
            `<div class="list" style="max-height: 80vh;overflow-y: auto;">
                <div class="list-group">
                    <ul>
                        `+htmlList+`
                    </ul>
                </div>
            </div>`)


        $(app.panel.right.$el).find(".save").on('click', function (e) {
            var botones = $(app.panel.right.$el).find(".ButtonSelector").find("input:checked")
            var botonesIds = Array.from(botones).map(c => $(c).data('id'))

            var meta = form.getMetadata()
            meta["BotonesRolId"] = {results:botonesIds}
            form.checkFieldsRequired()
            if (!form.getValidation()) return

            

            app.toast.create({
                text: 'Actualizando',
                icon: '<i class="ms-Icon ms-Icon--Sync"></i>',
                position: 'top',
                closeTimeout: 2000,
            }).open();

            var promise =Promise.resolve(true)
            if(item != undefined){
                promise = updatePromiseListItem(spo.getSiteUrl(), 'RolesSDP', item.ID, meta)
            }
            else{
                promise = addPromiseListItem(spo.getSiteUrl(), 'RolesSDP', meta)
            }

            promise
            .then(c =>{
                app.toast.create({
                    text: 'Exito',
                    icon: '<i class="ms-Icon ms-Icon--CheckMark"></i>',
                    position: 'top',
                    closeTimeout: 2000,
                    }).open();
                    page.requestItems()
                    app.panel.close("right");
                    $(app.panel.get("right").$el).css("min-width", "")
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

MantenedorRolSDPPage.methods.getOneItemSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [];
    buttons.push({
        icon: 'Add',
        class: 'AddButtonsSDP',
        text: 'Asignar Botones',
        onClick: function (page, items) {
            self.CreateEditRol(page, items)
        }
    })
    
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
                                <div class="col-50" style="max-width:300px;display:block;margin-left:auto;margin-right:auto;">
                                    <div class="promo-container">
                                        <div class="promo-image lazy-fadein lazy-loaded" style="background-image: url(&quot;https://grupoenvision.sharepoint.com/CDN/EFW/themes/mutual/mutual.png&quot;);"></div>
                                        <div class="promo-title"></div>
                                    </div>  
                                    <div class="panelPreview"></div>
                                </div>

                                <div class="col-50">
                                    <div class="card">
                                        <div class="card-content card-content-padding panelForm"></div>
                                        <div class="card-footer">
                                            <a></a>
                                            <a href="#" class="link save">Guardar <i class="ms-Icon ms-Icon--Save"></i></a>
                                        </div>
                                    </div>
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
                
                $(form.inputs.RolSDPDinamico.input).on('change', function(){
                    getPromiseListItems(spo.getSiteUrl(),'RolesSDP','?$select=*,RolesAutomaticos/ID,RolesAutomaticos/NombreRol&$expand=RolesAutomaticos&$filter=Id eq ' + parseInt($(this).val())).then(c =>{
                        var values = []
                        form.inputs.RolSDPDinamico.values.forEach(c =>{
                            values.push({key:c.key, text: c.text})
                        })
                        
                        for (let i = 0; i < c.d.results.length; i++) {
                            const element = c.d.results[i];
                            element.RolesAutomaticos.results.forEach(c =>{
                                if(form.inputs.RolSDPDinamico.values.find(f => f.key === c.ID) === undefined ){
                                    values.push({key:c.ID, text: c.NombreRol})
                                }
                            })
                        }

                        form.inputs.RolSDPDinamico.setValue(values)
                    })
                })

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

