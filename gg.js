angular.module('WebTrspModule').controller("ListCmdController", ['$rootScope', '$alert','NgMap', '$scope', '$uibModal', '$http', '$log', '$window', '$timeout', '$compile', '$q', '$sce', '$filter', '$location', 'hotRegisterer', '$mdDialog', 'cmdService', 'tvaService', 'clientService', 'interService', 'affService', 'vehService', 'apiService', 'pdfService', 'googleService', 'mailService', 'facVService', 'facAService', 'autoCom', 'listOfLg', 'comService', 'phoneService', function ($rootScope, $alert,NgMap, $scope, $uibModal, $http, $log, $window, $timeout, $compile, $q, $sce, $filter, $location, hotRegisterer, $mdDialog, cmdService, tvaService, clientService, interService, affService, vehService, apiService, pdfService, googleService, mailService, facVService, facAService, autoCom, listOfLg, comService, phoneService) {
	$scope.showTimeLine = false;
	$scope.waitInsert = false;
	$scope.isCmdSetted = false;
	$scope.cmdUpdate = false;
	$scope.selectedRowData = {};
	$scope.isLivSetted = false;
	$scope.isEnSetted = false;
	$scope.isCliSetted = false;  
	$scope.showFiltreMore = false;
	$scope.isAfSetted = false;
	$scope.theSelectedL = [];
	$scope.db = [];
	$scope.En = [];
	$scope.En.edited = false;
	$scope.Liv = [];  
	$scope.Liv.edited = false;
	$scope.findFile = false;
	$scope.nbrCmdFiles = 0;
	$scope.loadingCmd = false;
	$scope.acceptDelKey = false;
	$scope.columnFilter = '';
	// $scope.ctrlBtn = false
	var allIdSelec = [];
	$scope.allIdSelecAf = [];
	$scope.allIdSelecDist = [];
	var alerTimer;
  
	$scope.nbrCliFaUnpay = 0;
  
	var limit = 100;
  
	$scope.loadingCmds = true;
  
	$scope.searchTable = [];
	$scope.searchTable.value = '';
  
	$scope.modalActive = false;
	$scope.sideBarShow = false;
	$scope.Com = [];
	$scope.ctrlBtn = false;
	$scope.allselected = 0;
  
	$scope.Com.Exploit = '';
	$scope.testmodel = '';
  
	$scope.part = [];
	$scope.NbrVal = 0;
	$scope.totalPages = 1;
	$scope.thePage = 1;
  
	routeEn = "";
	routeLiv = "";
	routeV = "";
	routeV2 = "";
	$scope.cell = [];
  
	var limitPage = 100;
	var firstRowSelect;
	var lastRowSelect;
	var selectEditor = Handsontable.editors.BaseEditor.prototype.extend();
  
	$scope.Cli = [];
	$scope.En = [];
	$scope.Liv = [];
	$scope.Af = [];
  
	$scope.format = 'dd-MM-yyyy';
	$scope.Filtre = [];
	$scope.dateOptions = {
	  formatYear: 'yy',
	  startingDay: 1
	};
  
	$scope.listOfLg = [];
	$scope.autoCom = [];
  
	for (var x = 0; x < autoCom.data.length; x++) {
	  $scope.autoCom.push({ text: autoCom.data[x].Libelle, value: autoCom.data[x].Com })
	}
	for (var x = 0; x < listOfLg.data.length; x++) {
	  $scope.listOfLg.push({ text: listOfLg.data[x].name, value: listOfLg.data[x].language })
	}
  
	$scope.tinymceComI = {
	  menubar: false,
	  max_height: 92,
	  max_height: 125,
	  height: 125,
	  max_width: 500,

	  branding: false,
	  elementpath: false,
	  resize: false,
	  statusbar: false,
	  toolbar1: 'example | traduction |  listFields | styleselect bold italic forecolor textcolor  ',
	  plugins: 'image table link paste contextmenu textpattern autolink textcolor colorpicker',
	  contextmenu: "copy",
  
	  setup: function (ed) {
  
		ed.on("KeyUp", function (e) {
		  if ($scope.isCmdSetted && !$scope.isCmdFa) {
			console.log("e.content")
			console.log(e)
			console.log(e.currentTarget.innerHTML)
			$scope.inputKeyUp('ComExploit', $scope.Com.Exploit)
			// $scope.inputKeyUp('ComExploit',e.currentTarget.innerHTML)
		  }
		});
  
		function monitorNodeChange() {
		  console.log("monitorNodeChange")
		  console.log(!$scope.isCmdSetted || $scope.isCmdFa)
		  var btn = this;
		  $scope.$watch('loadingCmd', function (newValue, oldValue) {
			if (newValue === false) {
			  if (!$scope.isCmdSetted || $scope.isCmdFa) {
				btn.disabled(true);
			  }
			  else
				btn.disabled(false);
			}
		  });
		}
		ed.addButton('example', {
		  text: 'Commentaires Exploitation ',
		  classes: "title_com",
		  style: 'color:green',
		  onclick: function () {
			ed.focus();
		  }
		});
  
		ed.addButton('listFields', {
		  type: 'listbox',
		  text: 'Raccourcis',
		  icon: false,
		  onselect: function (e) {
			console.log("e");
			console.log(e);
			ed.insertContent(this.value());
			$scope.inputKeyUp('ComExploit', $scope.Com.Exploit)
			// $timeout(function() {
			// }, 200);
		  },
		  values: $scope.autoCom,
		  onpostrender: monitorNodeChange
		});
		ed.addButton('traduction', {
		  type: 'listbox',
		  text: 'Traduction',
		  icon: false,
		  onselect: function (e) {
			$scope.Translate(this.value(), "Exploit")
		  },
		  values: $scope.listOfLg,
		  onpostrender: monitorNodeChange
		});
	  },
	  insert_toolbar: 'quickimage quicktable',
	  paste_data_images: true
	};
  
	$scope.tinymceComFact = {
	  menubar: false,
	  max_height: 92,
	  max_width: 500,
	  branding: false,
	  elementpath: false,
	  resize: false,
	  statusbar: false,
	  toolbar1: 'example | traduction  |  listFields | styleselect bold italic forecolor textcolor ',
	  // toolbar1: 'example  |  listFields | styleselect bold italic forecolor textcolor alignleft aligncenter alignright alignjustify bullist numlist outdent indent | traduction ',
	  plugins: 'image table link paste contextmenu textpattern autolink textcolor colorpicker',
	  contextmenu: "copy",
	  setup: function (ed) {
  
		ed.on("KeyUp", function (e) {
		  if ($scope.isCmdSetted && !$scope.isCmdFa) {
			console.log("e.content")
			console.log(e)
			console.log(e.currentTarget.innerHTML)
			$scope.inputKeyUp('ComClient', e.currentTarget.innerHTML)
		  }
		});
  
		function monitorNodeChange2() {
		  var btn = this;
		  // loadingCmd
		  $scope.$watch('loadingCmd', function (newValue, oldValue) {
			if (newValue === false) {
			  if (!$scope.isCmdSetted || $scope.isCmdFa) {
				btn.disabled(true);
			  }
			  else
				btn.disabled(false);
			}
		  });
		}
		ed.addButton('example', {
		  text: 'Commentaires Facturation ',
		  classes: "title_com",
		  style: 'color:red',
		  onclick: function () {
			ed.focus();
		  }
		});
  
		ed.addButton('listFields', {
		  type: 'listbox',
		  text: 'Raccourcis',
		  icon: false,
		  onselect: function (e) {
			ed.insertContent(this.value());
			$scope.inputKeyUp('ComClient', e.currentTarget.innerHTML)
		  },
		  values: $scope.autoCom,
		  onpostrender: monitorNodeChange2
		});
  
		ed.addButton('traduction', {
		  type: 'listbox',
		  text: 'Traduction',
		  icon: false,
		  onselect: function (e) {
			$scope.Translate(this.value(), 'Client')
		  },
		  values: $scope.listOfLg,
		  onpostrender: monitorNodeChange2
		});
	  },
	  insert_toolbar: 'quickimage quicktable',
	  paste_data_images: true
	};
  
	$scope.prop = {
	  "values": ["tout", "Num. Dossier", "Num. Fact. Vente", "Code Client", "Reference", "Code Affrété", "MaleTaxe"],
	  "filtre": "Num. Dossier"
	};
  
	$scope.DateFiltre = {
	  "values": ["saisie", "Enlevement", "Livraison"],
	  "filtre": "Enlevement"
	};
  
	$scope.TypeMetier = {
	  "values": ["Commi / Distri", "Commission", "Distribution"],
	  "filtre": "Commi / Distri"
	};
  
	componentForm = {
	  street_number: 'short_name',
	  route: 'long_name',
	  locality: 'long_name',
	  administrative_area_level_1: 'short_name',
	  country: 'short_name',
	  postal_code: 'long_name'
	};
  
	$scope.db.rowHeaders = false;
	$scope.db.colHeaders = true;
	$scope.db.settings = {
	  afterInit: afterInit(),
	  contextMenu: true
	};
  
	var regex = /[?&]([^=#]+)=([^&#]*)/g,
	  url = $location.absUrl(),
	  params = {},
	  match;
  
	while (match = regex.exec(url)) {
	  params[match[1]] = match[2];
	}
  
	var data = [];
	$scope.countFold = 0;
	$scope.username = $rootScope.user.username;
	$scope.owner = $rootScope.user.id;
  
	var placeHolders = {
	  "CodeClient": "*****",
	  "CodeEn": "*****",
	  "CodeLiv": "*****",
	  "DateEn": "DDMMYYYY",
	  "dateLiv": 'DDMMYYYY',
	  "HeureEn": 'Cliquer F2',
	  "HeureLiv": 'Cliquer F2 '
	};
  
	$scope.columns = [
	  {
		data: 'Marge',
		readOnly: true,
		className: 'htMiddle htCenter'
	  },
	  {
		data: 'NumDossier',
		readOnly: true,
		className: 'htMiddle htCenter',
		placeholder: placeHolders.NumDossier
	  },
	  {
		data: 'CodeClient',
		type: 'autocomplete',
		source: function (query, process) {
		  if (query.length > 2) {
			$http.get('/Clients/AutoComplete?name=' + query).success(function (response) {
			  myArray = [];
			  angular.forEach(response, function (value, key) {
				myArray.push(value.CodeClient);
			  });
			  process(myArray);
			});
		  } else {
			var myArray = [];
			process(myArray);
		  }
		},
		placeholder: placeHolders.CodeClient
	  },
	  {
		data: 'Reference',
	  },
	  {
		data: 'CodeEn',
		type: 'autocomplete',
		source: function (query, process) {
		  if (query.length > 2) {
			$http.get('/intervenant?where={"CodeInter":{"startsWith":"' + query + '"}}').success(function (response) {
			  myArray = [];
			  angular.forEach(response, function (value, key) {
				myArray.push(value.CodeInter);
			  });
			  $http.get('/clients?where={"CodeClient":{"startsWith":"' + query + '"},"Inter":{"contains":"0"}}').success(function (res) {
				angular.forEach(res, function (value, key) {
				  myArray.push(value.CodeClient);
				});
				process(myArray);
			  });
			});
		  } else {
			var myArray = [];
			process(myArray);
		  }
		},
		placeholder: placeHolders.CodeEn
	  },
	  {
		data: 'DateEn',
		type: 'date',
		dateFormat: 'DD/MM/YYYY',

		correctFormat: true,
		validator: dateValidator,
		renderer: function(instance, td, row, col, prop, value, cellProperties) {
			if (!value) {
			  // Si la valeur est nulle ou indéfinie, laisser la cellule vide
			  td.innerHTML = '';
			} else {
			  // Si la valeur est définie, utiliser le renderer par défaut
			  Handsontable.renderers.TextRenderer.apply(this, arguments);
			}
		  }
	  },
	  {
		data: 'HeureEn',
		readOnly: true,
		correctFormat: true,
		editor: 'f2OnlyEditor',
  
  
  
	  },
	  {
		data: 'CodeLiv',
		type: 'autocomplete',
		source: function (query, process) {
		  if (query.length > 2) {
			$http.get('/intervenant?where={"CodeInter":{"startsWith":"' + query + '"}}').success(function (response) {
			  myArray = [];
			  angular.forEach(response, function (value, key) {
				myArray.push(value.CodeInter);
			  });
			  $http.get('/clients?where={"CodeClient":{"startsWith":"' + query + '"},"Inter":{"contains":"0"}}').success(function (res) {
				angular.forEach(res, function (value, key) {
				  myArray.push(value.CodeClient);
				});
				process(myArray);
			  });
			});
		  } else {
			var myArray = [];
			process(myArray);
		  }
		}
	  },
	  {
		data: 'DateLiv',
		type: 'date',
		dateFormat: 'DD/MM/YYYY',
		correctFormat: true,
		validator: dateValidator,
	  },
	  {
		data: 'HeureLiv',
		readOnly: true,
		editor: 'f2OnlyEditor',
  
  
	  },
	  {
		data: 'MontantV',
		type: 'numeric',
		format: '0,0.00 $',
		// language: 'fr-FR'
	  },
	  {
		data: 'Poids',
		editor: numsEditor,
		className: 'htMiddle htCenter'
	  },
	  {
		data: 'Colis',
		editor: numsEditor,
		className: 'htMiddle htCenter'
	  },
	  {
		data: 'Palettes',
		editor: numsEditor,
		className: 'htMiddle htCenter'
	  },
	  {
		data: 'MetreLin',
		editor: numsEditor,
		className: 'htMiddle htCenter'
	  },
	  {
		data: 'MetreCube',
		editor: numsEditor,
		className: 'htMiddle htCenter'
	  },
	  {
		data: 'CodeTVA',
		type: 'autocomplete',
		source: function (query, process) {
		  $http.get('/tva/AutoComplete?name=' + query).success(function (response) {
			myArray = [];
			angular.forEach(response, function (value, key) {
			  myArray.push(value.CodeTVA + ' - ' + value.Designation + ' - ' + value.Taux);
			});
			process(myArray);
		  });
		},
		className: 'htMiddle htCenter'
	  },
	  {
		data: 'Chauffeur_En',
		readOnly: true
	  },
	  {
		data: 'Chauffeur_liv',
		readOnly: true
	  },
	  {
		data: 'CMR',
		readOnly: true
	  },
	  {
		data: 'TypeVh',
		type: 'autocomplete',
		source: function (query, process) {
		  $http.get('/type_veh/AutoComplete?name=' + query).success(function (response) {
			myArray = [];
			angular.forEach(response, function (value, key) {
			  myArray.push(value.Nom);
			});
			process(myArray);
		  });
		}
	  },
	  {
		data: 'CodeAff',
		type: 'autocomplete',
		source: function (query, process) {
		  if (query.length > 2) {
			$http.get('/Affretes/AutoComplete?name=' + query).success(function (response) {
			  myArray = [];
			  angular.forEach(response, function (value, key) {
				myArray.push(value.CodeAffrete);
			  });
			  process(myArray);
			});
		  } else {
			var myArray = [];
			process(myArray);
		  }
		}
	  },
	  {
		data: 'MontantA',
		type: 'numeric',
		format: '0,0.00 $',
		// language: 'fr-FR'
	  },
	  {
		data: 'ContactAff'
	  },
	  {
		data: 'CodeTVATr',
		type: 'autocomplete',
		source: function (query, process) {
		  $http.get('/tvatr/AutoComplete?name=' + query).success(function (response) {
			myArray = [];
			angular.forEach(response, function (value, key) {
			  myArray.push(value.CodeTVA + ' - ' + value.Designation + ' - ' + value.Taux);
			});
			process(myArray);
		  });
		},
		className: 'htMiddle htCenter'
	  }, {
		data: 'TaxeGaz',
		type: 'numeric',
		format: '0,0.00 $',
		// language: 'fr-FR',
		readOnly: true
	  }, {
		data: 'FactCli',
		readOnly: true
	  },
	  {
		data: 'StatutCli',
		readOnly: true
	  },
	  {
		data: 'FactAffr',
		readOnly: true
	  },
	  {
		data: 'StatutAff',
		readOnly: true,
		className: 'htMiddle htCenter'
	  },
	  {
		data: 'StatutCmd',
		readOnly: true,
		className: 'htMiddle htCenter'
	  },
	  {
		data: 'createdName',
		readOnly: true
	  },
	  {
		data: 'createdAt',
		readOnly: true
	  }
	];
  
	$scope.colHeaders = ['% Marge', 'Dossier', 'Code Client', 'Reference', 'Code Enl.', 'Date Enl.', 'Heure Enl.', 'Code Liv.', 'Date Liv.', 'Heure Liv.', 'Prix Vente', 'Poids', 'Colis', 'Pal.', 'ML', 'm3', 'T.V.A V.', 'Chauffeur Enl.', 'Chauffeur Liv.', 'CMR', 'Type Véhicule', 'Code Affrété', 'Prix Achat', 'Contact Affr.', 'T.V.A A.', 'Taxe Gaz.', 'Fact. Cli.', 'Statut Cli.', 'Fact. Affr.', 'Statut Aff.', 'Statut Cmd.', 'Créer Par', 'Saisie le'];
  
	$('form').attr('autocomplete', 'off');
	$('input').attr('autocomplete', 'off');
  
	if (!io.socket.alreadyListeningToOrders) {
	  io.socket.alreadyListeningToOrders = true;
	  io.socket.on('ordergrid', function onServerSentEvent(msg) {
		console.log(msg);
		switch (msg.verb) {
		  case 'created':
			break;
		  case 'updated':
			for (var i = 0; i < $scope.part.length; i++) {
			  if ($scope.part[i].id === msg.id) {
				var allDatas = msg.data.name[0];
				if (allDatas.DateEn === null)
				  allDatas.DateEn = "";
				else
				  allDatas.DateEn = moment(allDatas.DateEn).format($rootScope.formatDateM);
  
				if (allDatas.DateLiv === null)
				  allDatas.DateLiv = "";
				else
				  allDatas.DateLiv = moment(allDatas.DateLiv).format($rootScope.formatDateM);
  
				$scope.part[i] = allDatas;
				break;
			  }
			  console.log('User  has been updated to ');
			}
			break;
		  default: return;
		}
	  });
	}
  
	angular.element(document).ready(function () {
	  $scope.$watch('$root.f1Click', function (newValue, oldValue) {
		console.log('watck f1');
		if (typeof oldValue != 'undefined' && oldValue != 'undefined') {
		  if ($scope.modalActive === false)
			$scope.addRow();
		}
	  });
	});
  
	$scope.$watch('$root.updateCmd', function () {
	  console.log('watcher rootupdate');
	  var founded2 = isAttrInArr($rootScope.updateCmd.NumDossier, $scope.part, "NumDossier");
	  if (founded2 !== false) {
  
		if ($rootScope.updateCmd.DateEn === null)
		  $rootScope.updateCmd.DateEn = "";
		else
		  $rootScope.updateCmd.DateEn = moment($rootScope.updateCmd.DateEn).format($rootScope.formatDateM);
  
		if ($rootScope.updateCmd.DateLiv === null)
		  $rootScope.updateCmd.DateLiv = "";
		else
		  $rootScope.updateCmd.DateLiv = moment($rootScope.updateCmd.DateLiv).format($rootScope.formatDateM);
  
		$rootScope.updateCmd.createdAt = moment($rootScope.updateCmd.createdAt).format('DD/MM/YY HH:mm');
  
		$scope.part[founded2] = $rootScope.updateCmd;
	  }
	}, true);
  
	$scope.$watch('$root.createCmd', function () {
	  console.log('watcher createCmd');
	}, true);
  
	$scope.$watch("En.edited", function (newValue, oldValue) {
	  console.log('watch en')
	  if (newValue !== '' && typeof newValue != 'undefined' && $scope.isCmdSetted) {
		$timeout(function () {
		  // $scope.modifDetCmd('Enl');
		  $scope.inputKeyUp('Enl');
		}, 400);
	  }
	});
  
	$scope.$watch("Liv.edited", function (newValue, oldValue) {
	  console.log('watch liv')
	  if (newValue !== '' && typeof newValue != 'undefined' && $scope.isCmdSetted) {
		$timeout(function () {
		  // $scope.modifDetCmd("Liv")
		  $scope.inputKeyUp("Liv")
		}, 400);
	  }
	});
	(function (Handsontable) {
		var F2OnlyEditor = Handsontable.editors.TextEditor.prototype.extend();
	  
		F2OnlyEditor.prototype.createElements = function () {
		  Handsontable.editors.TextEditor.prototype.createElements.apply(this, arguments);
	  
		  this.TEXTAREA = document.createElement('input');
		  this.TEXTAREA.setAttribute('type', 'text');
		  this.TEXTAREA.className = 'handsontableInput';
		  this.textareaStyle = this.TEXTAREA.style;
		  this.textareaStyle.width = 0;
		  this.textareaStyle.height = 0;
	  
		  Handsontable.dom.empty(this.TEXTAREA_PARENT);
		  this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
		  $compile(this.TEXTAREA_PARENT)($scope);
		};
	  
		F2OnlyEditor.prototype.open = function () {
		  Handsontable.editors.TextEditor.prototype.open.apply(this, arguments);
		  this.TEXTAREA.setAttribute('readonly', 'readonly'); // Empêche la saisie manuelle
		  this.TEXTAREA.style.display = 'none';
		};
	  
		F2OnlyEditor.prototype.onKeyDown = function (event) {
		  if (event.keyCode === Handsontable.helper.KEY_CODES.F2) {
			event.preventDefault();
			// Ouvrir une boîte de dialogue ou un sélecteur de temps ici
			var currentTime = prompt("Enter the time (HH:MM):", "12:00");
			if (currentTime !== null) {
			  this.setValue(currentTime);
			  this.finishEditing();
			}
		  } else if (event.keyCode === Handsontable.helper.KEY_CODES.ENTER) {
			this.finishEditing();
		  }
		};
	  
		Handsontable.editors.F2OnlyEditor = F2OnlyEditor;
		Handsontable.editors.registerEditor('f2OnlyEditor', F2OnlyEditor);
	  })(Handsontable);
	  

	var numsEditor = Handsontable.editors.NumericEditor.prototype.extend();
  
	numsEditor.prototype.createElements = function () {
	  Handsontable.editors.NumericEditor.prototype.createElements.apply(this, arguments);
  
	  this.TEXTAREA = document.createElement('input');
	  this.TEXTAREA.setAttribute('type', 'number');
	  this.TEXTAREA.setAttribute('id', 'testmodel');
	  this.TEXTAREA.setAttribute('pattern', '[0-9]*');
	  this.TEXTAREA.setAttribute('ng-model', 'testmodel');
	  this.TEXTAREA.className = 'handsontableInput';
	  this.textareaStyle = this.TEXTAREA.style;
	  this.textareaStyle.width = 0;
	  this.textareaStyle.height = 0;
  
	  Handsontable.Dom.empty(this.TEXTAREA_PARENT);
	  this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
	  $compile(this.TEXTAREA_PARENT)($scope);
	};
  
	$scope.resizeTab = function () {
	  $scope.hotInstance.render();
	};
	$scope.logResize = function () {
	  $scope.resizeTab();
	};
  
	var timeOutAlertPage = function (field) {
	  $timeout.cancel(alerTimer);
	  alerTimer = $timeout(function () {
		if (typeof alertPage != 'undefined' && alertPage.$isShown)
		  alertPage.toggle();
	  }, 4000);
	};
  
	$scope.newAlert = function (type, title, msg) {
	  $timeout(function () {
		if (typeof alertPage == 'undefined' || !alertPage.$isShown) {
		  alertPage = $alert({ title: title, content: msg, alertType: type, clearExists: true, duration: false, autoDestroy: false, placement: 'center', effect: 'fall' });
		}
		else {
		  alertPage.$scope.title = title;
		  alertPage.$scope.content = msg;
		  alertPage.$scope.alertType = 'alert-' + type;
		}
		timeOutAlertPage();
	  }, 600);
	};
  
	$scope.toggleSideBar = function () {
	  if ($scope.sideBarShow === false) {
		$scope.sideBarShow = true;
		$(".filtreAside").addClass('control-sidebar-open');
	  } else {
		$scope.sideBarShow = false;
		$(".filtreAside").removeClass('control-sidebar-open');
	  }
	};
  
	$scope.showFiles = function () {
	  var idDossier = $scope.part[$scope.selectedRow].id;
  
	  var modalInstance = $uibModal.open({
		templateUrl: 'ModalFiles',
		controller: 'ModalFilesController',
		size: "lg",
		backdrop: 'static',
		keyboard: 'true',
		resolve: {
		  idDossier: function () {
			return idDossier;
		  },
		  type: function () {
			return 'order';
		  }
		}
	  });
	  modalInstance.result.then(function (item) {
		$scope.nbrCmdFiles = item;
		if (item > 0) {
		  $scope.findFile = true;
		} else
		  $scope.findFile = false;
	  }, function (res) {
	  });
	};
  
  
	$scope.showFilesClient = function () {
	  var codeClient = $scope.part[$scope.selectedRow].CodeClient;
  
	  var modalInstance = $uibModal.open({
		templateUrl: 'ModalFiles',
		controller: 'ModalFilesController',
		size: "lg",
		backdrop: 'static',
		keyboard: 'true',
		resolve: {
		  idDossier: function () {
			return codeClient;
		  },
		  type: function () {
			return 'client';
		  }
		}
	  });
	  modalInstance.result.then(function (item) {
		$scope.nbrCmdFiles = item;
		if (item > 0) {
		  $scope.findFile = true;
		} else
		  $scope.findFile = false;
	  }, function (res) {
	  });
	};
  
  
	$scope.opendate = function ($event) {
	  $event.preventDefault();
	  $event.stopPropagation();
	  $scope.opened = true;
	};
  
	$scope.opendate2 = function ($event) {
	  $event.preventDefault();
	  $event.stopPropagation();
	  $scope.opened2 = true;
	};
  
	$scope.leaveEn = function () {
	  if (routeEn != '') {
		$timeout(function () {
		  $("#autoComplete").val(routeEn);
		}, 10);
	  }
	};
  
	$scope.leaveV = function () {
	  if (routeV != '') {
		$timeout(function () {
		  $("#autoCompleteVille").val(routeV);
		}, 10);
	  }
	};
  
	$scope.leaveV2 = function () {
	  if (routeV2 != '') {
		$timeout(function () {
		  $("#autoCompleteVille2").val(routeV2);
		}, 10);
	  }
	};
  
	$scope.leaveLiv = function () {
	  if (routeLiv != '') {
		$timeout(function () {
		  $("#autoComplete2").val(routeLiv);
		}, 10);
	  }
	};
  
	$scope.boxEnFocus = function () {
	  $('#divEn').addClass('hoverBoxEn');
	};
	$scope.boxEnFocusOut = function () {
	  $('#divEn').removeClass('hoverBoxEn');
	};
	$scope.boxLivFocus = function () {
	  $('#divLiv').addClass('hoverBoxLiv');
	};
	$scope.boxLivFocusOut = function () {
	  $('#divLiv').removeClass('hoverBoxLiv');
	};
	$scope.boxCliFocus = function () {
	  $('#divCli').addClass('hoverBoxCli');
	};
	$scope.boxCliFocusOut = function () {
	  $('#divCli').removeClass('hoverBoxCli');
	};
	$scope.boxAffFocus = function () {
	  $('#divAff').addClass('hoverBoxAff');
	};
	$scope.boxAffFocusOut = function () {
	  $('#divAff').removeClass('hoverBoxAff');
	};
  
	$scope.today = function () {
	  var today = moment();
	  if ($scope.Filtre.dt1 === '' || typeof $scope.Filtre.dt1 === 'undefined' || $scope.Filtre.dt1 === null) {
		$scope.Filtre.dt1 = today.toDate();
	  }
	  if ($scope.Filtre.dt2 === '' || typeof $scope.Filtre.dt2 === 'undefined' || $scope.Filtre.dt2 === null)
		$scope.Filtre.dt2 = today.toDate();
	};
  
	$scope.Translate = function (lg, type) {
	  var theComment = $scope.Com[type];
	  console.log("theComment")
	  console.log(theComment)
	  console.log(type)
  
	  var theComment = $("<div/>").html(theComment).text();
	  console.log(theComment)
	  $http.post('/Translate/translate', { value: theComment, lg: lg }).success(function (res) {
		if (res.translatedText) {
		  var theType = 'Com' + type;
		  console.log("theType")
		  console.log(theType)
		  console.log($scope.part[$scope.selectedRow][theType])
		  $scope.part[$scope.selectedRow][theType] = res.translatedText;
		  $scope.Com[type] = res.translatedText;
		  updateCmd($scope.selectedRow);
		}
	  });
	};
  
	$scope.detectLg = function () {
	  $http.get('/Translate/detect?value=' + $scope.Com.Exploit).success(function (res) {
	  });
	};
  
	$scope.showInMap = function (type) {
	  var Adr = [];
	  if (type === 'en') {
		Adr.CodeInter = $scope.En.CodeEn;
		Adr.Nom = $scope.En.NomEn;
		Adr.AdresseG = $scope.part[$scope.selectedRow].AdrEn;
		Adr.AdresseComp = $scope.En.CompAdrEn;
		Adr.CodePostal = $scope.En.Cp;
		Adr.Ville = $scope.En.Ville;
		Adr.CodePays = $scope.En.CodePays;
		Adr.Tel = $scope.En.Tel;
		Adr.Fax = $scope.En.Fax;
		Adr.Coordinates = $scope.part[$scope.selectedRow].CoordinatesEn;
		Adr.id = $scope.part[$scope.selectedRow].id;
	  } else {
		Adr.CodeInter = $scope.Liv.CodeLiv;
		Adr.Nom = $scope.Liv.NomLiv;
		Adr.AdresseG = $scope.part[$scope.selectedRow].AdrLiv;
		Adr.AdresseComp = $scope.Liv.CompAdrLiv;
		Adr.CodePostal = $scope.Liv.Cp;
		Adr.Ville = $scope.Liv.Ville;
		Adr.CodePays = $scope.Liv.CodePays;
		Adr.Tel = $scope.Liv.Tel;
		Adr.Fax = $scope.Liv.Fax;
		Adr.Coordinates = $scope.part[$scope.selectedRow].CoordinatesLiv;
		Adr.id = $scope.part[$scope.selectedRow].id;

	  }
  

	  console.log("tyyyyyyyype" ,type);
	  console.log("adrr" ,$scope.part[$scope.selectedRow]);
	  apiService.mapModal(Adr, type).result.then(function (selectedItem) {
		console.log(selectedItem);
		if(selectedItem!=null){
			if(selectedItem.type_dest=="liv"){
				$scope.part[$scope.selectedRow].AdrLiv=selectedItem.Adresse;
				$scope.Liv.AdrLiv=selectedItem.Adresse;

				$scope.Liv.NomLiv=selectedItem.Nom;
				$scope.part[$scope.selectedRow].NomLiv=selectedItem.Nom;

				
				$scope.part[$scope.selectedRow].CompAdrLiv=selectedItem.AdresseComp;
				$scope.Liv.CompAdrLiv=selectedItem.AdresseComp;
	
				$scope.part[$scope.selectedRow].PaysLiv=selectedItem.CodePays;
				$scope.part[$scope.selectedRow].CpLiv=selectedItem.CodePostal;
				$scope.Liv.Cp=selectedItem.CodePostal;
	
				$scope.part[$scope.selectedRow].VilleLiv=selectedItem.Ville;
				$scope.Liv.Ville=selectedItem.Ville;
				$scope.Liv.CodePays=selectedItem.CodePays;
	
			}
			else{
				$scope.En.NomEn=selectedItem.Nom;

				$scope.part[$scope.selectedRow].AdrEn=selectedItem.Adresse;
				$scope.part[$scope.selectedRow].CompAdrEn=selectedItem.AdresseComp;
				$scope.part[$scope.selectedRow].PaysEn=selectedItem.CodePays;
				$scope.part[$scope.selectedRow].CpEN=selectedItem.CodePostal;
				$scope.part[$scope.selectedRow].VilleEn=selectedItem.Ville;
				$scope.part[$scope.selectedRow].NomEn=selectedItem.Nom;
				$scope.En.Cp=selectedItem.CodePostal;
				$scope.En.CompAdrEn=selectedItem.AdresseComp;
				$scope.En.AdrEn=selectedItem.Adresse;
	
	
				$scope.En.Ville=selectedItem.Ville;
				$scope.En.CodePays=selectedItem.CodePays;
			}
		}

		updateCmd($scope.selectedRow);
	  });
	};
  
	$scope.toggleEnTsrp = function ($event) {
	  if ($scope.selectedRowData.TrspEn === false || $scope.selectedRowData.TrspEn === 'false') {
		$scope.selectedRowData.TrspEn = true;
		$scope.part[$scope.selectedRow].TrspEn = true;
		updateCmd($scope.selectedRow);
	  } else {
		$scope.selectedRowData.TrspEn = false;
		$scope.part[$scope.selectedRow].TrspEn = false;
		updateCmd($scope.selectedRow);
	  }
	};
  
	
	$scope.modalPalEU = function ($event) {

	
	  $scope.modalActive = true;
	//   $scope.hotInstance.deselectCell();

  if(!$scope.part[$scope.selectedRow].palAnn || $scope.part[$scope.selectedRow].palAnn<=0 ){
	$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Vous devez annoncez combien de pallette europe d'abord!")

	return;
  }
	  var theData = {
		palEn: $scope.part[$scope.selectedRow].PalEn,
		palRen: $scope.part[$scope.selectedRow].PalRen,
		palLiv: $scope.part[$scope.selectedRow].PalLiv,
		palRep: $scope.part[$scope.selectedRow].PalRep
	  }
  
	  var modalInstance = $uibModal.open({
		templateUrl: 'ModalPalEu',
		controller: 'ModalPalEuController',
		backdrop: "static",
		size: "md",
		resolve: {
		  idCmd: function () {
			return $scope.part[$scope.selectedRow].id;
		  },
		  data: function () {
			return theData;
		  }
		}
	  });
  
	  modalInstance.result.then(function (selectedItem) {
		console.log("sel");
		console.log(selectedItem);
		$scope.part.forEach(element => {
			if(element.id==selectedItem.id){
				console.log("egalite");
				element.PalEn=selectedItem.PalEn;
				element.PalLiv=selectedItem.PalLiv;
				element.PalRen=selectedItem.PalRen;
				element.PalRep=selectedItem.PalRep;
				
			}
			
		});
		// $scope.searchTable.value = selectedItem.CodeClient;
		// $('#NomClient').focus();
		$scope.hotInstance.selectCell($scope.selectedRow, 2, $scope.selectedRow, 2, true);
		$scope.modalActive = false;
	  }, function () {
		console.log("sssel");
		console.log(selectedItem);
		$scope.hotInstance.selectCell($scope.selectedRow, 2, $scope.selectedRow, 2, true);
		$scope.modalActive = false;
	  });
  
	};
  


	$scope.modalPalEU = function ($event) {

	
		$scope.modalActive = true;
	  //   $scope.hotInstance.deselectCell();
  
	if(!$scope.part[$scope.selectedRow].palAnn || $scope.part[$scope.selectedRow].palAnn<=0 ){
	  $scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Vous devez annoncez combien de pallette europe d'abord!")
  
	  return;
	}
		var theData = {
		  palEn: $scope.part[$scope.selectedRow].PalEn,
		  palRen: $scope.part[$scope.selectedRow].PalRen,
		  palLiv: $scope.part[$scope.selectedRow].PalLiv,
		  palRep: $scope.part[$scope.selectedRow].PalRep
		}
	
		var modalInstance = $uibModal.open({
		  templateUrl: 'ModalPalEu',
		  controller: 'ModalPalEuController',
		  backdrop: "static",
		  size: "md",
		  resolve: {
			idCmd: function () {
			  return $scope.part[$scope.selectedRow].id;
			},
			data: function () {
			  return theData;
			}
		  }
		});
	
		modalInstance.result.then(function (selectedItem) {
		  console.log("sel");
		  console.log(selectedItem);
		  $scope.part.forEach(element => {
			  if(element.id==selectedItem.id){
				  console.log("egalite");
				  element.PalEn=selectedItem.PalEn;
				  element.PalLiv=selectedItem.PalLiv;
				  element.PalRen=selectedItem.PalRen;
				  element.PalRep=selectedItem.PalRep;
				  
			  }
			  
		  });
		  // $scope.searchTable.value = selectedItem.CodeClient;
		  // $('#NomClient').focus();
		  $scope.hotInstance.selectCell($scope.selectedRow, 2, $scope.selectedRow, 2, true);
		  $scope.modalActive = false;
		}, function () {
		  console.log("sssel");
		  console.log(selectedItem);
		  $scope.hotInstance.selectCell($scope.selectedRow, 2, $scope.selectedRow, 2, true);
		  $scope.modalActive = false;
		});
	
	  };

	$scope.modalContr = function () {
		$scope.afficherContr=true;
		$scope.modee="";
		$scope.devise="";

		console.log("dddaaaa");
		console.log($scope.part[$scope.selectedRow]);
		


		if($scope.part[$scope.selectedRow].mode_contr!=null){
		$scope.modee=$scope.part[$scope.selectedRow].mode_contr;
		$scope.devise=$scope.part[$scope.selectedRow].devise_contr;
		$scope.typeSelection=$scope.part[$scope.selectedRow].type_contr;

		$scope.isChecked=$scope.part[$scope.selectedRow].valid_contr;



		}
	}

	$scope.modee="";

	$scope.EnleverAlertC=function(){
		$scope.afficherContr=false;
	}

	$scope.toggleObservationField = function () {

		console.log("show observation");

		var modeReglement=document.getElementById('modeReglement').value;
		console.log(modeReglement);
	$scope.modee=modeReglement;

		
		$scope.showObservation = $scope.modee === "CHÈQUE";
	};
	
	$scope.isFormValid = function () {
		return $scope.modee!="";
	};
	

	$scope.typeSelection="";

	$scope.toggleSel=function(t){

		console.log("ddddddddddddd");
		console.log(t);
		$scope.typeSelection=t;

	}
	$scope.validerReception = function () {
		// Logique pour valider la réception
		var observation="";
		var contre_remb_as=0;
		var contre_remb=0;

		if(document.getElementById('observation')!=null){
			 observation=document.getElementById('observation').value;
			 contre_remb_as=Number(document.getElementById('contre_remb_as').value);

		}
		contre_remb=Number(document.getElementById('contre_remb').value);
		

		$scope.part[$scope.selectedRow].mode_contr=$scope.modee;
		$scope.part[$scope.selectedRow].type_contr=$scope.typeSelection;
		$scope.part[$scope.selectedRow].devise_contr="EUR";
		$scope.part[$scope.selectedRow].obs_contr=observation;
		$scope.part[$scope.selectedRow].contre_remb_as=contre_remb_as;
		$scope.part[$scope.selectedRow].contre_remb=contre_remb;
		$scope.part[$scope.selectedRow].valid_contr=true;

		updateCmd($scope.selectedRow);
		$scope.afficherContr=false;


		alert("Réception validée !");
	};
  
	$scope.ModeRegelement = ["BILLET À ORDRE","CHÈQUE", "ESPÈCE", "LETTRE CHÈQUE", "TRAITE", "VIREMENT", "LCR À L'ACCEPTATION", "TRAITE ÉTABLIE PAR VOS SOINS", "LCR DIRECTE EN BANQUE"];
  
	$scope.keypressF2 = function ($event) {
	  if ($scope.prop.filtre == "Code Client")
		$scope.keypressClient();
	  else if ($scope.prop.filtre == "Code Affrété")
		$scope.keypressAffrete();
	  // else if($scope.prop.filtre == "Auxiliaire")
	  //   $scope.modalAux();
	};
  
	$scope.keypressClient = function ($event) {
	  if ($scope.modalActive === true)
		return;
  
	  $scope.modalActive = true;
	  $scope.items = [{ name: $scope.searchTable.value }];
  
	  val = $scope.CodeClient;
	  var modalInstance = $uibModal.open({
		templateUrl: 'ModalSelectCli',
		controller: 'ModalCliController',
		backdrop: "static",
		size: "lg",
		resolve: {
		  items: function () {
			return $scope.items;
		  },
		  type: function () {
			return "Client";
		  }
		}
	  });
  
	  modalInstance.result.then(function (selectedItem) {
		$scope.searchTable.value = selectedItem.CodeClient;
		$('#NomClient').focus();
		$scope.modalActive = false;
	  }, function () {
		$scope.modalActive = false;
	  });
  
	};
  
	$scope.keypressAffrete = function ($event) {
	  if ($scope.modalActive === true)
		return;
  
	  $scope.modalActive = true;
  
	  $scope.items = [{ name: $scope.searchTable.value }];
	  var row = $scope.selectedRow;
	  var codetva=$scope.part[row].CodeTva;
	  affService.modalSelect($scope.items).result.then(function (selectedItem) {
  
	  
  
		console.log("hooooo "+codetva);
		$scope.part[row].CodeTva=codetva
  
  
		$scope.searchTable.value = selectedItem.CodeAffrete;
		$('#NomClient').focus();
		$scope.modalActive = false;
	  }, function () {
		$('#NomClient').focus();
		$scope.modalActive = false;
	  });
	};
  
	$scope.filtre = function () {
	  var modalInstance = $uibModal.open({
		templateUrl: 'ModalFiltreCmd',
		controller: 'ModalCmdFilterController',
		size: "lg",
		backdrop: 'static',
		resolve: {}
	  });
	  modalInstance.result.then(function ($item) {
		return;
	  });
	};
  
	$scope.afterChange = function (change, source) {
	  if ($scope.modalActive === true) { return; }
  
	  if (source === 'loadData' || source === 'external') {
		return;
	  }
	  instance = this.getInstance();
  
	  var row = change[0][0];
	  var cell = change[0][1];
	  var value = change[0][3];
  
	  var plugin = this.getPlugin('autoColumnSize');
	  plugin.recalculateAllColumnsWidth();
	  if ($scope.acceptDelKey === true) {
		$scope.acceptDelKey = false;
	  }
	};
  
  
	$scope.cancelSlider=function(){
	  $scope.openSlider=false;
	}
  
	$scope.validateSlider = function() {
	  // Obtenir les valeurs du slider
	  var vall = $("#selected-ranges").html();
  
	  
	  if($scope.selectedDate=="En"){
		$scope.part[$scope.selectedRow].HeureEn =vall;
  
		updateCmd($scope.selectedRow);
	  }
	  else{
		$scope.part[$scope.selectedRow].HeureLiv =vall;
		updateCmd($scope.selectedRow);
  
	  }
  
	  // Fermer le slider ou effectuer toute autre action nécessaire
	  $scope.openSlider = false;
  }
  
  $scope.isHeur=false;
	$scope.beforeChanges = function (changes, source) {
	  if ($scope.modalActive === true) { return; }
  
	  if (source != 'Control') {
  
		console.log("updateBeforeChange");
		console.log(changes);
		console.log($scope.part);
		$timeout(function () {
		  $scope.hotInstance.deselectCell();
		  var row = changes[0][0];
  
		var cell = changes[0][1];
		var newVal = changes[0][3];
		var oldValue = changes[0][2];
		var numDossier=$scope.part[row].NumDossier;


		if(newVal!=oldValue){
			
			if(cell=="DateEn" || cell=="DateLiv" ) {
				var data = {
					cel: cell,
					NumDossier: numDossier,
			  
				  };
				  $http.post('tournees/libererCmd', data).then(function (res) {
					  console.log(res);
				  })
				  
			


			}
			

		}

		




  
		}, 10);
		var row = changes[0][0];
  
		var cell = changes[0][1];
		var newVal = changes[0][3];
		var oldValue = changes[0][2];
  
		if ($scope.part[row].FactCli != '' && $scope.part[row].FactCli !== null && typeof $scope.part[row].FactCli != 'undefined' && $scope.openSlider==false) {
		  $scope.hotInstance.deselectCell();
		  var confirm = $mdDialog.confirm()
			.title("Valider les modifcations ?")
			.textContent('La commande est déjà Facturée. Confirmer la modification ?')
			.ariaLabel('Confirmer la modification ?')
			.ok('Valider')
			.cancel('Annuler');
		  $mdDialog.show(confirm).then(function () {
			$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
			$timeout(function () {
			  $scope.updateBeforeChange(changes, row, cell, newVal, oldValue);
			}, 500)
		  }, function () {
			$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
			$scope.part[row][cell] = oldValue;
		  });
		}
		else if ($scope.part[row].StatutCmd == 'VALIDÉ' && $scope.isHeur==false) {
		  $scope.hotInstance.deselectCell();
		  var confirm = $mdDialog.confirm()
			.title("Valider les modifcations ?")
			.textContent('La commande est déjà validée. Confirmer la modification ?')
			.ariaLabel('Confirmer la modification ?')
			.ok('Valider')
			.cancel('Annuler');
		  $mdDialog.show(confirm).then(function () {
			$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
			$timeout(function () {
			  $scope.updateBeforeChange(changes, row, cell, newVal, oldValue);
			}, 500)
		  }, function () {
			$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
			$scope.part[row][cell] = oldValue;
		  });
		}
		else if ($scope.part[row].Prod) {
		  $scope.hotInstance.deselectCell();
		  var confirm = $mdDialog.confirm()
			.title("Valider les modifcations ?")
			.textContent('La commande est En production. Voulez-vous la récupérer ?')
			.ariaLabel('Récupérer la commande')
			.ok('Récupérer la commande')
			.cancel('Annuler');
		  $mdDialog.show(confirm).then(function () {
			$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
			$timeout(function () {
			  $scope.part[row].Prod = false;
			  $scope.updateBeforeChange(changes, row, cell, newVal, oldValue);
			}, 500)
		  }, function () {
			$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
			$scope.part[row][cell] = oldValue;
		  });
		}
		// else if($scope.part[row].Prod){
		//   $scope.hotInstance.deselectCell();
		//   var confirm = $mdDialog.confirm()
		//   .title("Commande dans le puit d attente")
		//   .textContent('La commande est en demande de production. Assigner la commande ?')
		//   .ariaLabel('Confirmer la modification ?')
		//   .ok('Valider')
		//   .cancel('Annuler');
		//   $mdDialog.show(confirm).then(function() {
		//     $scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
		//     $timeout(function(){
		//       $scope.updateBeforeChange(changes,row, cell,newVal, oldValue);
		//     },500)
		//   }, function(){
		//     $scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
		//     $scope.part[row][cell] =oldValue;
		//   });
		// }
  
		// else if($scope.part[row].NumFact =='FACTURÉ'){
  
		else {
		  $scope.updateBeforeChange(changes, row, cell, newVal, oldValue);
		}
	  }
	};
  
	$scope.updateBeforeChange = function (changes, row, cell, newVal, oldValue) {
  
	  console.log("cellll " + cell);
	  $scope.loadingCmds = true;
	  $scope.part[row].Prod = false;
	  if (($scope.part[row].FactCli == '' || $scope.part[row].FactCli === null || typeof $scope.part[row].FactCli == 'undefined') && $scope.part[row].StatutCmd == 'VALIDÉ') {
		$scope.part[row].StatutCmd = '';
	  }
	  if (cell == 'MontantV' || cell == 'MontantA') {
		newVal = parseFloat(newVal);
		if (!isNaN(newVal)) {
		  var achat, vente;
		  if (cell == 'MontantV') {
			vente = parseFloat(newVal);
			achat = $scope.part[row].MontantA;
		  }
		  else {
			vente = $scope.part[row].MontantV;
			achat = parseFloat(newVal);
		  }
		  var Marge;
		  if (achat > vente) {
			Marge = 0;
		  }
		  else {
			Marge = (1 - (achat / vente)) * 100;
			Marge = parseFloat(Marge);
		  }
  
		  if ((newVal == 0 || Marge <= 0) && ($scope.username != "admin" && $scope.username != "cedric")) {
			$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Nous vous prions de bien vouloir contacter un supérieur pour validation du prix de vente!")
			$scope.part[row][cell] = oldValue;
			changes[0][3] = oldValue;
		  } else {
			if (!isNaN(achat)) {
			  var margeNet = vente - achat;
			  if (margeNet > 200 || vente == 0 || Marge <= 0) {
				$scope.hotInstance.deselectCell();
				var confirm = $mdDialog.confirm()
				  .title("Merci de vérifier les prix Vente / Achat que vous avez renseignés pour cette commande")
				  .textContent('Montants renseignés : Ventes : ' + vente + ' | Achat : ' + achat)
				  .ariaLabel('Nouveau Client')
				  .ok('Je confirme les montants')
				  .cancel('Modifier mon prix');
  
				$mdDialog.show(confirm).then(function () {
				  $scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
				  $scope.part[row].Marge = parseFloat(Marge).toFixed(2);
				  $scope.part[row][cell] = newVal;
  
				  if ($scope.part[row].CodeTVA != "" && typeof $scope.part[row].CodeTVA != "undefined")
					$scope.part[row].MontantTVA = (parseFloat($scope.part[row].TauxTVA) * parseFloat($scope.part[row].MontantV)) / 100;
				  else
					$scope.part[row].MontantTVA = null;
				  $scope.calcTaxGaz(cell);
				}, function () {
				  $scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
				  $scope.part[row][cell] = oldValue;
				  changes[0][3] = oldValue;
				  $scope.loadingCmds = false;
				});
			  }
			  else {
				$scope.part[row].Marge = parseFloat(Marge).toFixed(2);
				$scope.part[row][cell] = newVal;
  
				if (cell == 'MontantV') {
				  if ($scope.part[row].CodeTVA != "" && typeof $scope.part[row].CodeTVA != "undefined")
					$scope.part[row].MontantTVA = (parseFloat($scope.part[row].TauxTVA) * parseFloat($scope.part[row].MontantV)) / 100;
				  else
					$scope.part[row].MontantTVA = null;
				  $scope.calcTaxGaz(cell);
				}
				else {
				  if ($scope.part[row].MontantA != "" && typeof $scope.part[row].MontantA != "undefined")
					$scope.part[row].MontantTVATr = (parseFloat($scope.part[row].TauxTVATr) * parseFloat($scope.part[row].MontantA)) / 100;
				  else
					$scope.part[row].MontantTVATr = null;
  
				  updateCmd($scope.selectedRow,cell);
				}
  
			  }
			}
			else {
			  $scope.part[row].Marge = parseFloat(Marge).toFixed(2);
			  $scope.part[row][cell] = newVal;
  
			  if ($scope.part[row].CodeTVA != "" && typeof $scope.part[row].CodeTVA != "undefined")
				$scope.part[row].MontantTVA = (parseFloat($scope.part[row].TauxTVA) * parseFloat($scope.part[row].MontantV)) / 100;
			  else
				$scope.part[row].MontantTVA = null;
			  $scope.calcTaxGaz(cell);
			}
  
		  }
		} else {
		  $scope.part[row][cell] = oldValue;
		  changes[0][3] = oldValue;
		   updateCmd(row,cell);
		}
	  }
	  else if (cell == 'Poids' || cell == 'Colis' || cell == 'Palettes' || cell == 'MetreLin' || cell == 'MetreCube') {
		newVal = newVal.replace(',', '.');
		newVal = parseFloat(newVal);
		if (isNaN(newVal)) {
		  changes[0][3] = "";
		  $scope.part[row][cell] = "";
		}
		else {
		  changes[0][3] = newVal;
		  $scope.part[row][cell] = newVal;
		}
		 updateCmd(row,cell);;
	  }
	  else if (cell == 'DateEn' || cell == 'DateLiv') {
		console.log("dateliv");
		var data = {
		  NumDossier: $scope.part[row].NumDossier,
		  Cell: cell,
	
		};
		$http.post('tournees/libererPos', data).then(function (res) {
			console.log(res);
		})
		
  
		if (newVal != '') {
		  var val, dateen, dateliv;
		  if (newVal.length <= 7)
			val = moment(newVal, 'DDMMYY').format($rootScope.formatDateM);
  
		  else if (newVal.length === 8) {
			if (newVal.indexOf('/') !== -1) {
			  val = moment(newVal, 'DD/MM/YY').format($rootScope.formatDateM);
			}
			else
			  val = moment(newVal, 'DDMMYYYY').format($rootScope.formatDateM);
		  }
		  else
			val = newVal;
		  
  
		  changes[0][3] = val;
		  if (cell == 'DateEn') {
			dateen = moment(val, $rootScope.formatDateM).format('YYYY-MM-DD');
			dateliv = moment($scope.part[row].DateLiv, $rootScope.formatDateM).format('YYYY-MM-DD');
		  } else {
			dateen = moment($scope.part[row].DateEn, $rootScope.formatDateM).format('YYYY-MM-DD');
			dateliv = moment(val, $rootScope.formatDateM).format('YYYY-MM-DD');
		  }
  
  
  
		  console.log("dd :" + dateliv);
		  if (dateliv !== 'Invalid date' && dateliv !== '' && dateen !== 'Invalid date' && dateen !== '') {
			if (moment(dateen).isBefore(moment(dateliv)) || moment(dateen).isSame(moment(dateliv))) {
			  var today = moment();
			  var theDay = moment(val, $rootScope.formatDateM);
			  if (Math.abs(today.diff(theDay, 'days')) > 30 || today.diff(theDay, 'days') < -30) {
				$scope.hotInstance.deselectCell();
				var confirm = $mdDialog.alert()
				  .title("La date saisie est de plus de 30jrs !")
				  .ariaLabel('Date + 30 Jrs')
				  .ok('ok');
				$mdDialog.show(confirm).then(function () {
				  $scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
  
				  if( $scope.part[row]){
					$scope.part[row][cell] = val;

				  }
				});
			  }
			  $scope.part[row][cell] = val;
  
			   updateCmd(row,cell);;
			}
			else {
			  var dateAlert;
			  if (cell == 'DateEn')
				dateAlert = "La date d'enlèvement doit être modifiée, celle-ci est postérieur à la date de livraison que vous avez saisie.!";
			  else
				dateAlert = "La date de livraison doit être modifiée, celle-ci est antérieur à la date d’enlèvement que vous avez saisie.!";
  
			  $scope.newAlert('warning', '<i class="fa fa-exclamation"></i> ' + dateAlert);
			  // f2_event = $.Event( 'keydown', { keyCode: 113 } );
			  console.log($scope.hotInstance.getActiveEditor());
			  if (cell == 'DateEn')
				$scope.hotInstance.selectCell(row, 5, row, 5, true);
			  else
				$scope.hotInstance.selectCell(row, 8, row, 8, true);
  
			  changes[0][3] = oldValue;
			  $scope.part[row][cell] = oldValue;
			  $scope.loadingCmds = false;
			}
		  } else {
			if (val === 'Invalid date' && dateliv !== '') {
			  changes[0][3] = oldValue;
			  $scope.part[row][cell] = oldValue;
			  $scope.loadingCmds = false;
			}
			else {
			  var today = moment.utc();
			  var theDay = moment.utc(val, $rootScope.formatDateM);
			  $scope.part[row][cell] = val;
			  if (Math.abs(today.diff(theDay, 'days')) > 30 || today.diff(theDay, 'days') < -30) {
				$scope.hotInstance.deselectCell();
				var confirm = $mdDialog.alert()
				  .title("La date saisie est de plus de 30jrs !")
				  .ariaLabel('Date + 30 Jrs')
				  .ok('ok');
				$mdDialog.show(confirm).then(function () {
				  if (cell == 'DateEn')
					$scope.hotInstance.selectCell(row, 5, row, 5, true);
				  else
					$scope.hotInstance.selectCell(row, 8, row, 8, true);
				}
				);
			  }
  
			  updateCmd(row,cell);
			}
		  }
		}
		else {
		  changes[0][3] = "";
		  $scope.part[row][cell] = "";
		  $scope.part[$scope.selectedRow].TaxeGazCoef = null;
		  $scope.part[$scope.selectedRow].TaxeGaz = null;
		  $scope.loadingCmds = false;
		  if (cell == "DateLiv") {
			updateCmd(row,cell);
  
		  }
		}
  
		if (cell == 'DateEn')
		  $scope.calcTaxGaz(cell);
	  }
	  else if (cell == 'HeureEn' || cell == 'HeureLiv') {
  
		console.log("newVal");
		console.log(newVal);
		console.log(cell);
  
		$scope.part[row][cell] = newVal;
		updateCmd(row,cell);
	  }
	  else if (cell == 'CodeClient') {
		if (newVal != '') {
		  $http.get("/clients?CodeClient=" + newVal).success(function (response) {
			if (!response.length) {
			  $scope.modalActive = true;
			  instance.deselectCell();
			  var confirm = $mdDialog.confirm()
				.title("Le Client n'existe pas.")
				.textContent('Voulez-vous créer un nouveau client?')
				.ariaLabel('Nouveau Client')
				.ok('Créer un nouveau client')
				.cancel('Annuler et revenir à la dernière séléction.');
  
			  $mdDialog.show(confirm).then(function () {
				var NvCli = false;
				if (NvCli === false) {
				  NvCli = true;
				  clientService.modalNew(newVal).result.then(function (selectedItem) {
					NvCli = false;
					$scope.modalActive = false;
					$scope.hotInstance.selectCell(row, 2, row, 2, true);
					$scope.onSelectedCli(selectedItem);
				  },
					function () {
					  $scope.modalActive = false;
					  console.log("$scope.modalActive")
					  console.log($scope.modalActive)
					  NvCli = false;
					  $scope.part[row].CodeClient = oldValue;
					  $scope.hotInstance.selectCell(row, 2, row, 2, true);
					  $scope.loadingCmds = false;
					});
				}
			  },
				function () {
				  $scope.modalActive = false;
				  $scope.loadingCmds = false;
				  $scope.hotInstance.selectCell(row, 2, row, 2, true);
				  $scope.part[row].CodeClient = oldValue;
				});
			}
			else {
			  if (response[0].Disable == "TRUE") {
				$scope.newAlert('danger', '<i class="fa fa-exclamation"></i>', "Client Bloqué!<br>" + response[0].ComDisable)
				$scope.onSelectedCli(null);
			  }
			  else if (typeof $scope.part[row] != 'undefined') {
				$scope.Cli = [];
				var id = $scope.part[row].id;
				$scope.onSelectedCli(response[0]);
			  }
			}
		  });
		} else {
		  $scope.onSelectedCli(null);
		}
	  }
	  else if (cell == 'CodeEn') {
		if (newVal != '') {
		  $http.get("/intervenant?CodeInter=" + newVal).success(function (response) {
			if (!response.length) {
			  $http.get("/clients?CodeClient=" + newVal + "&Inter=0").success(function (res) {
				if (!res.length) {
				  instance.deselectCell();
				  var confirm = $mdDialog.confirm()
					.title("L'intervenant' n'existe pas.")
					.textContent('Voulez-vous créer un nouvel intervenant?')
					.ariaLabel('Nouvel intervenant')
					.ok('Créer un nouvel intervenant')
					.cancel('Annuler et revenir à la dernière séléction.');
				  $mdDialog.show(confirm).then(function () {
					var NvEn = false;
					if (NvEn === false) {
					  NvEn = true;
  
					  interService.modalNew(newVal).result.then(function (selectedItem) {
						NvEn = false;
						$scope.modalActive = false;
  
						$scope.hotInstance.selectCell(row, 4, row, 4, true);
						$scope.onSelectedInter(selectedItem, 'En');
					  },
						function () {
						  NvEn = false;
						  $scope.modalActive = false;
						  $scope.part[row].CodeEn = oldValue;
						  $scope.hotInstance.selectCell(row, 4, row, 4, true);
						  $scope.loadingCmds = false;
						});
					}
				  }, function () {
					$scope.hotInstance.selectCell(row, 4, row, 4, true);
					$scope.part[row].CodeEn = oldValue;
					$scope.loadingCmds = false;
				  });
				} else {
				  infoInter = {
					CodeInter: res[0].CodeClient,
					Nom: res[0].Nom,
					Adresse: res[0].Adresse,
					AdresseComp: res[0].AdresseComp,
					CodePays: res[0].CodePays,
					CodePostal: res[0].CodePostal,
					Ville: res[0].Ville,
					Coordinates: res[0].Coordinates,
					Tel: res[0].Tel,
					Fax: res[0].Fax
				  };
				  $http.post('/Intervenant/createInter/', infoInter);
				  $http.get('/Clients/update/' + res[0].id + '?Inter=1');
				  $scope.onSelectedInter(res[0], 'En');
				}
			  });
			} else {
			  if (response[0].Disable == "TRUE") {
				$scope.newAlert('danger', '<i class="fa fa-exclamation"></i>', "Intervenant Bloqué!<br>" + response[0].ComDisable)
				$scope.onSelectedInter(null, 'En');
			  }
			  else {
				var id = $scope.part[row].id;
				$scope.onSelectedInter(response[0], 'En');
			  }
			}
		  });
		}
		else {
		  $scope.onSelectedInter(null, 'En');
		}
	  }
	  else if (cell == 'CodeLiv') {
		if (newVal != '') {
		  $http.get("/intervenant?CodeInter=" + newVal).success(function (response) {
			if (!response.length) {
			  $http.get("/clients?CodeClient=" + newVal + "&Inter=0").success(function (res) {
				if (!res.length) {
				  instance.deselectCell();
				  var confirm = $mdDialog.confirm()
					.title("L'intervenant' n'existe pas.")
					.textContent('Voulez-vous créer un nouvel intervenant?')
					.ariaLabel('Nouvel intervenant')
					.ok('Créer un nouvel intervenant')
					.cancel('Annuler et revenir à la dernière séléction.');
				  $mdDialog.show(confirm).then(function () {
					var NvLiv = false;
					if (NvLiv === false) {
					  NvLiv = true;
  
					  interService.modalNew(newVal).result.then(function (selectedItem) {
						NvLiv = false;
						$scope.modalActive = false;
						$scope.hotInstance.selectCell(row, 7, row, 7, true);
						$scope.onSelectedInter(selectedItem, 'Liv');
					  },
						function () {
						  $scope.modalActive = false;
						  NvLiv = false;
						  $scope.part[row].CodeLiv = oldValue;
						  $scope.hotInstance.selectCell(row, 7, row, 7, true);
						  $scope.loadingCmds = false;
						});
					}
				  }, function () {
					$scope.hotInstance.selectCell(row, 7, row, 7, true);
					$scope.part[row].CodeLiv = oldValue;
				  });
				} else {
				  infoInter = {
					CodeInter: res[0].CodeClient,
					Nom: res[0].Nom,
					Adresse: res[0].Adresse,
					AdresseComp: res[0].AdresseComp,
					CodePays: res[0].CodePays,
					CodePostal: res[0].CodePostal,
					Ville: res[0].Ville,
					Coordinates: res[0].Coordinates,
					Tel: res[0].Tel,
					Fax: res[0].Fax
  
				  };
				  $http.post('/Intervenant/createInter/', infoInter);
				  $http.get('/Clients/update/' + res[0].id + '?Inter=1');
				  $scope.onSelectedInter(res[0], 'Liv');
				}
			  });
			} else {
			  if (response[0].Disable == "TRUE") {
				$scope.newAlert('danger', '<i class="fa fa-exclamation"></i>', "Intervenant Bloqué!<br>" + response[0].ComDisable)
				$scope.onSelectedInter(null, 'Liv');
			  }
			  else {
				var id = $scope.part[row].id;
				$scope.onSelectedInter(response[0], 'Liv');
			  }
			}
		  });
		}
		else {
		  $scope.onSelectedInter(null, 'Liv');
		}
	  }
	  else if (cell == 'CodeAff') {
		if (newVal != '') {
		  $http.get("/affretes?CodeAffrete=" + newVal).success(function (response) {
			if (!response.length) {
			  instance.deselectCell();
			  var confirm = $mdDialog.confirm()
				.title("Cet Affrété n'existe pas.")
				.textContent('Voulez-vous créer un nouveau Affrété?')
				.ariaLabel('Nouveau Affrété')
				.ok('Créer un nouveau Affrété')
				.cancel('Annuler et revenir à la dernière séléction.');
			  $mdDialog.show(confirm).then(function () {
				var NvAff = false;
				if (NvAff === false) {
				  NvAff = true;
  
				  affService.modalNew(newVal).result.then(function (selectedItem) {
					NvAff = false;
					$scope.onSelectedAff(selectedItem);
					$scope.hotInstance.selectCell(row, 21, row, 21, true);
					return;
				  }, function () {
					NvAff = false;
					$scope.part[row].CodeAff = oldValue;
					$scope.hotInstance.selectCell(row, 21, row, 21, true);
					$scope.loadingCmds = false;
				  });
				}
			  }, function () {
				$scope.part[row].CodeAff = oldValue;
				$scope.hotInstance.selectCell(row, 21, row, 21, true);
				$scope.loadingCmds = false;
			  });
			} else {
			  if (response[0].Disable == "TRUE") {
				$scope.newAlert('danger', '<i class="fa fa-exclamation"></i>', "Affrété Bloqué!<br>" + response[0].ComDisable)
				$scope.onSelectedAff(null);
			  }
			  else {
				$scope.onSelectedAff(response[0]);
			  }
			}
		  });
		}
		else {
		  $scope.onSelectedAff(null);
		}
	  } else if (cell == 'TypeVh') {
		if (newVal != '') {
		  $http.get("/type_veh?Nom=" + newVal).success(function (response) {
			if (!response.length) {
			  instance.deselectCell();
			  var confirm = $mdDialog.confirm()
				.title("Le type de véhicule n'existe pas.")
				.textContent('Voulez-vous créer un nouveau type de véhicule?')
				.ariaLabel('Nouveau type de véhicule')
				.ok('Créer un nouveau type de véhicule')
				.cancel('Annuler et revenir à la dernière séléction.');
			  $mdDialog.show(confirm).then(function () {
				var NvAff = false;
				if (NvAff === false) {
				  NvAff = true;
				  var hot = hotRegisterer.getInstance('myTable');
				  $scope.items = [{ name: '' }];
				  var modalInstance = $uibModal.open({
					templateUrl: 'ModalTypeVeh',
					controller: 'ModalTypeVehController',
					size: "lg",
					resolve: {
					  items: function () {
						return $scope.items;
					  },
					  type: function () {
						return "TVA";
					  }
					}
				  });
				  modalInstance.result.then(function (selectedItem) {
					$scope.modalActive = false;
					instance.destroyEditor(true);
					$scope.part[row].TypeVh = selectedItem.Nom;
					updateCmd(row,cell);
  
					// $scope.hotInstance.selectCell(row, 20, row, 20, true);
				  }, function () {
					$scope.modalActive = false;
					$scope.part[row].TypeVh = oldValue;
					// $scope.hotInstance.selectCell(row, 20, row, 20, true);
					$setTimeout(function () {
					  $scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
					}, 10);
				  });
				}
			  }, function () {
				$scope.part[row].TypeVh = oldValue;
				// $scope.hotInstance.selectCell(row, 20, row, 20, true);
				$setTimeout(function () {
				  $scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
				}, 10);
			  });
			} else {
			  $scope.part[row].TypeVh = newVal;
			  updateCmd(row,cell);
			}
		  });
		}
		else
		  $scope.loadingCmds = false;
  
	  } else if (cell == 'CodeTVA' || cell == 'CodeTVATr') {
		var val = newVal.split(/[ ]+/);
		changes[0][3] = val[0];
		var sql;
		newVal = val[0];
		if (newVal != '') {
		  if (cell == 'CodeTVA')
			sql = "/tva?CodeTVA=";
		  else
			sql = "/tvatr?CodeTVA=";
  
		  $http.get(sql + newVal).success(function (response) {
			if (!response.length) {
			  changes[0][3] = oldValue;
			  $scope.part[row][cell] = oldValue;
			  $scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Code TVA " + newVal + " Inexistant!<br>Appuyez sur la touche F2 pour voir la liste des codes TVA.");
			} else {
			  if (cell == 'CodeTVA') {
				$scope.part[row].TauxTVA = response[0].Taux;
				if ($scope.part[row].MontantV != "" && typeof $scope.part[row].MontantV != "undefined")
				  $scope.part[row].MontantTVA = (parseFloat(response[0].Taux) * parseFloat($scope.part[row].MontantV)) / 100;
				else
				  $scope.part[row].MontantTVA = null;
			  }
			  else {
				$scope.part[row].TauxTVATr = response[0].Taux;
				if ($scope.part[row].MontantA != "" && typeof $scope.part[row].MontantA != "undefined")
				  $scope.part[row].MontantTVATr = (parseFloat(response[0].Taux) * parseFloat($scope.part[row].MontantA)) / 100;
				else
				  $scope.part[row].MontantTVATr = null;
			  }
  
			  $scope.part[row][cell] = response[0].CodeTVA;
			  updateCmd(row,cell);
			}
		  });
		}
		else
		  $scope.loadingCmds = false;
	  } else {
		if (typeof newVal === 'string') {
		  changes[0][3] = newVal.toUpperCase();
		}
		$scope.part[row][cell] = newVal;
		updateCmd(row,cell);
	  }
	};
  
	$scope.onSelectedInter = function (selectedItem, type) {
	  var row = $scope.selectedRow;
	  if (selectedItem === null) {
		if (type == 'En') {
		  $scope.En = [];
		  $scope.En.CodeEn = '';
		  $scope.En.NomEn = '';
		  $scope.En.AdrEn = '';
		  $scope.En.CompAdrEn = '';
		  $scope.En.CodePays = '';
		  $scope.En.Cp = '';
		  $scope.En.Ville = '';
		  $scope.En.Tel = '';
		  $scope.En.Fax = '';
  
		  $scope.part[row].CodeEn = '';
		  $scope.part[row].NomEn = '';
		  $scope.part[row].AdrEn = '';
		  $scope.part[row].CompAdrEn = '';
		  $scope.part[row].PaysEn = '';
		  $scope.part[row].CpEN = '';
		  $scope.part[row].VilleEn = '';
		  $scope.part[row].CoordinatesEn = [];
  
		  $scope.part[row].TelEn = '';
		  $scope.part[row].FaxEn = '';
		  $scope.enComment = false;
		  $scope.isEnSetted = false;
		}
		else {
  
		  $scope.Liv = [];
		  $scope.Liv.CodeLiv = '';
		  $scope.Liv.NomLiv = '';
		  $scope.Liv.AdrLiv = '';
		  $scope.Liv.CompAdrLiv = '';
		  $scope.Liv.CodePays = '';
		  $scope.Liv.Cp = '';
		  $scope.Liv.Ville = '';
		  $scope.Liv.Tel = '';
		  $scope.Liv.Fax = '';
  
		  $scope.part[row].CodeLiv = '';
		  $scope.part[row].NomLiv = '';
		  $scope.part[row].AdrLiv = '';
		  $scope.part[row].CompAdrLiv = '';
		  $scope.part[row].PaysLiv = '';
		  $scope.part[row].CpLiv = '';
		  $scope.part[row].VilleLiv = '';
		  $scope.part[row].CoordinatesLiv = '';
  
		  $scope.part[row].TelLiv = '';
		  $scope.part[row].FaxLiv = '';
		  $scope.livComment = false;
		  $scope.isLivSetted = false;
		}
	  }
	  else {
		if (typeof selectedItem.AdresseComp == 'undefined')
		  selectedItem.AdresseComp = "";
		if (type == 'En') {
		  $scope.interEn = selectedItem;
		  $scope.En = [];
		  $scope.En.CodeEn = selectedItem.CodeInter;
		  $scope.En.NomEn = selectedItem.Nom;
		  $scope.En.AdrEn = selectedItem.Adresse;
		  $scope.En.CompAdrEn = selectedItem.AdresseComp;
		  $scope.En.CodePays = selectedItem.CodePays;
		  $scope.En.Cp = selectedItem.CodePostal;
		  $scope.En.Ville = selectedItem.Ville;
		  $scope.En.Tel = selectedItem.Tel;
		  $scope.En.Fax = selectedItem.Fax;
  
		  $scope.part[row].CodeEn = selectedItem.CodeInter;
		  $scope.part[row].NomEn = selectedItem.Nom;
		  $scope.part[row].AdrEn = selectedItem.Adresse;
		  $scope.part[row].CompAdrEn = selectedItem.AdresseComp;
		  $scope.part[row].PaysEn = selectedItem.CodePays;
		  $scope.part[row].CpEN = selectedItem.CodePostal;
		  $scope.part[row].VilleEn = selectedItem.Ville;
		  $scope.part[row].CoordinatesEn = selectedItem.Coordinates;
		  $scope.part[row].TelEn = selectedItem.Tel;
		  $scope.part[row].FaxEn = selectedItem.Fax;
		  $scope.isEnSetted = true;
		  console.log("selectedItem.Commentaires");
		  console.log(selectedItem.Commentaires);
		  if (selectedItem.Commentaires != "" && selectedItem.Commentaires !== null && typeof selectedItem.Commentaires != 'undefined') {
			$scope.enComment = true;
		  } else
			$scope.enComment = false;
		}
		else {
		  $scope.Liv = [];
		  $scope.Liv.CodeLiv = selectedItem.CodeInter;
		  $scope.Liv.NomLiv = selectedItem.Nom;
		  $scope.Liv.AdrLiv = selectedItem.Adresse;
		  $scope.Liv.CompAdrLiv = selectedItem.AdresseComp;
		  $scope.Liv.CodePays = selectedItem.CodePays;
		  $scope.Liv.Cp = selectedItem.CodePostal;
		  $scope.Liv.Ville = selectedItem.Ville;
		  $scope.Liv.Tel = selectedItem.Tel;
		  $scope.Liv.Fax = selectedItem.Fax;
  
		  $scope.part[row].CodeLiv = selectedItem.CodeInter;
		  $scope.part[row].NomLiv = selectedItem.Nom;
		  $scope.part[row].AdrLiv = selectedItem.Adresse;
		  $scope.part[row].CompAdrLiv = selectedItem.AdresseComp;
		  $scope.part[row].PaysLiv = selectedItem.CodePays;
		  $scope.part[row].CpLiv = selectedItem.CodePostal;
		  $scope.part[row].VilleLiv = selectedItem.Ville;
		  $scope.part[row].CoordinatesLiv = selectedItem.Coordinates;
		  $scope.part[row].TelLiv = selectedItem.Tel;
		  $scope.part[row].FaxLiv = selectedItem.Fax;
  
		  dataUp = $scope.part[row];
		  $scope.isLivSetted = true;
  
		  $scope.interLiv = selectedItem;
  
		  if (selectedItem.Commentaires != "" && selectedItem.Commentaires !== null && typeof selectedItem.Commentaires != 'undefined') {
			$scope.livComment = true;
		  } else
			$scope.livComment = false;
  
		}
	  }
	  updateCmd($scope.selectedRow);
	  $scope.loadingCmds = false;
	};
  
	$scope.calcTaxGaz = function (cell) {
	  if ($scope.part[$scope.selectedRow].IsTaxeGaz) {
		if ($scope.part[$scope.selectedRow].DateEn == "" || $scope.part[$scope.selectedRow].DateEn == null || typeof $scope.part[$scope.selectedRow].DateEn == "undefined") {
		  $scope.part[$scope.selectedRow].TaxeGazCoef = null;
		  $scope.part[$scope.selectedRow].TaxeGaz = null;
		  updateCmd($scope.selectedRow,cell);
		}
		else if (($scope.part[$scope.selectedRow].MontantV !== 0) && ($scope.part[$scope.selectedRow].MontantV == "" || $scope.part[$scope.selectedRow].MontantV == null || typeof $scope.part[$scope.selectedRow].MontantV == "undefined")) {
		  $scope.part[$scope.selectedRow].TaxeGazCoef = null;
		  $scope.part[$scope.selectedRow].TaxeGaz = null;
		  updateCmd($scope.selectedRow,cell);
		}
		else {
		  var theYear = moment($scope.part[$scope.selectedRow].DateEn, $scope.formatDateM).format('YYYY');
		  var theMonth = moment($scope.part[$scope.selectedRow].DateEn, $scope.formatDateM).format('MM');
		  $http.get('/taxeGaz?Year=' + theYear + '&Month=' + theMonth).then(function (res) {
			if (res.data.length > 0) {
			  var percent = parseFloat(res.data[0].Percent);
			  if (isNaN(percent)) {
				$scope.part[$scope.selectedRow].TaxeGazCoef = null;
				$scope.part[$scope.selectedRow].TaxeGaz = null;
				$scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "Le taux de taxe gazoil n'est pas renseigné pour le " + theMonth + '/' + theYear);
			  }
			  else {
				var thePrice = (parseFloat($scope.part[$scope.selectedRow].MontantV) * parseFloat(res.data[0].Percent)) / 100;
				thePrice = parseFloat(thePrice);
				$scope.part[$scope.selectedRow].TaxeGazCoef = res.data[0].Percent;
				$scope.part[$scope.selectedRow].TaxeGaz = thePrice;
			  }
			}
			else {
			  $scope.part[$scope.selectedRow].TaxeGazCoef = null;
			  $scope.part[$scope.selectedRow].TaxeGaz = null;
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "Le taux de taxe gazoil n'est pas renseigné pour le " + theMonth + '/' + theYear);
			}
			updateCmd($scope.selectedRow,cell);
		  })
		}
	  }
	  else {
		$scope.part[$scope.selectedRow].TaxeGazCoef = null;
		$scope.part[$scope.selectedRow].TaxeGaz = null;
		updateCmd($scope.selectedRow,cell);
	  }
	};
  
	$scope.onSelectedAff = function (selectedItem) {
	  if (selectedItem === null) {
		$scope.Af = [];
		$scope.AfAll = {};
		$scope.Af.CodeAf = '';
		$scope.Af.Nom = '';
		$scope.Af.Adr = '';
		$scope.Af.AdresseComp = '';
		$scope.Af.Pays = '';
		$scope.Af.Cp = '';
		$scope.Af.Ville = '';
		$scope.Af.Tel = '';
		$scope.Af.Fax = '';
  
		console.log("troooo  ",$scope.part[$scope.selectedRow]);
  
		$scope.part[$scope.selectedRow].CodeAff = '';
		$scope.part[$scope.selectedRow].NomAff = '';
		$scope.part[$scope.selectedRow].AdrAff = '';
		$scope.part[$scope.selectedRow].CompAdrAff = '';
		$scope.part[$scope.selectedRow].CpAff = '';
		$scope.part[$scope.selectedRow].VilleAff = '';
		$scope.part[$scope.selectedRow].PaysAff = '';
		$scope.part[$scope.selectedRow].TelAff = '';
		$scope.part[$scope.selectedRow].FaxAff = '';
		$scope.part[$scope.selectedRow].ModeReglAff = '';
		$scope.part[$scope.selectedRow].DeviseAff = '';
		$scope.part[$scope.selectedRow].DeviseSAff = '';
		$scope.part[$scope.selectedRow].DelaiReglAff = '';
		$scope.part[$scope.selectedRow].TypeDelailAff = '';
		$scope.part[$scope.selectedRow].CoordinatesAff = '';
		$scope.part[$scope.selectedRow].CodeTVATr = '';
		$scope.part[$scope.selectedRow].TauxTVATr = null;
		$scope.part[$scope.selectedRow].MontantTVATr = null;
  
  
		updateCmd($scope.selectedRow);
	  }
	  else {
		if (selectedItem.Coordinates.length < 1) {
		  $scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "CLient non géolocalisé!<br>Veuillez renseigner les champs Lat et lng")
		  return $scope.updateAdr(selectedItem, 'aff', true, $scope.onSelectedAff);
		} else {
		  $scope.Af = [];
		  $scope.AfAll = selectedItem;
		  $scope.Af.CodeAf = selectedItem.CodeAffrete;
		  $scope.Af.Nom = selectedItem.Nom;
		  $scope.Af.Adr = selectedItem.Adresse;
		  $scope.Af.AdresseComp = selectedItem.AdresseComp;
		  $scope.Af.Pays = selectedItem.CodePays;
		  $scope.Af.Cp = selectedItem.CodePostal;
		  $scope.Af.Ville = selectedItem.Ville;
		  $scope.Af.Tel = selectedItem.Tel;
		  $scope.Af.Fax = selectedItem.Fax;
  
		  $scope.part[$scope.selectedRow].CodeAff = selectedItem.CodeAffrete;
		  $scope.part[$scope.selectedRow].NomAff = selectedItem.Nom;
		  $scope.part[$scope.selectedRow].AdrAff = selectedItem.Adresse;
		  $scope.part[$scope.selectedRow].CompAdrAff = selectedItem.AdresseComp;
		  $scope.part[$scope.selectedRow].CpAff = selectedItem.CodePostal;
		  $scope.part[$scope.selectedRow].VilleAff = selectedItem.Ville;
		  $scope.part[$scope.selectedRow].PaysAff = selectedItem.CodePays;
		  $scope.part[$scope.selectedRow].TelAff = selectedItem.Tel;
		  $scope.part[$scope.selectedRow].FaxAff = selectedItem.Fax;
		  $scope.part[$scope.selectedRow].ModeReglAff = selectedItem.ModeRegl;
		  $scope.part[$scope.selectedRow].DeviseAff = selectedItem.Devise;
		  $scope.part[$scope.selectedRow].DeviseSAff = selectedItem.DeviseS;
		  $scope.part[$scope.selectedRow].DelaiReglAff = selectedItem.DelaiRegl;
		  $scope.part[$scope.selectedRow].TypeDelailAff = selectedItem.TypeDelai;
		  $scope.part[$scope.selectedRow].CoordinatesAff = selectedItem.Coordinates;
		  $scope.part[$scope.selectedRow].CodeTVATr = selectedItem.CodeTva;
		  $scope.part[$scope.selectedRow].CodeTVATr = selectedItem.CodeTva;
  
  
		  $scope.part[$scope.selectedRow].CodeTVATr = selectedItem.CodeTva;
		  if (selectedItem.CodeTva != null && typeof selectedItem.CodeTva != "undefined" && selectedItem.CodeTva != "") {
			$http.get('/tvaTr?CodeTVA=' + selectedItem.CodeTva).then(function (res) {
			  console.log('res tvatr')
			  console.log(res)
			  console.log(res.data[0].Taux)
			  $scope.part[$scope.selectedRow].TauxTVATr = res.data[0].Taux;
			  $scope.part[$scope.selectedRow].CodeTVATr = res.data[0].CodeTVA;
			  updateCmd($scope.selectedRow);
			  if ($scope.part[$scope.selectedRow].MontantA != "" && typeof $scope.part[$scope.selectedRow].MontantA != "undefined") {
				console.log("ok ")
				$scope.part[$scope.selectedRow].MontantTVATr = (parseFloat(res.data[0].Taux) * parseFloat($scope.part[$scope.selectedRow].MontantA)) / 100;
			  }
			  else
				$scope.part[$scope.selectedRow].MontantTVATr = null;
			});
  
		  }
		  else
			$scope.part[$scope.selectedRow].MontantTVATr = null;
		 console.log( $scope.part[$scope.selectedRow])
  
		  updateCmd($scope.selectedRow);
		}
	  }
	  // $scope.loadingCmds = false;
	};
  
	$scope.onSelectedCli = function (selectedItem) {
	  console.log("selectedItem")
	  console.log(selectedItem)
	  $scope.nbrCliFaUnpay = 0;
	  if (selectedItem === null) {
		$scope.Cli = [];
		$scope.CliAll = {};
		$scope.Cli.CodeCli = '';
		$scope.Cli.Nom = '';
		$scope.Cli.Adresse = '';
		$scope.Cli.AdresseComp = '';
		$scope.Cli.Pays = '';
		$scope.Cli.Cp = '';
		$scope.Cli.Ville = '';
		$scope.Cli.Tel = '';
		$scope.Cli.Fax = '';
  
		$scope.part[$scope.selectedRow].CodeClient = '';
		$scope.part[$scope.selectedRow].NomClient = '';
		$scope.part[$scope.selectedRow].AdrCli = '';
		$scope.part[$scope.selectedRow].CompAdrCli = '';
		$scope.part[$scope.selectedRow].PaysCli = '';
		$scope.part[$scope.selectedRow].CpCli = '';
		$scope.part[$scope.selectedRow].VilleCli = '';
		$scope.part[$scope.selectedRow].CoordinatesCli = '';
		$scope.part[$scope.selectedRow].TelCli = '';
		$scope.part[$scope.selectedRow].FaxCli = '';
		$scope.part[$scope.selectedRow].CodeTVA = '';
		$scope.part[$scope.selectedRow].TauxTVA = null;
		$scope.part[$scope.selectedRow].MontantTVA = null;
  
		$scope.part[$scope.selectedRow].IsTaxeGaz = false;
		$scope.part[$scope.selectedRow].TaxeGaz = null;
  
		$scope.part[$scope.selectedRow].ModeReglCli = '';
		$scope.part[$scope.selectedRow].DeviseCli = '';
		$scope.part[$scope.selectedRow].DeviseLCli = '';
		$scope.part[$scope.selectedRow].DeviseSCli = '';
		$scope.part[$scope.selectedRow].DelaiReglCli = '';
		$scope.part[$scope.selectedRow].TypeDelailCli = '';
		$scope.isCliSetted = false;
		updateCmd($scope.selectedRow);
		// $scope.loadingCmds = false;
  
	  }
	  else {
		// if(selectedItem.Coordinates.length<1){
		//   $scope.newAlert('warning','<i class="fa fa-exclamation"></i>',"CLient non géolocalisé!<br>Veuillez renseigner les champs Lat et lng")
		//   return $scope.updateAdr(selectedItem,'cli',true,$scope.onSelectedCli);
		// }
		if (selectedItem && selectedItem.Coordinates && selectedItem.Coordinates.length < 1) {
		  return $scope.findAdr(selectedItem, "client");
		}
		else {
		  $scope.Cli = [];
		  $scope.CliAll = selectedItem;
		  $scope.Cli.CodeClient = selectedItem.CodeClient;
		  $scope.Cli.Nom = selectedItem.Nom;
		  $scope.Cli.Adr = selectedItem.Adresse;
		  $scope.Cli.AdresseComp = selectedItem.AdresseComp;
		  $scope.Cli.Pays = selectedItem.CodePays;
		  $scope.Cli.Cp = selectedItem.CodePostal;
		  $scope.Cli.Ville = selectedItem.Ville;
		  $scope.Cli.Tel = selectedItem.Tel;
		  $scope.Cli.Fax = selectedItem.Fax;
  
		  if (selectedItem.TaxeGaz == 'YES') {
			$scope.part[$scope.selectedRow].IsTaxeGaz = true;
			$scope.part[$scope.selectedRow].TaxeGaz = null;
			// $scope.calcTaxGaz();
		  }
		  else {
			$scope.part[$scope.selectedRow].IsTaxeGaz = false;
			$scope.part[$scope.selectedRow].TaxeGaz = null;
		  }
  
		  $scope.part[$scope.selectedRow].CodeClient = selectedItem.CodeClient;
		  $scope.part[$scope.selectedRow].TauxTVA = selectedItem.TauxTva;
		  $scope.part[$scope.selectedRow].MontantTVA = null;
		  $scope.part[$scope.selectedRow].NomClient = selectedItem.Nom;
		  $scope.part[$scope.selectedRow].CodeTVA = selectedItem.CodeTva;
		  $scope.part[$scope.selectedRow].AdrCli = selectedItem.Adresse;
		  $scope.part[$scope.selectedRow].CompAdrCli = selectedItem.AdresseComp;
		  $scope.part[$scope.selectedRow].PaysCli = selectedItem.CodePays;
		  $scope.part[$scope.selectedRow].CpCli = selectedItem.CodePostal;
		  $scope.part[$scope.selectedRow].VilleCli = selectedItem.Ville;
		  $scope.part[$scope.selectedRow].CoordinatesCli = selectedItem.Coordinates;
  
  
  
		  $scope.part[$scope.selectedRow].CodeTVA = selectedItem.CodeTva;
		  if (selectedItem.CodeTva != null && typeof selectedItem.CodeTva != "undefined" && selectedItem.CodeTva != "") {
			$http.get('/tva?CodeTVA=' + selectedItem.CodeTva).then(function (res) {
			  $scope.part[$scope.selectedRow].TauxTVA = res.data[0].Taux;
			  if ($scope.part[$scope.selectedRow].MontantV != "" && typeof $scope.part[$scope.selectedRow].MontantV != "undefined")
				$scope.part[$scope.selectedRow].MontantTVA = (parseFloat(res.data[0].Taux) * parseFloat($scope.part[$scope.selectedRow].MontantV)) / 100;
			  else
				$scope.part[$scope.selectedRow].MontantTVA = null;
			});
  
		  }
		  else
			$scope.part[$scope.selectedRow].MontantTVA = null;
  
		  $scope.part[$scope.selectedRow].ModeReglCli = selectedItem.ModeRegl;
		  $scope.part[$scope.selectedRow].DeviseCli = selectedItem.Devise;
		  $scope.part[$scope.selectedRow].DeviseLCli = selectedItem.DeviseL;
		  $scope.part[$scope.selectedRow].DeviseSCli = selectedItem.DeviseS;
		  $scope.part[$scope.selectedRow].DelaiReglCli = selectedItem.DelaiRegl;
		  $scope.part[$scope.selectedRow].TypeDelailCli = selectedItem.TypeDelai;
  
		  $scope.part[$scope.selectedRow].TelCli = selectedItem.Tel;
		  $scope.part[$scope.selectedRow].FaxCli = selectedItem.Fax;
  
		  $scope.isCliSetted = true;
  
		  $http.post('/factureC/countUnpaid', { name: $scope.part[$scope.selectedRow].CodeClient, type: "CodeClient", solder: false }).success(function (res) {
			console.log("res unpoaid")
			console.log(res.count)
			$scope.nbrCliFaUnpay = res.count;
		  });
  
		  $scope.cliToInter(selectedItem.CodeClient, $scope.selectedRow);
		}
	  }
	  // $scope.loadingCmds = true;
	};
  
	$scope.cliToInter = function (newVal, row) {
	  // $scope.loadingCmds = false;
  
	  $http.get('/intervenant?CodeInter=' + newVal).then(function (res) {
		if (res.data.length > 0) {
		  var $item = res.data[0];
		  if ($scope.part[row].CodeEn === "" || typeof $scope.part[row].CodeEn === "undefined" || $scope.part[row].CodeEn === null) {
			$scope.En = [];
			$scope.En.CodeEn = newVal;
			$scope.En.NomEn = res.data[0].Nom;
			$scope.En.AdrEn = res.data[0].Adresse;
			$scope.En.CompAdrEn = res.data[0].AdresseComp;
			$scope.En.CodePays = res.data[0].CodePays;
			$scope.En.Cp = res.data[0].CodePostal;
			$scope.En.Ville = res.data[0].Ville;
			$scope.En.Tel = res.data[0].Tel;
			$scope.En.Fax = res.data[0].Fax;
  
			$scope.part[row].CodeEn = newVal;
			$scope.part[row].NomEn = res.data[0].Nom;
			$scope.part[row].AdrEn = res.data[0].Adresse;
			$scope.part[row].CompAdrEn = res.data[0].AdresseComp;
			$scope.part[row].PaysEn = res.data[0].CodePays;
			$scope.part[row].CpEN = res.data[0].CodePostal;
			$scope.part[row].VilleEn = res.data[0].Ville;
			$scope.part[row].CoordinatesEn = res.data[0].Coordinates;
			$scope.part[row].TelEn = res.data[0].Tel;
			$scope.part[row].FaxEn = res.data[0].Fax;
			$scope.isEnSetted = true;
  
			if (res.data[0].Com != "" && res.data[0].Com !== null) {
			  $scope.enComment = true;
			} else
			  $scope.enComment = false;
		  }
  
		  if ($scope.part[row].CodeLiv === "" || typeof $scope.part[row].CodeLiv === "undefined" || $scope.part[row].CodeLiv === null) {
			$scope.Liv = [];
			$scope.Liv.CodeLiv = $item.CodeInter;
			$scope.Liv.NomLiv = $item.Nom;
			$scope.Liv.AdrLiv = $item.Adresse;
			$scope.Liv.CompAdrLiv = $item.AdresseComp;
			$scope.Liv.CodePays = $item.CodePays;
			$scope.Liv.Cp = $item.CodePostal;
			$scope.Liv.Ville = $item.Ville;
			$scope.Liv.Tel = $item.Tel;
			$scope.Liv.Fax = $item.Fax;
  
			$scope.part[row].CodeLiv = newVal;
			$scope.part[row].NomLiv = $item.Nom;
			$scope.part[row].AdrLiv = $item.Adresse;
			$scope.part[row].CompAdrLiv = $item.AdresseComp;
			$scope.part[row].PaysLiv = $item.CodePays;
			$scope.part[row].CpLiv = $item.CodePostal;
			$scope.part[row].VilleLiv = $item.Ville;
			$scope.part[row].CoordinatesLiv = res.data[0].Coordinates;
			$scope.part[row].TelLiv = $item.Tel;
			$scope.part[row].FaxLiv = $item.Fax;
  
			$scope.isLivSetted = true;
			if ($item.Com != "" && $item.Com !== null) {
			  $scope.livComment = true;
			} else
			  $scope.livComment = false;
		  }
  
		} else {
		  infoInter = {
			CodeInter: $scope.CliAll.CodeClient,
			Nom: $scope.CliAll.Nom,
			Adresse: $scope.CliAll.Adresse,
			AdresseComp: $scope.CliAll.AdresseComp,
			CodePays: $scope.CliAll.CodePays,
			CodePostal: $scope.CliAll.CodePostal,
			Ville: $scope.CliAll.Ville,
			Coordinates: $scope.CliAll.Coordinates,
  
			Site: $scope.CliAll.Site,
			Tel: $scope.CliAll.Tel,
			Fax: $scope.CliAll.Fax,
			ContactNom: $scope.CliAll.ContactNom,
			ContactPrenom: $scope.CliAll.ContactPrenom,
			Fonction: $scope.CliAll.Fonction,
			ContactTel: $scope.CliAll.ContactTel,
			ContactMail: $scope.CliAll.ContactMail,
			ContactFax: $scope.CliAll.ContactFax,
			Siren: $scope.CliAll.Siren,
			Siret: $scope.CliAll.Siret,
			TvaIntra: $scope.CliAll.TvaIntra,
			APE: $scope.CliAll.APE,
			Activite: $scope.CliAll.Activite,
		  };
  
		  io.socket.get('/Intervenant/createInter/', infoInter);
  
		  if ($scope.part[row].CodeEn === "" || typeof $scope.part[row].CodeEn === "undefined") {
			$scope.En = [];
			$scope.En.CodeEn = newVal;
			$scope.En.NomEn = $scope.CliAll.Nom;
			$scope.En.AdrEn = $scope.CliAll.Adresse;
			$scope.En.CompAdrEn = $scope.CliAll.AdresseComp;
			$scope.En.CodePays = $scope.CliAll.CodePays;
			$scope.En.Cp = $scope.CliAll.CodePostal;
			$scope.En.Ville = $scope.CliAll.Ville;
			$scope.En.Tel = $scope.CliAll.Tel;
			$scope.En.Fax = $scope.CliAll.Fax;
  
			$scope.part[row].CodeEn = newVal;
			$scope.part[row].NomEn = $scope.CliAll.Nom;
			$scope.part[row].AdrEn = $scope.CliAll.Adresse;
			$scope.part[row].CompAdrEn = $scope.CliAll.AdresseComp;
			$scope.part[row].PaysEn = $scope.CliAll.CodePays;
			$scope.part[row].CpEN = $scope.CliAll.CodePostal;
			$scope.part[row].VilleEn = $scope.CliAll.Ville;
			$scope.part[row].CoordinatesEn = $scope.CliAll.Coordinates;
			$scope.part[row].TelEn = $scope.CliAll.Tel;
			$scope.part[row].FaxEn = $scope.CliAll.Fax;
			$scope.isEnSetted = true;
		  }
  
		  if ($scope.part[row].CodeLiv === "" || typeof $scope.part[row].CodeLiv === "undefined") {
			var $item = $scope.CliAll;
			$scope.Liv = [];
			$scope.Liv.CodeLiv = newVal;
			$scope.Liv.NomLiv = $scope.CliAll.Nom;
			$scope.Liv.AdrLiv = $scope.CliAll.Adresse;
			$scope.Liv.CompAdrLiv = $scope.CliAll.AdresseComp;
			$scope.Liv.CodePays = $scope.CliAll.CodePays;
			$scope.Liv.Cp = $scope.CliAll.CodePostal;
			$scope.Liv.Ville = $scope.CliAll.Ville;
			$scope.Liv.Tel = $scope.CliAll.Tel;
			$scope.Liv.Fax = $scope.CliAll.Fax;
  
			$scope.part[row].CodeLiv = newVal;
			$scope.part[row].NomLiv = $scope.CliAll.Nom;
			$scope.part[row].AdrLiv = $scope.CliAll.Adresse;
			$scope.part[row].CompAdrLiv = $scope.CliAll.AdresseComp;
			$scope.part[row].PaysLiv = $scope.CliAll.CodePays;
			$scope.part[row].CpLiv = $scope.CliAll.CodePostal;
			$scope.part[row].VilleLiv = $scope.CliAll.Ville;
			$scope.part[row].CoordinatesLiv = $scope.CliAll.Coordinates;
			$scope.part[row].TelLiv = $scope.CliAll.Tel;
			$scope.part[row].FaxLiv = $scope.CliAll.Fax;
  
			$scope.isLivSetted = true;
		  }
		}
  
		if ($scope.part[$scope.selectedRow].IsTaxeGaz === true) {
		  $scope.calcTaxGaz();
		}
		else
		updateCmd(row,"inter");
  
	  });
	};

	var socket = io.sails.connect();
	socket.on('connect', function() {
	});
  

	socket.on('ordergenerer', function(data) {

		console.log("order genered");
		

		var d=data.orders;
		$scope.$apply(function() {
					d.forEach(element2 => {
						if(element2.id==$scope.part[$scope.selectedRow].id){
							console.log("i aaaaaar");
							$scope.part[$scope.selectedRow]=element2;
							$scope.part[$scope.selectedRow].isEnv=true;
							
						
						}
							
						
					});
				
				if(element.id==data.id){
					console.log("caaaa");
					element.Chauffeur_En="";
				}
			


		})
	})

	socket.on('orderModifEn', function(data) {
		$scope.$apply(function() {
			$scope.part.forEach(element => {
				if(element.id==data.id){
					console.log("caaaa");
					element.Chauffeur_En="";
				}
			});


		})
	})

	socket.on('orderModifLiv', function(data) {
		$scope.$apply(function() {
			$scope.part.forEach(element => {
				if(element.id==data.id){
					console.log("caaaa");
					element.Chauffeur_liv="";
				}
			});


		})
	})
  
	$scope.updateAdr = function (item, type, save, cb) {
	  $scope.modalActive = true;
	  apiService.mapModal(item, type).result.then(function (selectedItem) {
		$scope.modalActive = false;
		if (save === true) {
		  if (type == 'cli') {
			io.socket.post('/clients/updateClient/', selectedItem, function (message) {
			  cb(selectedItem);
			});
		  }
		}
		else
		  cb(selectedItem);
	  },
		function () {
		  $scope.modalActive = false;
		  $scope.hotInstance.deselectCell();
		  firstRowSelect = null;
		});
	};
  
	$scope.findAdr = function (selectedItem, type) {
	  console.log("find adr");
	};
  
	function removedefaulthelp() {
	  window.onhelp = function () {
		return false;
	  };
	}
  
	function checkOrder(value) {
	  if (value) {
		return ' ASC'
	  } else if (value === 'undefined') {
		return 'No'
	  } else if (!value) {
		return ' DESC'
	  }
	}
  
	$scope.hotTable = [];
	$scope.hotTable.setting = {
	  colHeaders: $scope.colHeaders,
	  columns: $scope.columns,
	  height: "320",
	  width: '100%',
	  overflow: scroll,
	  minSpareRows: 0,
	  fillHandle: false,
	  multiSelect: true,
	  columnSorting: true,
	  manualColumnResize: true,
	  sortIndicator: true,
	  outsideClickDeselects: false,
	  copyPaste: true,
	  copyRowsLimitNumber: 1,
	  copyColsLimit: 1,
	  currentRowClassName: 'currentRow',
	  currentColClassName: 'currentCell',
	  enterBeginsEditing: false,
	  enterMoves: { row: 0, col: 0 },
	  // enterMoves: {row: 0, col: 1},
	  autoColumnSize: true,
	  search: {
		callback: searchResultCounter
	  },
	  comments: false,
	  nestedRows: true,
	  onBeforeColumnSort: function (column, order) {
		console.log('index of a column to be sorted: ' + column);
		console.log('order of sorting for this column: ' + checkOrder(order));
  
		$scope.hotInstance.deselectCell();
  
		var theOrder = checkOrder(order);
  
		if (theOrder == 'No') {
		  $scope.columnFilter = '';
		}
		else
		  $scope.columnFilter = $scope.columns[column].data + theOrder;
  
		$scope.search(false);
  
		//here I return false to turn off front-end sorting
		return false
	  },
  
	  contextMenu: {
		callback: function (key, options) {
		  if (key === 'add_row') {
			setTimeout(function () {
			  $scope.addRow();
			}, 600);
		  }
		  else if (key === 'selectFac') {
			setTimeout(function () {
			  addToSelection($scope.selectedRow, $scope.selectedLastRow);
			}, 600);
		  }
		  else if (key === 'valid_cmd') {
			setTimeout(function () {
			  $scope.validCmd();
			}, 600);
		  }
		  else if (key === 'clone_cmd') {
			setTimeout(function () {
			  $scope.duplicate();
			}, 600);
		  }
		  else if (key === 'cancel_cmd') {
			setTimeout(function () {
			  $scope.annuleCmd();
			}, 600);
		  }
		  else if (key === 'show_map') {
			setTimeout(function () {
			  $scope.showMap();
			}, 600);
		  }
		  else if (key === 'show_cli') {
			setTimeout(function () {
			  var selection = $scope.hotInstance.getSelected();
  
			  if (selection) {
				var row = selection[0];
				var pathCli = "/client?CodeCLient=" + $scope.part[row].CodeClient;
				$location.url(pathCli);
			  }
			}, 600);
		  }
		  else if (key === 'show_en') {
			setTimeout(function () {
			  var selection = $scope.hotInstance.getSelected();
  
			  if (selection) {
				var row = selection[0];
				var pathCli = "/intervenants?CodeInter=" + $scope.part[row].CodeEn;
				$location.url(pathCli);
			  }
			}, 600);
		  }
		  else if (key === 'show_liv') {
			setTimeout(function () {
			  var selection = $scope.hotInstance.getSelected();
  
			  if (selection) {
				var row = selection[0];
				var pathCli = "/intervenants?CodeInter=" + $scope.part[row].CodeLiv;
				$location.url(pathCli);
			  }
			}, 600);
		  }
		  else if (key === 'show_Aff') {
			setTimeout(function () {
			  var selection = $scope.hotInstance.getSelected();
  
			  if (selection) {
				var row = selection[0];
				var pathCli = "/affrete?CodeAffrete=" + $scope.part[row].CodeAff;
				$location.url(pathCli);
			  }
			}, 600);
		  }
		  else if (key === 'metJour') {
			setTimeout(function () {
			 $scope.metJour();
			}, 600);
		  }
		  else if (key === 'control_cmd') {
			setTimeout(function () {
			  var selection = $scope.hotInstance.getSelected();
  
			  if (selection) {
				var row = selection[0];
  
				if (($scope.part[row].FactAffr !== '' && typeof $scope.part[row].FactAffr !== 'undefined' && $scope.part[row].FactAffr !== null) || ($scope.part[row].FactCli !== '' && typeof $scope.part[row].FactCli !== 'undefined' && $scope.part[row].FactCli !== null)) {
				  return $scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Commande Facturé!");
				}
  
				var modalInstance = $uibModal.open({
				  templateUrl: 'ModalCom',
				  controller: 'ModalComController',
				  size: "md",
				  backdrop: 'static',
				  resolve: {
					items: function () {
					  return '';
					},
					type: function () {
					  return "export";
					}
				  }
				});
  
				modalInstance.result.then(function (selectedItem) {
				  var text = "Renvoyer par <b>" + $rootScope.username + "</b> pour contrôle de la commande <br>" + selectedItem;
				  var aff = true;
				  if ($scope.part[row].CodeAff === "" || $scope.part[row].CodeAff === null || typeof $scope.part[row].CodeAff === "undefined")
					aff = false;
				  io.socket.post('/Ordergrid/sendControl/', { id: $scope.part[row].id, text: text, aff: aff }, function (message) {
					console.log("message")
					console.log(message)
  
					$scope.part[row].StatutCli = 'LITIGE';
					$scope.part[row].ComStatutCli = text;
					if (aff) {
					  $scope.part[row].StatutAff = 'LITIGE';
					  $scope.part[row].ComStatutAff = text;
					}
					$scope.part[row].StatutCmd = "Contrôle";
				  });
				});
			  }
			}, 600);
		  }
		  else if (key === 'add_Com') {
			setTimeout(function () {
			  var selection = $scope.hotInstance.getSelected();
  
			  if (selection) {
				var row = selection[0];
				// $scope.commentsPlugin.showAtCell(row, 1);
				// $scope.commentsPlugin.displaySwitch.cancelHiding();
  
			  }
			}, 600);
		  }
		},
		// },
		items: {
		  "selectFac": { name: 'Modifier la séléction' },
		  "hsep0": "---------",
		  "valid_cmd": { name: 'Valider commande' },
		  "control_cmd": { name: 'Renvoyer pour contrôle' },
		  "hsep0": "---------",
		  "clone_cmd": { name: 'Dupliquer commande' },
		  // "cancel_cmd": {name: 'Annulée commande'},
		  "hsep2": "---------",
		  "show_map": { name: 'Visualiser la commande' },
		  "show_cli": { name: 'Voir la fiche client' },
		  "show_en": { name: 'Voir la fiche Inter. En.' },
		  "show_liv": { name: 'Voir la fiche Inter. Liv.' },
		  "show_Aff": { name: 'Voir la fiche Affrété' },
		  "metJour": { name: 'valider la réception' },

		  // "hsep2": "---------",
		  // "add_Com": {name: 'Ajouter commentaires'},
		}
	  },
	  onAfterInit: function () {
		$scope.hotInstance = this.getInstance();
		$scope.commentsPlugin = this.getPlugin('comments');
	  },
	  onBeforeChange: $scope.beforeChanges,
	  onAfterChange: $scope.afterChange,
  
	  cell: $scope.cell,
	  cells: function (row, col, prop) {
		var cellProperties = {};
	  
		// Assurez-vous que le renderer spécifique à DateEn reste inchangé
		if (col === 5) {
			cellProperties.renderer = highlightFactCliRenderer;
		} else if (col === 0) {
		  cellProperties.renderer = margeCellRenderer;
		} else if (col === 1) {
		  cellProperties.renderer = dossierCellRenderer;
		} else if (col === 2) {
		  cellProperties.renderer = cliCellRenderer;
		} else if (col === 10 || col === 25) {
		  cellProperties.renderer = highlightFactCliNumRenderer;
		} else if (col === 3 || col === 4 || col === 6 || col === 7 || col === 8 || col === 9 || col === 11 || col === 12 || col === 13 || col === 14 || col === 15 || col === 16 || col === 20 || col === 26 || col === 27) {
		  cellProperties.renderer = highlightFactCliRenderer;
		} else if (col === 21 || col === 23 || col === 24 || col === 28 || col === 29) {
		  cellProperties.renderer = highlightFactAffRenderer;
		} else if (col === 22) {
		  cellProperties.renderer = highlightFactAffNumRenderer;
		} else {
		  cellProperties.renderer = highlightOthersRenderer;
		}
	  
		return cellProperties;
	  },
	  onBeforeKeyDown: function (e) {
		if ($scope.modalActive === true) {
		  if (e.keyCode !== 27)
			return;
		}
  
		if (e.keyCode === 17) {
		  $scope.ctrlBtn = true;
		  $scope.delaySele2(function () {
			// if($scope.ctrlBtn === false)
			$scope.ctrlBtn = false;
			// else
			//   $scope.ctrlBtn = false
		  }, 100)
		}
		var instance = this.getInstance();
		var selection = this.getSelected();
  
		if (!selection)
		  return;
		var row = selection[0];
  
		var activeEditor = instance.getActiveEditor();
  
		if (e.keyCode === 112) {
		  $scope.addRow();
		}
		if (e.keyCode === 122) {
		  $timeout.cancel(typingTimer);
		  typingTimer = $timeout(function () {
			$scope.duplicate();
  
		  }, 1000);
		}
  
		if (selection) {
		  if (selection[0] !== selection[2] || selection[1] !== selection[3] || e.keyCode === 112 || e.keyCode === 114 || e.keyCode === 115 || e.keyCode === 116 || e.keyCode == 117 || e.keyCode === 118 || e.keyCode === 119 || e.keyCode == 120 || e.keyCode == 121 || e.keyCode == 122 || e.keyCode == 123) {
			removedefaulthelp();
			e.cancelBubble = true;
			e.cancelable = true;
			e.stopPropagation();
			e.preventDefault();
			e.returnValue = false;
			e.stopImmediatePropagation();
			e.isImmediatePropagationEnabled = false;
			e.isImmediatePropagationStopped = function () {
			  return true;
			};
		  }
  
		  if (selection[0] != selection[2] || selection[1] != selection[3]) {
			if (e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 67 || e.keyCode === 88 || e.keyCode == 86) {
			}
		  }
  
		  if (selection[1] === 12) {
			if ((e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode >= 48 && e.keyCode <= 57)) {
  
			} else {
			  return false;
			}
		  }
  
		  if (selection[1] == 2) {
			// CLIENT
			if (e.keyCode === 113) {
			  Handsontable.dom.stopImmediatePropagation(e);
			  instance.deselectCell();
			  $scope.modalActive = true;
  
			  var actuCodeC = this.getDataAtCell(selection[0], selection[1]);
			  if (typeof e.target.value == 'undefined' || e.target.value === null)
				var CodeCli = actuCodeC;
			  else
				var CodeCli = e.target.value;
  
			  $scope.items = [{ name: CodeCli }];
			  val = $scope.CodeClient;
  
			  clientService.modalSelect($scope.items).result.then(function (selectedItem) {
				$scope.modalActive = false;
				instance.destroyEditor(true);
				$scope.onSelectedCli(selectedItem);
				$scope.hotInstance.selectCell(selection[0], 2, selection[0], 2, true);
			  }, function () {
				$scope.hotInstance.selectCell(selection[0], 2, selection[0], 2, true);
				$scope.modalActive = false;
				$scope.part[row].CodeClient = actuCodeC;
			  });
			}
			else if (e.keyCode === 46) {
			  $scope.onSelectedCli(null);
			}
		  } else if (selection[1] == 21) {
			// AFFRETES
			if (e.keyCode === 113) {
			  Handsontable.dom.stopImmediatePropagation(e);
			  instance.deselectCell();
			  $scope.modalActive = true;
  
			  var actuCodeC = this.getDataAtCell(selection[0], selection[1]);
			  if (typeof e.target.value == 'undefined' || e.target.value == null)
				var CodeCli = actuCodeC;
			  else
				var CodeCli = e.target.value;
  
			  $scope.items = [{ name: CodeCli }];
			  val = $scope.CodeClient;
  
			  affService.modalSelect($scope.items).result.then(function (selectedItem) {
				$scope.modalActive = false;
				instance.destroyEditor(true);
  
				$scope.onSelectedAff(selectedItem);
  
				$scope.hotInstance.selectCell(selection[0], 21, selection[0], 21, true);
  
			  }, function () {
				$scope.hotInstance.selectCell(selection[0], 21, selection[0], 21, true);
				$scope.modalActive = false;
				$scope.part[row].CodeAff = actuCodeC;
			  });
			}
		  }
  
  
		  else if (selection[1] == 6)  {
		
			// AFFRETES
			if (e.keyCode === 113) {
			console.log("ssssss");
			$scope.isHeur=true;

				if($scope.part[row].StatutCmd == 'VALIDÉ' && ($scope.part[row].FactCli == '' || !$scope.part[row].FactCli ) ){
					var confirm = $mdDialog.confirm()
					.title("Valider les modifcations ?")
					.textContent('La commande est déjà validée. Confirmer la modification ?')
					.ariaLabel('Confirmer la modification ?')
					.ok('Valider')
					.cancel('Annuler');
				  $mdDialog.show(confirm).then(function () {
					$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
					$timeout(function () {
					  $scope.updateBeforeChange(changes, row, cell, newVal, oldValue);
					  console.log("sssssas");
					  $scope.openSlider=true;
					$scope.isHeur=false;

			
					  $scope.selectedDate="En";
					  setTimeout(function() {
						var slider = document.getElementById('time-slider');
						noUiSlider.create(slider, {
							start: [8, 12, 13, 17],
							connect: [false, true, false, true, false],
							range: {
								'min': 0,
								'max': 24
							},
							step: 0.25 // Définit le pas de 1 heure
						});
			
						slider.noUiSlider.on('update', function(values, handle) {
							var selectedRanges = "";
							function formatTime(value) {
								var hours = Math.floor(value);
								var minutes = Math.round((value - hours) * 60);
								
								if (minutes === 60) {
									hours += 1;
									minutes = 0;
								}
						
								return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
							}
						
							var selectedRanges = "";
						
							if (parseFloat(values[1]) === parseFloat(values[2])) {
								// Cas où les plages horaires se chevauchent
								selectedRanges = formatTime(parseFloat(values[0])) + "-" + formatTime(parseFloat(values[3]));
							} else {
								// Cas où les plages horaires sont distinctes
								selectedRanges = formatTime(parseFloat(values[0])) + "-" + formatTime(parseFloat(values[1])) + " || " + formatTime(parseFloat(values[2])) + "-" + formatTime(parseFloat(values[3]));
							}
							$("#selected-ranges").text(selectedRanges);
							var handles = slider.querySelectorAll('.noUi-connect');
							handles.forEach(function(handle, index) {
								if (index === 1 && values[1] >= 12 && values[2] <= 13) {
									handle.classList.add('inactive');
								} else {
									handle.classList.remove('inactive');
								}
							});
						});
					}, 1300);
			
					}, 500)
				})
			}
			else{
				console.log("sssssas");
				$scope.openSlider=true;
	  
				$scope.selectedDate="En";
				setTimeout(function() {
					var slider = document.getElementById('time-slider');
						noUiSlider.create(slider, {
							start: [8, 12, 13, 17],
							connect: [false, true, false, true, false],
							range: {
								'min': 0,
								'max': 24
							},
							step: 0.25 // Définit le pas de 1 heure
						});
		
						slider.noUiSlider.on('update', function(values, handle) {
							var selectedRanges = "";
							function formatTime(value) {
								var hours = Math.floor(value);
								var minutes = Math.round((value - hours) * 60);
								
								if (minutes === 60) {
									hours += 1;
									minutes = 0;
								}
						
								return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
							}
						
							var selectedRanges = "";
						
							if (parseFloat(values[1]) === parseFloat(values[2])) {
								// Cas où les plages horaires se chevauchent
								selectedRanges = formatTime(parseFloat(values[0])) + "-" + formatTime(parseFloat(values[3]));
							} else {
								// Cas où les plages horaires sont distinctes
								selectedRanges = formatTime(parseFloat(values[0])) + "-" + formatTime(parseFloat(values[1])) + " || " + formatTime(parseFloat(values[2])) + "-" + formatTime(parseFloat(values[3]));
							}
							$("#selected-ranges").text(selectedRanges);
							var handles = slider.querySelectorAll('.noUi-connect');
							handles.forEach(function(handle, index) {
								if (index === 1 && values[1] >= 12 && values[2] <= 13) {
									handle.classList.add('inactive');
								} else {
									handle.classList.remove('inactive');
								}
							});
						});
				}, 1300);
				
	  
			}

		
			}
			
		  }
  
  
		  else if (selection[1] == 9) {
			console.log("ssssss");
			// AFFRETES
			if (e.keyCode === 113) {
			console.log("sssssas");
	
		

  
			$scope.selectedDate="Liv";
			if($scope.part[row].StatutCmd == 'VALIDÉ' && ($scope.part[row].FactCli == '' || !$scope.part[row].FactCli ) ){
				
					var confirm = $mdDialog.confirm()
					.title("Valider les modifcations ?")
					.textContent('La commande est déjà validée. Confirmer la modification ?')
					.ariaLabel('Confirmer la modification ?')
					.ok('Valider')
					.cancel('Annuler');
				  $mdDialog.show(confirm).then(function () {
					$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
					$timeout(function () {
					  $scope.updateBeforeChange(changes, row, cell, newVal, oldValue);
					  console.log("jjjjjjjjjjjjj");
					  $scope.openSlider=true;
					 
					  setTimeout(function() {
						var slider = document.getElementById('time-slider');
						noUiSlider.create(slider, {
							start: [8, 12, 13, 17],
							connect: [false, true, false, true, false],
							range: {
								'min': 0,
								'max': 24
							},
							step: 0.25 // Définit le pas de 1 heure
						});
			
						slider.noUiSlider.on('update', function(values, handle) {
							var selectedRanges = "";
							function formatTime(value) {
								var hours = Math.floor(value);
								var minutes = Math.round((value - hours) * 60);
								
								if (minutes === 60) {
									hours += 1;
									minutes = 0;
								}
						
								return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
							}
						
							var selectedRanges = "";
						
							if (parseFloat(values[1]) === parseFloat(values[2])) {
								// Cas où les plages horaires se chevauchent
								selectedRanges = formatTime(parseFloat(values[0])) + "-" + formatTime(parseFloat(values[3]));
							} else {
								// Cas où les plages horaires sont distinctes
								selectedRanges = formatTime(parseFloat(values[0])) + "-" + formatTime(parseFloat(values[1])) + " || " + formatTime(parseFloat(values[2])) + "-" + formatTime(parseFloat(values[3]));
							}
							$("#selected-ranges").text(selectedRanges);
							var handles = slider.querySelectorAll('.noUi-connect');
							handles.forEach(function(handle, index) {
								if (index === 1 && values[1] >= 12 && values[2] <= 13) {
									handle.classList.add('inactive');
								} else {
									handle.classList.remove('inactive');
								}
							});
						});
					}, 1300);
					})
				})
		
			}
			else{
				$scope.openSlider=true;
				setTimeout(function() {
					var slider = document.getElementById('time-slider');
						noUiSlider.create(slider, {
							start: [8, 12, 13, 17],
							connect: [false, true, false, true, false],
							range: {
								'min': 0,
								'max': 24
							},
							step: 0.25 // Définit le pas de 1 heure
						});
		
						slider.noUiSlider.on('update', function(values, handle) {
							var selectedRanges = "";
							function formatTime(value) {
								var hours = Math.floor(value);
								var minutes = Math.round((value - hours) * 60);
								
								if (minutes === 60) {
									hours += 1;
									minutes = 0;
								}
						
								return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
							}
						
							var selectedRanges = "";
						
							if (parseFloat(values[1]) === parseFloat(values[2])) {
								// Cas où les plages horaires se chevauchent
								selectedRanges = formatTime(parseFloat(values[0])) + "-" + formatTime(parseFloat(values[3]));
							} else {
								// Cas où les plages horaires sont distinctes
								selectedRanges = formatTime(parseFloat(values[0])) + "-" + formatTime(parseFloat(values[1])) + " || " + formatTime(parseFloat(values[2])) + "-" + formatTime(parseFloat(values[3]));
							}
							$("#selected-ranges").text(selectedRanges);
							var handles = slider.querySelectorAll('.noUi-connect');
							handles.forEach(function(handle, index) {
								if (index === 1 && values[1] >= 12 && values[2] <= 13) {
									handle.classList.add('inactive');
								} else {
									handle.classList.remove('inactive');
								}
							});
						});
				}, 1300);
			}
			}
			
		   
		  }
		  else if (selection[1] == 16) {
			// TVA VENTE
			if (e.keyCode === 113) {
			  Handsontable.dom.stopImmediatePropagation(e);
			  instance.deselectCell();
			  $scope.modalActive = true;
  
			  var actuCodeC = this.getDataAtCell(selection[0], selection[1]);
  
			  if (typeof e.target.value == 'undefined' || e.target.value == null)
				var CodeCli = actuCodeC;
			  else
				var CodeCli = e.target.value;
  
			  $scope.items = [{ name: CodeCli }];
  
			  tvaService.modalSelect($scope.items).result.then(
				function (selectedItem) {
				  $scope.modalActive = false;
				  instance.destroyEditor(true);
  
				  $scope.part[row].CodeTVA = selectedItem.CodeTVA;
				  $scope.part[row].TauxTVA = selectedItem.Taux;
				  if ($scope.part[row].MontantV != "" && typeof $scope.part[row].MontantV != "undefined")
					$scope.part[row].MontantTVA = (parseFloat(selectedItem.Taux) * parseFloat($scope.part[row].MontantV)) / 100;
				  else
					$scope.part[row].MontantTVA = null;
  
				   updateCmd(row,cell);;
				  $scope.hotInstance.selectCell(selection[0], 16, selection[0], 16, true);
				},
				function () {
				  $scope.modalActive = false;
				  $scope.part[row].CodeTVA = actuCodeC;
				  $scope.hotInstance.selectCell(selection[0], 16, selection[0], 16, true);
				});
			}
			else if (e.keyCode === 46) {
			  $scope.part[row].MontantTVA = "";
			  $scope.part[row].TauxTVA = "";
			  $scope.part[row].CodeTVA = "";
			   updateCmd(row,cell);;
			}
		  }
		  else if (selection[1] == 20) {
			// TYPE VEHICULE
			if (e.keyCode === 113) {
			  Handsontable.dom.stopImmediatePropagation(e);
			  instance.deselectCell();
			  $scope.modalActive = true;
  
			  var actuCodeC = this.getDataAtCell(selection[0], selection[1]);
			  if (typeof e.target.value == 'undefined' || e.target.value === null)
				var CodeCli = actuCodeC;
			  else
				var CodeCli = e.target.value;
  
			  $scope.items = [{ name: CodeCli }];
			  val = $scope.CodeClient;
  
			  vehService.modalType($scope.items).result.then(function (selectedItem) {
				$scope.modalActive = false;
				instance.destroyEditor(true);
				$scope.part[row].TypeVh = selectedItem.Nom;
				 updateCmd(row,cell);;
				$scope.hotInstance.selectCell(selection[0], 20, selection[0], 20, true);
  
			  }, function () {
				$scope.modalActive = false;
				$scope.part[row].TypeVh = actuCodeC;
				$scope.hotInstance.selectCell(selection[0], 20, selection[0], 20, true);
			  });
  
			}
		  }
		  else if (selection[1] == 24) {
			// TVA TRANSPORTEURS
			if (e.keyCode === 113) {
			  Handsontable.dom.stopImmediatePropagation(e);
			  instance.deselectCell();
			  $scope.modalActive = true;
			  var actuCodeC = this.getDataAtCell(selection[0], selection[1])
  
			  if (typeof e.target.value == 'undefined' || e.target.value == null)
				var CodeCli = actuCodeC;
			  else
				var CodeCli = e.target.value;
  
			  $scope.items = [{ name: CodeCli }];
  
			  val = $scope.CodeClient;
  
			  tvaService.modalSelectTr($scope.items).result.then(function (selectedItem) {
				$scope.modalActive = false;
				instance.destroyEditor(true);
				$scope.part[row].CodeTVATr = selectedItem.CodeTVA;
				$scope.part[row].TauxTVATr = selectedItem.Taux;
				if ($scope.part[row].MontantA != "" && typeof $scope.part[row].MontantA != "undefined")
				  $scope.part[row].MontantTVATr = (parseFloat(selectedItem.Taux) * parseFloat($scope.part[row].MontantA)) / 100;
				else
				  $scope.part[row].MontantTVATr = null;
				 updateCmd(row,cell);;
				$scope.hotInstance.selectCell(selection[0], 24, selection[0], 24, true);
			  }, function () {
				$scope.modalActive = false;
				$scope.part[row].TVA = actuCodeC;
				$scope.hotInstance.selectCell(selection[0], 24, selection[0], 24, true);
			  });
			}
			else if (e.keyCode === 46) {
			  $scope.part[row].MontantTVATr = null;
			  $scope.part[row].TauxTVATr = null;
			   updateCmd(row,cell);;
			}
		  }
		  else if (selection[1] == 4 || selection[1] == 7) {
			// INTERVENANTS
			if (e.keyCode === 113) {
			  Handsontable.dom.stopImmediatePropagation(e);
			  instance.deselectCell();
			  $scope.modalActive = true;
			  var actuCodeC = this.getDataAtCell(selection[0], selection[1])
			  if (typeof e.target.value == 'undefined' || e.target.value == null)
				var CodeCli = actuCodeC;
			  else
				var CodeCli = e.target.value;
  
			  $scope.items = [{ name: CodeCli }];
  
			  val = $scope.CodeClient;
  
			  interService.modalSelect($scope.items).result.then(function (selectedItem) {
				$scope.modalActive = false;
				instance.destroyEditor(true);
				if (selection[1] == 4) {
				  $scope.onSelectedInter(selectedItem, 'En');
				  $scope.hotInstance.selectCell(selection[0], 4, selection[0], 4, true);
				} else {
				  $scope.onSelectedInter(selectedItem, 'Liv');
				  $scope.hotInstance.selectCell(selection[0], 7, selection[0], 7, true);
				}
			  }, function () {
				$scope.modalActive = false;
				if (selection[1] == 4) {
				  $scope.part[row].CodeEn = actuCodeC;
				  $scope.hotInstance.selectCell(selection[0], 4, selection[0], 4, true);
				}
				else {
				  $scope.part[row].CodeLiv = actuCodeC;
				  $scope.hotInstance.selectCell(selection[0], 7, selection[0], 7, true);
				}
			  });
			}
		  }
  
		  if (e.keyCode === 46) {
			$scope.acceptDelKey = true;
		  }
		}
	  },
	  onAfterSelectionEnd: function (r, c, r2, c2) {
		$scope.theSelectedL = [r, c, r2, c2];
  
		$scope.selectedRow = r;
		$scope.selectedLastRow = r2;
  
		if ($scope.ctrlBtn === true)
		  addToSelection(r, r2);
		if (r != firstRowSelect || r2 != lastRowSelect || $scope.isCmdSetted === false)
		  $scope.loadingCmd = true;
  
		$scope.delaySele(function () {
		  if (r != firstRowSelect || r2 != lastRowSelect || $scope.isCmdSetted === false) {
			firstRowSelect = r;
			lastRowSelect = r2;
			$scope.setCmd($scope.selectedRow);
		  }
  
		  $scope.boxEnFocusOut();
		  $scope.boxLivFocusOut();
		  $scope.boxCliFocusOut();
		  $scope.boxAffFocusOut();
		  if (c == 2) {
			$scope.boxCliFocus();
		  } else if (c == 4) {
			$scope.boxEnFocus();
  
		  } else if (c == 7) {
			$scope.boxLivFocus();
		  } else if (c == 21) {
			$scope.boxAffFocus();
		  }
		}, 100);
	  },
	  onAfterSelection: function (r, c, r2, c2) {
		if ($scope.cmdUpdate) {
		  $scope.cmdUpdate = false;
		  updateCmd($scope.theSelectedL[0]);
		}
		if (r != firstRowSelect || r2 != lastRowSelect || $scope.isCmdSetted === false) {
		  console.log("onAfterSelectionEnd")
		  $scope.En = [];
		  $scope.Liv = [];
		  $scope.Com = [];
		  $scope.Af = [];
		  $scope.Cli = [];
  
		  $scope.Com.Exploit = '';
		  $scope.Com.Client = '';
		  $scope.NumDossier = '';
  
		  $scope.comEx = false;
		  $scope.liCli = false;
		  $scope.liAff = false;
		  $scope.isCmdSetted = false;
		  $scope.isAfSetted = false;
		  $scope.isCliSetted = false;
		  $scope.isLivSetted = false;
		  $scope.isEnSetted = false;
		  $scope.loadingCmd = false;
		}
	  }
	};
  
	function fom(date) {
	  if (date.getDate() != 1) {
		return [false, "", "Specify 1st of Month"];
	  }
	  return [true, ""];
	}
  
	function dateValidator(value, callback) {
	  setTimeout(function () {
		if (value === null || value == 'Invalid date') {
		  callback(false);
		}
		else {
		  callback(true);
		}
	  }, 100);
	}
  
  
	function hheureValidator(value, callback) {
	  
		 setTimeout(() => {
  
		  $scope.part[$scope.selectedRow].HeureEn=""
		  value="";
  
		  callback(false);
		  value="";
		 }, 200);
  
	 
	}
	function hheureValidator2(value, callback) {
	  
	  setTimeout(() => {
  
	   $scope.part[$scope.selectedRow].HeureLiv=""
	   value="";
  
	   callback(false);
	   value="";
	  }, 200);
  
  
  }
	$scope.open = function (size, data) {
	  var modalInstance = $uibModal.open({
		templateUrl: 'ModalNewCmd',
		controller: 'ModalController',
		size: size,
		keyboard: false,
		backdrop: 'static',
		resolve: {
		  items: function () {
			return angular.copy(data);
		  }
		}
	  });
	  modalInstance.result.then(function (selectedItem) {
		var modalInst = $uibModal.open({
		  animation: true,
		  templateUrl: 'shouldBeOpen.html',
		  controller: 'shouldBeOpenCtrl',
		  size: 'md',
		  resolve: {
			items: function () {
			  return selectedItem;
			}
		  }
		});
  
		modalInst.result.then(function (selectedItem) {
		  var item = [];
		  item.NumDossier = selectedItem;
		  $http.get('/Ordergrid?NumDossier=' + selectedItem).then(function (response) {
			if (response.data.length > 0) {
			  $scope.onSelectFolder(response.data[0]);
			}
		  });
		}, function () {
		});
		$scope.selected = selectedItem;
	  }, function () {
	  });
	};
  
	var typingTimer;
	var timer = 0;
	var timer2 = 0;
  
	$scope.fileMaleCplt = function ($file, $message, $flow) {
	  if ($message === "invalid_flow_request") {
		$alert({ title: '', content: 'Erreur pendant le téléchargement!', alertType: 'danger', clearExists: true, duration: 4, autoDestroy: true, placement: 'center', effect: 'bounce-in' });
	  }
	  var name = $flow.files[0].name;
	  var size = $flow.files[0].size;
	  var uniqueIdentifier = $flow.files[0].uniqueIdentifier;
	  var typeDoc = name.split('.').pop();
	  console.log("$message")
	  console.log($message)
  
  
	  $scope.part = JSON.parse($message);
	  // $http.get('/fileUpload/create?NumDossier='+$scope.idDossier+'&Name='+name+'&Size='+size+'&Identifier='+uniqueIdentifier+'&Folder=/upload/').then(function(res){
	  // $http.post('/fileUpload/create',{NumDossier:$scope.idDossier,Name:name,Size:size,Identifier:uniqueIdentifier+'.'+typeDoc,Folder:"/upload/"}).then(function(res){
	  //   $scope.nbrCmdFiles++;
	  //   $scope.findFile = true;
	  //   console.log(res);
	  //   $scope.allFiles.push(res.data);
	  // },function(res){
	  //   console.log(res);
	  // });
  
	  $flow.files.splice(0, 1);
	};
  
	$scope.flowMaleCplt = function ($file, $message, $flow) {
  
	  $alert({ title: 'Téléchargement terminé!', content: '', alertType: 'success', clearExists: true, duration: 4, autoDestroy: true, placement: 'center', effect: 'bounce-in' });
	};
  
	$scope.importMale = function () {
  
	};
  
	$scope.exportExcell = function () {
	  var data = [];
	  for (var x = 0; x < $scope.part.length; x++) {
		data[x] = {};
		data[x].NumDossier = $scope.part[x].NumDossier;
		if (typeof $scope.part[x].NomClient == 'undefined')
		  data[x].Nom_Client = '';
		else
		  data[x].Nom_Client = $scope.part[x].NomClient;
  
		data[x].Ref = $("<div/>").html($scope.part[x].ComClient).text();
  
		data[x].Date_En = $scope.part[x].DateEn;
		data[x].Nom_En = $scope.part[x].NomEn;
		data[x].Adr_En = $scope.part[x].AdrEn;
		data[x].Cp_En = $scope.part[x].CpEN;
		data[x].Ville_En = $scope.part[x].VilleEn;
		data[x].Pays_En = $scope.part[x].PaysEn;
		data[x].Date_Liv = $scope.part[x].DateLiv;
		data[x].Nom_Liv = $scope.part[x].NomLiv;
		data[x].Adr_Liv = $scope.part[x].AdrLiv;
		data[x].Cp_Liv = $scope.part[x].CpLiv;
		data[x].Ville_Liv = $scope.part[x].VilleLiv;
		data[x].Pays_Liv = $scope.part[x].PaysLiv;
		data[x].Colis = $scope.part[x].Colis;
		data[x].Palettes = $scope.part[x].Palettes;
		data[x].Poids = $scope.part[x].Poids;
		data[x].ML = $scope.part[x].MetreLin;
		data[x].M3 = $scope.part[x].MetreCube;
  
		data[x].Prix = $scope.part[x].MontantV;
		data[x].CodeTVA = $scope.part[x].CodeTVA;
		data[x].MontantTva = $scope.part[x].MontantTVA;
		data[x].TaxeGazCoef = $scope.part[x].TaxeGazCoef;
		data[x].TaxeGaz = $scope.part[x].TaxeGaz;
		data[x].NumFact = $scope.part[x].FactCli;
		// data[x].MontantTva = $scope.part[x].MontantTVAT;
		data[x].Commentaires = $("<div/>").html($scope.part[x].ComExport).text();
	  }
  
	  console.log(data);
  
	  var ws_name = "SheetJS";
	  var dateNow = moment().format('DD_MM_YY_HH_mm');
	  var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
  
  
	  var wb = XLSX.utils.book_new();
  
	  var ws = XLSX.utils.json_to_sheet(data);
	  console.log("XLSX.utils");
	  ws.A1.s =
	  {
		patternType: 'solid',
		fgColor: { theme: 8, tint: 0.3999755851924192, rgb: '9ED2E0' },
		bgColor: { indexed: 64 }
	  };
	  XLSX.utils.book_append_sheet(wb, ws, ws_name);
  
	  var wbout = XLSX.write(wb, wopts);
  
	  function s2ab(s) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	  }
  
	  saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'export_' + dateNow + ".xlsx");
	};
  
	$scope.delaySele = function (callback, ms) {
	  clearTimeout(timer);
	  timer = setTimeout(callback, ms);
	};
	$scope.delaySele2 = function (callback, ms) {
	  clearTimeout(timer2);
	  timer2 = setTimeout(callback, ms);
	  // $scope.ctrlBtn = false;    
	};
  
	$scope.inputKeyDown = function () {
	  $timeout.cancel(typingTimer);
	};
  
	$scope.inputKeyUp = function (field, data) {
	  if ($scope.isCmdSetted) {
		if (field === "ComClient") {
		  $scope.cmdUpdate = true;
		  var row = $scope.selectedRow;
		  $scope.part[row]['ComClient'] = data;
		}
		else if (field === "ComExploit") {
		  $scope.cmdUpdate = true;
		  var row = $scope.selectedRow;
		  $scope.part[row]['ComExploit'] = data;
		}
		else if (field === "palEur") {
		  $scope.cmdUpdate = true;
		  var row = $scope.selectedRow;
		  $scope.part[row]['PalEur'] = data;
		}
		$timeout.cancel(typingTimer);
		typingTimer = $timeout(function () {
		  if (field === "ComClient") {
			$scope.modifDetCmd('ComClient', $scope.part[row]['ComClient']);
		  }
		  else if (field === "ComExploit") {
			console.log('save')
			$scope.modifDetCmd('ComExploit', $scope.part[row]['ComExploit']);
		  }
		  else {
			$scope.modifDetCmd(field, null);
		  }
		}, 500);
	  }
	};
  
	function updateCmd(row, para, selection) {
	  console.log("updateCmd");
	  console.log("test");
	  console.log(para);
	  if (!selection)
		$scope.hotInstance.deselectCell();
	  if ($scope.part[row].NumDossier === '') {
		if ($scope.part[row].CodeClient === '') {
		  $scope.loadingCmds = false;
		  return false;
		}
  
		insertCmd(row);
	  }
	  else {
		$rootScope.loadState = false;
		var id = $scope.part[row].id;
		var cell = 'ee';
		var dataUp = angular.copy($scope.part[row]);
		dataUp.cell=para;
  
		if (dataUp.DateEn == 'Invalid date' || dataUp.DateEn == '') {
		  dataUp.DateEn = null;
		}
		else if (dataUp.DateEn != '' && dataUp.DateEn !== null && typeof dataUp.DateEn != 'undefined')
		  dataUp.DateEn = moment.utc(dataUp.DateEn, $rootScope.formatDateM).toDate();
  
		if (dataUp.DateLiv == 'Invalid date' || dataUp.DateLiv == '') {
		  dataUp.DateLiv = null;
		}
		else if (dataUp.DateLiv != '' && dataUp.DateLiv !== null && typeof dataUp.DateLiv != 'undefined')
		  dataUp.DateLiv = moment.utc(dataUp.DateLiv, $rootScope.formatDateM).toDate();
  
		delete dataUp.createdAt;
		delete dataUp.updatedAt;
  
		if (dataUp.TaxeGazCoef === null || dataUp.TaxeGazCoef == "" || typeof dataUp.TaxeGazCoef == 'undefined' || isNaN(dataUp.TaxeGazCoef))
		  dataUp.TaxeGazCoef = 0;
		else
		  dataUp.TaxeGazCoef = parseFloat(dataUp.TaxeGazCoef);
  
		if (dataUp.MontantV === null || dataUp.MontantV == '' || typeof dataUp.MontantV == 'undefined' || isNaN(dataUp.MontantV))
		  dataUp.MontantV = 0;
		else
		  dataUp.MontantV = parseFloat(dataUp.MontantV);
  
		if (dataUp.MontantA === null || dataUp.MontantA == '' || typeof dataUp.MontantA == 'undefined' || isNaN(dataUp.MontantA))
		  dataUp.MontantA = 0;
		else
		  dataUp.MontantA = parseFloat(dataUp.MontantA);
  
		dataUp.updatedName = $rootScope.username;
		if (isNaN(dataUp.Marge)) {
		  dataUp.Marge = 0;
		}
  
		console.log("dataUp")
		console.log(dataUp)
  
		io.socket.get('/Ordergrid/updateCmd/', { id: id, field: cell, value: dataUp }, function (message) {
		  if (!selection) {
			$timeout(function () {
			  $scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1] + 1, $scope.theSelectedL[0], $scope.theSelectedL[1] + 1, true);
			}, 10);
		  }
		  $scope.loadingCmds = false;
  
		 
		  $rootScope.loadState = true;
		});
	  }
	}
  
	function insertCmd(row) {
	  console.log("insert")
	  $rootScope.loadState = false;
	  $scope.waitInsert = true;
	  $scope.newAlert('warning', '<i class="fa fa-spinner fa-spin"></i>', 'Création commande en cours.');
	  $scope.part[row].createdBy = $scope.owner;
	  $scope.part[row].createdName = $scope.username;
	  $scope.part[row].Valide = 0;
  
	  var dataUp = angular.copy($scope.part[row]);
	  if (dataUp.DateEn != '' && dataUp.DateEn !== null && typeof dataUp.DateEn != 'undefined')
		dataUp.DateEn = moment.utc(dataUp.DateEn, $rootScope.formatDateM).toDate();
	  // dataUp.DateEn = moment(dataUp.DateEn, $rootScope.formatDateM).format();
	  if (dataUp.DateLiv != '' && dataUp.DateLiv !== null && typeof dataUp.DateLiv != 'undefined')
		dataUp.DateLiv = moment.utc(dataUp.DateLiv, $rootScope.formatDateM).toDate();
	  // dataUp.DateLiv = moment(dataUp.DateLiv, $rootScope.formatDateM).format();
  
	  delete dataUp.NumDossier;
  
	  if (dataUp.TaxeGazCoef !== null && typeof dataUp.TaxeGazCoef != 'undefined')
		dataUp.TaxeGazCoef = parseFloat(dataUp.TaxeGazCoef);
  
	  dataUp.MontantV = 0;
	  dataUp.MontantA = 0;
  
	  io.socket.post('/Ordergrid/createCmd/', dataUp, function (message) {
  
		$scope.part[row].id = message.id;
		$scope.part[row].NumDossier = message.NumDossier;
		$scope.part[row].createdName = message.createdName;
		// $scope.part[row].createdAt =  message.createdAt;
		$scope.part[row].createdAt = moment(message.createdAt).format('DD/MM/YY HH:mm');
		$scope.isCmdSetted = true;
		$timeout(function () {
		  $scope.newAlert('success', '<i class="fa fa-check"></i>', 'Dossier ' + $scope.part[row].NumDossier + ' créé');
		  $timeout(function () {
			$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
			$scope.waitInsert = false;
			$rootScope.loadState = true;
			$scope.loadingCmds = false;
  
		  }, 10)
		}, 300)
	  });
	};
  
	function searchResultCounter(instance, row, col, value, result) {
	  Handsontable.Search.DEFAULT_CALLBACK.apply(this, arguments);
	  if (result) {
		searchResultCount++;
	  };
	};
  
	searchFiled = document.getElementById('search_field');
	resultCount = document.getElementById('resultCount');
  
	Handsontable.Dom.addEvent(searchFiled, 'keyup', function (event) {
	  var queryResult;
	  var hot = hotRegisterer.getInstance('myTable');
	  searchResultCount = 0;
	  queryResult = $scope.hotInstance.search.query(this.value);
	  resultCount = searchResultCount.toString();
	  $scope.NbrVal = resultCount;
	  $scope.hotInstance.render();
	  $scope.$digest();
	});
  
	function decodeHtml(html) {
	  var txt = document.createElement("textarea");
	  txt.innerHTML = html;
	  return txt.value;
	}
  
	$scope.printStockOut = function () {
	  console.log('print stat');
	  var modalInstance = $uibModal.open({
		templateUrl: 'ModalSelectDate',
		controller: 'ModalPrintStockController',
		size: 'lg',
		keyboard: false,
		backdrop: 'static'
	  });
  
	  modalInstance.result.then(function (all) {
  
	  }, function (all) {
		console.log('dismiss')
	  });
  
	};
  
	$scope.exportTour = function () {
	  console.log('exportTour');
	  var modalInstance = $uibModal.open({
		templateUrl: 'ModalSelectDate',
		controller: 'ModalExportTourController',
		size: 'md',
		keyboard: false,
		backdrop: 'static'
	  });
  
	  modalInstance.result.then(function (all) {
  
	  }, function (all) {
		console.log('dismiss')
	  });
  
	};
  
	$scope.printStat = function () {
	  var dossier = '';
	  var ref = '';
  
	  var pal = '';
	  var poids = '';
	  var colis = '';
	  var mlp = '';
	  var m3 = '';
  
	  var heure_enl = '';
	  var date_enl = '';
	  var nomEn = '';
	  var adr_enl = '';
	  var adr_enl2 = '';
	  var cpEn = '';
	  var villeEn = '';
	  var paysEn = '';
	  var telEn = '';
  
	  var nomLiv = '';
	  var date_liv = '';
	  var heure_liv = '';
	  var adr_liv = '';
	  var adr_liv2 = '';
	  var cpLiv = '';
	  var villeLiv = '';
	  var paysLiv = '';
	  var telLiv = '';
  
	  var NomAff = '';
	  var AdrAff = '';
	  var CompAdrAff = '';
	  var CpAff = '';
	  var VilleAff = '';
	  var PaysAff = '';
	  var TelAff = '';
	  var FaxAff = '';
	  var ContactAff = '';
	  var MontantV = '';
	  var ModeReglAff = '';
	  var DeviseAff = '';
	  var DelaiReglAff = '';
	  var TypeDelailAff = '';
  
	  var comment = '';
	  var chauffeur = '';
	  var chauffeur2 = '';
	  var ville = '';
	  var pays = '';
	  var client = '';
	  var codeCli = '';
	  var createdBy = '';
  
	  for (i = 0; i < $scope.part.length; i++) {
  
		if (type == "confAff") {
		  if ($scope.part[i].CodeAff === null || $scope.part[i].CodeAff == 'null' || $scope.part[i].CodeAff == '') {
			$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Veuillez renseigner un code affrété");
			return false;
		  }
		}
  
		if (type == "mission" || type == "cmr" || type == "mCMR") {
		  if ($scope.part[i].CodeAff != '') {
			$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Un code affrété est renseigné");
			return false;
		  }
		}
  
		dossier = dossier + $scope.part[i].NumDossier + '$*';
		ref = ref + $scope.part[i].Reference + '$*';
  
		client = client + $scope.part[i].NomClient + '$*';
		codeCli = codeCli + $scope.part[i].CodeClient + '$*';
  
		chauffeur = chauffeur + $scope.part[i].CodeChauf1 + '$*';
		chauffeur2 = chauffeur2 + $scope.part[i].CodeChauf2 + '$*';
  
		date_enl = date_enl + $scope.part[i].DateEn + '$*';
		heure_enl = heure_enl + $scope.part[i].HeureEn + '$*';
		nomEn = nomEn + $scope.part[i].NomEn + '$*';
		adr_enl = adr_enl + $scope.part[i].AdrEn + '$*';
		adr_enl2 = adr_enl2 + $scope.part[i].CompAdrEn + '$*';
		cpEn = cpEn + $scope.part[i].CpEN + '$*';
		villeEn = villeEn + $scope.part[i].VilleEn + '$*';
		paysEn = paysEn + $scope.part[i].PaysEn + '$*';
		telEn = telEn + $scope.part[i].TelEn + '$*';
  
		date_liv = date_liv + $scope.part[i].DateLiv + '$*';
		heure_liv = heure_liv + $scope.part[i].HeureLiv + '$*';
		nomLiv = nomLiv + $scope.part[i].NomLiv + '$*';
		adr_liv = adr_liv + $scope.part[i].AdrLiv + '$*';
		adr_liv2 = adr_liv2 + $scope.part[i].CompAdrLiv + '$*';
		cpLiv = cpLiv + $scope.part[i].CpLiv + '$*';
		villeLiv = villeLiv + $scope.part[i].VilleLiv + '$*';
		paysLiv = paysLiv + $scope.part[i].PaysLiv + '$*';
		telLiv = telLiv + $scope.part[i].TelLiv + '$*';
  
		NomAff = NomAff + $scope.part[i].NomAff + '$*';
		AdrAff = AdrAff + $scope.part[i].AdrAff + '$*';
		CompAdrAff = CompAdrAff + $scope.part[i].CompAdrAff + '$*';
		CpAff = CpAff + $scope.part[i].CpAff + '$*';
		VilleAff = VilleAff + $scope.part[i].VilleAff + '$*';
		PaysAff = PaysAff + $scope.part[i].PaysAff + '$*';
		TelAff = TelAff + $scope.part[i].TelAff + '$*';
		FaxAff = FaxAff + $scope.part[i].FaxAff + '$*';
		ContactAff = ContactAff + $scope.part[i].ContactAff + '$*';
		MontantV = MontantV + $scope.part[i].MontantV + '$*';
		ModeReglAff = ModeReglAff + $scope.part[i].ModeReglAff + '$*';
		DeviseAff = DeviseAff + $scope.part[i].DeviseAff + '$*';
		DelaiReglAff = DelaiReglAff + $scope.part[i].DelaiReglAff + '$*';
		TypeDelailAff = TypeDelailAff + $scope.part[i].TypeDelailAff + '$*';
  
		pal = pal + $scope.part[i].Palettes + '$*';
		poids = poids + $scope.part[i].Poids + '$*';
		colis = colis + $scope.part[i].Colis + '$*';
		mlp = mlp + $scope.part[i].MetreLin + '$*';
		m3 = m3 + $scope.part[i].MetreCube + '$*';
  
		var theComment = $scope.part[i].ComClient;
  
		var theComment = $("<div/>").html(theComment).text();
  
		comment = comment + theComment + '$*';
		createdBy = createdBy + $scope.part[i].createdName + '$*';
	  }
  
	  var data = {
		dossier: dossier,
		ref: ref,
		codeCli: codeCli,
		chauffeur: chauffeur,
		chauffeur2: chauffeur2,
  
		NomAff: NomAff,
		AdrAff: AdrAff,
		CompAdrAff: CompAdrAff,
		CpAff: CpAff,
		VilleAff: VilleAff,
		PaysAff: PaysAff,
		TelAff: TelAff,
		FaxAff: FaxAff,
		ContactAff: ContactAff,
		ModeReglAff: ModeReglAff,
		DeviseAff: DeviseAff,
		DelaiReglAff: DelaiReglAff,
		TypeDelailAff: TypeDelailAff,
  
		MontantV: MontantV,
		client: client,
  
		date_enl: date_enl,
		heure_enl: heure_enl,
		nomEn: nomEn,
		adr_enl: adr_enl,
		adr_enl2: adr_enl2,
		cpEn: cpEn,
		villeEn: villeEn,
		paysEn: paysEn,
		telEn: telEn,
  
		date_liv: date_liv,
		heure_liv: heure_liv,
		nomLiv: nomLiv,
		adr_liv: adr_liv,
		adr_liv2: adr_liv2,
		cpLiv: cpLiv,
		villeLiv: villeLiv,
		paysLiv: paysLiv,
		telLiv: telLiv,
  
		poids: poids,
		colis: colis,
		pal: pal,
		mlp: mlp,
		m3: m3,
		comment: comment,
		createdBy: createdBy,
	  };
  
	  data.typePdf = 'statOrders';
  
	  pdfService.modalPrint(data);
  
	};
  
	$scope.printDoc = function (type) {
	  if (type == 'confAff') {
		if ($scope.allIdSelecAf.length === 0) {
		  return $scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Confirmation Affrétement<br>Aucune commande séléctionnée!");
		}
	  }
	  else {
		if ($scope.allIdSelecDist.length === 0) {
		  return $scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Distribution<br>Aucune commande séléctionnée!");
		}
	  }
  
	  var data = [];
	  if ($scope.allselected > 0) {
		if (type == "mission" || type == "cmr" || type == "mCMR") {
		  for (var x = 0; x < $scope.allIdSelecDist.length; x++) {
			console.log("$scope.allIdSelecDist");
			console.log($scope.allIdSelecDist);
			if ($scope.allIdSelecDist[x].DateEn === "" || $scope.allIdSelecDist[x].DateEn === null || typeof $scope.allIdSelecDist[x].DateEn === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecDist[x].NumDossier + '<br>Date Enlèvement non renseignée.');
			}
			else if ($scope.allIdSelecDist[x].DateLiv === "" || $scope.allIdSelecDist[x].DateLiv === null || typeof $scope.allIdSelecDist[x].DateLiv === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecDist[x].NumDossier + '<br>Date Livraison non renseignée.');
			}
			else if ($scope.allIdSelecDist[x].CodeClient === "" || $scope.allIdSelecDist[x].CodeClient === null || typeof $scope.allIdSelecDist[x].CodeClient === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecDist[x].NumDossier + '<br>Code Client non renseigné.');
			}
			else if ($scope.allIdSelecDist[x].CodeEn === "" || $scope.allIdSelecDist[x].CodeEn === null || typeof $scope.allIdSelecDist[x].CodeEn === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecDist[x].NumDossier + ".<br>Aucun intervenant renseigné pour l'enlevement.");
			}
			else if ($scope.allIdSelecDist[x].CodeLiv === "" || $scope.allIdSelecDist[x].CodeLiv === null || typeof $scope.allIdSelecDist[x].CodeLiv === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecDist[x].NumDossier + ".<br>Aucun intervenant renseigné pour la livraison.");
			}
			else if ($scope.allIdSelecDist[x].MontantV === "" || $scope.allIdSelecDist[x].MontantV === null || typeof $scope.allIdSelecDist[x].MontantV === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecDist[x].NumDossier + ".<br>Le prix de vente n'est pas renseigné.");
			}
			else if ($scope.allIdSelecDist[x].CodeTVA === "" || $scope.allIdSelecDist[x].CodeTVA === null || typeof $scope.allIdSelecDist[x].CodeTVA === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecDist[x].NumDossier + ".<br>Le code TVA client n'est pas renseigné.");
			}
			else
			  data.push($scope.allIdSelecDist[x]);
		  }
		}
		else if (type == 'confCli') {
		  for (var x = 0; x < $scope.allIdSelecAf.length; x++) {
			if ($scope.allIdSelecAf[x].CodeClient === "" || $scope.allIdSelecAf[x].CodeClient === null || typeof $scope.allIdSelecAf[x].CodeClient === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur Impression confirmation client pour le  dossier N° " + $scope.allIdSelecAf[x].NumDossier + '<br>Code Client non renseigné.');
			}
			else {
			  data.push($scope.allIdSelecAf[x]);
  
			}
		  }
		  for (var x = 0; x < $scope.allIdSelecDist.length; x++) {
			if ($scope.allIdSelecDist[x].CodeClient === "" || $scope.allIdSelecDist[x].CodeClient === null || typeof $scope.allIdSelecDist[x].CodeClient === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur Impression confirmation client pour le  dossier N° " + $scope.allIdSelecDist[x].NumDossier + '<br>Code Client non renseigné.');
			}
			else {
			  data.push($scope.allIdSelecDist[x]);
  
			}
		  }
		}
		else {
		  for (var x = 0; x < $scope.allIdSelecAf.length; x++) {
			if ($scope.allIdSelecAf[x].DateEn === "" || $scope.allIdSelecAf[x].DateEn === null || typeof $scope.allIdSelecAf[x].DateEn === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecAf[x].NumDossier + '<br>Date Enlèvement non renseignée.');
			}
			else if ($scope.allIdSelecAf[x].DateLiv === "" || $scope.allIdSelecAf[x].DateLiv === null || typeof $scope.allIdSelecAf[x].DateLiv === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecAf[x].NumDossier + '<br>Date Livraison non renseignée.');
			}
			else if ($scope.allIdSelecAf[x].CodeClient === "" || $scope.allIdSelecAf[x].CodeClient === null || typeof $scope.allIdSelecAf[x].CodeClient === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecAf[x].NumDossier + '<br>Code Client non renseigné.');
			}
			else if ($scope.allIdSelecAf[x].CodeEn === "" || $scope.allIdSelecAf[x].CodeEn === null || typeof $scope.allIdSelecAf[x].CodeEn === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecAf[x].NumDossier + ".<br>Aucun intervenant renseigné pour l'enlevement.");
			}
			else if ($scope.allIdSelecAf[x].CodeLiv === "" || $scope.allIdSelecAf[x].CodeLiv === null || typeof $scope.allIdSelecAf[x].CodeLiv === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecAf[x].NumDossier + ".<br>Aucun intervenant renseigné pour la livraison.");
			}
			else if ($scope.allIdSelecAf[x].MontantA === "" || $scope.allIdSelecAf[x].MontantA === null || typeof $scope.allIdSelecAf[x].MontantA === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecAf[x].NumDossier + ".<br>Le prix de vente n'est pas renseigné.");
			}
			else if ($scope.allIdSelecAf[x].CodeTVATr === "" || $scope.allIdSelecAf[x].CodeTVATr === null || typeof $scope.allIdSelecAf[x].CodeTVATr === "undefined") {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "erreur validation dossier N° " + $scope.allIdSelecAf[x].NumDossier + ".<br>Le code TVA client n'est pas renseigné.");
			}
			else if ($scope.allIdSelecAf[x].CodeAff === null || $scope.allIdSelecAf[x].CodeAff == 'null' || $scope.allIdSelecAf[x].CodeAff == '') {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Veuillez renseigner un code affrété.");
			  return false;
			}
			else
			  data.push($scope.allIdSelecAf[x]);
		  }
		}
	  }
	  else {
		var selection = $scope.hotInstance.getSelected();
		var row = selection[0];
		var lastRow = selection[2];
		var theRow = row;
		var instance = $scope.hotInstance;
  
		var theI, theL;
		if (row > lastRow) {
		  theI = lastRow;
		  theL = row;
		}
		else {
		  theI = row;
		  theL = lastRow;
		}
  
		for (i = theI; i <= theL; i++) {
		  if (type == "confAff") {
			if ($scope.part[theRow].CodeAff === null || $scope.part[theRow].CodeAff == 'null' || $scope.part[theRow].CodeAff == '') {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Veuillez renseigner un code affrété.");
			  return false;
			}
			if ($scope.part[theRow].MontantA === null || $scope.part[theRow].MontantA == 'null' || $scope.part[theRow].MontantA == '') {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Veuillez renseigner un Prix d'achat."); return false;
			}
		  }
		  if (type == "mission" || type == "cmr" || type == "mCMR") {
			if ($scope.part[theRow].CodeAff != '') {
			  $scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Un code affrété est renseigné!");
			  return false;
			}
		  }
		  data.push($scope.part[theRow]);
		}
	  }
  
  
  
	  console.log("ddddddddddddddddddddddddata");
	  console.log(data);
	  console.log(type);
	  pdfService.modalPrint(data, type).result.then(function () {
		$scope.getFiles();
	  }, function () {
		$scope.getFiles();
	  });
	};
  
	$scope.printFac = function () {
	  var selection = $scope.hotInstance.getSelected();
	  var row = selection[0];
	  var instance = $scope.hotInstance.getInstance();
	  if ($scope.part[row].FactCli !== null && typeof $scope.part[row].FactCli != 'undefined' && $scope.part[row].FactCli != '') {
		var client = $scope.part[row].NomClient;
		var num_facture = $scope.part[row].FactCli;
		var adrCli = $scope.part[row].AdrCli;
		var telCli = $scope.part[row].TelCli;
		var client = $scope.part[row].NomClient;
		var client = $scope.part[row].NomClient;
		var client = $scope.part[row].NomClient;
		var client = $scope.part[row].NomClient;
		var data = {
		  client: client, nom: client, adresse: adrCli, tel: telCli, fax: "$fax", num_facture: num_facture,
		  date: '$date', IdTVA: "tetst", rib: "asasas", reglement: "tel", dossier: "sdsd$*fax", ref: "sdsd$*fax",
		  poids: 'sdsd$*fax', palette: "sdsd$*fax", tva: "sdsd$*fax", montant: "sdsd$*fax", adr_enl: "sdsd$*fax", date_enl: "sdsd$*fax",
		  adr_liv: 'sdsd$*fax', date_liv: "sdsd$*fax"
		};
		$http.post('http://127.0.0.1/www/webtransport/pdf3/facture3.php', data).then(function (res) {
		  var anchor = angular.element('<a/>');
		  anchor.attr({
			href: '/download/' + res.data,
			target: '_blank',
			download: res.data + '.pdf'
		  })[0].click();
		})
	  } else {
		$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Commande non facturée!");
	  }
	};
  
	$scope.setLatLng = function (selectedItem) {
	  if (selectedItem.typeGet === 'cli') {
		$scope.part[$scope.selectedRow].AdrCli = selectedItem.Adresse;
		$scope.part[$scope.selectedRow].CompAdrCli = selectedItem.AdresseComp;
		$scope.part[$scope.selectedRow].PaysCli = selectedItem.CodePays;
		$scope.part[$scope.selectedRow].CpCli = selectedItem.CodePostal;
		$scope.part[$scope.selectedRow].VilleCli = selectedItem.Ville;
		$scope.part[$scope.selectedRow].CoordinatesCli = selectedItem.Coordinates;
		$scope.part[$scope.selectedRow].LatCli = selectedItem.Lat;
		$scope.part[$scope.selectedRow].LngCli = selectedItem.Lng;
  
		$scope.Cli.AdrCli = selectedItem.Adresse;
		$scope.Cli.CompAdrCli = selectedItem.AdresseComp;
		$scope.Cli.CodePays = selectedItem.CodePays;
		$scope.Cli.Cp = selectedItem.CodePostal;
		$scope.Cli.Ville = selectedItem.Ville;
		$scope.Cli.Coordinates = selectedItem.Coordinates;
		$scope.Cli.Lat = selectedItem.Lat;
		$scope.Cli.Lng = selectedItem.Lng;
	  }
	  else if (selectedItem.typeGet === 'aff') {
		$scope.part[$scope.selectedRow].AdrAff = selectedItem.Adresse;
		$scope.part[$scope.selectedRow].CompAdrAff = selectedItem.AdresseComp;
		$scope.part[$scope.selectedRow].PaysAff = selectedItem.CodePays;
		$scope.part[$scope.selectedRow].CpAff = selectedItem.CodePostal;
		$scope.part[$scope.selectedRow].VilleAff = selectedItem.Ville;
		$scope.part[$scope.selectedRow].CoordinatesAff = selectedItem.Coordinates;
  
		$scope.Aff.AdrAff = selectedItem.Adresse;
		$scope.Aff.CompAdrAff = selectedItem.AdresseComp;
		$scope.Aff.CodePays = selectedItem.CodePays;
		$scope.Aff.Cp = selectedItem.CodePostal;
		$scope.Aff.Ville = selectedItem.Ville;
		$scope.Aff.Coordinates = selectedItem.Coordinates;
	  }
	  else if (selectedItem.typeGet === 'en') {
		$scope.part[$scope.selectedRow].AdrEn = selectedItem.Adresse;
		$scope.part[$scope.selectedRow].CompAdrEn = selectedItem.AdresseComp;
		$scope.part[$scope.selectedRow].PaysEn = selectedItem.CodePays;
		$scope.part[$scope.selectedRow].CpEN = selectedItem.CodePostal;
		$scope.part[$scope.selectedRow].VilleEn = selectedItem.Ville;
		$scope.part[$scope.selectedRow].CoordinatesEn = selectedItem.Coordinates;
  
		$scope.En.AdrEn = selectedItem.Adresse;
		$scope.En.CompAdrEn = selectedItem.AdresseComp;
		$scope.En.CodePays = selectedItem.CodePays;
		$scope.En.Cp = selectedItem.CodePostal;
		$scope.En.Ville = selectedItem.Ville;
		$scope.En.Coordinates = selectedItem.Coordinates;
	  } else if (selectedItem.typeGet === 'liv') {
		$scope.Liv.AdrLiv = selectedItem.Adresse;
		$scope.Liv.CompAdrLiv = selectedItem.AdresseComp;
		$scope.Liv.CodePays = selectedItem.CodePays;
		$scope.Liv.Cp = selectedItem.CodePostal;
		$scope.Liv.Ville = selectedItem.Ville;
		$scope.Liv.Coordinates = selectedItem.Coordinates;
  
		$scope.part[$scope.selectedRow].AdrLiv = selectedItem.Adresse;
		$scope.part[$scope.selectedRow].CompAdrLiv = selectedItem.AdresseComp;
		$scope.part[$scope.selectedRow].PaysLiv = selectedItem.CodePays;
		$scope.part[$scope.selectedRow].CpLiv = selectedItem.CodePostal;
		$scope.part[$scope.selectedRow].VilleLiv = selectedItem.Ville;
		$scope.part[$scope.selectedRow].CoordinatesLiv = selectedItem.Coordinates;
	  }
  
	  updateCmd($scope.selectedRow);
  
	  $scope.setCmd();
	};
  
	$scope.verifAdr = function () {
	  var row = $scope.selectedRow;
	  if ($scope.part[row].CoordinatesCli.length < 1) {
		return $scope.updateAdr($scope.part[row], 'cli', false, $scope.setLatLng);
	  }
  
	  if ($scope.part[row].CoordinatesEn.length < 1) {
		return $scope.updateAdr($scope.part[row], 'en', false, $scope.setLatLng);
	  }
  
	  if ($scope.part[row].CoordinatesLiv.length < 1) {
		return $scope.updateAdr($scope.part[row], 'liv', false, $scope.setLatLng);
	  }
  
	  if ($scope.part[row].CoordinatesAff.length < 1) {
		return $scope.updateAdr($scope.part[row], 'aff', false, $scope.setLatLng);
	  }
	}
  
	$scope.setCmd = function () {
	  $scope.nbrCliFaUnpay = 0;
	  console.log("setCmd")
	  $scope.Com.Exploit = null;
	  $scope.Com.Client = null;
	  var selection = $scope.hotInstance.getSelected();
	  if (typeof selection == 'undefined') {
		$scope.En = [];
		$scope.Liv = [];
		$scope.Com = [];
		$scope.Af = [];
		$scope.Cli = [];
  
		$scope.Com.Exploit = '';
		$scope.Com.Client = '';
		$scope.palEur = '';
  
		$scope.NumDossier = '';
  
		$scope.isCmdSetted = false;
		$scope.isAfSetted = false;
		$scope.isCliSetted = false;
		$scope.isLivSetted = false;
		$scope.isEnSetted = false;
		$scope.loadingCmd = false;
		return;
	  }
	  else {
		if (selection[0] === selection[2]) {
		  $scope.selectedRowData = $scope.part[$scope.selectedRow];
		  if ($scope.part[$scope.selectedRow].StatutCli == 'LITIGE')
			$scope.liCli = true;
		  else
			$scope.liCli = false;
  
		  if ($scope.part[$scope.selectedRow].typeCmd == 'AFF')
			$scope.cmdAff = true;
		  else
			$scope.cmdAff = false;
  
		  if ($scope.part[$scope.selectedRow].typeCmd == 'DIST')
			$scope.cmdDist = true;
		  else
			$scope.cmdDist = false;
  
		  if ($scope.part[$scope.selectedRow].StatutAff == 'LITIGE')
			$scope.liAff = true;
		  else
			$scope.liAff = false;
  
		  if (typeof $scope.part[$scope.selectedRow].ComExport != 'undefined') {
			if ($scope.part[$scope.selectedRow].ComExport.length > 0)
			  $scope.comEx = true;
			else
			  $scope.comEx = false;
		  }
		  else
			$scope.comEx = false;
  
		  $scope.getFiles();
  
		  // $http.get("/intervenant?where={'CodeInter':{'or':['"+$scope.part[$scope.selectedRow].CodeEn+"','"+$scope.part[$scope.selectedRow].CodeLiv+"']}}").then(function(res){
		  $http.get("/intervenant?CodeInter=" + $scope.part[$scope.selectedRow].CodeEn).then(function (res) {
			console.log("res inter En")
			console.log(res)
			if (res.data.length > 0) {
			  $scope.interEn = res.data[0];
  
			  if ($scope.interEn.Commentaires != "" && $scope.interEn.Commentaires !== null && typeof $scope.interEn.Commentaires != 'undefined' && $scope.interEn.Commentaires.length > 0) {
				$scope.enComment = true;
			  } else
				$scope.enComment = false;
			}
		  }, function (res) {
			$scope.interEn = [];
		  });
  
		  $http.get("/intervenant?CodeInter=" + $scope.part[$scope.selectedRow].CodeLiv).then(function (res) {
			if (res.data.length > 0) {
			  $scope.interLiv = res.data[0];
			  if ($scope.interLiv.Comentaires != "" && $scope.interLiv.Comentaires !== null && typeof $scope.interLiv.Commentaires != 'undefined' && $scope.interLiv.Commentaires.length > 0) {
				$scope.livComment = true
			  } else
				$scope.livComment = false;
			}
		  }, function (res) {
			$scope.interLiv = [];
		  });
  
		  $http.post('/factureC/countUnpaid', { name: $scope.part[$scope.selectedRow].CodeClient, type: "CodeClient", solder: false }).success(function (res) {
			console.log("res unpoaid")
			console.log(res.count)
			$scope.nbrCliFaUnpay = res.count;
		  });
  
		  if ($scope.part[$scope.selectedRow].FactCli != '' && $scope.part[$scope.selectedRow].FactCli != null && typeof $scope.part[$scope.selectedRow].FactCli != 'undefined' && $rootScope.username != 'cedric' && $rootScope.username != 'admin')
			$scope.isCmdFa = true;
		  else
			$scope.isCmdFa = false;
  
		  if ($scope.part[$scope.selectedRow].FactAff != '' && $scope.part[$scope.selectedRow].FactAff != null && typeof $scope.part[$scope.selectedRow].FactAff != 'undefined' && $rootScope.username != 'cedric' && $rootScope.username != 'admin')
			$scope.isCmdAffFa = true;
		  else
			$scope.isCmdAffFa = false;
  
  
  
		  $scope.NumDossier = $scope.part[$scope.selectedRow].NumDossier;
  
		  $scope.En = [];
		  if ($scope.part[$scope.selectedRow].CodeEn !== "" && typeof $scope.part[$scope.selectedRow].CodeEn != "undefined") {
			$scope.isEnSetted = true;
			$scope.En.CodeEn = $scope.part[$scope.selectedRow].CodeEn;
			$scope.En.NomEn = $scope.part[$scope.selectedRow].NomEn;
			$scope.En.AdrEn = $scope.part[$scope.selectedRow].AdrEn;
			if (typeof $scope.part[$scope.selectedRow].CompAdrEn == "undefined")
			  $scope.part[$scope.selectedRow].CompAdrEn = "";
			$scope.En.CompAdrEn = $scope.part[$scope.selectedRow].CompAdrEn;
			$scope.En.Cp = $scope.part[$scope.selectedRow].CpEN;
			$scope.En.Ville = $scope.part[$scope.selectedRow].VilleEn;
			$scope.En.CodePays = $scope.part[$scope.selectedRow].PaysEn;
			$scope.En.Tel = $scope.part[$scope.selectedRow].TelEn;
			$scope.En.Fax = $scope.part[$scope.selectedRow].FaxEn;
			$scope.En.Coordinates = $scope.part[$scope.selectedRow].CoordinatesEn;
		  } else {
			$scope.isEnSetted = false;
		  }
  
		  $scope.Liv = [];
		  if ($scope.part[$scope.selectedRow].CodeLiv !== "" && typeof $scope.part[$scope.selectedRow].CodeLiv != "undefined") {
			$scope.isLivSetted = true;
			$scope.Liv.CodeLiv = $scope.part[$scope.selectedRow].CodeLiv;
			$scope.Liv.NomLiv = $scope.part[$scope.selectedRow].NomLiv;
			$scope.Liv.AdrLiv = $scope.part[$scope.selectedRow].AdrLiv;
			$scope.Liv.CompAdrLiv = $scope.part[$scope.selectedRow].CompAdrLiv;
			$scope.Liv.Cp = $scope.part[$scope.selectedRow].CpLiv;
			$scope.Liv.Ville = $scope.part[$scope.selectedRow].VilleLiv;
			$scope.Liv.CodePays = $scope.part[$scope.selectedRow].PaysLiv;
			$scope.Liv.Tel = $scope.part[$scope.selectedRow].TelLiv;
			$scope.Liv.Fax = $scope.part[$scope.selectedRow].FaxLiv;
			$scope.Liv.Coordinates = $scope.part[$scope.selectedRow].CoordinatesLiv;
		  } else {
			$scope.isLivSetted = false;
		  }
  
		  $scope.Com = [];
		  $scope.Com.Exploit = '';
		  $scope.Com.Client = '';
		  $scope.Com.Exploit = $scope.part[$scope.selectedRow].ComExploit;
		  $scope.Com.Client = $scope.part[$scope.selectedRow].ComClient;
		  $scope.palEur = '';
		  $scope.palEur = $scope.part[$scope.selectedRow].PalEur;
		  $scope.Cli = [];
  
		  if ($scope.part[$scope.selectedRow].CodeClient !== "" && typeof $scope.part[$scope.selectedRow].CodeClient != "undefined") {
			$scope.isCliSetted = true;
			$scope.Cli.CodeClient = $scope.part[$scope.selectedRow].CodeClient;
			$scope.Cli.Nom = $scope.part[$scope.selectedRow].NomClient;
			$scope.Cli.Adr = $scope.part[$scope.selectedRow].AdrCli;
			$scope.Cli.CompAdr = $scope.part[$scope.selectedRow].CompAdrCli;
			$scope.Cli.Cp = $scope.part[$scope.selectedRow].CpCli;
			$scope.Cli.Ville = $scope.part[$scope.selectedRow].VilleCli;
			$scope.Cli.Pays = $scope.part[$scope.selectedRow].PaysCli;
			$scope.Cli.Tel = $scope.part[$scope.selectedRow].TelCli;
			$scope.Cli.Fax = $scope.part[$scope.selectedRow].FaxCli;
		  } else {
			$scope.isCliSetted = false;
		  }
  
		  $scope.Af = [];
		  if ($scope.part[$scope.selectedRow].CodeAff !== "" && typeof $scope.part[$scope.selectedRow].CodeAff != "undefined") {
			$scope.isAfSetted = true;
			$scope.Af.CodeAffrete = $scope.part[$scope.selectedRow].CodeAff;
			$scope.Af.Nom = $scope.part[$scope.selectedRow].NomAff;
			$scope.Af.Adr = $scope.part[$scope.selectedRow].AdrAff;
			$scope.Af.CompAdr = $scope.part[$scope.selectedRow].CompAdrAff;
			$scope.Af.Cp = $scope.part[$scope.selectedRow].CpAff;
			$scope.Af.Ville = $scope.part[$scope.selectedRow].VilleAff;
			$scope.Af.Pays = $scope.part[$scope.selectedRow].PaysAff;
			$scope.Af.Tel = $scope.part[$scope.selectedRow].TelAff;
			$scope.Af.Fax = $scope.part[$scope.selectedRow].FaxAff;
		  } else {
			$scope.isAfSetted = false;
		  }
  
		  if (!$scope.$$phase) {
			$scope.$digest();
		  }
		}
		else {
		  $scope.En = [];
		  $scope.Liv = [];
		  $scope.Com = [];
		  $scope.Af = [];
		  $scope.Cli = [];
  
		  $scope.Com.Exploit = '';
		  $scope.Com.Client = '';
		  $scope.NumDossier = '';
		  $scope.palEur = '';
  
  
		  $scope.isCmdSetted = false;
		  $scope.isAfSetted = false;
		  $scope.isCliSetted = false;
		  $scope.isLivSetted = false;
		  $scope.isEnSetted = false;
		  $scope.loadingCmd = false;
		}
	  }
	  console.log($scope.part[$scope.selectedRow].NumDossier)
	  console.log(typeof $scope.part[$scope.selectedRow].NumDossier)
	  if ($scope.part[$scope.selectedRow].NumDossier != "")
		$scope.isCmdSetted = true;
	  else
		$scope.isCmdSetted = false;
	  $scope.loadingCmd = false;
	};
  
	$scope.getFiles = function () {
	  $http.get('fileUpload?NumDossier=' + $scope.part[$scope.selectedRow].id).then(function (res) {
		if (res.data.length > 0) {
		  $scope.findFile = true;
		  $scope.nbrCmdFiles = res.data.length;
		}
		else {
		  $scope.nbrCmdFiles = 0;
		  $scope.findFile = false;
		}
	  });
	};
  
	function cmdNumCellRender(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.NumericRenderer.apply(this, arguments);
	  var selection = instance.getDataAtCell(row, 10);
	  if (selection != '' && selection !== null && (value !== null || value != '')) {
		var dif = selection - value;
		if (dif <= 0)
		  td.style.background = '#FF999A';
	  }
	}
  
	function cmdTextCellRender(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
	  var selection = instance.getDataAtCell(row, 30);
	  if (selection === 'VALIDÉ') {
		td.style.background = '#C9F9FA';
	  } else if (selection === 'Annulée') {
		cellProperties.readOnly = true;
		td.style.background = '#FEFDC4';
	  } else {
	  }
  
	  if (value <= 0 || value === null || isNaN(value)) {
		td.style.background = '#FF999A';
	  }
  
	  var selection = instance.getDataAtCell(row, 22);
	  if (selection != '' && selection !== null && (value === null || value === '')) {
		td.style.background = '#FF999A';
	  }
  
	};
  
	function margeCellRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
  
	  if (value <= 0 || value === null || isNaN(value)) {
		td.style.background = '#FF999A';
	  }
	  else if (value > 0)
		td.style.background = '#5cb85c';
	};
  
	function PrixACellRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.NumericRenderer.apply(this, arguments);
	  var selection = instance.getDataAtCell(row, 10);
	  if (selection != '' && selection !== null && (value !== null || value != '')) {
		var dif = selection - value;
		if (dif <= 0)
		  td.style.background = '#FF999A';
	  }
	};
  
	function SubOrderEnCellRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
	  var selection = instance.getDataAtCell(row, 22);
	  if ($scope.part[row].TypeSub === 'En') {
		cellProperties.readOnly = true;
		td.style.background = '#ccc';
		td.style.textAlign = 'right';
	  }
	};
	function subTextRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
	  var selection = instance.getDataAtCell(row, 22);
	  if ($scope.part[row].TypeSub === 'En' || $scope.part[row].TypeSub === 'Liv') {
		cellProperties.readOnly = true;
		td.style.textAlign = 'right';
	  }
	};
	function SubOrderCellRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
	  var selection = instance.getDataAtCell(row, 22);
	  if ($scope.part[row].TypeSub === 'En' || $scope.part[row].TypeSub === 'Liv') {
		cellProperties.readOnly = true;
		td.style.background = '#ccc';
		td.style.textAlign = 'right';
	  }
	};
	function SubOrderLivCellRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
	  var selection = instance.getDataAtCell(row, 22);
	  if ($scope.part[row].TypeSub === 'Liv') {
		cellProperties.readOnly = true;
		td.style.background = '#ccc';
	  }
	};
  
	function addToSelection(first, last) {
	  $scope.sameCli = false;
	  if (first < last) {
		theFirst = first;
		theLast = last;
	  }
	  else {
		theFirst = last;
		theLast = first;
	  }
	  for (var x = theFirst; x <= theLast; x++) {
		if ($scope.part[x].selectedRow === false) {
		  $scope.part[x].selectedRow = true;
		  allIdSelec.push($scope.part[x]);
		  if ($scope.part[x].CodeAff !== null && $scope.part[x].CodeAff != '' && typeof $scope.part[x].CodeAff != 'undefined') {
			$scope.allIdSelecAf.push($scope.part[x]);
		  }
		  else {
			$scope.allIdSelecDist.push($scope.part[x]);
		  }
		  $scope.allselected++;
		}
		else {
		  for (var y = 0; y < allIdSelec.length; y++) {
			if (allIdSelec[y].id == $scope.part[x].id) {
			  allIdSelec.splice(y, 1);
			  break;
			}
		  }
		  if ($scope.part[x].CodeAff !== null && $scope.part[x].CodeAff != '' && typeof $scope.part[x].CodeAff != 'undefined') {
			for (var y = 0; y < $scope.allIdSelecAf.length; y++) {
			  if ($scope.allIdSelecAf[y].id == $scope.part[x].id) {
				$scope.allIdSelecAf.splice(y, 1);
				break;
			  }
			}
		  }
		  else {
			for (var y = 0; y < $scope.allIdSelecDist.length; y++) {
			  if ($scope.allIdSelecDist[y].id == $scope.part[x].id) {
				$scope.allIdSelecDist.splice(y, 1);
				break;
			  }
			}
		  }
		  $scope.part[x].selectedRow = false;
		  $scope.allselected--;
		}
	  }
	}
  
	function dossierCellRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
  
	  if ($scope.part[row].selectedRow === true) {
		td.className = 'selected htCenter htMiddle';
	  }
	};
  
	function highlightFactCliRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
	  var faCli = instance.getDataAtCell(row, 26);
	  var selectionDos = instance.getDataAtCell(row, 1);
	  var selection = instance.getDataAtCell(row, 27);
	  var selection2 = instance.getDataAtCell(row, 30);
	  var inProd = $scope.part[row].Prod;
  
	  if (selectionDos == '') {
		cellProperties.readOnly = true;
	  }
  
	  if (faCli != '' && faCli !== null && typeof faCli != 'undefined') {
		td.style.background = '#9AFA9A';
		if ($rootScope.username != 'cedric' && $rootScope.username != 'admin')
		  cellProperties.readOnly = true;
	  }
	  else if (selection2 === 'ANNULÉE') {
		td.style.background = '#FEFDC4';
		cellProperties.readOnly = true;
	  }
	  else if (selection === 'LITIGE') {
		cellProperties.readOnly = false;
		td.style.background = 'rgb(255, 156, 185)';
	  }
	  else if (selection2 === 'VALIDÉ') {
		td.style.background = '#C9F9FA';
		if (col === 26 || col === 27)
		  cellProperties.readOnly = true;
		if ($rootScope.username == 'doNNY' || $rootScope.username == 'Saidi')
		  cellProperties.readOnly = true;
	  }
	  else if (selection2 === 'F') {
		cellProperties.readOnly = true;
		td.style.background = '#9AFA9A';
	  }
	  else if (inProd) {
		td.style.background = '#f0c9fa';
	  }
	  else if (col !== 26 && col !== 27) {
		cellProperties.readOnly = false;
	  }
  
	  selection3 = $scope.part[row].Imported;
	  if (selection3 === true && $rootScope.username != 'admin' && $rootScope.username != 'cedric') {
		cellProperties.readOnly = true;
		td.style.background = 'rgb(109, 303, 234)';
	  }
	};
  
	function highlightFactCliNumRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.NumericRenderer.apply(this, arguments);
	  var faCli = instance.getDataAtCell(row, 26);
	  var selectionDos = instance.getDataAtCell(row, 1);
	  var selection = instance.getDataAtCell(row, 27);
	  var selection2 = instance.getDataAtCell(row, 30);
	  var inProd = $scope.part[row].Prod;
  
	  var devise = $scope.part[row].DeviseCli;
  
  
  
	  if (devise == "" || typeof devise == "undefined")
		cellProperties.language = '00-00';
	  else
		cellProperties.language = devise;
  
	  if (selectionDos == '') {
		cellProperties.readOnly = true;
	  }
	 if (faCli != '' && faCli !== null && typeof faCli != 'undefined') {
		td.style.background = '#9AFA9A';
		if ($rootScope.username != 'cedric' && $rootScope.username != 'admin')
		  cellProperties.readOnly = true;
	  }
	  else if (selection2 === 'ANNULÉE') {
		td.style.background = '#FEFDC4';
		cellProperties.readOnly = true;
	  }
	  else if (selection === 'LITIGE') {
		if (col !== 25)
		  cellProperties.readOnly = false;
		td.style.background = 'rgb(255, 156, 185)';
	  }
	  else if (selection2 === 'VALIDÉ') {
		td.style.background = '#C9F9FA';
		if ($rootScope.username == 'doNNY' || $rootScope.username == 'Saidi')
		  cellProperties.readOnly = true;
	  }
	  else if (selection2 === 'F') {
		cellProperties.readOnly = true;
		td.style.background = '#9AFA9A';
	  }
	  else if (inProd) {
		td.style.background = '#f0c9fa';
	  }
	  else {
		if (col !== 25)
		  cellProperties.readOnly = false;
	  }
  
	  selection3 = $scope.part[row].Imported;
	  if (selection3 === true && $rootScope.username != 'admin' && $rootScope.username != 'cedric') {
		cellProperties.readOnly = true;
		td.style.background = 'rgb(109, 303, 234)';
	  }
  
	};
  
	function cliCellRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
	  var faCli = instance.getDataAtCell(row, 26);
	  var selection = instance.getDataAtCell(row, 27);
	  var selection2 = instance.getDataAtCell(row, 30);
	  var inProd = $scope.part[row].Prod;
  
  
	
	  if (faCli != '' && faCli !== null && typeof faCli != 'undefined') {
		td.style.background = '#9AFA9A';
		cellProperties.readOnly = true;
	  }
	  else if (selection2 === 'ANNULÉE') {
		td.style.background = '#FEFDC4';
		cellProperties.readOnly = true;
	  }
	  else if (selection === 'LITIGE') {
		cellProperties.readOnly = false;
		td.style.background = 'rgb(255, 156, 185)';
	  }
	  else if (selection2 === 'VALIDÉ') {
		td.style.background = '#C9F9FA';
		if ($rootScope.username == 'doNNY' || $rootScope.username == 'Saidi')
		  cellProperties.readOnly = true;
	  }
	  else if (selection2 === 'F') {
		cellProperties.readOnly = true;
		td.style.background = '#9AFA9A';
	  }
	  else if (inProd) {
		td.style.background = '#f0c9fa';
	  }
	  else {
		cellProperties.readOnly = false;
	  }
  
	  selection3 = $scope.part[row].Imported;
	  if (selection3 === true && $rootScope.username != 'admin' && $rootScope.username != 'cedric') {
		cellProperties.readOnly = true;
		td.style.background = 'rgb(109, 303, 234)';
	  }
	};
  
	function highlightOthersRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
	  var selection = instance.getDataAtCell(row, 29);
	  var selection2 = instance.getDataAtCell(row, 30);
	  var selection3 = $scope.part[row].Imported;
	  var faAff = instance.getDataAtCell(row, 28);
	  var faCli = instance.getDataAtCell(row, 26);
	  var inProd = $scope.part[row].Prod;
  
	  
	  cellProperties.readOnly = true;
  
  
	 
  if (faCli != '' && faCli !== null && typeof faCli != 'undefined') {
		td.style.background = '#9AFA9A';
	  }
	  else if (selection2 === 'ANNULÉE') {
		td.style.background = '#FEFDC4';
	  }
	  else if (selection2 === 'F') {
		td.style.background = '#9AFA9A';
	  }
	  else if (selection === 'LITIGE') {
		td.style.background = 'rgb(255, 156, 185)';
	  }
	  else if (selection2 === 'VALIDÉ') {
		td.style.background = '#C9F9FA';
	  }
	  else if (inProd) {
		td.style.background = '#f0c9fa';
	  }
  
	  if (selection3 === true && $rootScope.username != 'admin' && $rootScope.username != 'cedric') {
		td.style.background = 'rgb(109, 303, 234)';
	  }
	};
  
	function highlightFactAffRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
	  var selection = instance.getDataAtCell(row, 29);
	  var selection2 = instance.getDataAtCell(row, 30);
	  var selectionDos = instance.getDataAtCell(row, 1);
	  var selection3 = $scope.part[row].Imported;
	  var faAff = instance.getDataAtCell(row, 28);
	  var chauf1 = instance.getDataAtCell(row, 17);
	  var chauf2 = instance.getDataAtCell(row, 18);
	  var inProd = $scope.part[row].Prod;
  
	  if (selectionDos == '') {
		cellProperties.readOnly = true;
	  }
   
	  if (faAff != '' && faAff !== null && typeof faAff != 'undefined') {
		cellProperties.readOnly = true;
		td.style.background = '#9AFA9A';
	  }
	  else if ((chauf1 != '' && chauf1 !== null && typeof chauf1 != 'undefined') || (chauf2 != '' && chauf2 !== null && typeof chauf2 != 'undefined')) {
		cellProperties.readOnly = true;
		td.style.background = '#9AFA9A';
	  }
	  else if (selection2 === 'ANNULÉE') {
		td.style.background = '#FEFDC4';
		cellProperties.readOnly = true;
	  }
	  else if (selection2 === 'F') {
		cellProperties.readOnly = true;
		td.style.background = '#9AFA9A';
	  }
	  else if (selection === 'LITIGE') {
		cellProperties.readOnly = false;
		td.style.background = 'rgb(255, 156, 185)';
	  }
	  else if (selection2 === 'VALIDÉ') {
		td.style.background = '#C9F9FA';
		if (col !== 28 && col !== 29)
		  cellProperties.readOnly = false;
		if ($rootScope.username == 'doNNY' || $rootScope.username == 'Saidi')
		  cellProperties.readOnly = true;
	  }
	  else if (col !== 28 && col !== 29) {
		cellProperties.readOnly = false;
	  }
	  else if (inProd) {
		td.style.background = '#f0c9fa';
	  }
  
	  if (selection3 === true && $rootScope.username != 'admin' && $rootScope.username != 'cedric') {
		cellProperties.readOnly = true;
		td.style.background = 'rgb(109, 303, 234)';
	  }
	};
  
	function highlightFactAffNumRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.NumericRenderer.apply(this, arguments);
	  var selection = instance.getDataAtCell(row, 22);
	  var selection2 = instance.getDataAtCell(row, 30);
	  var faAff = instance.getDataAtCell(row, 28);
	  var selectionDos = instance.getDataAtCell(row, 1);
	  var chauf1 = instance.getDataAtCell(row, 17);
	  var chauf2 = instance.getDataAtCell(row, 18);
	  var devise = $scope.part[row].DeviseAff;
	  var inProd = $scope.part[row].Prod;
  
	  cellProperties.language = devise;
  
  
	  
  
	  
  
  
	 
  
	  if (selectionDos == '') {
		cellProperties.readOnly = true;
	  }
	 
	  if (faAff != '' && faAff !== null && typeof faAff != 'undefined') {
		cellProperties.readOnly = true;
		td.style.background = '#9AFA9A';
	  }
	  else if ((chauf1 != '' && chauf1 !== null && typeof chauf1 != 'undefined') || (chauf2 != '' && chauf2 !== null && typeof chauf2 != 'undefined')) {
		cellProperties.readOnly = true;
		td.style.background = '#9AFA9A';
	  }
	  else if (selection2 === 'ANNULÉE') {
		td.style.background = '#FEFDC4';
		cellProperties.readOnly = true;
	  }
	  else if (selection2 === 'F') {
		cellProperties.readOnly = true;
		td.style.background = '#9AFA9A';
	  }
	  else if (selection === 'LITIGE') {
		cellProperties.readOnly = true;
		td.style.background = 'rgb(255, 156, 185)';
	  }
	  else if (selection2 === 'VALIDÉ') {
		td.style.background = '#C9F9FA';
		if ($rootScope.username == 'doNNY' || $rootScope.username == 'Saidi')
		  cellProperties.readOnly = true;
	  }
	  else if (inProd) {
		td.style.background = '#f0c9fa';
	  }
	  else {
		cellProperties.readOnly = false;
	  }
	  var selection3 = $scope.part[row].Imported;
	  if (selection3 === true && $rootScope.username != 'admin' && $rootScope.username != 'cedric') {
		cellProperties.readOnly = true;
		td.style.background = 'rgb(109, 303, 234)';
	  }
  
	};
  
	function highlightTextRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
	  var selection = instance.getDataAtCell(row, 30);
	  var inProd = $scope.part[row].Prod;
	  if (selection === 'VALIDÉ') {
		td.style.background = '#C9F9FA';
	  } else if (selection === 'Annulée') {
		cellProperties.readOnly = true;
		td.style.background = '#FEFDC4';
	  }
  
	  else if (inProd) {
		td.style.background = '#f0c9fa';
	  }
  
	  var selection3 = $scope.part[row].Imported;
	  if (selection3 === true && $rootScope.username != 'admin' && $rootScope.username != 'cedric') {
		cellProperties.readOnly = true;
		td.style.background = 'rgb(109, 303, 234)';
	  }
	};
  
	function CodeCliCellRenderer(instance, td, row, col, prop, value, cellProperties) {
	  Handsontable.renderers.TextRenderer.apply(this, arguments);
	  if (value == '' || value === null) {
		td.style.background = '#FF999A';
	  }
	};
  
	function afterInit() {
	  $scope.handsonTableInstance = this;
	};
  
	$scope.modifDetCmd = function (field, value) {
	  var row = $scope.selectedRow;
	  if (field == 'Enl') {
		$scope.part[row].NomEn = $scope.En.NomEn;
		$scope.part[row].CoordinatesEn = $scope.En.Coordinates;
		$scope.part[row].AdrEn = $scope.En.AdrEn;
		$scope.part[row].CompAdrEn = $scope.En.CompAdrEn;
		$scope.part[row].CpEN = $scope.En.Cp;
		$scope.part[row].VilleEn = $scope.En.Ville;
		$scope.part[row].PaysEn = $scope.En.CodePays;
	
		var tel = $scope.En.Tel;
		var ct = $scope.En.CodePays;
		
			// Réutiliser la fonction pour valider et formater le numéro de téléphone
			function validateAndFormatPhone(number) {
				const regexLocal = /^(0[1-9]\d{8})$/;
				const regexInternational = /^\+33\s?[1-9](\s?\d{2}){4}$/;
		
				if (regexLocal.test(number)) {
					return '+33 ' + number.substring(1, 2) + ' ' + number.substring(2, 4) + ' ' + number.substring(4, 6) + ' ' + number.substring(6, 8) + ' ' + number.substring(8);
				} else if (regexInternational.test(number)) {
					return number;
				} else {
					return null;
				}
			}
		
		if (tel && ct === "FR") {
			var formattedTel = validateAndFormatPhone(tel);
			if (formattedTel) {
				$scope.telError2 = false;

				$scope.En.Tel = formattedTel;
				$scope.part[row].TelEn = formattedTel;
			} else {
				$scope.telError = true;
			}
		}
	
		var fax = $scope.En.Fax;
		if (fax && ct === "FR") {
			var formattedFax = validateAndFormatPhone(fax);
			if (formattedFax) {
				$scope.telError2 = false;

				$scope.En.Fax = formattedFax;
				$scope.part[row].FaxEn = formattedFax;
			} else {
				$scope.faxError = true;
			}
		}
	}
	else if (field == 'Liv') {
		$scope.part[row].NomLiv = $scope.Liv.NomLiv;
		$scope.part[row].CoordinatesLiv = $scope.Liv.Coordinates;
		$scope.part[row].AdrLiv = $scope.Liv.AdrLiv;
		$scope.part[row].CompAdrLiv = $scope.Liv.CompAdrLiv;
		$scope.part[row].CpLiv = $scope.Liv.Cp;
		$scope.part[row].VilleLiv = $scope.Liv.Ville;
		$scope.part[row].PaysLiv = $scope.Liv.CodePays;
	
		var tel = $scope.Liv.Tel;
		var ct = $scope.Liv.CodePays;
	
		// Réutiliser la fonction pour valider et formater le numéro de téléphone
		function validateAndFormatPhone(number) {
			const regexLocal = /^(0[1-9]\d{8})$/;
			const regexInternational = /^\+33\s?[1-9](\s?\d{2}){4}$/;
	
			if (regexLocal.test(number)) {
				return '+33 ' + number.substring(1, 2) + ' ' + number.substring(2, 4) + ' ' + number.substring(4, 6) + ' ' + number.substring(6, 8) + ' ' + number.substring(8);
			} else if (regexInternational.test(number)) {
				return number;
			} else {
				return null;
			}
		}
	
		if (tel && ct === "FR") {
			var formattedTel = validateAndFormatPhone(tel);
			if (formattedTel) {
				$scope.telError2 = false;

				$scope.Liv.Tel = formattedTel;
				$scope.part[row].TelLiv = formattedTel;
			} else {
				$scope.telError2 = true;
			}
		}
	
		var fax = $scope.Liv.Fax;
		if (fax && ct === "FR") {
			var formattedFax = validateAndFormatPhone(fax);
			if (formattedFax) {
				$scope.telError2 = false;

				$scope.Liv.Fax = formattedFax;
				$scope.part[row].FaxLiv = formattedFax;
			} else {
				$scope.faxError2 = true;
			}
		}
	}
	
	
	  else {
		$scope.part[row]['ComExploit'] = $scope.Com.Exploit;
		$scope.part[row]['ComClient'] = $scope.Com.Client;
		$scope.part[row]['PalEur'] = $scope.palEur;
	  }
  
	  updateCmd(row, null, true);
	}
  
	$scope.nbrSubCmd = 1;
  
  
  
	$scope.infoClient = function () {
	  var row = $scope.selectedRow;
	  var numDossier = $scope.part[row].NumDossier;
	  var codeCli = $scope.part[row];
	  interService.modalHist({ codeCli: codeCli, type: 'client', numDossier: numDossier }).result.then(function (selectedItem) {
		for (var x = 0; x < selectedItem.length; x++) {
		  $scope.addRowToCmds(selectedItem[x]);
		}
		$scope.hotInstance.render();
	  }, function () {
	  });
  
	};
  
	$scope.infoInter = function (type) {
	  var row = $scope.selectedRow;
	  var codeCli = $scope.part[row];
	  var numDossier = $scope.part[row].NumDossier;
  
	  interService.modalHist({ codeCli: codeCli, type: type, numDossier: numDossier }).result.then(function (selectedItem) {
		for (var x = 0; x < selectedItem.length; x++) {
		  $scope.addRowToCmds(selectedItem[x]);
		}
		$scope.hotInstance.render();
	  });
	};
  
	$scope.addRowToCmds = function (row) {
	  var found = $filter('filter')($scope.part, { NumDossier: row.NumDossier }, true);
	  if (found.length <= 0) {
  
		if (row.MontantA !== null || row.MontantA != "") {
		  var Marge = (1 - (row.MontantA / row.MontantV)) * 100;
		  Marge = parseFloat(Marge);
		  row.Marge = Marge;
  
		} else {
		  row.Marge = null;
		}
  
		row.createdAt = moment(row.createdAt).format('DD/MM/YY HH:mm');
  
		$scope.part.push(row);
	  }
	  else {
		$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Commande(s) préalablement affichée(s) dans le tableau!");
		$scope.loadingCmds = false;
	  }
	}
  
	$scope.InfoAff = function (cmd) {
	  var items = null;
	  if (cmd) {
		var row = $scope.selectedRow;
		items = $scope.part[row];
	  }
  
	  $scope.hotInstance.deselectCell();
  
  
	  var codetva=$scope.part[row].CodeTva;
  
	  console.log("hooooo "+codetva);
	  var modalInstance = $uibModal.open({
		templateUrl: 'ModalFindAff',
		controller: 'ModalFindAffController',
		size: 'lg',
		keyboard: false,
		backdrop: 'static',
		resolve: {
		  items: function () {
			return items;
		  },
		  type: function () {
			return 'Client'
		  },
		  user: function () {
			return $scope.username
		  }
		}
	  });
  
	  modalInstance.result.then(function (all) {
		$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
	 
	 
		var code = all[0];
  
		var price = all[1];
		$scope.part[row].CodeAff = code;
		$scope.part[row].CodeTva = codetva;
		if (price != '' && typeof price != 'undefined')
		  $scope.part[row].MontantA = price;
		 updateCmd(row,cell);;
	  }, function () {
		$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
	  });
	};
  
	$scope.wizard = function (size, data) {
	  var modalInstance = $uibModal.open({
		templateUrl: 'ModalWizard',
		controller: 'ModalWizardController',
		size: 'lg',
		keyboard: false,
		backdrop: 'static',
		resolve: {
		  items: function () {
			return angular.copy(data);
		  }
		}
	  });
  
	  modalInstance.result.then(function (selectedItem) {
		var modalInst = $uibModal.open({
		  animation: true,
		  templateUrl: 'shouldBeOpen.html',
		  controller: 'shouldBeOpenCtrl',
		  size: 'md',
		  resolve: {
			items: function () {
			  return selectedItem;
			}
		  }
		});
  
		modalInst.result.then(function (selectedItem) {
		  var item = [];
		  item.NumDossier = selectedItem;
  
		  $http.get('/Ordergrid?NumDossier=' + selectedItem).then(function (response) {
			if (response.data.length > 0) {
			  $('.tableShow').hide(500);
			  $('#mapContainer').show(500);
			  $scope.onSelectFolder(response.data[0]);
			}
		  });
		});
  
		$scope.selected = selectedItem;
  
	  });
	};
  
	$scope.showTab = function () {
	  $('#mapContainer').hide(500);
	  $('.tableShow').show(500);
	};
  
  
	$scope.isTourneeLivExist = false;
  $scope.isTourneeEnExist = false;
  
  $scope.cmdLivs=[];
  $scope.cmdEn=[];
  
  $scope.selectedMode="En";
  $scope.selectedOptionTournee =function(type){
	$scope.selectedMode=type;
  
  
	if($scope.selectedMode=="En"){
	  $scope.cmdToShow=$scope.cmdEn;
	  
	  }
	  else{
	  $scope.cmdToShow=$scope.cmdLivs;
	  
	  }
	$scope.markers_tournee.forEach((element,index) => {
	  element.setMap(null);
	  $scope.markers_tournee.splice(index,1)
	  
	});
	
  $scope.cmdToShow.forEach(function(cmd, index) {
  
	if(cmd.cmdTour.poids!=""){
	   $scope.poids+=parseFloat(cmd.cmdTour.poids);
	}
	
	
	if(cmd.cmdTour.ml!=""){
		$scope.ml+=parseFloat(cmd.cmdTour.ml);
	}
	
	cmd.type = "commande";
	cmd.hidden = false;
  
	if (cmd.cmdTour.Type == "depart") {
		$scope.isDep = true;
  
	}
	var itemsWithSameNumDOSSIER = $scope.cmdToShow.filter(function(item) {
		return item.cmdTour.NumDossier === cmd.cmdTour.NumDossier;
	});
	if (itemsWithSameNumDOSSIER.length > 1) {
		var indicesWithSameNumDOSSIER = itemsWithSameNumDOSSIER.map(function(item) {
			return $scope.cmdToShow.indexOf(item);
		});
  
	   
	}
  
  });
  angular.forEach($scope.cmdToShow, function(cmd, index) {
	if (cmd.cmdTour.Type == 'depart') {
	}
  
	else {
		if (cmd.orders[0] && cmd.orders.length>0 && cmd.orders[0].CoordinatesEn && cmd.orders[0].CoordinatesEn.length === 2 && (cmd.cmdTour.Type == 'En' || cmd.cmdTour.Type == 'Liv')) {
			var t = cmd.cmdTour.LatLng.split(',');
			var latLng = new google.maps.LatLng(t[0], t[1]);
			const existingMarker = $scope.markers_tournee.find(marker => marker.NumDossier === numDossier);
			if (!existingMarker) {
  
				if(cmd.cmdTour.NumDossier==$scope.numD){
				  createMarkerTournee(latLng, cmd, "rgb(57, 86, 155)",true);
  
				}
				else{
				  createMarkerTournee(latLng, cmd, "rgb(57, 86, 155)",false);
  
				}
  
			} else {
  
			}
		}
	}
  });
  }
  
  $scope.selectedDate="En";
  function createMarkerTournee(position, order, color,annime) {
  
  
  
	var title, includeClock, baseIcon;
	if (order.cmdTour.Type == "depart") {
  
		return;
  
	}
  
	if (order.cmdTour.Type == 'Liv') {
		title = order.orders[0].CodeLiv;
  
		if (order.orders[0].HeureLiv) {
			includeClock = true;
		} else {
			includeClock = false;
		}
		baseIcon = "images/markers/Geo_Red_Icon.gif";
	} else {
		title = order.orders[0].CodeEn;
		if (order.orders[0].HeureEn) {
			includeClock = true;
		} else {
			includeClock = false;
		}
		baseIcon = "images/markers/Geo_Green_Icon.gif";
	}
	title = "Poids : " + order.orders[0].Poids + "kg " + " Ml: " + order.orders[0].MetreLin + "ml";
  
  
	var leftTube = getTubeImagePath("poids", order.orders[0].Poids);
	var rightTube = getTubeImagePath("ML", order.orders[0].MetreLin);
  
	const size = { width: 80, height: 80 };
  
	var canvas = document.createElement('canvas');
	canvas.width = size.width;
	canvas.height = size.height;
	var context = canvas.getContext('2d');
  
	var images = [];
  
	if (includeClock) {
		images.push("images/markers/Clock.gif");
	}
  
	images.push(leftTube);
	images.push(rightTube);
  
	var imagesLoaded = 0;
  
	images.forEach((path) => {
		var img = new Image();
		img.onload = function() {
			context.drawImage(img, 0, 0, size.width, size.height);
			imagesLoaded++;
			if (imagesLoaded === images.length) {
				var markerCanvas = document.createElement('canvas');
				markerCanvas.width = size.width;
				markerCanvas.height = size.height;
				var markerContext = markerCanvas.getContext('2d');
  
				var baseIconImage = new Image();
				baseIconImage.onload = function() {
  
					var positionExists = $scope.markers_tournee.some(function(existingMarker) {
  
						console.log(existingMarker.getPosition().equals(position))
						return existingMarker.getPosition().equals(position);
					});
  
  
					if (!positionExists) {
  
						var positionExists = $scope.positionsPuit.some(function(existingMarker) {
							return existingMarker.getPosition().equals(position);
						});
  
  
					}
  
  
					if (positionExists) {
  
  
						var newLat = position.lat() + getRandomOffset();
						var newLng = position.lng() + getRandomOffset();
						position = new google.maps.LatLng(newLat, newLng);
					}
  
					markerContext.drawImage(baseIconImage, 0, 0, size.width, size.height);
					markerContext.drawImage(canvas, 0, 0, size.width, size.height);
  
  
					markerContext.beginPath();
					markerContext.arc(size.width / 2, size.height - 15, 15, 0, 2 * Math.PI); // Draw a circle
					markerContext.fillStyle = color;
					markerContext.fill();
  
					markerContext.font = 'bold 14px Arial';
					markerContext.fillStyle = 'white';
					markerContext.textAlign = 'center';
					markerContext.textBaseline = 'middle';
					markerContext.fillText(order.cmdTour.position, size.width / 2, size.height - 15);
					var marker = new google.maps.Marker({
						position: position,
						title: title,
						icon: markerCanvas.toDataURL('image/png'),
						map: $scope.mapPuit,
						typeDest: order.cmdTour.Type,
						NumDossier: order.orders[0].NumDossier,
						cmd: order,
						indexPos: order.cmdTour.position,
						collisionBehavior: google.maps.CollisionBehavior.REQUIRED,
					});
  
  
  
  
					var newMarkerPosition = marker.getPosition();
					var mapZoom = 15;
  
  
  
					if(annime){
					  marker.setAnimation(google.maps.Animation.BOUNCE);
					  setTimeout(function() {
						  marker.setAnimation(null);
					  }, 3500);
					}
					
  
					var initialpositon = marker.getPosition();
  
  
  
					$scope.markers_tournee.push(marker);
  
					console.log("markers ", $scope.markers_tournee);
  
  
					$scope.is_dragger = false;
					$scope.initialMarkerPosition = null;
  
					marker.addListener('drag', function(event) {
						$scope.affichage = 'camions';
  
  
						$scope.is_dragger = true;
  
					});
  
					function isElementHovered(element, x, y) {
						if (!element) {
							return false;
						}
  
						var rect = element.getBoundingClientRect();
						return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
					}
  
					$scope.isMarkerAboveContainer = function(markerPixel, containerRect) {
						return (
							markerPixel.x >= containerRect.left &&
							markerPixel.x <= containerRect.right &&
							markerPixel.y >= containerRect.top &&
							markerPixel.y <= containerRect.bottom
						);
					};
  
					marker.addListener('mouseover', function(event) {
  
  
  
					});
  
					marker.addListener('mouseout', function(event) {
  
  
  
					});
  
  
  
  
					function showprogressContainer(marker) {
						var hoverContainer = document.getElementById('hoverContainer');
						hoverContainer.style.display = 'block';
						hoverContainer.style.position = 'absolute';
						hoverContainer.style.left = (event.pageX || event.clientX) + 'px';
						hoverContainer.style.top = (event.pageY || event.clientY) - 80 + 'px';
  
  
  
					}
					function hideprogressContainer() {
						var hoverContainer = document.getElementById('hoverContainer');
						hoverContainer.style.display = 'none';
					}
  
					marker.addListener('rightclick', function(event) {
  
						// Récupérez les coordonnées du clic droit
						var rightClickLat = event.latLng.lat();
						var rightClickLng = event.latLng.lng();
  
						// Affichez un menu contextuel ou effectuez d'autres actions
						// Par exemple, créez un div contenant des options du menu contextuel et positionnez-le à l'emplacement du clic droit
  
						showContextMenu(marker);
					});
  
  
  
					marker.addListener('dragend', function(event) {
  
  
  
  
  
  
  
  
  
  
  
  
  
					});
				};
  
  
				baseIconImage.src = baseIcon;
			}
		};
		img.src = path;
	});
  
  }
  
  
  
  function getTubeImagePath(type, value) {
	let folder;
	let prefix;
	switch (type) {
		case "poids":
			folder = "Left_Tube";
			prefix = "Left_Tube_";
			break;
		case "ML":
			folder = "Right_Tube";
			prefix = "Right_Tube_";
			break;
		default:
	}
  
	let suiteImage;
  
  
	if (type == "poids") {
		switch (true) {
			case value >= 0 && value <= 50:
				suiteImage = "01";
				break;
			case value > 51 && value <= 200:
				suiteImage = "02";
				break;
			case value > 201 && value <= 400:
				suiteImage = "03";
				break;
			case value > 401 && value <= 600:
				suiteImage = "04";
				break;
			case value > 601 && value <= 800:
				suiteImage = "05";
				break;
			case value > 801 && value <= 1000:
				suiteImage = "06";
				break;
			case value > 1001 && value <= 1500:
				suiteImage = "07";
				break;
			case value > 1501 && value <= 2000:
				suiteImage = "08";
				break;
			case value > 2001 && value <= 3000:
				suiteImage = "09";
				break;
			case value > 3001 && value <= 4000:
				suiteImage = "10";
				break;
			case value > 4001 && value <= 5000:
				suiteImage = "11";
				break;
			case value > 5001 && value <= 6000:
				suiteImage = "12";
				break;
			case value > 6001 && value <= 7000:
				suiteImage = "13";
				break;
			case value > 7001 && value <= 8000:
				suiteImage = "14";
				break;
			case value > 8001 && value <= 9000:
				suiteImage = "15";
				break;
			case value > 9001 && value <= 10000:
				suiteImage = "16";
				break;
			case value > 10001 && value <= 11000:
				suiteImage = "18";
				break;
			case value > 11001 && value <= 12000:
				suiteImage = "19";
				break;
			case value > 12001 && value <= 13000:
				suiteImage = "20";
				break;
			case value > 13001 && value <= 15000:
				suiteImage = "21";
				break;
			case value > 15001 && value <= 18000:
				suiteImage = "21";
				break;
			case value > 18001 && value <= 19000:
				suiteImage = "22";
				break;
			case value > 19001 && value <= 21000:
				suiteImage = "23";
				break;
			case value > 21001 && value <= 22000:
				suiteImage = "24";
				break;
			case value > 22001 && value <= 25000:
				suiteImage = "25";
				break;
			default:
  
				suiteImage = "Empty";
		}
  
	}
  
	else {
		switch (true) {
			case value >= 0 && value <= 0.1:
				suiteImage = "01";
				break;
			case value > 0.11 && value <= 0.2:
				suiteImage = "02";
				break;
			case value > 0.21 && value <= 0.5:
				suiteImage = "03";
				break;
			case value > 0.51 && value <= 1:
				suiteImage = "04";
				break;
			case value > 1.01 && value <= 1.5:
				suiteImage = "05";
				break;
			case value > 1.51 && value <= 1.8:
				suiteImage = "06";
				break;
			case value > 1.81 && value <= 2:
				suiteImage = "07";
				break;
			case value > 2.01 && value <= 2.5:
				suiteImage = "08";
				break;
			case value > 2.51 && value <= 3:
				suiteImage = "09";
				break;
			case value > 3.01 && value <= 3.5:
				suiteImage = "10";
				break;
			case value > 3.51 && value <= 4:
				suiteImage = "11";
				break;
			case value > 4.01 && value <= 4.5:
				suiteImage = "12";
				break;
			case value > 4.51 && value <= 5:
				suiteImage = "13";
				break;
			case value > 5.01 && value <= 5.5:
				suiteImage = "14";
				break;
			case value > 5.51 && value <= 6:
				suiteImage = "15";
				break;
			case value > 6.01 && value <= 6.5:
				suiteImage = "16";
				break;
			case value > 6.51 && value <= 7:
				suiteImage = "17";
				break;
			case value > 7.51 && value <= 7.8:
				suiteImage = "18";
				break;
			case value > 7.81 && value <= 8.4:
				suiteImage = "19";
				break;
			case value > 8.41 && value <= 9:
				suiteImage = "20";
				break;
			case value > 9.01 && value <= 10:
				suiteImage = "21";
				break;
			case value > 10.01 && value <= 11:
				suiteImage = "22";
				break;
			case value > 11.01 && value <= 12:
				suiteImage = "23";
				break;
			case value > 12.01 && value <= 12.9:
				suiteImage = "24";
				break;
			case value > 12.91 && value <= 13.5:
				suiteImage = "25";
				break;
  
			default:
				suiteImage = "Empty";
		}
  
	}
	const imagePath = `images/markers/${folder}/${prefix}${suiteImage}.gif`;
  
  
	return imagePath;
  }
  $scope.cmdToShow=[];
  $scope.positionsPuit=[];
  $scope.markers_tournee=[];
  $scope.initMap = function(map) {
	$scope.mapPuit = map; // Récupérer la référence de la carte dans $scope.map
  };
  
  $scope.numD= -1;
  $scope.showMap = function () {
	  var row = $scope.selectedRow;
	  if ($('.tableShow').is(':visible')) {
		$('.tableShow').hide(500);
		$('#mapContainer').show('500');
		
		NgMap.getMap('mapPuit').then(function(map) {
		  $scope.mapPuit = map;
	   
		
		  var parisLatLng = new google.maps.LatLng(48.8566, 2.3522);
		  $scope.mapPuit.setCenter(parisLatLng);
		
		
		});
		
  
  
		
		$scope.markers_tournee.forEach((element,index) => {
		  element.setMap(null);
		  $scope.markers_tournee.splice(index,1)
		  
		});
	   
		  
  
		  var numDossier = $scope.part[row].NumDossier;
		$scope.numD= $scope.part[row].NumDossier;
		if ($('.alert-container').length) {  // Check if the element exists
            $('.alert-container').hide();    // Hide the alert-container if it exists
        } else {
            console.log('alert-container does not exist.');
        }
  
		  $http.post('/tournees/searchTournee', { numDossier: numDossier }).success(function (res) {
			  console.log(res);
			  $scope.isTourneeLivExist = res.tourneeLivExist;
			  $scope.isTourneeEnExist = res.tourneeEnExist;
			  $scope.cmdLivs=res.cmdToursLiv;
  $scope.cmdEn=res.cmdToursEn;
  
  if($scope.selectedMode=="En"){
  $scope.cmdToShow=$scope.cmdEn;
  
  }
  else{
  $scope.cmdToShow=$scope.cmdLivs;
  
  }
  
  console.log( $scope.cmdLivs);
  console.log( $scope.cmdEn);


  for (let index = 0; index <  $scope.cmdLivs.length; index++) {
	const element =  $scope.cmdLivs[index];
	if(element.orders[0] && element.orders.length>0 && element.orders[0].NumDossier==parseInt(numDossier)){
		if(element.orders[0].chauffeurSignature_liv){
			console.log("livvazs");

			const filePath = '/Document_Webtransport/' + element.orders[0].chauffeurSignature_liv.toLowerCase();

    // Envoyer la requête POST au serveur pour télécharger et stocker le fichier
    $http.post('/tournees/downloadAndStoreFile', { path: filePath })
        .success(function(res) {
			$scope.imageSrc2=res;
            console.log('Fichier téléchargé et stocké avec succès:', res);
        })
        .error(function(err) {
            console.error('Erreur lors du téléchargement du fichier:', err);
        });
			
		}
		if(element.orders[0].clientSignature_liv){
			console.log("livvazs");

			const filePath = '/Document_Webtransport/' + element.orders[0].clientSignature_liv.toLowerCase();

    // Envoyer la requête POST au serveur pour télécharger et stocker le fichier
    $http.post('/tournees/downloadAndStoreFile', { path: filePath })
        .success(function(res) {
			$scope.imageSrc4=res;
            console.log('Fichier téléchargé et stocké avec succès:', res);
        })
        .error(function(err) {
            console.error('Erreur lors du téléchargement du fichier:', err);
        });
			
		}
		
	}
	
  }
  


  for (let index = 0; index <  $scope.cmdEn.length; index++) {
	const element =  $scope.cmdEn[index];
	if(element.orders[0] && element.orders.length>0 && element.orders[0].NumDossier==parseInt(numDossier)){
		if(element.orders[0].chauffeurSignature_en){
			console.log("envass");

			const filePath = '/Document_Webtransport/' + element.orders[0].chauffeurSignature_en.toLowerCase();

    // Envoyer la requête POST au serveur pour télécharger et stocker le fichier
    $http.post('/tournees/downloadAndStoreFile', { path: filePath })
        .success(function(res) {
			$scope.imageSrc=res;
            console.log('Fichier téléchargé et stocké avec succès:', res);
        })
        .error(function(err) {
            console.error('Erreur lors du téléchargement du fichier:', err);
        });
			
		}
		
	}
	
  }
  
  $scope.cmdEn.forEach(function(cmd, index) {
  
	if(cmd.cmdTour.poids!=""){
	   $scope.poids_En+=parseFloat(cmd.cmdTour.poids);
	}
	
	
	if(cmd.cmdTour.ml!=""){
		$scope.ml_En+=parseFloat(cmd.cmdTour.ml);
	}
  
  })
  
  $scope.cmdLivs.forEach(function(cmd, index) {
  
	if(cmd.cmdTour.poids!=""){
	   $scope.poids_Liv+=parseFloat(cmd.cmdTour.poids);
	}
	
	
	if(cmd.cmdTour.ml!=""){
		$scope.ml_Liv+=parseFloat(cmd.cmdTour.ml);
	}
  
  
  
  });
  
  
  if($scope.cmdLivs[0]){
	$scope.chauffeur_liv=$scope.cmdLivs[0].tournee.CodeChauf;
	$scope.dateTournee_liv=$scope.cmdLivs[0].tournee.Date;
  }
  
  if($scope.cmdEn[0]){
	$scope.chauffeur_En=$scope.cmdEn[0].tournee.CodeChauf;
	$scope.dateTournee_En=$scope.cmdEn[0].tournee.Date;
  
  }
  
  $scope.cmdToShow.forEach(function(cmd, index) {
  
  
	cmd.type = "commande";
	cmd.hidden = false;
  
	if (cmd.cmdTour.Type == "depart") {
		$scope.isDep = true;
  
	}
	var itemsWithSameNumDOSSIER = $scope.cmdToShow.filter(function(item) {
		return item.cmdTour.NumDossier === cmd.cmdTour.NumDossier;
	});
	if (itemsWithSameNumDOSSIER.length > 1) {
		var indicesWithSameNumDOSSIER = itemsWithSameNumDOSSIER.map(function(item) {
			return $scope.cmdToShow.indexOf(item);
		});
  
	   
	}
  
  });
  angular.forEach($scope.cmdToShow, function(cmd, index) {
	if (cmd.cmdTour.Type == 'depart') {
	}
  
	else {
		if (cmd.orders[0] && cmd.orders.length>0 && cmd.orders[0].CoordinatesEn && cmd.orders[0].CoordinatesEn.length === 2 && (cmd.cmdTour.Type == 'En' || cmd.cmdTour.Type == 'Liv')) {
			var t = cmd.cmdTour.LatLng.split(',');
			var latLng = new google.maps.LatLng(t[0], t[1]);
			const existingMarker = $scope.markers_tournee.find(marker => marker.NumDossier === numDossier);
			if (!existingMarker) {
				createMarkerTournee(latLng, cmd, "rgb(57, 86, 155)");
			} else {
			}
		}
	}
  });
  
  setTimeout(() => {
	console.log($scope.markers_tournee);
  }, 3000);
		  });
  
	  } else {
		  $('#mapContainer').hide('500');
		  $('.tableShow').show(500);
	  }
  };
  
  
	
	$scope.onSelectFolder = function ($item, $model, $label) {
	  $scope.detail = $item;
	  $scope.getSubFolders($item.NumDossier);
	};
  
	geocoder = new google.maps.Geocoder();
  
	codeAddress = function (i, addr, f) {
	  var address = addr;
	  geocoder.geocode({ 'address': address }, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		  f(results[0].geometry.location);
		} else {
		  alert('Geocode was not successful for the following reason: ' + status);
		}
	  });
	};
  
	$scope.TransformDate = function (vari) {
	  var date = moment(vari, "DD-MM-YY").format('YYYY,MM,DD');
	  var fullDate = new Date(vari);
	  var twoDigitMonth = fullDate.getMonth() + 1 + ""; if (twoDigitMonth.length == 1) twoDigitMonth = "0" + twoDigitMonth;
	  var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
	  var currentDate = fullDate.getFullYear() + "," + twoDigitMonth + "," + twoDigitDate;
	  return date;
	};
  
	$scope.TransformDateFr = function (vari) {
	  var date = moment(vari, "DD-MM-YY").format('DD/MM/YYYY');
	  var fullDate = new Date(vari);
	  var twoDigitMonth = fullDate.getMonth() + 1 + ""; if (twoDigitMonth.length == 1) twoDigitMonth = "0" + twoDigitMonth;
	  var twoDigitDate = fullDate.getDate() + ""; if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
	  var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
	  return date;
	};
  
	$scope.getTimeLine = function () {
	  if (angular.isUndefined($scope.detail) !== true && $scope.detail.CoordinatesEn.length > 1 && $scope.detail.CoordinatesLiv.length > 1) {
		$scope.showTimeLine = true;
  
		$('.tableShow').hide(500);
		$('#mapContainer').show('500', function () {
		  $("#mapdiv").empty();
		  var storymap_data = {};
		  firstPos = $scope.detail.AdrEn + " " + $scope.detail.CpEN + " " + $scope.detail.VilleEn + " " + $scope.detail.PaysEn;
		  lastPos = $scope.detail.AdrLiv + " " + $scope.detail.CpLiv + " " + $scope.detail.VilleLiv + " " + $scope.detail.PaysLiv;
		  var firstLat = scope.detail.CoordinatesEn[1];
		  var firstLon = scope.detail.CoordinatesEn[0];
  
		  var lastLat = scope.detail.CoordinatesLiv[1];
		  var lastLon = scope.detail.CoordinatesLiv[0];
		  var storymap_data = {
			"storymap": {
			  "slides": [{
				"type": "overview",
				"date": $scope.TransformDate($scope.detail.DateEn) + "-" + $scope.TransformDate($scope.detail.DateLiv),
				"text": {
				  "headline": " Dossier Numéro " + $scope.detail.NumDossier + " </small>",
				  "text": "<p>Client :" + $scope.detail.CodeClient + " <br> Période : du " + $scope.TransformDateFr($scope.detail.DateEn) + " Au " + $scope.TransformDateFr($scope.detail.DateLiv) + "</p> <span class='vco-note'>REMARQUES : " + $scope.detail.ComExploit + "</span>"
				}
			  }, {
				"date": $scope.TransformDate($scope.detail.DateEn),
				"text": {
				  "headline": "<img src='https://maps.googleapis.com/maps/api/streetview?location=" + firstLat + "," + firstLon + "&size=600x300&heading=250&fov=90&pitch=-10&sensor=false' ></img>",
				  "text": "Depart " + $scope.detail.CodeEn + "<br />" + $scope.detail.AdrEn + " " + $scope.detail.CpEN + " " + $scope.detail.VilleEn + " " + $scope.detail.PaysEn + "</p> <span class='vco-note'>Remarques : </span>"
				},
				"location": {
				  "name": $scope.detail.CodeEn,
				  "zoom": 10,
				  "lat": firstLat,
				  "lon": firstLon,
				  "line": true
				},
  
			  }]
			}
		  };
		  storymap_data.storymap.slides.push({
			"date": $scope.TransformDate($scope.detail.DateLiv),
			"text": {
			  "headline": "<img src='https://maps.googleapis.com/maps/api/streetview?location=" + lastLat + "," + lastLon + "&size=600x300&heading=250&fov=90&pitch=-10&sensor=false'></img>",
			  "text": "Arrivée " + $scope.detail.CodeLiv + "<br />" + $scope.detail.AdrLiv + " " + $scope.detail.CpLiv + " " + $scope.detail.VilleLiv + " " + $scope.detail.PaysLiv + " <span class='vco-note'>Remarques : </span>"
			},
			"location": {
			  "name": $scope.detail.CodeClient,
			  "lat": lastLat,
			  "lon": lastLon,
			  "zoom": 10,
			  "line": true
			},
			"media": {
			  "url": "",
			  "credit": "photobucket",
			  "caption": "1790 Map of the US Census"
			}
		  });
		  var storymap_options = { language: 'fr' };
		  $scope.allCmd = storymap_data.storymap.slides;
		  var storymap = new VCO.StoryMap('mapdiv', storymap_data, storymap_options);
		  window.onresize = function (event) {
			storymap.updateDisplay();
		  };
		});
	  } else {
		$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Impossible de géolocaliser les points d'interventions.");
	  }
	}
  
	$scope.getSubFolders = function (val) {
	  $scope.datas2 = [];
	  return $http.get('Suborders/?NumDossier=' + val + '&&sort=NumSub').then(function (response) {
		if (response.data.length > 0) {
		  $scope.datas2 = response.data;
		  if (angular.isUndefined($scope.detail) !== true && $scope.detail.CoordinatesEn.length > 1 && $scope.detail.CoordinatesLiv.length > 1) {
			$scope.getTimeLine();
		  }
		  return response.data;
		}
		else {
		  $scope.getTimeLine();
		  return response.data;
		}
	  });
	};
  
	$scope.addSub = function (type) {
	  var hot = hotRegisterer.getInstance('myTable');
	  var selection = $scope.hotInstance.getSelected();
	  var row = selection[0];
	  if (type === "En") {
		var copy = [];
		copy.TypeSub = 'En';
		copy.NumDossier = $scope.part[row].NumDossier + " - " + $scope.nbrSubCmd;
		$scope.nbrSubCmd++;
		$scope.part.splice(row + $scope.nbrSubCmd - 1, 0, copy);
	  } else {
		var copy = [];
		copy.TypeSub = 'Liv';
		copy.NumDossier = $scope.part[row].NumDossier + " - " + $scope.nbrSubCmd;
		$scope.nbrSubCmd++;
		$scope.part.splice(row + $scope.nbrSubCmd - 1, 0, copy);
	  }
  
	};
  
	$scope.removeRows = function () {
	  $scope.allselected = 0;
	  $scope.allIdSelecDist = [];
	  $scope.allIdSelecAf = [];
	  $scope.loadingCmds = true;
	  $scope.part = [];
	  $scope.En = [];
	  $scope.Liv = [];
	  $scope.Com = [];
	  $scope.Af = [];
	  $scope.Cli = [];
  
	  $scope.Com.Exploit = '';
	  $scope.Com.Client = '';
	  $scope.NumDossier = '';
	  $scope.comEx = false;
	  $scope.liCli = false;
	  $scope.liAff = false;
	  $scope.isCmdSetted = false;
	  $scope.isAfSetted = false;
	  $scope.isCliSetted = false;
	  $scope.isLivSetted = false;
	  $scope.isEnSetted = false;
	  $scope.search(1, 'reset');
	};
  
	$scope.addRow = function () {
	  var alldata = $scope.part;
	  $scope.part = [];
	  data = {};
	  data.NumDossier = "";
	  data.Marge = null;
	  data.CodeClient = "";
	  data.Reference = "";
	  data.CodeEn = "";
	  data.DateEn = null;
	  data.CodeLiv = "";
	  data.DateLiv = null;
	  data.MontantV = "";
	  data.Poids = "";
	  data.Colis = "";
	  data.Palettes = "";
	  data.MetreLin = "";
	  data.MetreCube = "";
	  data.CodeTVA = "";
	  data.CodeChauf1 = "";
	  data.CodeChauf2 = "";
	  data.CMR = "";
	  data.TypeVh = "";
	  data.CodeAff = "";
	  data.MontantA = "";
	  data.CodeTVATr = "";
	  alldata.push(data);
	  $scope.part = alldata;
	  $scope.hotInstance.selectCell($scope.part.length - 1, 2);
	};
  
	$scope.validCmd = function () {
	  if (allIdSelec.length === 0) {
		return $scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Aucune commande séléctionnée!");
	  }
  
	  $scope.hotInstance.deselectCell();
	  var confirm = $mdDialog.confirm()
		.title('Validation Commande(s)')
		.textContent('Valider les ' + $scope.allselected + ' commandes selectionnées ?')
		.ariaLabel('Valid Cmd')
		.ok('Valider')
		.cancel('Annuler');
  
	  $mdDialog.show(confirm).then(function () {
		console.log(allIdSelec);
		validAlert = $alert({ title: "<i class='fa fa-spinner fa-spin '></i> Validation en cours", content: "", alertType: 'warning', clearExists: false, autoDestroy: false, placement: 'center', effect: 'fall' });
		$scope.isCmdSetted = false;
		var allIds = [];
		for (var p = 0; p < allIdSelec.length; p++) {
		  allIds.push(allIdSelec[p].id);
		}
  
		io.socket.post('/Ordergrid/validCmd', { id: allIds }, function (res) {
		  var rowDb;
  
  
		  console.log(res.valid);
  
		  for (var x = 0; x < res.valid.length; x++) {
			for (var y = 0; y < $scope.part.length; y++) {
		  console.log($scope.part[y].NumDossier);
		  console.log($scope.part[y].NumDossier==res.valid[x]);
  
			  if ($scope.part[y].NumDossier == res.valid[x])
				rowDb = y;
			}
			for (var t = 0; t < allIdSelec.length; t++) {
			  if (allIdSelec[t].id == $scope.part[x].id) {
				allIdSelec.splice(t, 1);
				break;
			  }
			}
  
			console.log("rowDb");
			console.log(rowDb);
			console.log($scope.part[rowDb]);
			if($scope.part[rowDb] &&  typeof $scope.part[rowDb].CodeAff != 'undefined' && $scope.part[rowDb].CodeAff){
			  if ($scope.part[rowDb].CodeAff !== null && $scope.part[rowDb].CodeAff != '' && typeof $scope.part[rowDb].CodeAff != 'undefined') {
				for (var y = 0; y < $scope.allIdSelecAf.length; y++) {
				  if ($scope.allIdSelecAf[y].id == $scope.part[rowDb].id) {
					$scope.allIdSelecAf.splice(y, 1);
					break;
				  }
				}
			  }
			  else {
				for (var y = 0; y < $scope.allIdSelecDist.length; y++) {
				  if ($scope.allIdSelecDist[y].id == $scope.part[rowDb].id) {
					$scope.allIdSelecDist.splice(y, 1);
					break;
				  }
				}
			  }
  
			}
			else{
			  for (let index = 0; index < $scope.part.length; index++) {
				if($scope.part[index].NumDossier==res.valid[res.valid-1]){
				  rowDb=index;
				}
				
			  }
			  
			}
		  
			$scope.allselected--;
  
			$scope.part.splice(rowDb, 1);
		  }
  
		  $timeout(function () {
			if (res.error.length > 0) {
			  cmdService.modalErrors(res.error).result.then(function (selectedItem) {
				$scope.modalActive = false;
  
			  }, function () {
				$scope.modalActive = false;
			  });
			}
			validAlert.toggle();
		  }, 400)
  
  
		});
  
	  }, function () {
		$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
	  });
	};
  
	$scope.sendWait = function () {
	  $scope.part[$scope.selectedRow].Prod = true;
  
	  updateCmd($scope.selectedRow, 1);
	  // $scope.part.splice($scope.selectedRow,1);
	};
  
	$scope.typeCmd = function (type) {
	  $scope.part[$scope.selectedRow].typeCmd = type;
	  // if(type == 'Aff'){
	  //   // if($scope.part[$scope.selectedRow].typeCmd == 'AFF')
	  // }
	  // else{
	  //   $scope.part[$scope.selectedRow].typeCmd = 'Aff';
	  // }
  
  
	  if ($scope.part[$scope.selectedRow].typeCmd == 'AFF')
		$scope.cmdAff = true;
	  else
		$scope.cmdAff = false;
  
	  if ($scope.part[$scope.selectedRow].typeCmd == 'DIST')
		$scope.cmdDist = true;
	  else
		$scope.cmdDist = false;
  
	  updateCmd($scope.selectedRow);
	};
  
	$scope.comExport = function () {
	  var row = $scope.selectedRow;
	  if ($scope.part[row].NumDossier === "" || $scope.part[row].NumDossier === null || typeof $scope.part[row].NumDossier === "undefined") {
		$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Commande Non Enregitrée.");
	  } else {
		var modalInstance = $uibModal.open({
		  templateUrl: 'ModalCom',
		  controller: 'ModalComController',
		  size: "md",
		  backdrop: 'static',
		  resolve: {
			items: function () {
			  return $scope.part[row].ComExport;
			},
			type: function () {
			  return "export";
			}
		  }
		});
  
		modalInstance.result.then(function (selectedItem) {
		  $scope.modalActive = false;
		  $scope.part[row].ComExport = selectedItem;
		  if (selectedItem.length > 0)
			$scope.comEx = true;
		  else
			$scope.comEx = false;
		   updateCmd(row,"ComExport");
		  $scope.hotInstance.render();
		}, function () {
		  $scope.modalActive = false;
		});
	  }
	};
  
	$scope.litigeCli = function () {
	  var row = $scope.selectedRow;
	  if ($scope.part[row].CodeClient === "" || $scope.part[row].CodeClient === null || typeof $scope.part[row].CodeClient === "undefined") {
		$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Code Client obligatoire.");
	  } else {
		var isFa = false;
		if ($scope.part[row].FactCli != '' && $scope.part[row].FactCli !== null && typeof $scope.part[row].FactCli != 'undefined')
		  isFa = true;
		var items = { com: $scope.part[row].ComStatutCli, isFa: isFa };
		var modalInstance = $uibModal.open({
		  templateUrl: 'ModalCom',
		  controller: 'ModalComController',
		  size: "md",
		  backdrop: 'static',
		  resolve: {
			items: function () {
			  return items;
			},
			type: function () {
			  return "En";
			}
		  }
		});
  
		modalInstance.result.then(function (selectedItem) {


			console.log("selected ittem");
			console.log(selectedItem);
			

			if (selectedItem == 'annul') {
				
			  }
		 else if (selectedItem == 'ok') {
			$scope.part[row].StatutCli = '';
			$scope.liCli = false;
		  } else  {
			$scope.part[row].StatutCli = 'LITIGE';
			$scope.part[row].ComStatutCli = selectedItem;
			$scope.liCli = true;
		  }
		   updateCmd(row,"StatutCli");
		  $scope.hotInstance.render();
		}, function () {
		  $scope.modalActive = false;
		});
	  }
	};
  
	$scope.litigeAff = function () {
	  var row = $scope.selectedRow;
	  if ($scope.part[row].CodeAff === "" || $scope.part[row].CodeAff === null || typeof $scope.part[row].CodeAff === "undefined") {
		$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Code Affrété obligatoire.");
	  } else {
		var isFa = false;
		if ($scope.part[row].FactAffr != '' && $scope.part[row].FactAffr !== null && typeof $scope.part[row].FactAffr != 'undefined')
		  isFa = true;
		var items = { com: $scope.part[row].ComStatutAff, isFa: isFa };
		var modalInstance = $uibModal.open({
		  templateUrl: 'ModalCom',
		  controller: 'ModalComController',
		  backdrop: 'static',
		  size: "md",
		  resolve: {
			items: function () {
			  return items;
			},
			type: function () {
			  return "EnA";
			}
		  }
		});
  
		modalInstance.result.then(function (selectedItem) {
		  if (selectedItem == 'ok') {
			$scope.part[row].StatutAff = '';
			$scope.liAff = false;
			$scope.addCommentFact($scope.part[row].FactAffr,"remove",$scope.part[row].NumDossier);
		  } else {
			console.log('starysafff');
			$scope.part[row].StatutAff = 'LITIGE';
			$scope.part[row].ComStatutAff = selectedItem;
			$scope.liAff = true;
			$scope.addCommentFact($scope.part[row].FactAffr,"add",$scope.part[row].NumDossier);
  
		  }
		  updateCmd(row,"StatutAff");

  
		}, function () {
		  $scope.modalActive = false;
		});
	  }
	};
  
  
	$scope.addCommentFact =function(NumFact,type,dossier){
	  $http.post('/FacturesA/updateCom', { Dossier:dossier,NumFact: NumFact, type: type }).success(function (res) {
		  console.log(res);
	  });
  
	}
  
  
  
	$scope.filtreBtn = function () {
	  if ($scope.prop.filtre == 'Num. Dossier' || $scope.prop.filtre == 'Num. Fact. Vente')
		$scope.showFiltreMore = false;
	  else
		$scope.showFiltreMore = true;
	};
  
	$scope.getCli = function (val) {
	  return $http.get('/Clients/AutoComplete?name=' + val).then(function (response) {
		return response.data
	  });
	};
  
	$scope.getAff = function (val) {
	  return $http.get('/Affretes/AutoComplete?name=' + val).then(function (response) {
		return response.data
	  });
	};
  
	$scope.getVeh = function (val) {
	  return $http.get('/Vehicules/AutoComplete?name=' + val).then(function (response) {
		return response.data
	  });
	};
  
	$scope.sidebarF = function () {
	  var codeCli = $scope.Sidebar.CodeCli;
	  var codeAff = $scope.Sidebar.CodeAff;
	  var DeptEn = $scope.Sidebar.DeptEn;
	  var DeptLiv = $scope.Sidebar.DeptLiv;
	  var Colis = $scope.Sidebar.Colis;
	  var Pal = $scope.Sidebar.Pal;
	  var ML = $scope.Sidebar.ML;
	  var paysEn = $scope.Sidebar.PaysEn;
	  var paysLiv = $scope.Sidebar.PaysLiv;
	  var Vehicule = $scope.Sidebar.Vehicule;
	  var url = "/Ordergrid?where={"
	  var where = 0;
	  if (codeCli != "" && typeof codeCli !== "undefined") {
		where = 1
		url = url + '"CodeClient":{"contains":"' + codeCli + '"}';
	  }
	  if (codeAff != "" && typeof codeAff !== "undefined") {
		if (where == 0) {
		  where = 1
		  url = url + '"CodeAff":{"contains":"' + codeAff + '"}';
		} else
		  url = url + ',"CodeAff":{"contains":"' + codeAff + '"}';
	  }
	  if (Colis != "" && typeof Colis !== "undefined") {
		if (where == 0) {
		  where = 1
		  url = url + '"Colis":"' + Colis + '"';
		} else
		  url = url + ',"Colis":"' + Colis + '"';
	  }
	  if (Pal != "" && typeof Pal !== "undefined") {
		if (where == 0) {
		  where = 1
		  url = url + '"Palettes":"' + Pal + '"';
		} else
		  url = url + ',"Palettes":"' + Pal + '"';
	  }
	  if (ML != "" && typeof ML !== "undefined") {
		if (where == 0) {
		  where = 1
		  url = url + '"MetreLin":"' + ML + '"';
		} else
		  url = url + ',"MetreLin":"' + ML + '"';
	  }
	  if (Vehicule != "" && typeof Vehicule !== "undefined") {
		if (where == 0) {
		  where = 1
		  url = url + '"TypeVh":"' + Vehicule + '"';
		} else
		  url = url + ',"TypeVh":"' + Vehicule + '"';
	  }
	  if (DeptEn != "" && typeof DeptEn !== "undefined") {
		if (where == 0) {
		  where = 1
		  url = url + '"CpEN":{"startsWith":"' + DeptEn + '"}';
		} else
		  url = url + ',"CpEN":{"startsWith":"' + DeptEn + '"}';
	  }
	  if (DeptLiv != "" && typeof DeptLiv !== "undefined") {
		if (where == 0) {
		  where = 1
		  url = url + '"CpLiv":{"startsWith":"' + DeptLiv + '"}';
		} else
		  url = url + ',"CpLiv":{"startsWith":"' + DeptLiv + '"}';
	  }
	  if (paysEn != "" && typeof paysEn !== "undefined") {
		if (where == 0) {
		  where = 1
		  url = url + '"PaysEn":{"startsWith":"' + paysEn + '"}';
		} else
		  url = url + ',"PaysEn":{"startsWith":"' + paysEn + '"}';
	  }
	  if (paysLiv != "" && typeof paysLiv !== "undefined") {
		if (where == 0) {
		  where = 1
		  url = url + '"PaysLiv":{"startsWith":"' + paysLiv + '"}';
		} else
		  url = url + ',"PaysLiv":{"startsWith":"' + paysLiv + '"}';
	  }
	  url = url + '}&limit=10000&sort=createdAt DESC';
	  $http.get(url).success(function (response) {
		$scope.part = [];
		if (response.length != "undefined") {
		  $scope.countFold = response.length;
		  $scope.part = response;
		  response.forEach(function (result, key) {
			data = {};
			data.NumDossier = result.NumDossier;
			if (result.DateEn === null)
			  $scope.part[key].DateEn = "";
			else
			  $scope.part[key].DateEn = moment(result.DateEn).format($rootScope.formatDateM);
			if (result.DateLiv === null)
			  $scope.part[key].DateLiv = "";
			else
			  $scope.part[key].DateLiv = moment(result.DateLiv).format($rootScope.formatDateM);
  
			$scope.part[key].createdAt = moment(result.createdAt).format('DD/MM/YY HH:mm');
  
		  })
		}
	  });
	}
  
	$scope.getPages = function () {
	  $scope.totalPages = Math.ceil(parseFloat($scope.part.length / 100));
	  $scope.thePage = 1;
	  $scope.goToPage();
	};
  
	$scope.nextPage = function () {
	  if ($scope.thePage < $scope.totalPages) {
		$scope.loadingCmds = true;
		$scope.thePage++;
		$scope.search($scope.thePage);
	  }
	};
  
	$scope.prevPage = function () {
	  if ($scope.thePage > 1) {
		$scope.loadingCmds = true;
		$scope.thePage--;
		$scope.search($scope.thePage);
	  }
	};
  
	$scope.goToPage = function () {
	  if ($scope.thePage > 1) {
		$scope.loadingCmds = true;
		$scope.search($scope.thePage);
	  }
	};
	// $scope.goToPage = function(){
	//   limit = 100,
	//   row   = ($scope.thePage - 1) * limit,
	//   count = $scope.thePage * limit,
	//   $scope.part  = [];
	//   $scope.cell  = [];
  
	//   if(count>$scope.part.length)
	//     count = $scope.part.length;
  
	//   $scope.newAlert('info','','<div class="col-md-12 text-center alertStyle" > Dossier(s) affiché(s)<br><span> '+row+' à '+count+"</span></div>");
  
	//   var nbr = 0;
	//   for (;row < count;row++) {
	//     $scope.part.push($scope.part[row]);
	//     var theComment = $scope.part[row].ComExploit; 
  
	//     var theComment = $("<div/>").html(theComment).text();
	//     $scope.cell.push({row: nbr, col: 1, comment: {value: theComment, readOnly : true}});
	//     nbr++;
	//   }
  
	//   $timeout(function(){
	//     $scope.hotInstance.updateSettings({
	//        cell:$scope.cell
	//     });
  
	//     $scope.loadingCmds = false;
	//     $scope.setCmd();
	//   },1000)
	// };
  
	$scope.autoCompSearch = function (val) {
	  var request;
	  if ($scope.prop.filtre == "Code Client") {
		request = '/Clients/AutoComplete?name=';
		$scope.searchTable.output = 'CodeClient';
	  } else if ($scope.prop.filtre == "Code Affrété") {
		request = '/Affretes/AutoComplete?name=';
		$scope.searchTable.output = 'CodeAffrete';
	  }
	  else {
		return [];
	  }
  
	  return $http.get(request + val).then(function (response) {
		for (var x = 0; x < response.data.length; x++) {
		  if ($scope.prop.filtre == "Code Client")
			response.data[x].theName = response.data[x].CodeClient;
		  else if ($scope.prop.filtre == "Code Affrété")
			response.data[x].theName = response.data[x].CodeAffrete;
		}
		return response.data
	  });
  
	};
  
	$scope.search = function (toPage, para) {

		console.log("reservee");
		console.log(para);
		
	  $scope.loadingCmds = true;
	  $scope.resultCount = $sce.trustAsHtml("<i class='fa fa-spinner fa-spin text-success'></i> ");
  
	  if (!toPage)
		$scope.thePage = 1;
  
	  if (para) {
		var name = $rootScope.user.username;
		if (para == "reset")
		  $sql = '/Ordergrid/invalid?name=' + name;
		else if (para == "affWait")
		  $sql = '/Ordergrid/affWait';
		else if (para == "distWait")
		  $sql = '/Ordergrid/distWait';
		else {
		  console.log("params")
		  console.log(params)
		  if (typeof params.affWait != 'undefined' && params.affWait !== null)
			$sql = '/Ordergrid/affWait';
		  else if (typeof params.xpo != 'undefined' && params.xpo !== null)
			$sql = '/Ordergrid/xpo';
		  else if (typeof params.distWait != 'undefined' && params.distWait !== null)
			$sql = '/Ordergrid/distWait';
		  else if (typeof params.dossier != 'undefined' && params.dossier !== null) {
			$sql = '/Ordergrid?NumDossier=' + params.dossier;
		  }
		  else if (typeof params.invalide != 'undefined' && params.invalide !== null) {
			$sql = '/Ordergrid/invalid?name=' + name;
			// $sql = "/Ordergrid/invalidAll";
		  } else {
			$sql = '/Ordergrid/invalid?name=' + name;
		  }
		}
  
		io.socket.get($sql, function (response) {
		  var loadedData = response;
		  response.forEach(function (result, key) {
			data = {};
			if (result.DateEn === null)
			  data.DateEn = "";
			else
			  loadedData[key].DateEn = moment(result.DateEn).format($rootScope.formatDateM);
  
			if (result.DateLiv === null)
			  data.DateLiv = "";
			else
			  loadedData[key].DateLiv = moment(result.DateLiv).format($rootScope.formatDateM);
  
			loadedData[key].createdAt = moment(result.createdAt).format('DD/MM/YY HH:mm');
			loadedData[key].Marge = parseFloat(loadedData[key].Marge).toFixed(2);
			loadedData[key].selectedRow = false;
  
			// loadedData[key].__children= [ {CodeClient:'teste'} ];
			// loadedData[key].__children.push(_.clone(loadedData[key]));
			// delete loadedData[key].__children[0].NumDossier;
			$scope.cell.push({ row: key, col: 1, comment: { value: loadedData[key].ComExploit, readOnly: true, } });
		  });
  
		  $scope.part = loadedData;
		  $scope.countFold = $scope.part.length;
		  $scope.totalPages = Math.ceil(parseFloat($scope.part.length / 100));
		  $rootScope.loadState = true;
		  $scope.loadingCmds = false;
  
  
		  var row = ($scope.thePage - 1) * limit,
			count = $scope.thePage * limit;
  
		  $scope.newAlert('info', '<div class="col-md-12 text-center alertStyle" > Dossier(s) affiché(s)<br><span> ' + row + ' à ' + count + "</span></div>")
  
		});
	  }
	  else {
		var type, typeDate, val;
		if (typeof $scope.searchTable.value == 'undefined')
		  val = '';
  
		else
		  val = $scope.searchTable.value;
  
		if ($scope.prop.filtre == 'Num. Dossier') {
		  type = "NumDossier";
		} else if ($scope.prop.filtre == "Reference") {
		  type = "Ref";
		} else if ($scope.prop.filtre == "Code Client") {
		  type = "CodeCLi";
		} else if ($scope.prop.filtre == "Code Affrété") {
		  type = "CodeAff";
		} else if ($scope.prop.filtre == "tout") {
		  type = "tout";
		} else if ($scope.prop.filtre == "Num. Fact. Vente") {
		  type = "NumFact";
		} else if ($scope.prop.filtre == "MaleTaxe") {
		  type = "MaleTaxe";
		} else {
		  type = "Par";
		}
  
		if ($scope.DateFiltre.filtre == 'Enlevement') {
		  typeDate = 'En';
		} else if ($scope.DateFiltre.filtre == 'Livraison') {
		  typeDate = 'Liv';
		} else {
		  typeDate = 'saisie';
		}
  
		if (typeof $scope.Filtre.dt1 != 'undefined') {
		  var DateDeb = moment($scope.Filtre.dt1).format('YYYY-MM-DD');
		}
  
		if (typeof $scope.Filtre.dt2 != 'undefined') {
		  var DateFin = moment($scope.Filtre.dt2).format('YYYY-MM-DD');
		}
  
  
		if (type === "NumDossier") {
		  if (val != '' && typeof val != 'undefined' && val !== null) {
			$http.get('/ordergrid?NumDossier=' + val).then(function (response) {
			  
			  console.log('response')
			  console.log(response)
			  if (response.data.length > 0) {
				var found = $filter('filter')($scope.part, { NumDossier: response.data[0].NumDossier }, true);
  
			   
				if (found.length <= 0) {
				  var dataloaded = response.data[0];
				  if (response.data[0].DateEn === null)
					dataloaded.DateEn = "";
				  else
					dataloaded.DateEn = moment(response.data[0].DateEn).format($rootScope.formatDateM);
  
				  if (response.data[0].DateLiv === null)
					dataloaded.DateLiv = "";
				  else
					dataloaded.DateLiv = moment(response.data[0].DateLiv).format($rootScope.formatDateM);
  
				  dataloaded.createdAt = moment(response.data[0].createdAt).format('DD/MM/YY HH:mm');
				  dataloaded.selectedRow = false;
  
				  $scope.part.unshift(dataloaded);
  
				  $scope.countFold++;
				  $scope.searchTable.value = '';
				  $scope.resultCount = $sce.trustAsHtml("<i class='fa fa-check text-success'> " + $scope.countFold + " Resultats</i> ");
				  $timeout(function () {
					$scope.loadingCmds = false;
					$scope.setCmd();
				  }, 1000)
				} else {
				  $scope.newAlert('info', '<i class="fa fa-exclamation fa-2x"></i>', 'Commande(s) préalablement affichée(s) dans le tableau!');
  
				  $timeout(function () {
					$scope.loadingCmds = false;
				  }, 1000)
				}
			  } else {
				$scope.newAlert('danger', '<i class="fa fa-exclamation fa-2x"></i>', "Le dossier N° " + val + " n'éxiste pas.");
  
				$timeout(function () {
				  $scope.loadingCmds = false;
				}, 1000)
			  }
			})
		  }
		  else {
			$scope.loadingCmds = false;
			$scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "Aucun numéro de dossier saisie !");
		  }
		}
		// else if(type === "NumFact"){
		//   if(val !='' && typeof val != 'undefined' && val !== null){
		//     // $http.get('/ordergrid/findFact?Reference='+val).then(function(response){
		//     io.socket.post('/ordergrid/findFact',{num:val}, function(response){
		//       var found = $filter('filter')( $scope.part, { Reference: response.data[0].Reference }, true);
		//       if(found.length<=0){
		//         $scope.part.unshift(response.data[0]);
		//         if(response.data[0].DateEn ===null)
		//           $scope.part[0].DateEn = "";
		//         else
		//           $scope.part[0].DateEn = moment(response.data[0].DateEn).format($rootScope.formatDateM);
  
		//           $scope.part[0].selectedRow =  false;
		//         if(response.data[0].DateLiv ===null)
		//           $scope.part[0].DateLiv =  "";
		//         else
		//           $scope.part[0].DateLiv =  moment(response.data[0].DateLiv).format($rootScope.formatDateM);
		//           $scope.part[0].createdAt =  moment(response.data[0].createdAt).format('DD/MM/YY HH:mm');
  
		//         $timeout(function(){
		//           $scope.setCmd();
		//         },1000)
		//         $scope.countFold++;
		//         $scope.resultCount = $sce.trustAsHtml("<i class='fa fa-check text-success'> "+$scope.countFold+" Resultats</i> ");
		//       }else{
		//         $scope.newAlert('warning','<i class="fa fa-exclamation fa-2x"></i>',"Commande(s) préalablement affichée(s) dans le tableau!");
		//         $timeout(function(){
		//           $scope.loadingCmds = false;
		//         },1000)
		//       }
		//     })
		//   }
		// }
		else if (type === "Ref") {
		  if (val != '' && typeof val != 'undefined' && val !== null) {
			$http.get('/ordergrid?Reference=' + val).then(function (response) {
			  var found = $filter('filter')($scope.part, { Reference: response.data[0].Reference }, true);
			  if (found.length <= 0) {
				$scope.part.unshift(response.data[0]);
				if (response.data[0].DateEn === null)
				  $scope.part[0].DateEn = "";
				else
				  $scope.part[0].DateEn = moment(response.data[0].DateEn).format($rootScope.formatDateM);
  
				$scope.part[0].selectedRow = false;
				if (response.data[0].DateLiv === null)
				  $scope.part[0].DateLiv = "";
				else
				  $scope.part[0].DateLiv = moment(response.data[0].DateLiv).format($rootScope.formatDateM);
				$scope.part[0].createdAt = moment(response.data[0].createdAt).format('DD/MM/YY HH:mm');
  
				$timeout(function () {
				  $scope.setCmd();
				}, 1000)
				$scope.countFold++;
				$scope.resultCount = $sce.trustAsHtml("<i class='fa fa-check text-success'> " + $scope.countFold + " Resultats</i> ");
			  } else {
				$scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "Commande(s) préalablement affichée(s) dans le tableau!");
				$timeout(function () {
				  $scope.loadingCmds = false;
				}, 1000)
			  }
			})
		  }
		}
		else if ((DateDeb !== '' && DateFin !== '' && typeof DateDeb !== 'undefined' && typeof DateFin !== 'undefined' && DateDeb !== null && DateFin !== null) || type === "NumFact") {
		  io.socket.post('/Ordergrid/Search', { name: val, type: type, dt1: DateDeb, dt2: DateFin, typeDate: typeDate, typeMetier: $scope.TypeMetier.filtre, columnF: $scope.columnFilter, page: $scope.thePage }, function (response) {
			console.log("response")
			console.log(response)
			$scope.advancedSearch = true;
			var theResponse;
			if ($scope.thePage === 1) {
			  theResponse = response.data;
			  $scope.countFold = response.count;
			  $scope.totalPages = Math.ceil(parseFloat(response.count / 100));
			}
			else
			  theResponse = response;
  
			if (theResponse.length > 0) {
			  if ((type != "Ref" && type != "NumDossier") || (type === "NumDossier" && ($scope.searchTable.NumDossier === '' || $scope.searchTable.NumDossier === null || typeof $scope.searchTable.NumDossier === 'undefined'))) {
  
				theResponse.forEach(function (result, key) {
				  if (result.DateEn === null)
					theResponse[key].DateEn = "";
				  else
					theResponse[key].DateEn = moment(result.DateEn).format($rootScope.formatDateM);
  
				  if (result.DateLiv === null)
					theResponse[key].DateLiv = "";
				  else
					theResponse[key].DateLiv = moment(result.DateLiv).format($rootScope.formatDateM);
  
				  theResponse[key].createdAt = moment(result.createdAt).format('DD/MM/YY HH:mm');
				  theResponse[key].selectedRow = false;
  
				})
  
				$scope.part = theResponse;
  
				if ($scope.countFold > 0)
				  $scope.resultCount = $sce.trustAsHtml("<i class='fa fa-check text-lime'> " + $scope.countFold + " Resultats</i> ");
				else if ($scope.countFold == 0)
				  $scope.resultCount = $sce.trustAsHtml("<i class='fa fa-exclamation-triangle text-danger'> " + $scope.countFold + " Resultats</i> ");
  
				$timeout(function () {
				  $scope.setCmd();
				  $scope.loadingCmds = false;
				}, 1000)
			  }
			  else {
				var found = $filter('filter')($scope.part, { NumDossier: response[0].NumDossier }, true);
				if (found.length <= 0) {
				  $scope.part.unshift(response[0]);
				  if (response[0].DateEn === null)
					$scope.part[0].DateEn = "";
				  else
					$scope.part[0].DateEn = moment(response[0].DateEn).format($rootScope.formatDateM);
  
				  if (response[0].DateLiv === null)
					$scope.part[0].DateLiv = "";
				  else
					$scope.part[0].DateLiv = moment(response[0].DateLiv).format($rootScope.formatDateM);
  
				  $scope.part[0].createdAt = moment(response[0].createdAt).format('DD/MM/YY HH:mm');
  
				  $timeout(function () {
					$scope.setCmd();
				  }, 1000)
  
				  $scope.countFold++;
				  $scope.resultCount = $sce.trustAsHtml("<i class='fa fa-check text-success'> " + $scope.countFold + " Resultats</i> ");
  
				} else {
  
				  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "Commande(s) préalablement affichée(s) dans le tableau!");
  
				  $timeout(function () {
					$scope.loadingCmds = false;
				  }, 1000)
				}
			  }
			}
			else {
			  $scope.newAlert('danger', '<i class="fa fa-exclamation fa-2x"></i>', "Aucune commande ne correspond à votre recherche!");
			  $timeout(function () {
				$scope.loadingCmds = false;
			  }, 1000)
			}
		  }, function (err) { console.log("err"); console.log(err) })
		}
		else {
		  $scope.newAlert('warning', '<i class="fa fa-exclamation fa-2x"></i>', "Veuillez saisir une plage de date.");
  
		  $timeout(function () {
			$scope.loadingCmds = false;
		  }, 1000)
		}
	  }
	};
  
	$scope.search(1, 1);
  
	$scope.duplicate = function () {
	  console.log('duplicate')
	  console.log($scope.selectedRow)
	  console.log($scope.waitInsert)
	  // $scope.newAlert('info','<i class="fa fa-spinner fa-spin"></i>','Copie de la commande.');
	  if ($scope.selectedRow !== '' && typeof $scope.selectedRow != 'undefined' && $scope.waitInsert === false) {
		if ($scope.part[$scope.selectedRow].NumDossier != '' && typeof $scope.part[$scope.selectedRow].NumDossier != 'undefined') {
		  // $scope.newAlert('info','Copie de la commande',"");
		  var second = {};
			second.CodeClient=$scope.part[$scope.selectedRow].CodeClient;
			second.CodeLiv=$scope.part[$scope.selectedRow].CodeLiv;
			second.CodeEn=$scope.part[$scope.selectedRow].CodeEn;

			second.NomClient=$scope.part[$scope.selectedRow].NomClient;
			second.AdrCli=$scope.part[$scope.selectedRow].AdrCli;
			second.CompAdrCli=$scope.part[$scope.selectedRow].CompAdrCli;
			second.PaysCli=$scope.part[$scope.selectedRow].PaysCli;
			second.CpCli=$scope.part[$scope.selectedRow].CpCli;
			second.VilleCli=$scope.part[$scope.selectedRow].VilleCli;
			second.TelCli=$scope.part[$scope.selectedRow].TelCli;
			second.CoordinatesCli=$scope.part[$scope.selectedRow].CoordinatesCli;
			second.FaxCli=$scope.part[$scope.selectedRow].FaxCli;
			second.NomEn=$scope.part[$scope.selectedRow].NomEn;
			second.AdrEn=$scope.part[$scope.selectedRow].AdrEn;
			second.CompAdrEn=$scope.part[$scope.selectedRow].CompAdrEn;
			second.PaysEn=$scope.part[$scope.selectedRow].PaysEn;
			second.CpEN=$scope.part[$scope.selectedRow].CpEN;
			second.VilleEn=$scope.part[$scope.selectedRow].VilleEn;
			second.CoordinatesEn=$scope.part[$scope.selectedRow].CoordinatesEn;
			second.TelEn=$scope.part[$scope.selectedRow].TelEn;
			second.AdrLiv=$scope.part[$scope.selectedRow].AdrLiv;
			second.NomLiv=$scope.part[$scope.selectedRow].NomLiv;
			second.CompAdrLiv=$scope.part[$scope.selectedRow].CompAdrLiv;
			second.PaysLiv=$scope.part[$scope.selectedRow].PaysLiv;
			second.CpLiv=$scope.part[$scope.selectedRow].CpLiv;
			second.VilleLiv=$scope.part[$scope.selectedRow].VilleLiv;
			second.CoordinatesLiv=$scope.part[$scope.selectedRow].CoordinatesLiv;
			second.TelLiv=$scope.part[$scope.selectedRow].TelLiv;
			second.FaxLiv=$scope.part[$scope.selectedRow].FaxLiv;
			second.HeureEn="";
			second.HeureLiv="";
			second.TrspEn="FALSE";
			second.TrspLiv="FALSE";

		
  
  
			if(second.CodeAff){
				second.CodeAff=$scope.part[$scope.selectedRow].CodeAff;
				second.NomAff=$scope.part[$scope.selectedRow].NomAff;
				second.AdrAff=$scope.part[$scope.selectedRow].AdrAff;
				second.CompAdrAff=$scope.part[$scope.selectedRow].CompAdrAff;
				second.CpAff=$scope.part[$scope.selectedRow].CpAff;
				second.VilleAff=$scope.part[$scope.selectedRow].VilleAff;
				second.PaysAff=$scope.part[$scope.selectedRow].PaysAff;
				second.TelAff=$scope.part[$scope.selectedRow].TelAff;
				second.CoordinatesAff=$scope.part[$scope.selectedRow].CoordinatesAff;
				second.FaxAff=$scope.part[$scope.selectedRow].FaxAff;
				second.ContactAff=$scope.part[$scope.selectedRow].ContactAff;
				second.typeCmd="AFF";

			}
  
  
  
		  $scope.part.push(second);
		  insertCmd($scope.part.length - 1);
		}
	  }
	  else {
		$scope.newAlert('danger', 'Action impossible pour le moment', "");
	  }
	};
  
	$scope.comInter = function (type) {
	  console.log("comInter")
	  var theInter;
	  if (type == "En")
		theInter = $scope.interEn;
	  else
		theInter = $scope.interLiv;
  
	  console.log("theInter")
	  console.log(theInter)
	  console.log(type)
	  theInter.NumDossier=$scope.part[$scope.selectedRow].NumDossier;
	  comService.comInter(theInter, type).result.then(function (selectedItem) {
		console.log("selectedItem")
		console.log(selectedItem)
		if (type == "En") {
		  $scope.modalActive = false;
		  $scope.interEn.Commentaires = selectedItem;
		  if (selectedItem && selectedItem != "") {
			$scope.enComment = true;
			if ($scope.part[$scope.selectedRow].CodeEn === $scope.part[$scope.selectedRow].CodeLiv) {
			  $scope.livComment = true;
			  $scope.interLiv.Comentaires = selectedItem;
			}
		  }
		  else {
			$scope.enComment = false;
			if ($scope.part[$scope.selectedRow].CodeEn === $scope.part[$scope.selectedRow].CodeLiv) {
			  $scope.livComment = false;
			  $scope.interLiv.Comentaires = selectedItem;
			}
		  }
  
		}
		else {
		  $scope.modalActive = false;
		  $scope.interLiv.Comentaires = selectedItem;
		  if (selectedItem && selectedItem != "") {
			$scope.livComment = true;
			if ($scope.part[$scope.selectedRow].CodeEn === $scope.part[$scope.selectedRow].CodeLiv) {
			  $scope.enComment = true;
			  $scope.interEn.Commentaires = selectedItem;
			}
		  }
		  else {
			$scope.livComment = false;
			if ($scope.part[$scope.selectedRow].CodeEn === $scope.part[$scope.selectedRow].CodeLiv) {
			  $scope.enComment = false;
			  $scope.interEn.Commentaires = selectedItem;
			}
		  }
		}
  
	  }, function () {
		$scope.modalActive = false;
	  });
	};
  
	$scope.saveEn = function () {
	  var enl = {
		CodeInter: $scope.En.CodeEn,
		Nom: $scope.En.NomEn,
		Adresse: $scope.En.AdrEn,
		AdresseComp: $scope.En.CompAdrEn,
		CodePays: $scope.En.CodePays,
		CodePostal: $scope.En.Cp,
		Ville: $scope.En.Ville,
		Coordinates: $scope.En.Coordinates,
		Tel: $scope.En.Tel,
		Fax: $scope.En.Fax
	  }
	  io.socket.get('/Intervenant/updateInter/', enl, function (message) {
		$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Intervenant mis à jour.<br>Les informations de l'intervant <b class='toUpperCase'>" + $scope.En.CodeEn + "</b> ont bien été mise à jour.");
	  });
	};
  
	$scope.mailInter = function (type) {
	  var mail = [];
	  var item = $scope.part[$scope.selectedRow];
	  if (type == 'En')
		item.interEn = $scope.interEn;
	  else
		item.interLiv = $scope.interLiv;
  
	  mail.push(item);
  
	  $scope.hotInstance.deselectCell();
	  mailService.modalMail(mail, type).result.then(function (selectedItem) {
		$scope.modalActive = false;
		$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
	  }, function () {
		$scope.modalActive = false;
		$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
	  });
	};
  
	$scope.smsInter = function (type) {
	  var sms = [];
	  var item = $scope.part[$scope.selectedRow];
	  if (type == 'En')
		item.theData = $scope.interEn;
	  else
		item.theData = $scope.interLiv;
  
	  sms.push(item);
  
	  $scope.hotInstance.deselectCell();
	  phoneService.ModalSms(sms, type).result.then(function (selectedItem) {
		$scope.modalActive = false;
		$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
	  }, function () {
		$scope.modalActive = false;
		$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
	  });
	};
  
	$scope.showFaAff = function () {
	  $scope.modalActive = true;
	  var aff = {
		CodeAff: $scope.Af.CodeAff,
		Nom: $scope.Af.Nom,
		Adresse: $scope.Af.Adr,
		Cp: $scope.Af.Cp,
		CodePays: $scope.Af.Pays,
		Ville: $scope.Af.Ville,
		Tel: $scope.Af.Tel,
		Fax: $scope.Af.Fax
	  }
  
	  facAService.modalListFaA(aff).result.then(function (selectedItem) {
		$scope.modalActive = false;
  
	  }, function () {
		$scope.modalActive = false;
	  });
  
	};
  
	$scope.showFaCli = function () {
	  $scope.modalActive = true;
	  var cli = {
		CodeClient: $scope.Cli.CodeClient,
		Nom: $scope.Cli.Nom,
		Adresse: $scope.Cli.Adr,
		AdresseComp: $scope.Cli.CompAdrCli,
		Cp: $scope.Cli.Cp,
		CodePays: $scope.Cli.Pays,
		Ville: $scope.Cli.Ville,
		Tel: $scope.Cli.Tel,
		Fax: $scope.Cli.Fax
	  }
  
	  facVService.modalListFaV(cli).result.then(function (selectedItem) {
		$scope.modalActive = false;
  
	  }, function () {
		$scope.modalActive = false;
	  });
  
	};
  
	$scope.mailCli = function () {
	  $scope.hotInstance.deselectCell();
  
	  var row = $scope.selectedRow;
	  var dateEn = moment($scope.selectedRow["DateEn"]).format($rootScope.formatDateM);
	  var id = $scope.selectedRow.id;
	  var dateLiv = moment($scope.selectedRow["DateLiv"]).format($rootScope.formatDateM);
  
	  var enl = {
		CodeInter: $scope.En.CodeEn,
		Nom: $scope.En.NomEn,
		Adresse: $scope.En.AdrEn,
		AdresseComp: $scope.En.CompAdrEn,
		Cp: $scope.En.Cp,
		CodePays: $scope.En.CodePays,
		Ville: $scope.En.Ville,
		Tel: $scope.En.Tel,
		Fax: $scope.En.Fax,
		date: dateEn,
		id: id,
		By: $scope.username
	  }
  
	  var liv = {
		CodeInter: $scope.Liv.CodeLiv,
		Nom: $scope.Liv.NomLiv,
		Adresse: $scope.Liv.AdrLiv,
		AdresseComp: $scope.Liv.CompAdrLiv,
		Cp: $scope.Liv.Cp,
		CodePays: $scope.Liv.CodePays,
		Ville: $scope.Liv.Ville,
		Tel: $scope.Liv.Tel,
		Fax: $scope.Liv.Fax,
		date: dateLiv
	  }
  
	  var cmd = {
		Colis: $scope.selectedRow["Colis"],
		Poids: $scope.selectedRow["Poids"],
		MetreLin: $scope.selectedRow["MetreLin"],
		MetreCube: $scope.selectedRow["MetreCube"],
		Palettes: $scope.selectedRow["Palettes"]
	  }
  
	  $http.get('Clients?CodeClient=' + $scope.Cli.CodeClient).then(function (resultCLi) {
		var cli = {
		  id: resultCLi.data[0].id,
		  CodeClient: $scope.Cli.CodeClient,
		  Nom: $scope.Cli.Nom,
		  Adresse: $scope.Cli.Adr,
		  // AdresseComp: $scope.Cli.CompAdrCli,
		  Cp: $scope.Cli.Cp,
		  CodePays: $scope.Cli.Pays,
		  Ville: $scope.Cli.Ville,
		  Tel: $scope.Cli.Tel,
		  Fax: $scope.Cli.Fax
		}
  
		var mail = [];
		mail.push($scope.part[$scope.selectedRow]);
		mail.push(enl);
		mail.push(liv);
		mail.push(cmd);
		mail.push(cli);
  
		if ($scope.modalActive == true) { return; }
		$scope.modalActive = true;
  
		mailService.modalMail(mail, "Cli").result.then(function (selectedItem) {
		  $scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
		  $scope.modalActive = false;
		}, function () {
		  $scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
		  $scope.modalActive = false;
		});
	  })
  
	};
  
	$scope.mailAff = function () {
	  if ($scope.modalActive == true) { return; }
	  $scope.modalActive = true;
  
	  $scope.modalActive = true;
  
	  var mail = [];
	  var item = $scope.part[$scope.selectedRow];
	  $http.get('/Affretes?CodeAffrete=' + item.CodeAff).then(function (response) {
		item.Aff = response.data[0];
		mail.push(item);
  
		$scope.hotInstance.deselectCell();
		mailService.modalMail(mail, 'Aff').result.then(function (selectedItem) {
		  $scope.modalActive = false;
		  $scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
		}, function () {
		  $scope.modalActive = false;
		  $scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
		});
	  });
  
	};
  
	$scope.factureA = function () {
	  var hot = hotRegisterer.getInstance('myTable');
	  var selection = $scope.hotInstance.getSelected();
	  var row = selection[0],
		lastRow = selection[2],
		ids = [];
	  var numDossier = [];
	  var Aff = $scope.part[row]["CodeAff"];
	  if (Aff === "" || typeof Aff == 'undefined') {
		$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Facturation Affrété.<br>Aucun Affrété selectionné pour la commande N° " + $scope.part[row]['id']);
		return;
	  }
  
	  var Affrete = $scope.Af;
	  var montant = 0;
	  var tva = 0;
	  var tab = [];
  
	  if (row > lastRow) {
		for (i = lastRow; i <= row; i++) {
		  if ($scope.part[i].FactAffr !== '' && typeof $scope.part[i].FactAffr !== 'undefined' && $scope.part[i].FactAffr !== null) {
			$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Facturation Affrété.<br>Une ou plusieurs commandes sont déjà facturées! Veuillez vérifier votre sélection." + $scope.part[row]["id"]);
			return false;
		  }
  
		  if ($scope.part[i].CodeAff !== Aff || Aff === '' || typeof Aff == 'undefined' || $scope.part[i].CodeAff === '' || typeof $scope.part[i].CodeAff == 'undefined') {
			$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Facturation Affrété.<br>plusieurs affrétés ne peuvent avoir la meme facture! Veuillez vérifier votre selection." + $scope.part[row]["id"]);
			return false;
		  }
  
		  ids.push($scope.part[i].id);
		  numDossier.push($scope.part[i].NumDossier);
		  montant = montant + parseInt($scope.part[i].MontantA);
		  tva = tva + (parseInt($scope.part[i].MontantA) * parseInt($scope.part[i].MontantTVA)) / 100;
		  tab.push({ Dossier: $scope.part[i].NumDossier, CpEn: $scope.part[i].CpEN, PaysEn: $scope.part[i].PaysEn, CpLiv: $scope.part[i].CpLiv, PaysLiv: $scope.part[i].PaysLiv, Colis: $scope.part[i].Colis, Pal: $scope.part[i].Palettes, MetreLin: $scope.part[i].MetreLin, MetreCube: $scope.part[i].MetreCube, Montant: $scope.part[i].MontantA, tva: $scope.part[i].MontantTVA, ttc: parseInt($scope.part[i].MontantA) + parseInt($scope.part[i].MontantA) * parseInt($scope.part[i].MontantTVA) / 100 });
		}
	  } else {
		for (i = row; i <= lastRow; i++) {
  
		  if ($scope.part[i].FactAffr !== '' && typeof $scope.part[i].FactAffr !== 'undefined' && $scope.part[i].FactAffr !== null) {
			$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Facturation Affrété.<br>Une ou plusieurs commandes sont déjà facturées! Veuillez vérifier votre sélection." + $scope.part[row]["id"]);
			return false;
		  }
		  if ($scope.part[i].CodeAff !== Aff || Aff === '' || typeof Aff == 'undefined' || $scope.part[i].CodeAff === '' || typeof $scope.part[i].CodeAff == 'undefined') {
			$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Facturation Affrété.<br>plusieurs affrétés ne peuvent avoir la meme facture! Veuillez vérifier votre selection." + $scope.part[row]["id"]);
			return false;
		  }
		  ids.push($scope.part[i].id);
		  numDossier.push($scope.part[i].NumDossier);
		  montant = montant + parseInt($scope.part[i].MontantA);
		  tva = tva + (parseInt($scope.part[i].MontantA) * parseInt($scope.part[i].MontantTVA)) / 100;
		  tab.push({ Dossier: $scope.part[i].NumDossier, CpEn: $scope.part[i].CpEN, PaysEn: $scope.part[i].PaysEn, CpLiv: $scope.part[i].CpLiv, PaysLiv: $scope.part[i].PaysLiv, Colis: $scope.part[i].Colis, Pal: $scope.part[i].Palettes, MetreLin: $scope.part[i].MetreLin, MetreCube: $scope.part[i].MetreCube, Montant: $scope.part[i].MontantA, tva: $scope.part[i].MontantTVA, ttc: parseInt($scope.part[i].MontantA) + parseInt($scope.part[i].MontantA) * parseInt($scope.part[i].MontantTVA) / 100 });
		}
	  }
  
	  var montantTTC = tva + montant;
	  var client = $scope.part[row]["NomClient"];
  
	  var modalInstance = $uibModal.open({
		templateUrl: 'ModalFactureA',
		controller: 'ModalFactureAController',
		size: "lg",
		backdrop: 'static',
		resolve: {
		  items: function () {
			return tab;
		  },
		  username: function () {
			return $scope.username;
		  },
		  client: function () {
			return Aff;
		  },
		  ids: function () {
			return ids;
		  },
		  montant: function () {
			return montant;
		  },
		  tva: function () {
			return tva;
		  },
		  ttc: function () {
			return montantTTC;
		  },
		  Aff: function () {
			return Affrete;
		  }
		},
	  });
  
	  modalInstance.result.then(function ($item) {
		if (row > lastRow) {
		  for (i = lastRow; i <= row; i++) {
			$scope.part[i]["FactAffr"] = $item;
			updateCmd(i);
		  }
		}
		else {
		  for (i = row; i <= lastRow; i++) {
			$scope.part[i]["FactAffr"] = $item;
			updateCmd(i);
		  }
		}
  
		return;
	  }, function () {
  
	  });
	}
  
	$scope.factureC = function () {
	  var instance = hotRegisterer.getInstance('myTable');
	  var selection = instance.getSelected();
	  var row = selection[0];
	  lastRow = selection[2],
		ids = [];
	  var numDossier = [];
	  var realRow = row;
	  var Cli = $scope.part[realRow]["CodeClient"];
	  if (Cli === "" || typeof Cli == 'undefined') {
		$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Facturation Client.<br>Aucun Client selectionné pour la commande N° " + $scope.part[realRow]["id"]);
		return false;
	  }
	  var Aff = $scope.Cli;
	  var montant = 0;
	  var tva = 0;
	  var tab = [];
  
	  if (row > lastRow) {
		for (i = lastRow; i <= row; i++) {
  
		  var realRow = i;
  
		  if ($scope.part[realRow].FactCli !== '' && typeof $scope.part[realRow].FactCli !== 'undefined' && $scope.part[realRow].FactCli !== null) {
			$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Facturation Client.<br>e ou plusieurs commandes sont déjà facturées! Veuillez vérifier votre sélection. Dossier N° :" + $scope.part[realRow]["NumDossier"]);
			return false
		  }
  
		  if ($scope.part[realRow].CodeClient !== Cli || Cli === '' || typeof Cli == 'undefined' || $scope.part[realRow].CodeClient === '' || typeof $scope.part[realRow].CodeClient == 'undefined') {
			$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Facturation Client.<br>Plusieurs Clients ne peuvent avoir la meme facture! Veuillez vérifier votre selection. Dossier N° :" + $scope.part[realRow]["NumDossier"]);
			return false
		  }
		  if ($scope.part[realRow].CodeTVA === '' || typeof $scope.part[realRow].CodeTVA == 'undefined') {
			$scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "La TVA doit être renseignée pour facturer un client. Dossier N° :" + $scope.part[realRow]["NumDossier"]);
			return false
		  }
  
		  ids.push($scope.part[realRow].id);
		  numDossier.push($scope.part[realRow].NumDossier);
		  montant = montant + parseFloat($scope.part[realRow].MontantV);
		  tva = tva + (parseFloat($scope.part[realRow].MontantV) * parseFloat($scope.part[realRow].MontantTVA)) / 100;
		  var ttc = parseFloat($scope.part[realRow].MontantV) + parseFloat($scope.part[realRow].MontantV) * parseFloat($scope.part[realRow].MontantTVA) / 100;
		  ttc = ttc.toFixed(2);
		  var ht = parseFloat($scope.part[realRow].MontantV);
		  ht = ht.toFixed(2);
		  tab.push({ Dossier: $scope.part[realRow].NumDossier, CpEn: $scope.part[realRow].CpEN, PaysEn: $scope.part[realRow].PaysEn, CpLiv: $scope.part[realRow].CpLiv, PaysLiv: $scope.part[realRow].PaysLiv, Colis: $scope.part[realRow].Colis, Pal: $scope.part[realRow].Palettes, MetreLin: $scope.part[realRow].MetreLin, MetreCube: $scope.part[realRow].MetreCube, Montant: ht, tva: $scope.part[realRow].CodeTVA, ttc: ttc });
		}
	  } else {
		for (i = row; i <= lastRow; i++) {
  
		  var realRow = i;
  
		  if ($scope.part[realRow].FactCli !== '' && typeof $scope.part[realRow].FactCli !== 'undefined' && $scope.part[realRow].FactCli !== null) {
			$alert({ title: 'Facturation Client', content: '<br>Une ou plusieurs commandes sont déjà facturées! Veuillez vérifier votre sélection.<br/>Dossier N° :' + $scope.part[realRow]["NumDossier"], alertType: 'danger', clearExists: false, duration: null, autoDestroy: true, placement: 'center', effect: 'fall' });
			return false
		  }
  
		  if ($scope.part[realRow].StatutCmd !== 'VALIDÉ') {
			$alert({ title: 'Facturation Client', content: '<br>Une ou plusieurs commandes ne sont pas validées !<br/>Veuillez vérifier votre sélection.<br/>Dossier N° :' + $scope.part[realRow]["NumDossier"], alertType: 'danger', clearExists: false, duration: null, autoDestroy: true, placement: 'center', effect: 'fall' });
			return false
		  }
  
		  if ($scope.part[realRow].CodeClient !== Cli || Cli === '' || typeof Cli == 'undefined' || $scope.part[realRow].CodeClient === '' || typeof $scope.part[realRow].CodeClient == 'undefined') {
			$alert({ title: 'Facturation Client', content: '<br>Plusieurs Clients ne peuvent avoir la meme facture! Veuillez vérifier votre selection.<br/>Dossier N° :' + $scope.part[realRow]["NumDossier"], alertType: 'danger', clearExists: false, duration: null, autoDestroy: true, placement: 'center', effect: 'fall' });
			return false
		  }
  
		  if ($scope.part[realRow].CodeTVA === '' || typeof $scope.part[realRow].CodeTVA == 'undefined') {
			$alert({ title: 'Facturation Client', content: '<br>La TVA doit être renseignée pour facturer un client. Dossier N° :' + $scope.part[realRow]["NumDossier"], alertType: 'danger', clearExists: false, duration: null, autoDestroy: true, placement: 'center', effect: 'fall' });
			return false
		  }
		  ids.push($scope.part[realRow].id);
		  numDossier.push($scope.part[realRow].NumDossier);
		  montant = montant + parseFloat($scope.part[realRow].MontantV);
		  tva = tva + (parseFloat($scope.part[realRow].MontantV) * parseFloat($scope.part[realRow].MontantTVA)) / 100;
		  var ttc = parseFloat($scope.part[realRow].MontantV) + parseFloat($scope.part[realRow].MontantV) * parseFloat($scope.part[realRow].MontantTVA) / 100;
		  ttc = ttc.toFixed(2);
		  var ht = parseFloat($scope.part[realRow].MontantV);
		  ht = ht.toFixed(2);
		  tab.push({ Dossier: $scope.part[realRow].NumDossier, CpEn: $scope.part[realRow].CpEN, PaysEn: $scope.part[realRow].PaysEn, CpLiv: $scope.part[realRow].CpLiv, PaysLiv: $scope.part[realRow].PaysLiv, Colis: $scope.part[realRow].Colis, Pal: $scope.part[realRow].Palettes, MetreLin: $scope.part[realRow].MetreLin, MetreCube: $scope.part[realRow].MetreCube, Montant: ht, tva: $scope.part[realRow].CodeTVA, ttc: ttc });
		}
	  }
  
	  var montantTTC = tva + montant;
	  montantTTC = parseFloat(montantTTC).toFixed(2);
	  tva = tva.toFixed(2);
	  montant = montant.toFixed(2);
	  var client = $scope.part[row]["NomClient"];
  
	  var modalInstance = $uibModal.open({
		templateUrl: 'ModalFactureC',
		controller: 'ModalFactureCController',
		size: "lg",
		backdrop: 'static',
		resolve: {
		  items: function () {
			return tab;
		  },
		  username: function () {
			return $scope.username;
		  },
		  client: function () {
			return Cli;
		  },
		  ids: function () {
			return ids;
		  },
		  montant: function () {
			return montant;
		  },
		  tva: function () {
			return tva;
		  },
		  ttc: function () {
			return montantTTC;
		  },
		  Aff: function () {
			return Aff;
		  }
		},
	  });
  
	  modalInstance.result.then(function ($item) {
		if (row > lastRow) {
		  for (i = lastRow; i <= row; i++) {
			$scope.part[i]["FactCli"] = $item.NumFact;
			$scope.part[i]["FactCliCol"] = $item.id;
			$scope.part[i]["StatutCli"] = "F";
			updateCmd(i);
		  }
		} else {
		  for (i = row; i <= lastRow; i++) {
			$scope.part[i]["FactCli"] = $item.NumFact;
			$scope.part[i]["FactCliCol"] = $item.id;
			$scope.part[i]["StatutCli"] = "F";
			updateCmd(i);
		  }
		}
		return;
	  }, function () {
  
	  });
	};
  
	$scope.annuleCmd = function () {
	  if (allIdSelec.length === 0) {
		return $scope.newAlert('warning', '<i class="fa fa-exclamation"></i>', "Aucune commande séléctionnée!");
	  }
	  $scope.hotInstance.deselectCell();
	  var confirm = $mdDialog.confirm()
		.title("Annulée le dossier N°" + $scope.part[$scope.selectedRow].NumDossier + " ?")
		.textContent("Confirmer l'annulation du dossier")
		.ariaLabel('Annuler Dossier')
		.ok('Non')
		.cancel('Annuler le Dossier');
	  $mdDialog.show(confirm).then(function () {
		$scope.hotInstance.selectCell($scope.theSelectedL[0], $scope.theSelectedL[1], $scope.theSelectedL[0], $scope.theSelectedL[1], true);
	  }, function () {
		var id = $scope.part[$scope.selectedRow].id;
		var numDossier = $scope.part[$scope.selectedRow].NumDossier;
		$http.get('/Ordergrid/update/' + id + '?StatutCmd=Annulée').then(function (res) {
		  $scope.part.splice($scope.selectedRow, 1);
		  $scope.setCmd();
		  $scope.notifyAnulation(numDossier);
		})
	  });
	};
  
	$scope.notifyAnulation=function(numDossier){
		var data = {
			NumDossier: numDossier,
			
	  
		  };
		  $http.post('tournees/notifyUpdate', data).then(function (res) {
			  
			  console.log(res);
		  })
	}
	$scope.saveLiv = function () {
	  var liv = {
		CodeInter: $scope.Liv.CodeLiv,
		Nom: $scope.Liv.NomLiv,
		Adresse: $scope.Liv.AdrLiv,
		AdresseComp: $scope.Liv.CompAdrLiv,
		CodePays: $scope.Liv.CodePays,
		CodePostal: $scope.Liv.Cp,
		Ville: $scope.Liv.Ville,
		Coordinates: $scope.Liv.Coordinates,
		Tel: $scope.Liv.Tel,
		Fax: $scope.Liv.Fax
	  }
  
	  io.socket.get('/Intervenant/updateInter/', liv, function (message) {
		$scope.newAlert('success', '<i class="fa fa-exclamation"></i>', "Intervenant mis à jour !<br>Les informations de l'intervant <b class='toUpperCase'>" + $scope.Liv.CodeLiv + "</b> ont bien été mise à jour.");
	  }, function (message) {
	  });
	};
  
	function countryCellRenderer(params) {
	  if (params.value === "" || params.value === undefined || params.value === null) {
		return null;
	  } else {
		var lower = params.value.toLowerCase();
		var flag = "<div class='f16'><i class='flag " + lower + "'></i> " + params.value + "</div>";
		return flag;
	  }
	}
  
	function selectionChanged() {
	  $scope.setCmd($scope.gridOptions.selectedRows[0]);
	}
  
  $scope.openSlider=false;
  
	$scope.addCom = function (id) {
	  if ($scope.Com.Exploit == null || typeof $scope.Com.Exploit == 'undefined' || $scope.Com.Exploit == '') {
		$scope.Com.Exploit = $scope.btnCmplt[id].Com;
	  } else
		$scope.Com.Exploit = $scope.Com.Exploit + '\n' + $scope.btnCmplt[id].Com;
  
	  $scope.modifDetCmd('ComExploit', $scope.Com.Exploit + '\n');
	};
  

	$scope.valueSlider1=[];
	$scope.valueSlider2=[];

	
	$scope.updatePalAnn = function() {
		console.log("annnn");
		console.log($scope.part[$scope.selectedRow].palAnn);
        var data = {
            palAnn: $scope.part[$scope.selectedRow].palAnn,
            id:  $scope.part[$scope.selectedRow].id
        };
        
        $http.post('/Ordergrid/updatePann/', data)
            .then(function(response) {
                // Succès de la requête
                console.log('Mise à jour réussie:', response.data);
            }, function(error) {
                // Échec de la requête
                console.error('Erreur lors de la mise à jour:', error);
            });
    };
	$scope.afficheReserve=false;
	$scope.note_en="Aucune Reserve";
	$scope.note_liv="Aucune Reserve";

	$scope.laisserAlert=function(){
	$scope.afficheReserve=false;

	}

	$scope.afficherReserves = function () {
	$scope.afficheReserve=true;


	if($scope.part[$scope.selectedRow].is_reserve==true){
			if($scope.part[$scope.selectedRow].note_en!=null){
				$scope.note_en=$scope.part[$scope.selectedRow].note_en;
			}

			if($scope.part[$scope.selectedRow].note_liv!=null){
				$scope.note_liv=$scope.part[$scope.selectedRow].note_liv;
			}
		
	}


		
	}
	 $scope.triggerFileSelect = function() {
        document.getElementById('fileInput').click();
    };



    // Fonction pour traiter le fichier sélectionné
	$scope.handleFileSelect = function() {
		var fileInput = document.getElementById('fileInput');
		var file = fileInput.files[0];
	
		if (!file) return;
	
		// Afficher l'indicateur de chargement
		Swal.fire({
			title: 'Chargement...',
			text: 'Veuillez patienter pendant le traitement du fichier.',
			didOpen: () => {
				Swal.showLoading();
			}
		});
	
		var formData = new FormData();
		formData.append('file', file);
	
		$http.post('tournees/uploadAndProcessExcel', formData, {
			headers: {
				'Content-Type': undefined // Let the browser set the content type
			},
			transformRequest: angular.identity
		})
		.then(function(response) {
			Swal.fire({
				icon: 'success',
				title: 'Succès',
				text: 'Le fichier a été traité avec succès.',
			});
	$scope.search(1, 1);

			console.log('Success:', response.data);
		})
		.catch(function(error) {

	$scope.search(1, 1);

			Swal.fire({
				icon: 'error',
				title: 'Erreur',
				text: 'Une erreur s\'est produite lors du traitement du fichier.',
			});
			console.error('Error:', error);
		})
		.finally(function() {
			// Masquer l'indicateur de chargement, si nécessaire
			Swal.close();
		});
	};
	

	$scope.downloadOrderSummary = function(userId) {
		const apiUrl = `/tournees/downloadSummaryPdf`;
	
		$http.post(apiUrl, {}, { responseType: 'blob' })
		  .then(function(response) {
			const blob = new Blob([response.data], { type: 'application/pdf' });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `orders_summary_${userId}.pdf`;
			a.click();
			window.URL.revokeObjectURL(url);
		  })
		  .catch(function(error) {
			console.error('Error downloading PDF:', error);
		  });
	  };

	  $scope.metJour = function() {
		console.log("mets jour");
		console.log($scope.allIdSelecDist);
	
		// Extraire les NumDossier depuis les items où DateEn est null
		var numDossiers = $scope.allIdSelecDist
			.filter(function(item) {
				return item.DateEn === null; // Filtrer seulement ceux avec DateEn null
			})
			.map(function(item) {
				return item.NumDossier;
			});
	
		// Vérifier si aucun dossier n'a été sélectionné
		if (numDossiers.length === 0) {
			Swal.fire({
				icon: 'info',
				title: 'Aucune mise à jour',
				text: 'Aucune commande avec une date vide n’a été trouvée.',
			});
			return; // Arrêter l'exécution si aucun dossier éligible
		}
	
		// Obtenir la date actuelle et formater pour T00:00:00Z
		var now = new Date();
		now.setHours(0, 0, 0, 0); // Réinitialiser l'heure à 00:00:00
		var currentDateISO = now.toISOString().split("T")[0]; // Convertir en format ISO
	
		// Préparer les données pour la requête POST
		var data = {
			numDossiers: numDossiers,
			date: currentDateISO
		};
	
		// Envoyer la requête POST pour mettre à jour ordergrid
		$http.post('/tournees/updateDate', data)
			.then(function(response) {
				// Traitement en cas de succès
				Swal.fire({
					icon: 'success',
					title: 'Succès',
					text: 'Les dates ont été mises à jour avec succès.',
				});
				console.log('Success:', response.data);
				$scope.search(1, 1);
			})
			.catch(function(error) {
				// Traitement en cas d'erreur
				Swal.fire({
					icon: 'error',
					title: 'Erreur',
					text: 'Une erreur est survenue lors de la mise à jour des dates.',
				});
				console.error('Error:', error);
			});
	};
	

	function initializeAutocomplete() {
        var input = document.getElementById('autoComplete2');
        var autocomplete = new google.maps.places.Autocomplete(input, {
            types: ['geocode'] // Vous pouvez limiter le type d'autocomplétion ici
        });

        // Écouter l'événement place_changed lorsque l'utilisateur sélectionne une adresse
        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();

            if (place.geometry) {
                // Mise à jour des coordonnées
                $scope.Liv.Lat = place.geometry.location.lat();
                $scope.Liv.Lng = place.geometry.location.lng();
                
           
                $scope.Liv.Ville = '';
                $scope.Liv.Cp = '';
                $scope.Liv.CodePays = '';
                $scope.Liv.AdrLiv = input.value;
				let streetAddress = '';

                // Parcours des composants de l'adresse pour trouver les informations souhaitées
                place.address_components.forEach(function(component) {
                    var types = component.types;

                    if (types.indexOf('locality') !== -1) {
                        $scope.Liv.Ville = component.long_name;
                    }
                    if (types.indexOf('postal_code') !== -1) {
                        $scope.Liv.Cp = component.long_name;
                    }
                    if (types.indexOf('country') !== -1) {
                        $scope.Liv.CodePays = component.short_name;
                    }
					if (types.indexOf('route') !== -1 || types.indexOf('street_number') !== -1) {
						streetAddress += (streetAddress ? ' ' : '') + component.long_name;
					}
                });
				console.log('selected row:', $scope.part[$scope.selectedRow]);
				console.log('Adresse complète:', place.formatted_address);
                console.log('Latitude:', $scope.Liv.Lat);
                console.log('Longitude:', $scope.Liv.Lng);
                console.log('Code Postal:', $scope.Liv.Cp);
                console.log('Ville:', $scope.Liv.Ville);
				$scope.Liv.AdrLiv=place.name;

				$scope.part[$scope.selectedRow].AdrLiv= place.name;
				$scope.part[$scope.selectedRow].CpLiv=$scope.Liv.Cp;
				$scope.part[$scope.selectedRow].VilleLiv=$scope.Liv.Ville;
				$scope.part[$scope.selectedRow].CoordinatesLiv=[$scope.Liv.Lng,$scope.Liv.Lat ];
				updateCmd($scope.selectedRow,"DateLiv");

					


                $scope.$apply(); // Appliquer les changements dans le scope AngularJS
            }
        });
    }

	function initializeAutocomplete2() {
        var input = document.getElementById('autoComplete3');
        var autocomplete = new google.maps.places.Autocomplete(input, {
            types: ['geocode'] // Vous pouvez limiter le type d'autocomplétion ici
        });

        // Écouter l'événement place_changed lorsque l'utilisateur sélectionne une adresse
        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();

            if (place.geometry) {
                // Mise à jour des coordonnées
                $scope.En.Lat = place.geometry.location.lat();
                $scope.En.Lng = place.geometry.location.lng();
            
                $scope.En.Ville = '';
                $scope.En.Cp = '';
                $scope.En.CodePays = '';
                $scope.En.AdrLiv = input.value;
				let streetAddress = '';
                // Parcours des composants de l'adresse pour trouver les informations souhaitées
                place.address_components.forEach(function(component) {
                    var types = component.types;

                    if (types.indexOf('locality') !== -1) {
                        $scope.En.Ville = component.long_name;
                    }
                    if (types.indexOf('postal_code') !== -1) {
                        $scope.En.Cp = component.long_name;
                    }
                    if (types.indexOf('country') !== -1) {
                        $scope.En.CodePays = component.short_name;
                    }
					if (types.indexOf('route') !== -1 || types.indexOf('street_number') !== -1) {
						streetAddress += (streetAddress ? ' ' : '') + component.long_name;
					}
                });
				$scope.En.AdrEn=place.name;
				console.log('selected row:', $scope.part[$scope.selectedRow]);
				console.log('Adresse complète:', place.formatted_address);
				console.log('Adresse name:', place.name);
                console.log('Latitude:', $scope.En.Lat);
                console.log('Longitude:', $scope.En.Lng);
                console.log('Code Postal:', $scope.En.Cp);
                console.log('Ville:', $scope.En.Ville);

				$scope.part[$scope.selectedRow].AdrEn= place.name;
				$scope.part[$scope.selectedRow].CpEN=$scope.En.Cp;
				$scope.part[$scope.selectedRow].VilleEn=$scope.En.Ville;
				$scope.part[$scope.selectedRow].CoordinatesEn=[$scope.En.Lng,$scope.En.Lat ];
					  updateCmd($scope.selectedRow,"DateEn");

					


                $scope.$apply(); // Appliquer les changements dans le scope AngularJS
            }
        });
    }

    // Initialiser l'autocomplétion après le chargement de la vue
    initializeAutocomplete();
    initializeAutocomplete2();

	$scope.selectedTab="chauffeur";
	$scope.selectTab = function(tab) {
        $scope.selectedTab = tab;
    };

	$scope.isPhotoModalVisible = false;
    $scope.isPlanModalVisible = false;

    $scope.showPhotoModal = function() {
        $scope.isPhotoModalVisible = true;
    };

    $scope.closePhotoModal = function() {
        $scope.isPhotoModalVisible = false;
    };

    $scope.showPlanModal = function() {
        $scope.isPlanModalVisible = true;

		if($scope.part[$scope.selectedRow].etage)
        $scope.drawPlan();
    };

    $scope.closePlanModal = function() {
        $scope.isPlanModalVisible = false;
		
    };
	$scope.drawPlan = function() {
		var canvas = document.getElementById('planCanvas');
		var ctx = canvas.getContext('2d');
		var img = new Image();
		var imgSrc;
	
		if ($scope.part[$scope.selectedRow].etage === "RDC") {
			imgSrc = 'images/plan1.jpeg';
		} else if ($scope.part[$scope.selectedRow].etage === "1ER") {
			imgSrc = 'images/plan2.jpeg';
		} else {
			imgSrc = 'images/plan3.jpeg';
		}
	
		img.src = imgSrc;
		img.onload = function() {
			// Set canvas dimensions to match the image dimensions
			canvas.width = 600;
			canvas.height = 300;
	
			// Draw the image on the canvas
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	
			// Example coordinates to overlay (normalized to canvas size)
			var coordinates = [
				{x: $scope.part[$scope.selectedRow].cordinateX * canvas.width+50, y: $scope.part[$scope.selectedRow].cordinateY * canvas.height},
			];
	
			// Draw coordinates on the canvas
			ctx.fillStyle = 'red';
			ctx.font = '20px Arial';
			coordinates.forEach(function(coord) {
				ctx.beginPath();
				ctx.arc(coord.x, coord.y, 5, 0, 2 * Math.PI); // Draw a point
				ctx.fill();
				ctx.fillText(`(${coord.x}, ${coord.y})`, coord.x + 10, coord.y); // Draw text
			});
		};
	};

	$scope.isModalOpen = false;


	$scope.infos=[];
	$scope.selectedDoc=0;
    // Fonction pour afficher le modal
    $scope.showinfos = function() {
        $scope.isModalOpen = true;
	$scope.infos=$scope.part[$scope.selectedRow].commande_file.split('|');
	$scope.selectedDoc=$scope.part[$scope.selectedRow].NumDossier;
	$scope.fetchStatuses($scope.part[$scope.selectedRow].NumDossier);

    };


	$scope.isModalOpen = false;
	$scope.initialTables=function(){
		$scope.arrivage = [
			{ code1: 'AAR', code2: 'AVA', description: 'Arrivage - Avarie' },
			{ code1: 'AAR', code2: 'CEX', description: 'Arrivage - Colis en excédent' },
			{ code1: 'AAR', code2: 'CFM', description: 'Arrivage - Prise en charge ou arrivage conforme' },
			{ code1: 'AAR', code2: 'DDT', description: 'Arrivage - Dédouané' },
			{ code1: 'AAR', code2: 'DOC', description: 'Arrivage - Absence de document' },
			{ code1: 'AAR', code2: 'DVY', description: 'Arrivage - Dévoyé' },
			{ code1: 'AAR', code2: 'MQP', description: 'Arrivage - Colis manquant partiel' },
			{ code1: 'AAR', code2: 'MQT', description: 'Arrivage - Colis manquant total' },
			{ code1: 'AAR', code2: 'NCF', description: 'Arrivage - Non conforme' },
			{ code1: 'AAR', code2: 'OUV', description: 'Arrivage - Colis ouvert' },
			{ code1: 'AAR', code2: 'PIC', description: 'Arrivage - Photo jointe' },
			{ code1: 'AAR', code2: 'PNT', description: 'Arrivage - Pointage automatisé (état non décrit)' },
			{ code1: 'AAR', code2: 'PVE', description: 'Arrivage - Poids visiblement erroné' },
			{ code1: 'AAR', code2: 'RCA', description: 'Arrivage - Réserves pour avaries caractérisées' },
			{ code1: 'AAR', code2: 'RGT', description: 'Arrivage - Régularisation de manquant' },
			{ code1: 'AAR', code2: 'RMA', description: 'Arrivage - Réserves pour manquant et avarie' },
			{ code1: 'AAR', code2: 'TAR', description: 'Arrivage - Prise en charge ou arrivage tardif' },
			{ code1: 'AAR', code2: 'VVE', description: 'Arrivage - Volume visiblement erroné' }
		  ];
		
		  // Statuts Restant à Quai
		  $scope.quai = [
			{ code1: 'RST', code2: 'AVA', description: 'Restant à quai - Avarie' },
			{ code1: 'RST', code2: 'BRT', description: 'Restant à quai - Bureau restant' },
			{ code1: 'RST', code2: 'CAD', description: 'Restant à quai - Complément adresse' },
			{ code1: 'RST', code2: 'CEX', description: 'Restant à quai - Colis en excédent' },
			{ code1: 'RST', code2: 'DAF', description: 'Restant à quai - Destinataire fermé ou absent' },
			{ code1: 'RST', code2: 'DDC', description: 'Restant à quai - Dédouanement en cours' },
			{ code1: 'RST', code2: 'DDR', description: 'Restant à quai - Dédouanement refusé' },
			{ code1: 'RST', code2: 'DIL', description: 'Restant à quai - Date impérative de livraison' },
			{ code1: 'RST', code2: 'DLP', description: 'Restant à quai - Date de livraison proposée au destinataire' },
			{ code1: 'RST', code2: 'DOC', description: 'Restant à quai - Document manquant' },
			{ code1: 'RST', code2: 'DVY', description: 'Restant à quai - Dévoyé' },
			{ code1: 'RST', code2: 'FCO', description: 'Restant à quai - Fermé pour congés ou inventaire' },
			{ code1: 'RST', code2: 'FHB', description: 'Restant à quai - Fermeture hebdomadaire' },
			{ code1: 'RST', code2: 'FMA', description: 'Restant à quai - Force majeure' },
			{ code1: 'RST', code2: 'GPO', description: 'Restant à quai - Problème avec la position géographique reçue' },
			{ code1: 'RST', code2: 'INT', description: 'Restant à quai - Intempéries' },
			{ code1: 'RST', code2: 'LDF', description: 'Restant à quai - Livraison à jour fixe' },
			{ code1: 'RST', code2: 'LPT', description: 'Restant à quai - Livraison prochaine tournée' },
			{ code1: 'RST', code2: 'MQP', description: 'Restant à quai - Colis manquant partiel' },
			{ code1: 'RST', code2: 'MQT', description: 'Restant à quai - Colis manquant total' },
			{ code1: 'RST', code2: 'NCG', description: 'Restant à quai - Non chargé' },
			{ code1: 'RST', code2: 'OUV', description: 'Restant à quai - Colis ouvert' },
			{ code1: 'RST', code2: 'PAM', description: 'Restant à quai - Panne mécanique' },
			{ code1: 'RST', code2: 'PIC', description: 'Restant à quai - Photo jointe' },
			{ code1: 'RST', code2: 'PNT', description: 'Restant à quai - Colis pointé(s)' },
			{ code1: 'RST', code2: 'PRE', description: 'Restant à quai - Destinataire avisé' },
			{ code1: 'RST', code2: 'PVI', description: 'Restant à quai - Attente d\'instructions (du destinataire)' },
			{ code1: 'RST', code2: 'RAP', description: 'Restant à quai - Rendez-vous à prendre' },
			{ code1: 'RST', code2: 'RCA', description: 'Restant à quai - Réserves pour avaries caractérisées' },
			{ code1: 'RST', code2: 'RMA', description: 'Restant à quai - Réserves pour manquant et avarie' },
			{ code1: 'RST', code2: 'TAR', description: 'Restant à quai - Prise en charge ou arrivage tardif' }
		  ];
		
		  // Statuts Mis en livraison
		  $scope.misenliv = [
			{ code1: 'MLV', code2: 'ARS', description: 'Mis en livraison - Arrivée du moyen de transport sur site' },
			{ code1: 'MLV', code2: 'CEX', description: 'Mis en livraison - Colis en excédent' },
			{ code1: 'MLV', code2: 'CFM', description: 'Mis en livraison - Expédition conforme' },
			{ code1: 'MLV', code2: 'DEB', description: 'Mis en livraison - Début de déchargement' },
			{ code1: 'MLV', code2: 'DOC', description: 'Mis en livraison - Documents manquants' },
			{ code1: 'MLV', code2: 'MQP', description: 'Mis en livraison - Colis manquant partiel' },
			{ code1: 'MLV', code2: 'PIC', description: 'Mis en livraison - Photo jointe' },
			{ code1: 'MLV', code2: 'PNT', description: 'Mis en livraison - Colis pointé(s)' },
			{ code1: 'MLV', code2: 'RCA', description: 'Mis en livraison - Réserves pour avaries caractérisées' },
			{ code1: 'MLV', code2: 'RMA', description: 'Mis en livraison - Réserves pour manquant et avarie' }
		  ];
	
		  // Statuts Livré
		  $scope.livree = [
			{ code1: 'LIV', code2: 'CFM', description: 'Livré - Expédition conforme' },
			{ code1: 'LIV', code2: 'DES', description: 'Livré - Départ du moyen de transport du site' },
			{ code1: 'LIV', code2: 'DIV', description: 'Livré - Réserves diverses' },
			{ code1: 'LIV', code2: 'DOC', description: 'Livré - Documents manquants' },
			{ code1: 'LIV', code2: 'FIN', description: 'Livré - Fin des opérations de déchargement' },
			{ code1: 'LIV', code2: 'MQP', description: 'Livré - Réserves pour colis manquant (partiel)' },
			{ code1: 'LIV', code2: 'NEM', description: 'Livré - Récépissé non émargé / non rendu' },
			{ code1: 'LIV', code2: 'RCA', description: 'Livré - Réserves pour avaries caractérisées' },
			{ code1: 'LIV', code2: 'RMA', description: 'Livré - Réserves pour manquant partiel et avarie' },
			{ code1: 'LIV', code2: 'RSY', description: 'Livré - Réserves systématiques' },
			{ code1: 'LIV', code2: 'SPO', description: 'Livré - Réserves spoliation' }
		  ];
	
		  // Statuts Preuve de livraison (POD)
		  $scope.pod = [
			  { code1: 'POD', code2: 'CFM', description: 'Preuve de livraison - Conforme' },
			{ code1: 'POD', code2: 'DSP', description: 'Preuve de livraison - Image disponible' },
			{ code1: 'POD', code2: 'MQT', description: 'Preuve de livraison - Image manquante' },
			{ code1: 'POD', code2: 'NID', description: 'Preuve de livraison - Non indexé' }
		  ];
	
	}
	$scope.getStatusColor = function (statusCode) {
		switch (statusCode) {
		  case 'COM-CFM':
			return 'status-green';
		  case 'AAR-AVA':
			return 'status-green';
		case 'AAR-CFM':
				return 'status-green';
		  case 'RST-AVA':
			return 'status-orange';
			case 'RST-TAR':
				return 'status-orange';
		  case 'MLV-ARS':
			return 'status-orange';
			 case 'MLV-CFM':
			return 'status-orange'
		  case 'LIV-CFM':
			return 'status-red';
		  default:
			return 'status-blue';
		}
	  };
	  

	$scope.initialTables();
	$scope.statusOrders=[];
    $scope.openModalStatus = function() {
	$scope.statusOrders=[];

		console.log("opennn modd");
		$scope.initialTables();
		const postData = { 
			num:$scope.part[$scope.selectedRow].NumDossier
		};
	
		$http.post('tournees/getStatus', postData)
			.then(function(response) {
				$scope.statusOrders=response.data.orders;
				

				
				console.log('Success:', response.data);
			})
		
        $scope.isModalOpen2 = true;
    };

	

