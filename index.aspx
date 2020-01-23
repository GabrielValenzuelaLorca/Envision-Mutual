<!DOCTYPE html>
<!--<html manifest="app2.appcache" xmlns:mso="urn:schemas-microsoft-com:office:offic<!--e" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">-->
<html xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">
	<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Security-Policy" content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:">
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui, viewport-fit=cover">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="default">
	<!--<meta name="theme-color" content="#9c27b0">-->
	<meta name="format-detection" content="telephone=no">
	<meta name="msapplication-tap-highlight" content="no">
	<title></title>
	<link rel="stylesheet" href="https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/3.0.8/framework7.3.1.1.css">
	<link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/7.3.0/css/fabric.min.css">
	<link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/9.6.0/css/fabric.min.css">
	<link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.4.0/css/fabric.min.css">
	<link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-js/1.4.0/css/fabric.components.min.css">
	<link rel="stylesheet" href="css/custom.css?v=1">

	<!--<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"></script>-->
	<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
	<mso:CustomDocumentProperties>
	<mso:Order msdt:dt="string">1100.00000000000</mso:Order>
	<mso:FSObjType msdt:dt="string">0</mso:FSObjType>
	<mso:FileDirRef msdt:dt="string">sites/envision365/efw/app/DSR3.0</mso:FileDirRef>
	<mso:ContentTypeId msdt:dt="string">0x0101005CA03F08D642A1428CCFF2516A2631C7</mso:ContentTypeId>
	<mso:FileLeafRef msdt:dt="string">index.aspx</mso:FileLeafRef>
	<mso:ContentType msdt:dt="string">Documento</mso:ContentType>
	</mso:CustomDocumentProperties>
	</xml></SharePoint:CTFieldRefs><![endif]-->
	<style>body {
		background-image: url("assets/img/env.gif") !important;
	    background-position: center !important;
    	background-repeat: no-repeat !important;
    	background-color: #2f2f2f !important;
    	background-size: 100px !important;
	}</style>
</head>
	<body class="color-theme-pink" style="">
		<div id="app">
			<!-- Status bar overlay for fullscreen mode-->
			<div class="statusbar"></div>
			<!-- Left panel with reveal effect when hidden -->
			<div class="panel panel-left panel-cover">
				<div class="view view-left">
					<div class="page">
					</div>
				</div>
			</div>
			<!-- Right panel with cover effect -->
			<div class="panel panel-right panel-cover">
				<div class="view">
					<div class="page">
						<div class="navbar">
							<div class="navbar-inner">
								<div class="title">Right Panel</div>
							</div>
						</div>
						<div class="page-content">
							<div class="block">Right panel content goes here</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Your main view, should have "view-main" class -->
			<div class="view view-main ios-edges">
				<!-- Page, data-name contains page name which can be used in callbacks -->
				<div class="page" data-name="">
				</div>
			</div>
			<!-- Popup -->
			<div class="popup" id="my-popup">
				<div class="view">
					<div class="page">
						<div class="navbar">
							<div class="navbar-inner">
								<div class="title">Popup</div>
								<div class="right">
									<a href="#" class="link popup-close">Close</a>
								</div>
							</div>
						</div>
						<div class="page-content">
							<div class="block">
								<p>Popup content goes here.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Cordova -->
		<!--
			<script src="cordova.js"></script>
			-->
		<!-- (Script only executed in IE) FormData and Object.values/entries Polyfill -->
		<script type="text/javascript">
		    if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
		        document.write('<script src="https://unpkg.com/formdata-polyfill"><\/script>');
		        document.write('<script src="https://unpkg.com/es7-object-polyfill"><\/script>');
		    }
		</script>
		<!-- Path to JQuery Library JS-->
		<script type="text/javascript" src="https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/libs/jquery.min.js"></script>  
		<!-- Framework7 library -->
		<script src="https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/3.0.8/framework7.3.1.1.js"></script>
		<!-- Moment library -->
		<script src="https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/libs/moment.min.js"></script>
        <script src="https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/libs/es.js"></script>
        <!-- XLSX Js library -->
        <script src="https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/libs/xlsx.full.min.js"></script>
		<!-- FileSaver library -->
        <script src="https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/libs/FileSaver.min.js"></script>
        <!-- jsPDFs library -->
        <script type="text/javascript" src="https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/libs/jspdf.min.js"></script>
		<script src="https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/libs/jspdf.plugin.autotable.js"></script>
		
		<!-- App routes -->
		<script type="text/javascript">
			function efwLoad(){
				var timeAux = Date.now();
				// load styles & title & favicon
				document.title = global.appName;
				var link = document.createElement('link');
				link.type = 'image/x-icon';
				link.rel = 'shortcut icon';
				link.href = "https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/themes/" + global.theme + "/" + global.theme + "-favicon.png";
				document.getElementsByTagName('head')[0].appendChild(link);
				
				link = document.createElement('link');
				link.type = 'text/css';
				link.rel = 'stylesheet';
				link.href = "https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/" + (global.efwDev ? 'developer/' : '') + global.efwVersion + "/EFWComponents.css";
				document.getElementsByTagName('head')[0].appendChild(link);

				link = document.createElement('link');
				link.type = 'text/css';
				link.rel = 'stylesheet';
				if(typeof localStorage.globalTheme != 'undefined'){
					global.theme = localStorage.globalTheme
				}
				link.href = "https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/themes/" + global.theme + "/" + global.theme + ".css";
				//document.getElementsByTagName('head')[0].appendChild(link);
				global["currentThemeCSS"] = document.getElementsByTagName('head')[0].appendChild(link);

				// load js
				var EFWScriptsArray = [
					"https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/" + (global.efwDev ? 'developer/' : '') + global.efwVersion + "/EFWComponents.js",
					"https://publiccdn.sharepointonline.com/grupoenvision.sharepoint.com/CDN/EFW/" + (global.efwDev ? 'developer/' : '') + global.efwVersion + "/EFWF7Components.js",
				];

				function loadScripts(scriptsArray) {
					var loaded = {};

					function loadScript(script, isLastScript) {
						isLastScript = typeof isLastScript !== 'undefined' ? isLastScript : false;
						var urlAux = script + "?ver=" + timeAux;
						var s = document.createElement("script");
						s.type = "text/javascript";
						s.src = urlAux;
						s.onload = function () {
							loaded[script] = true;
							//console.log("Loaded: " + this.src);
							if (isLastScript) {
								if (scriptsArray == EFWScriptsArray)
									loadScripts(AppScriptsArray);
							}
							else
								semaforo();
						}; // notifica que se cargó
						document.getElementsByTagName('body')[0].appendChild(s);
					}

					function semaforo() {
						for (var i = 0; i < scriptsArray.length - 1; i++) {
							if (!loaded[scriptsArray[i]])
								return;
						}
						loadScript(scriptsArray[scriptsArray.length - 1], true);
					};

					for (var i = 0; i < scriptsArray.length - 1; i++) {
						(function (i) {
							loadScript(scriptsArray[i]);
						})(i)
					}
				}

				if (EFWScriptsArray.length)
					loadScripts(EFWScriptsArray);
				else
					loadScripts(AppScriptsArray);
			}

			var s = document.createElement("script");
			s.type = "text/javascript";
			s.src = "js/config.js";
			s.onload = function () {
				efwLoad();
			};
			document.getElementsByTagName('body')[0].appendChild(s);
        </script>
    
	</body>
</html>