var posicionStreamPage = $.extend(true, {}, listStreamPage)

posicionStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

posicionStreamPage.methods.getListView = function(){
    return "Todos los Elementos"    
}

posicionStreamPage.methods.getTitle = function(){
    return "Listado de posiciones"
}

posicionStreamPage.methods.getListTitle = function(){
    return "Posicion"
}

posicionStreamPage.methods.onItemDblClick = function(item){
    // mainView.router.navigate('/itemVariable?listItemId='+item.ID);
    return;
}

posicionStreamPage.methods.getNoItemsSelectedButtons = function(){
    var self = this,
        page = self._getPage(),
        context = self._getPageContext(),
        buttons = [
            localButtons.toCreatePosition()
        ];
    return buttons;
}

posicionStreamPage.methods.getOneItemSelectedButtons = function(item){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [
        localButtons.toEditPosition()
    ];

    if(item.Estado == "En revisión"){
        buttons.push(localButtons.enviarUnCyE())
    }

    return buttons;
}

posicionStreamPage.methods.getMultiItemsSelectedButtons = function(items){
    var page = this._getPage();
    var self = this, buttons = [],
    context = self._getPageContext(),
    buttons = [
        localButtons.toEditPosition()
    ];
    let allow = true;
    items.map(function(x){
        if(x.Estado != "En revisión"){
            allow = false;
        }
    })

    if(allow){
        buttons.push(localButtons.enviarMultiplesCyE())
    }


    return buttons;
}

posicionStreamPage.methods.getCamlOrderBy = function() {
    return '<FieldRef Name="NPosicion" Ascending="True" />';
}

posicionStreamPage.methods.renderHeader = function($header){
    // core vars
    var self = this,
        page = this._getPage(),
        url = page.route.url

    // use vars
    var title = self.getTitle() || page.route.query.title,
        description = '',
        tabChoices = [
            {id : 1, text: 'Todas las posiciones', segment: 'Disponible para uso'},
            {id : 2, text: 'En revisión', segment: 'En revisión'},
        ];

    // tempalte con titulo, descripción opcional y un tabs
    var templateHtml = `
        <div class="form-header">
            <div class="Title" style="margin-left: 42%; margin-right: 42%; margin-top: 8px; font-size: 20px; font-weight: 600;">` + title +  `</div>
            <div class="ms-Form-Description">` + description + `</div>
            <div class="segmented" style="margin:20px auto; max-width:600px">
                <a class="button" segment-id="` + tabChoices[0].id + `" segment-text="` + tabChoices[0].segment + `">` + tabChoices[0].text + `</a>
                <a class="button" segment-id="` + tabChoices[1].id + `" segment-text="` + tabChoices[1].segment + `">` + tabChoices[1].text + `</a>
            </div>
        </div>
    `;

    // agregar html
    $header.html(templateHtml);

    // agregar al hacer click sobre botón
    $header.find('.segmented .button').on('click', function(e){
        var choice = this.getAttribute('segment-text');
            query = "";
        switch(choice){
            case tabChoices[0].segment.toString() :{
                query = `
                        <Eq><FieldRef Name="Estado" /><Value Type="Choice">${tabChoices[0].segment.toString()}</Value></Eq>
                    `;
                break;
            }
            case tabChoices[1].segment.toString() :{
                query = `
                        <Eq><FieldRef Name="Estado" /><Value Type="Choice">${tabChoices[1].segment.toString()}</Value></Eq>
                    `;
                break;
            }
        }
        // manejar lógica para ver botón seleccionado
        $header.find('.segmented .button').removeClass('button-active');
        $(this).addClass('button-active');
        

        // self.requestItems() acepta como parametro una consulta CAML
        self.requestItems(query);
    });
}