var misSolicitudesStreamPage = $.extend(true, {}, listStreamPage)

misSolicitudesStreamPage.methods.allowChangeTemplate = function(){
    return false;
}

misSolicitudesStreamPage.methods.getListView = function(){
    return "PosicionsSolicitante"
}

misSolicitudesStreamPage.methods.getTitle = function(){
    return "Mis Posiciones"
}

misSolicitudesStreamPage.methods.getListTitle = function(){
    return "Posicion"
}

misSolicitudesStreamPage.methods.onItemDblClick = function(item){
     return false;
}

misSolicitudesStreamPage.methods.getOneItemSelectedButtons = function(item){
    var btn = []
    console.log('item', item)
    if(item.Bloqueado != "Sí" && item.Liberado == "Sí" && item.Estado == "Disponible para uso"){
        btn.push(localButtons.toActivatePosicion())
    }
    return btn;
}

misSolicitudesStreamPage.methods.getMultiItemsSelectedButtons = function(){
    return false;
}
misSolicitudesStreamPage.methods.getCamlQueryConditions = function(){
    return `
    <And>
        <Eq><FieldRef Name="CentroCosto" LookupId="TRUE"/><Value Type="Lookup">${plantaAdmin.CentroCostoId}</Value></Eq>
        <Eq><FieldRef Name="Liberado" /><Value Type="Boolean">1</Value></Eq>
    </And>`
}

misSolicitudesStreamPage.methods.renderHeader = function($header){
    // core vars
    var self = this,
        page = this._getPage(),
        url = page.route.url

    // use vars
    var title = self.getTitle() || page.route.query.title,
        description = '',
        tabChoices = [
            {id : 1, text: 'Todas', segment: 'todas'},
            {id : 2, text: 'Liberado / Bloqueado', segment: 'bloqueado'},
            {id : 3, text: 'Liberado /No bloqueado', segment: 'NoBloqueado'}
        ];

    // tempalte con titulo, descripción opcional y un tabs
    var templateHtml = `
        <div class="form-header">
            <div class="Title" style="margin-left: 42%; margin-right: 42%; margin-top: 8px; font-size: 20px; font-weight: 600;">` + title +  `</div>
            <div class="ms-Form-Description">` + description + `</div>
            <div class="segmented" style="margin:20px auto; max-width:600px">
                <a class="button" segment-id="` + tabChoices[0].id + `" segment-text="` + tabChoices[0].segment + `">` + tabChoices[0].text + `</a>
                <a class="button" segment-id="` + tabChoices[1].id + `" segment-text="` + tabChoices[1].segment + `">` + tabChoices[1].text + `</a>
                <a class="button" segment-id="` + tabChoices[2].id + `" segment-text="` + tabChoices[2].segment + `">` + tabChoices[2].text + `</a>
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
            case 'todas':{
                query = ``;
                break;
            }
            case 'bloqueado':{
                query = `<Eq><FieldRef Name="Bloqueado" /><Value Type="Boolean">1</Value></Eq>`;
                break;
            }
            case 'NoBloqueado':{
                query = `<Eq><FieldRef Name="Bloqueado" /><Value Type="Boolean">0</Value></Eq>`;
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