$scope.isActive = function(prefix) {
  return $scope.part[$scope.selectedRow].dernier_status.startsWith(prefix);
};
	$scope.openModalStatuss = function() {
		console.log("opennn modd");
		$scope.initialTables();
		
        $scope.isModalOpen3 = true;
    };

    $scope.closeModal = function() {
        $scope.isModalOpen2 = false;
    };
	$scope.closeModal2 = function() {
        $scope.isModalOpen3 = false;
    };


	$scope.sendRequest = function(item) {
		$scope.isModalOpen2 = false;
		$scope.isModalOpen3 = false;

		const now = new Date(); // Obtenez la date et l'heure actuelles
		const date = now.toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
		const hour = now.toTimeString().split(' ')[0]; // Format 'HH:mm:ss'
	
		const postData = { 
			label: item.description, 
			status: item.code1 + "-" + item.code2,
			NumDossier:$scope.selectedDoc!=0?$scope.selectedDoc:  $scope.part[$scope.selectedRow].NumDossier,
			date: date,
			hour: hour 
		};
	
		$http.post('ordergrid/changestatus', postData)
			.then(function(response) {


				$scope.part[$scope.selectedRow]=response.data[0];

				$scope.part[$scope.selectedRow].DateEn=response.data[0].DateEn.split('T')[0];
				$scope.part[$scope.selectedRow].DateLiv=response.data[0].DateLiv.split('T')[0];
				$scope.fetchStatuses($scope.selectedDoc);

				
				console.log('Success:', response.data);
			})
			.catch(function(error) {
				console.error('Error:', error);
			});
	};

