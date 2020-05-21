class SimuladorRenta{
    constructor(){
        this.zona =[]
        this.sueldobase = []
        this.antiguedad =[]
        this.factores = []
        this.ipc = []
        this.uf = []
    }

    async init(){
        var zonaPromise = getPromiseListItems(spo.getSiteUrl(),'Simulador_Zona','?$select=*')
        .then(c =>{
            this.zona = c.d.results
        })

        var sueldoPromise = getPromiseListItems(spo.getSiteUrl(),'Simulador_SueldoBase','?$select=*')
        .then(c =>{
            this.sueldobase = c.d.results
        })

        var antiguedadPromise = getPromiseListItems(spo.getSiteUrl(),'Simulador_Antiguedad','?$select=*')  
        .then(c =>{
            this.antiguedad = c.d.results
        })

        var factoresPromise = getPromiseListItems(spo.getSiteUrl(),'Simulador_Factores','?$select=*')  
        .then(c =>{
            this.factores = c.d.results
        })

        var ipcPromise = getPromiseListItems(spo.getSiteUrl(),'Simulador_Ipc','?$select=*')  
        .then(c =>{
            this.ipc = c.d.results
        })

        var ufPromise = getPromiseListItems(spo.getSiteUrl(),'Simulador_Uf','?$select=*')  
        .then(c =>{
            this.uf = c.d.results
        })

        return Promise.all([zonaPromise,sueldoPromise,antiguedadPromise,factoresPromise,ipcPromise,ufPromise])

    }

    calcular(categoria, zona, anios){
        debugger
        var sueldoBase = this.sueldobase.find(c => c.categoria === categoria)
        var asignaciones_extra = this.factores.find(c => c.esc_esp === sueldoBase.esc)
        var asignacion_anios = this.antiguedad.find(c => c.anios === anios)
        var asignacion_zona = this.zona.find(c => c.ubicacion === zona)

        var remu = 0
        console.log("S.Base --> " + sueldoBase.sbase)
        remu += sueldoBase.sbase
        console.log("Bono Compensatorio --> " + sueldoBase.bono_comp)
        remu += sueldoBase.bono_comp
        console.log("Trab. Terreno--> " + sueldoBase.trab_terreno)
        remu += sueldoBase.trab_terreno

        if(sueldoBase.esc === "M"){
            console.log("Antiguedad/Permanencia (Medico)--> " + sueldoBase.sbase * asignacion_anios.medico)
            remu += sueldoBase.sbase * asignacion_anios.medico
        }
        else if(sueldoBase.esc === "L"){
            console.log("Antiguedad/Permanencia (Medico L)--> " + sueldoBase.sbase * asignacion_anios.medico_l)
            remu += sueldoBase.sbase * asignacion_anios.medico_l
        }
        else{
            console.log("Antiguedad/Permanencia (General)--> " + sueldoBase.sbase * asignacion_anios.general)
            remu += sueldoBase.sbase * asignacion_anios.general
        }

        console.log("Asig. Titulo--> " + sueldoBase.sbase * asignaciones_extra.titulo)
        remu +=   sueldoBase.sbase * asignaciones_extra.titulo
        console.log("Gratificacion-->" + sueldoBase.sbase * asignaciones_extra.grati)
        remu += asignaciones_extra.grati

        if(sueldoBase.esc === "M" || sueldoBase.esc === "L"){
            console.log("Asig. Zona (Exp?)-->" + sueldoBase.sbase * asignacion_zona.asig_z_exp)
            remu += sueldoBase.sbase * asignacion_zona.asig_z_gral
        }
        else{
            console.log("Asig. Zona (Gral?)-->" + sueldoBase.sbase * asignacion_zona.asig_z_gral)
            remu += sueldoBase.sbase * asignacion_zona.asig_z_gral
        }


        console.log("Asig. Estimulo-->" + sueldoBase.sbase * asignaciones_extra.estimulo)
        remu += sueldoBase.sbase * asignaciones_extra.estimulo
        console.log("Turno llamado-->" + sueldoBase.sbase * asignaciones_extra.llamado)
        remu += sueldoBase.sbase * asignaciones_extra.llamado
        console.log("Asig. Resp. Lugar. Trab.-->" + sueldoBase.sbase * asignaciones_extra.resp_tl)
        remu += sueldoBase.sbase * asignaciones_extra.resp_tl
        console.log("Bono Entr. Turno-->" + asignaciones_extra.bono_ent_t)
        remu += asignaciones_extra.bono_ent_t
        console.log("Asig. Movilizacion-->" + asignaciones_extra.movilizacion)
        remu += asignaciones_extra.movilizacion
        console.log("Bono casa-->" + asignaciones_extra.bono_casa)
        remu += asignaciones_extra.bono_casa
        console.log("Asig. Caja-->" + asignaciones_extra.asigna_caja)
        remu += asignaciones_extra.asigna_caja
        console.log("Asig. Especialidad-->" + sueldoBase.sbase * sueldoBase.esp)
        remu += sueldoBase.sbase * sueldoBase.esp
        console.log("Asig. Sub Especialidad-->" + sueldoBase.sbase * sueldoBase.sub)
        remu += sueldoBase.sbase * sueldoBase.sub

        console.log("--------------")
        console.log("Remuneracion Bruta Mensual: " + remu)

    }


}

