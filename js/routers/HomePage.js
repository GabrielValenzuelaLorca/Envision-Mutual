var homePage = {
    template: 
    '<div class="page" data-page="homePage" data-component="homePage">' +
        '<div class="navbar">' +
            '<div class="navbar-inner">' +
                '<div class="left">' +
                    '<a href="#" data-panel="left" class="link panel-open panel-index">' +
                        '<i class="ms-Icon ms-Icon--GlobalNavButton"></i>' +
                        '<span class="ios-only"></span>' +
                    '</a>' +
                    '<a href="#" class="link {{navbar.backButton.class}} panel-close" data-panel="right">' +
                        '<i class="ms-Icon ms-Icon--{{navbar.backButton.icon}}"></i>' +
                        '<span class="ios-only">{{navbar.backButton.text}}</span>' +
                    '</a>' +
                '</div>' +
                '<div class="title">{{$route.query.title}}</div>' +
                '<div class="right"></div>' +
            '</div>' +
        '</div>' +
        '<div class="page-content">' +
            '<div class="page-content-header"></div>' +
            '<div class="page-content-body"></div>' +
            '<div class="page-content-footer"></div>' +

            '<!--page loader-->' +
            '<div class="content-loader">' +
                '<div class="content-loader-inner">' +
                    '<div class="image-logo lazy lazy-fadein" data-background="{{loader.image}}"></div>' +
                    '<div class="loading-message">{{loader.text}}</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>',
    style: '' +
        '.page[data-component="homePage"] {' +
            'background: #555;' +
            'background: url("assets/img/background.jpg") !important;' + 
            'background-size: cover !important;' + 
        '}' +
        '.page[data-component="homePage"] .page-content{' +
            'background: #555;' +
            'background: linear-gradient(0, rgba(0,0,0,0.9), rgba(0,0,0,0.1)) !important;' + 
        '}' +
        '#env-gif {height: 100px; position: absolute; bottom: 50px; right: 50px; opacity: 0.5;}' +
        '.home-card-header-pic {' +
            'float: left;' +
            'height: 165px !important;' +
            'overflow: hidden;' +
            'width: calc(100% - 20px);' +
        '}' +
        '.home-card-header-pic:active{' +
            'top:2px;' +
            '-webkit-box-shadow: 0px 0px 0px 1px rgb(219, 219, 219);' +
            'box-shadow: 0px 0px 0px 1px rgb(219, 219, 219);' +
        '}        ' +
        '.home-card-header-pic .card-header {' +
            'color: #fff;' +
            'height: 100px;' +
            'background-color: #f2f2f2;' +
            'background-size: cover;' +
            'background-position: center;' +
            'background-repeat: no-repeat;' +
        '}' +
        '.home-card-header-pic:hover{' +
            'background-color:#fcefe4 !important;' +
            '-webkit-box-shadow: 0px 1px 2px rgb(230, 83, 1);' +
            'box-shadow: 0px 1px 2px rgb(230, 83, 1);' +
        '}' +
        '.home-card-header-pic .card-content-padding .date{' +
            'color: #8e8e93;' +
        '}' +
        '.home-card-header-pic .card-content-padding .title{' +
            'font-size: 1rem;' +
            'margin: 0;' +
            'line-height: 1.125;' +
            'font-weight: bold;' +
            'color:#333;' +
        '}' +
        '.home-card-header-pic .card-content-padding .description{' +
            'font-size: .9375rem;' +
            'line-height: 1.33;' +
            'margin: 6px 0 0;' +
            'padding: 0;' +
            'color:#333;' +
            'display:none;' +
        '}' +
        '.home-card-header-pic:hover .card-content-padding .title,' +
        '.home-card-header-pic:hover .card-content-padding .description{' +
            'color:#6a6158;' +
        '}' +

        '/* CSS query media */' +
        '@media (min-width: 600px) {' +
            '.home-card-header-pic {' +
                'width: calc(50% - 20px) !important;' +
            '}' +
        '}' +
        '@media (min-width: 900px) {' +
            '.home-card-header-pic {' +
                'width: calc(33% - 20px) !important;' +
            '}' +
        '}' +
        '@media (min-width: 1200px) {' +
            '.home-card-header-pic {' +
                'width: calc(33% - 20px) !important;' +
            '}' +
        '}',
    data: function () {
        var self = this;
        var methods = self.$options.methods;
        
        return {
            uuid: null,
            title: 'Portal de Fiscalizaciones',
            description: 'Here comes paragraph within content block. Donec et nulla auctor massa pharetra adipiscing ut sit amet sem. Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam mollis, vulputate turpis vel, sagittis felis.',
            image: methods.getPageComponentImage(),
            components: {},
            item: {},
            xhr: null,
            loader: {
                text: methods.getLoadingMessage(),
                image: methods.getLoadingImage()
            },
            navbar: {
                backButton: {
                    icon: 'Back',
                    class: 'back',
                    text: 'Cerrar',
                },
            }
        };
    },
    methods: {
        _getPage: function(){
            return {};
        },

        _getPageContext: function(){
            return {};
        },

        // {string} retorna el título del componente
        getTitle: function(){
            return 'Managment System';
        },
        // {string} retorna la descripción del componente
        getDescription: function(){
            return '';
        },

        // {fn} desaparecer DOM de cargar
        removePageLoader: function(){
            var page = this._getPage(),
                $loader = page.$el.find('.content-loader');

            if (!$loader.hasClass('ms-fadeOut100'))
                page.$el.find('.content-loader').removeClass('ms-fadeIn100').addClass('ms-fadeOut100');
        },

        // {fn} hacer visible el DOM de cargar
        addPageLoader: function(){
            var page = this._getPage(),
                $loader = page.$el.find('.content-loader');

            if ($loader.hasClass('ms-fadeOut100'))
                page.$el.find('.content-loader').removeClass('ms-fadeOut100').addClass('ms-fadeIn100');
        },

        // {fn} funcion que renderiza o no DOM en header
        renderHeader: function($header){
            var title = this.getTitle();
            var description = this.getDescription();

            var html = `
                <div class="ms-fontSize-xxl" style="padding: 20px 20px 0 20px;">` + title + `</div>
                <div class="ms-fontSize-m" style="padding: 20px">` + description + `</div>
            `;

            $header.html(html);
        },

        // {fn} funcion que renderiza o no DOM en footer
        renderFooter: function($footer){

        },

        // {string} devuele el título de la lista
        getListTitle: function(){
            return 'TiposSolicitud';
        },

        // {string} devuelve en formato CAML las columnas por las que debe ordernar
        // Ej: /sites/subsite/folder1/folder2
        getFolderServerRelativeUrl: function(){
            return null;
        },

        // {object} retornar objecto con la metadata a actualizar cada uno de los archivos a cargar
        getFilesMetadata: function(){
            return null;
        },

        // {fn} retorna la imagen del componente
        getPageComponentImage: function(){
            return 'https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/svg/sharepoint_48x1.svg';
        },

        // {fn} retorna la imagen del carga del componente
        getLoadingImage: function(){
            return './assets/img/arauco_loading.png';
        },

        // {fn} retorna el mensaje de carga del componente
        getLoadingMessage: function(){
            return app.language != 'es-ES' ? 'Wait a moment please' : 'Espere un momento por favor';
        },

        // {fn} retorna la url de la imagen del mosaico
        getTileImage: function(title){
            var image = {
                'Descripción de roles': './assets/img/img2.png',
                'default': './assets/img/img1.png'
            };

            return image[title] || image['default'];
        },

        // {string} template de tile de tipo de solicitudes
        renderTile: function(item){
            var title = item.Title,
                solicitudId = item.ID || item.Id,
                image = this.getTileImage(title),
                //serverRelativeUrl = spo.getSiteUrl().replace('https://arauco.sharepoint.com','') + 'HojasTrabajo',
                description = item.Description || 'Quisque eget vestibulum nulla. Quisque quis dui quis ex ultricies efficitur vitae non felis.',
                href = item.Href;
            
            return `
                <a href="` + href + `" class="card home-card-header-pic">
                    <div data-background="` + image + `" class="card-header align-items-flex-end lazy lazy-fadein"></div>
                    <div class="card-content card-content-padding">
                        <div class="title">` + title + `</div>
                        <div class="description">` + description + `</div>
                    </div>
                </a>
            `;
        }
    },
    on: {
        pageInit: function(e, page) {
            // variables
            var self = this,
                mths = self.$options.methods,
                context = self.$options.data();
            
            // blocks
            var $container = $(page.$el),
                $bodyContent = $container.find('.page-content-body'),
                $headerContent = $container.find('.page-content-header'),
                $footerContent = $container.find('.page-content-footer');

            // definir un uuid único por página y contexto
            context.uuid = generateUUID();
            $container[0].setAttribute('data-uuid', context.uuid);

            // definir entra de valores de página
            mths._getPage = function(){
                return page;
            };

            // definir función de contexto
            mths._getPageContext = function(){
                return context;
            };

            // renderizar HTML de header y footer
            mths.renderHeader($headerContent);
            mths.renderFooter($footerContent);

            var tilesHtml = '<img id="env-gif" src="assets/img/env2.gif">';
            var menus = [
                /*{
                    Title: 'Nuevo Formulario',
                    Href: '/form'
                },
                {
                    Title: 'Listado de productos',
                    Href: '/liststream?title=Productos&listtitle=sodimacProductos&listview=Todos los elementos&template=list-row'
                }*/
            ];

            for (var i = 0; i < menus.length; i++){
                tilesHtml += mths.renderTile(menus[i]);
            }

            $bodyContent.html(tilesHtml);
            mths.removePageLoader();
            $container.find('img.lazy, div.lazy').each(function(index, el){
                app.lazy.loadImage(el);
            });

            /* test */

            /*var params = {
                paging: '',
                rowLimit: 100,
                datesInUtc: 'true',
                renderOptions: 4103,
                inplaceSearchQuery: '',
                recursiveScope: false,
                folderServerRelativeUrl: null,
                viewFields: '<FieldRef Name="Title"/>' + 
                            '<FieldRef Name="nivelA"/>' +
                            '<FieldRef Name="nivelB"/>' +
                            '<FieldRef Name="ID"/>',
                camlOrder: '<FieldRef Name="ID" Ascending="False" />',
                camlWhere: '',
                camlGroup: '<GroupBy Collapse="TRUE">' + 
                                '<FieldRef Name="nivelA"/>' +
                            '</GroupBy>',
            };*/

            /*
            var url = 'https://grupoenvision.sharepoint.com/Proyectos/sistema/',
                listTitle = 'metabrowser',
                listViewId = '';*/
            /*spo.getItemsAsStream(url, listTitle, listViewId, params, function(results){
                console.log(results);
            }, function(results){
                console.log('fail')
            })*/

            /*
            var minId, maxId;

            var params2 = {
                rowLimit: 5000,
                renderOptions: 4103,
                inplaceSearchQuery: '',
                recursiveScope: false,
                folderServerRelativeUrl: null,
                viewFields: '<FieldRef Name="ID"/>',
                camlOrder: '<FieldRef Name="ID" Ascending="True" />',
                camlWhere: ''
            };

            console.log('id min!!!');
            spo.getListItemsAsStream(url, listTitle, listViewId, params2, function(data){
                console.log('minId data',data);
            }, function(data){
                console.log('fail3', data);
            })


            var params3 = {
                rowLimit: 5000,
                renderOptions: 4103,
                inplaceSearchQuery: '',
                recursiveScope: false,
                folderServerRelativeUrl: null,
                viewFields: '<FieldRef Name="ID"/>',
                camlOrder: '<FieldRef Name="ID" Ascending="False" />',
                camlWhere: ''
            };

            spo.getListItemsAsStream(url, listTitle, listViewId, params3, function(data){
                console.log('maxId data',data);
            }, function(data){
                console.log('fail4', data);
            })
            spo.getListInfo(listTitle,
                function (response) {
                    var query = spo.encodeUrlListQuery(response, {
                        view: 'Todos los elementos',
                        odata: {
                            'filter': '',
                            'select': 'ID',
                            'expand': '',
                            'orderby': 'ID desc',
                            'top':1,

                        }
                    });


                    spo.getListItems(url, listTitle, query, function(data){
                        console.log('odata ok', data)
                    }, function(data){
                        console.log('odata fail', data)
                    });
            });*/


            /* fin test */
        },
        pageBeforeIn: function(e, page) {
            // console.log('pageBeforeIn', page);
        },
        pageMounted: function(e, page) {
            // console.log('pageAfterIn', page);
        },
        pageBeforeOut: function(e, page) {
            // console.log('pageBeforeOut', page);
        },
        pageAfterOut: function(e, page) {
            // console.log('pageAfterOut', page);
        },
        pageBeforeRemove: function(e, page) {
            var ctx = this.$options.data(),
                mths = this.$options.methods;

            // destruir instancia de componentes
            for (var key in ctx.components){
                ctx.components[key].destroy();
            }
        }
    }
};