$scope.statuses = [];
$scope.getStatusIcon = function(status) {
    switch (status) {
        case 'Commande reçue':
            return 'fa-check';
        case 'En cours de traitement':
            return 'fa-cogs';
        case 'AAR':
            return 'fa-truck';
        case 'Livré':
            return 'fa-home';
        default:
            return 'fa-info-circle';
    }
};



$scope.fetchStatuses = function(numDossier) {
    $http.get('ordergrid/fetchStatus', { params: { NumDossier: numDossier } })
        .then(function(response) {
            const statuses = response.data;

            // Grouper les statuts par date
            const groupedStatuses = statuses.reduce((acc, status) => {
                const date = status.date; // Assurez-vous que 'status.date' est bien au format 'YYYY-MM-DD'
                
                if (!acc[date]) {
                    acc[date] = { date: date, entries: [] };
                }
                acc[date].entries.push(status);
                return acc;
            }, {});

            // Convertir l'objet en tableau pour ng-repeat
            $scope.statuses = Object.values(groupedStatuses);

			console.log(  $scope.statuses );
			
        })
        .catch(function(error) {
            console.error('Erreur lors de la récupération des statuts:', error);
        });
};


    // Fonction pour fermer le modal
    $scope.closeModal = function() {
        $scope.isModalOpen = false;
    };
	$scope.closeModall = function() {
        $scope.isModalOpen2 = false;
    };
	

	
  }]); 