var SimuladorPage ={
    template: `
    <div class="page">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="link back">
                        <i class="ms-Icon ms-Icon--Back"></i>
                        <span class="ios-only">Volver</span>
                    </a>
                </div>
                <div class="title"></div>
  
            </div>
        </div>
        <div class="page-content">
            <div class="row">
                <div class="col-30">
                    <div class="cargoListContainer"></div>
                </div>
                <div class="col-70 detailsContainer">
               
                    
                </div>

            </div> 
            
            
            <div class="content-loader">
                <div class="content-loader-inner">
                    <div class="image-logo lazy lazy-fadein" data-background="{{loader.image}}"></div>
                    <div class="loading-message">{{loader.text}}</div>
                </div>
            </div>
        </div>
    </div>
    `,
    style: `
    `,
    data: function() {
        var self = this;
        return {
            title: '',
            forms: {},
            tables: {},
            loader: {
                text: 'Espere un momento por favor',
                image: ''
            }
        }
    },
    methods: {
        _getPage() {
            return {}
        },
  
        generateUUID: function(prefix){
            function guid() {
                var date = new Date(),
                    year = date.getFullYear(),
                    month = date.getMonth() > 9 ? ('0' + date.getMonth()) : date.getMonth();
                return prefix ? prefix + '-' + year + '-' + month + s4() : year + '-' + month + s4();
            }
              
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
              
            return guid().toUpperCase();
        },
  
        getTitle: function() {
            var page = this._getPage();
            return page.route.query.title || 'Componente';
        },

    
    },
    on: {
        pageInit: function (e, page) {
            // variables
            var context = this.$options.data(),
                mths = this.$options.methods,
                listItemId = page.route.query.listItemId
                console.log('itemid',listItemId);

            context.methods = mths;
            context.simuladorRenta = new SimuladorRenta()

            // definir entra de valores de página
            mths._getPage = function () {
                return page;
            };

            mths._getPageContext = function () {
                return context;
            };

            var initClass = async function() {
                await context.simuladorRenta.init()
                debugger
                context.simuladorRenta.calcular("P-5", "ANTOFAGASTA", 0)
            
            }
            initClass()


        

        },
        pageMounted: function(e, page) {
        },
        pageBeforeIn: function(e, page) {
        },
        pageAfterIn: function(e, page) {
        },
        pageBeforeOut: function(e, page) {
        },
        pageAfterOut: function(e, page) {
        },
        pageBeforeRemove: function(e, page) {
            
            var data = this.$options.data();
            console.log(data)
            for (var key in data.forms) {
                data.forms[key].destroy();
            }
            for (var key in data.tables) {
                data.tables[key].destroy();
            }
        }
    }
  };