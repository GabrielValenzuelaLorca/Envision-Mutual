var superListStreamPage = $.extend(true, {}, listStreamPage);

// {fn} función para obtener elementos
superListStreamPage.methods.requestItems = function(camlFilters){
    var self = this,
        paging = '',
        loading = false,
        page = self._getPage(),
        context = self._getPageContext();

    var $container = page.$el,
        $infiniteContainer = $container.find('.infinite-scroll-content'),
        $preloader = $container.find('.preloader.infinite-scroll-preloader'),
        query = encodeURI(spo.getSiteUrl() + '/_api/web/Lists(guid\'' + context.list.Id + '\')/RenderListDataAsStream?View=' + context.list.View.Id + '&InplaceSearchQuery=' + context.parameters.inplaceSearchQuery);

    // Guarda la última consulta CAML
    context.parameters.lastCamlFilters = camlFilters;

    console.log('self', self);
    // {event} set infinite scroll if bottom page reached
    if (self.allowInfiniteScroll()){
        $infiniteContainer.on('infinite', function() {
            if (loading) return;
            loading = true;
            getListItems();
        })    
    }

    // habilitar recusiveScope en llamada a elementos
    var recursiveScope = self.allowRecursiveScope() ? 'Scope="RecursiveAll"' : '';

    // construcción de CAML query
    var camlQuery = (function(){
        var query = '';
        var order = '';
        var conds = '';
        var camlConditions = self.getCamlQueryConditions() || '';

        order = self.getCamlOrderBy() || '';
        order = order.length > 0 ? '<OrderBy>' + order + '</OrderBy>' : order;

        camlFilters = camlFilters || '';
        conds = camlConditions + camlFilters;
        conds = camlConditions.length > 0 && camlFilters.length > 0 ? '<And>' + conds + '</And>' : conds;
        context.parameters.lastCamlQuery = conds;

        conds = conds.length > 0 ? '<Where>' + conds + '</Where>' : conds;

        query = order + conds;
        query = query.length > 0 ? '<Query>' + query + '</Query>' : query;

        return query;
    })();

    var viewFields = (function(){
        var viewfields = '';

        for (var i = 0; i < context.list.ViewFields.length; i++){
            viewfields += '<FieldRef Name="' + context.list.ViewFields[i].InternalName + '"></FieldRef>'
        }

        viewfields += '<FieldRef Name="Title"></FieldRef>';
        viewfields += '<FieldRef Name="FileRef"></FieldRef>';
        viewfields += '<FieldRef Name="FileLeafRef"></FieldRef>';
        viewfields += '<FieldRef Name="Author"></FieldRef>';
        viewfields += '<FieldRef Name="Editor"></FieldRef>';
        viewfields += '<FieldRef Name="Created"></FieldRef>';
        viewfields += '<FieldRef Name="Modified"></FieldRef>';

        // agregar campos adicionales a los que vienen en la vista seleccionada
        if (self.getAdditionalFields()){
            viewfields += self.getAdditionalFields()
        }

        return viewfields;
    })();

    // {fn} realizar los llamados para obtener elementos
    function getListItems() {
        var items = [];

        if (context.xhr) {
            context.xhr.abort();
            context.xhr = null;
        }

        console.log('camlquery', camlQuery);

        // $preloader.css({'opacity':'1'});
        return new Promise((resolve, reject) =>{
            context.xhr = $.ajax({
                url: query,
                type: "POST",
                dataType: "json",
                headers: {
                    'accept': 'application/json;odata=nometadata',
                    'content-type': 'application/json;odata=nometadata'
                },
                data: JSON.stringify({
                    "parameters": {
                        "Paging": paging,
                        "DatesInUtc": "true",
                        "RenderOptions": (4103 + 8192),
                        "FolderServerRelativeUrl": context.parameters.folderServerRelativeUrl,
                        "ViewXml": `
                            <View ` + recursiveScope + `>
                                <ViewFields>` + viewFields + `</ViewFields>
                                <RowLimit Paged="TRUE">` + context.parameters.rowLimit + `</RowLimit>
                                ` + camlQuery + `
                            </View>
                        `
                    }
                }),
                success: function(response){   
                    resolve(response);
                },
                failure: function(response){
                    reject(response);
                }
            })
        })
        .then(response =>{
            var superTabla = new SuperTabla();
            if(context.list.ViewFields.find(c => c.InternalName === "Detalle1") === undefined){
                context.list.ViewFields = context.list.ViewFields.concat(superTabla.pushColumns());
            }
            var items = superTabla.processResponse(response);
            return Promise.resolve(items);
        })
        .then(response =>{
            var listData = response.ListData;
            var listSchema = response.ListSchema;

            paging = listData['NextHref'] ? listData['NextHref'].replace('?','') : null;
            items = items.concat(listData.Row);

            // renderizar elementos en lista virtual
            self.renderItems(items);
            
            // si el total de items es menor a 100 y la siguiente consulta existe
            if (items.length < 100 && paging != null){
                getListItems(); 
            }
            else {
                if (paging == undefined){
                    $preloader.css({'opacity':'0'});
                    $infiniteContainer.off('infinite');
                }
            }
            
            loading = false;
            app.progressbar.hide();
            self.removePageLoader();
            app.lazy.create($container);
        })
        .catch(response =>{
            var responseText = JSON.parse(response.responseText);
            app.dialog.create({
                title: 'Error al obtener información de la lista ' + context.list.Title,
                text: responseText.error.message.value,
                buttons: [
                    {
                        text: 'Aceptar',
                    },
                ],
                verticalButtons: false,
            }).open();
        })
    }

    self.resetVirtualList();

    // get library elements
    getListItems();
    self.addPageLoader();
    app.progressbar.show();
}