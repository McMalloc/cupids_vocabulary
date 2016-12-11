MAS.controller('grobplanController', ['$scope', 'ajax', '$filter', 'localization', '$q', 'cache', '$timeout', '$routeParams', 'fertiglager', 'preferences', 'stammdaten', 'excel', 'webwrapper', 'notification',
function ($scope, ajax, $filter, localization, $q, cache, $timeout, $routeParams, fertiglager, prefs, stammdaten, excel, webwrapper, notification) {

    $scope.enableEditing = $routeParams.edit === "true";

    $scope.drag = {};

    //$scope.isInWrapper = false;

    $scope.isInWrapper = webwrapper.isInWrapper;

    $scope.webWrapperTest = function () {

        //alert("teste WebWrapper");

        var programExecuterHelper = {
            programName: "ingres\\bin\\w4glrun.exe",
            //programName: "notepad.exe",  "%II_SYSTEM%\\
            args: " C:\\msp\\TAE\\Test\\Tae_Kontraktbearbeitung.img -dtaesys2::giess_test -cuebersicht_vk -Tyes"
            //args: " C:\\msp\\TAE\\Test\\Tae_adressen.img -dgiess_dev -Tyes"
        };

        var response = webwrapper.executeProgram(programExecuterHelper);

        if (response !== null) {
            if (response.WasSuccessful !== "1") {
                notification.show({
                    template: 'error',
                    message: $filter('translation')("WebWrapper.executeProgramm.Error")
                });
            }
        } else {
            notification.show({
                template: 'error',
                message: $filter('translation')("WebWrapper.executeProgramm.Error")
            });
        }

    };

    var filterChangedCallback = function (event, data) {
        if (data.value.length === 0) { // leeres Filter -> Filter entfernen
            console.log("filter entfernen!");

            doForEveryOfenGrid("removefilter", [data.datafield]);
            doForEveryPoolGrid("removefilter", [data.datafield]);
            $scope.auftraegeGridSettings.apply('removefilter', data.datafield);
        } else {
            console.log("filter!");
            var filtergroup = new $.jqx.filter();
            var filtervalue = data.value;
            var filtercondition = 'contains';
            var filter = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);
            var filter_or_operator = 1;
            filtergroup.addfilter(filter_or_operator, filter);

            $scope.auftraegeGridSettings.apply('addfilter', data.datafield, filtergroup);
            $scope.auftraegeGridSettings.apply('applyfilters');

            doForEveryOfenGrid("addfilter", [data.datafield, filtergroup]);
            doForEveryOfenGrid("applyfilter", []);
            doForEveryOfenGrid("render", []);
            doForEveryPoolGrid("addfilter", [data.datafield, filtergroup]);
            doForEveryPoolGrid("applyfilter", []);
            doForEveryPoolGrid("render", []);
        }
    };

    // debounce verhindert, dass der Callback zweimal ausgeführt wird, weil Angular zweimal das Event feuert
    $scope.$on("filterChanged", _.debounce(filterChangedCallback, 500));

    var doForEveryOfenGrid = function (func, args) {
        _.each($scope.anlagen, function (anlage) {
            _.each(anlage.oefen, function (ofen) {
                try {
                    ofen.gridSettings.apply.apply(this, [func].concat(args));
                } catch (error) {
                    //console.info("Grid ist noch nicht initialisiert: ", error);
                }
            });
        });
    };
    var doForEveryPoolGrid = function (func, args) {
        _.each($scope.plan.poolListe.pools, function (pool) {
            try {
                pool.gridSettings.apply.apply(this, [func].concat(args));
            } catch (error) {
                //console.info("Grid ist noch nicht initialisiert: ", error);
            }
        });
    };

    //#region Splitter (Auftraege, Fertiglager)
    $scope.auftraegeSplitterSettings = {
        orientation: "horizontal",
        splitBarSize: 10,
        height: "100%",
        width: "100%",
        panels: [
            {
                size: "60%",
                resizable: true,
                min: 100,
                collapsible: true,
                collapsed: false
            },
            {
                size: "40%",
                resizable: true,
                min: 100,
                collapsible: true,
                collapsed: false
            }
        ]
    };

    $scope.fertiglagerSplitterSettings = {
        orientation: "horizontal",
        height: "100%",
        splitBarSize: 10,
        width: "100%",
        panels: [
            {
                size: "25%",
                resizable: true,
                min: 100,
                collapsible: true,
                collapsed: false
            },
            {
                size: "75%",
                resizable: true,
                min: 100,
                collapsible: false,
                collapsed: false
            }
        ]
    };
    //#endregion

    //#region Anlagen
    $scope.anlagenRibbonSettings = {
        position: "bottom",
        selectionMode: "click",
        animationType: "none"
    };

    $scope.ofenVisible = true;
    $scope.poolVisible = false;

    $scope.ribbonSelected = function (event) {
        if (event.args.selectedIndex === $scope.anlagen.length) {
            $scope.ofenVisible = false;
            $scope.poolVisible = true;
        } else {
            $scope.ofenVisible = true;
            $scope.poolVisible = false;
        }
    };

    $scope.managePoolColumnsButtonSettings = {
        enableBrowserBoundsDetection: true
    };
    //#endregion

    //#region Auftrag-Grid
    $scope.manageColumnsButtonSettings = {
        enableBrowserBoundsDetection: true
    };

    $scope.gridSource = {};

    $scope.$on("jqxDropDownButtonCreated", function (event, source) {
        source.instance.setContent("<div style='padding:5px;'><i class='fa fa-eye-slash'></i>&nbsp;" + $filter('translate')('Allgemein.SichtbarkeitSchalten') + "</div>");
    });

    $scope.auftraegeGridSettings = {
        width: '100%',
        height: "100%",
        altrows: true,
        sortable: true,
        //showstatusbar: false,
        autoshowfiltericon: true,
        //statusbarheight: 50,
        columnsresize: true,
        columnsreorder: true,
        selectionmode: 'none',
        localization: localization.get(),
        groupable: false,
        filterable: true,
        //showfilterrow: true,
        //filtermode: 'excel',
        showaggregates: true,
        showstatusbar: true,
        statusbarheight: 25,
        enabletooltips: true,
        autoshowloadelement: false,
        columnsautoresize: true,
        rendered: function (type) {
            if (type === "row") return;
            $scope.$broadcast("domChanged", "oefen");
        }
    };

    $scope.exportAuftraege = function () {
        //$scope.auftraegeGridSettings.apply("exportdata", "xls", "Auftraege_" + $scope.plan.name, true, null, false, "lib/js/jqwidgets_src/PHPExport/dataexport.php");

        var parameter = {
            sheetName: "Auftraege",
            fileName: "Auftraege",
            gridSettings: $scope.auftraegeGridSettings,
            gridColumns: $scope.gridColumns
        }

        var exportSuccess = excel.exportXSLX(parameter);

        console.log(exportSuccess);

    };

    //#endregion

    //#region Drag&Drop
    $scope.onEmptyDrop = function (event) {
        $scope.anlagenRibbonSettings.selectionMode = "click";
    };

    $scope.onDrag = function (event) {
        $scope.anlagenRibbonSettings.selectionMode = "hover";
        var cell = $scope.auftraegeGridSettings.apply('getcellatposition', event.clientX, event.clientY);
        var rowdata = $scope.auftraegeGridSettings.apply("getrowdata", cell.row);
        $scope.drag.artikel = rowdata.artikel;

        $scope.drag.aequivalente = stammdaten.getAequivalenteArtikelByArtikel(rowdata.artikel);

        $scope.drag.wkst_nr = rowdata.wkst_nr;
        $scope.drag.kontrakt = rowdata.kontrakt;
        $scope.drag.auftrag = rowdata;
        return rowdata;
    };

    $scope.onDrop = function (data, element, event) {
        $scope.anlagenRibbonSettings.selectionMode = "click";

        if (element.dataset.type === "pool") {
            // Zunächst die Reihe hinzufügen
            _.each($scope.plan.poolListe.pools, function (pool) {
                if ("pool-jqx-grid-" + pool.id !== element.id) return;
                var cellAtDrop = pool.gridSettings.apply('getcellatposition', event.clientX, event.clientY);
                var rowdata = pool.gridSettings.apply("getrowdata", cellAtDrop.row);

                var newrow = {
                    artikel: data.artikel,
                    wkst_nr: data.wkst_nr,
                    satz_nr_lk: data.satz_nr_lk,
                    r_menge: data.r_menge,
                    kontrakt: data.kontrakt
                };
                //Auftrag zu Ofen als Ofenbelegung hinzufügen


                pool.gridSettings.apply("addrow", null, newrow);
                //TODO: fao: Ofenbelegung hier korrekt erzeugen
                pool.poolBelegungsListe.push(newrow);
                //Auftrag aus Auftraege entfernen
                //$scope.auftraegeGridSettings.apply("deleterow", data.boundindex);
                //TODO: statt dessen bitte muss die Spalte zu planende Menge (r_menge - summe aller geplanten Mengen für den data.kontrakt)
                //erstmal: WIE kann ich Zelleninhlate ändern??
                data.prod_offen = data.prod_offen - data.r_menge;

                //??????
                //TODO: fao: Hier werden alle Aufträge (auftragListe.auftraege) entfernt; nachdenken warum!
                //$scope.plan = _.without($scope.plan.auftragListe.auftraege, _.findWhere($scope.plan.auftragListe.auftraege, {
                //    satz_nr_lk: data.satz_nr_lk
                //}));

                //TODO: nötig?
                //updateFertiglagerGrid(data.artikel);
            });
        } else {
            // Zunächst die Reihe hinzufügen
            _.each($scope.anlagen, function (anlage) {
                _.each(anlage.oefen, function (ofen) {
                    if ("jqx-grid-" + ofen.id !== element.id) return;
                    var cellAtDrop = ofen.gridSettings.apply('getcellatposition', event.clientX, event.clientY);
                    var rowdata = ofen.gridSettings.apply("getrowdata", cellAtDrop.row);

                    var newrow = {
                        beginn: moment(rowdata.ende_hs).add(1, "minute").toDate(),
                        ende_hs: moment(rowdata.ende_hs).add(16, "hour").toDate(),  //später aus config ...
                        ende: moment(rowdata.ende_hs).add(16 + 24, "hour").toDate(), //später aus config ...
                        giessTag: 0,
                        giessWoche: 0,
                        artikel: data.artikel,
                        wkst_nr: data.wkst_nr,
                        sollGFT: data.gft,
                        plan_menge: data.r_menge,
                        pps_menge: 0,
                        kontrakt: data.kontrakt,
                        status: 'neu'
                    };
                    //Auftrag zu Ofen als Ofenbelegung hinzufügen

                    ofen.gridSettings.apply("addrow", null, newrow);
                    //TODO: fao: Ofenbelegung hier korrekt erzeugen
                    ofen.ofenBelegungsListe.push(newrow);
                    //Auftrag aus Auftraege entfernen
                    //$scope.auftraegeGridSettings.apply("deleterow", data.boundindex);
                    //TODO: statt dessen bitte muss die Spalte zu planende Menge (r_menge - summe aller geplanten Mengen für den data.kontrakt)
                    //erstmal: WIE kann ich Zelleninhlate ändern??
                    data.prod_offen = data.prod_offen - data.r_menge;

                    //??????
                    //TODO: fao: Hier werden alle Aufträge (auftragListe.auftraege) entfernt; nachdenken warum!
                    //$scope.plan = _.without($scope.plan.auftragListe.auftraege, _.findWhere($scope.plan.auftragListe.auftraege, {
                    //    satz_nr_lk: data.satz_nr_lk
                    //}));

                    updateFertiglagerGrid(data.artikel);
                });
            });
        }


        // Dann können die Daten entweder in einem Buffer gespeichert werden, zusammen mit den Griddaten
        // (was sowieso geschieht), je nachdem, wie der Datenabgleich ablaufen soll
    };
    //#endregion

    //#region Fertiglager
    $scope.fertiglagerDtSettings = {
        width: '100%',
        height: "100%",
        sortable: true,
        selectionMode: "none",
        localization: localization.get()
    };

    $scope.fertiglagerPending = false;

    $scope.fertiglagerDtColumns = [];

    $scope.columnChecked = function () {
        $scope.auftraegeGridSettings.apply("render");
        prefs.setHiddenColumns("auftraegeGrid", $scope.gridColumns)
    };

    $scope.ofenColumnChecked = function () {
        _.each($scope.anlagen, function (anlage, i) {
            _.each(anlage.oefen, function (ofen, j) {
                ofen.gridSettings.apply("render");
            })
        });
        prefs.setHiddenColumns("ofenGrid", $scope.ofenColumns);
    };

    $scope.poolColumnChecked = function () {
        _.each($scope.plan.poolListe.pools, function (pool) {
            pool.gridSettings.apply("render");
        });
        prefs.setHiddenColumns("poolGrid", $scope.poolColumns);
    };

    var updateFertiglagerGrid = function (artikel) {
        try {

            var columns = [{
                text: "Artikel",
                datafield: "artikel",
                width: 80,
                pinned: true
            }];

            var aequivalenteArtikel = stammdaten.getAequivalenteArtikelByArtikel(artikel);

            var source = [];
            _.each(aequivalenteArtikel, function (art) {
                source.push({
                    artikel: art
                });
            });

            var prognosen = fertiglager.getFertiglagerprognose($scope.plan, aequivalenteArtikel, 100);  //[artikel]
            _.each(getMomentDates(prognosen[0].length - 1, $scope.plan.fertiglager_aktualisierung), function (momentDate, i) {
                columns.push({
                    text: $filter('translate')('Allgemein.KurzTag' + momentDate.isoWeekday()) + ' ' + momentDate.format("DD.MM"),
                    momentDate: momentDate,
                    datafield: i + 1 + "", //+1 da in 0 ja schon der Artikel steht
                    width: 80,
                    cellsalign: 'right',
                    cellsformat: 'f0',
                    cellclassname: function (i, datafield, menge) {
                        if (datafield === "artikel") return;
                        if (!columns[parseInt(datafield)].momentDate) return;

                        if (menge <= 0) {
                            return "gridcell-warning";
                        }
                        //day bringt sunday = 0, isoWeekday bringt sunday = 7
                        if (columns[parseInt(datafield)].momentDate.isoWeekday() > 5) {
                            return "fertiglager-we";
                        } else {
                            return "";
                        }
                    }
                });
                var prognosenCount = 0;
                _.each(prognosen, function (prognose) {
                    source[prognosenCount][i + 1 + ""] = prognose[i];
                    prognosenCount++;
                });
                //source[0][i + 1 + ""] = prognosen[0][i];
            });

            $scope.fertiglagerDtColumns = columns;
            $scope.fertiglagerDtSource = source;
            $scope.fertiglagerPending = false;
        } catch (error) {
            console.dir(error);
            $scope.fertiglagerPending = false;
            $scope.fertiglagerError = error.status;
        }
    };

    $scope.fertiglagerError = 0;
    $scope.rowClick = function (event) {
        $scope.fertiglagerPending = true;
        var row = event.args.row.bounddata;
        var artikel = row.artikel;
        //TODO: Hier per checkbox auto-open an/aus
        //$scope.secondSplitterSettings.apply("expand");
        updateFertiglagerGrid(artikel);
    };
    //#endregion

    //#region Auftraege
    $scope.datafields = [
        { name: 'kontrakt', type: "string" },
        { name: 'sorter', type: "string" },
        { name: 'sorter_konto', type: "string" },
        { name: 'empfaenger', type: "string" },
        { name: 'empfaenger_konto', type: "string" },
        { name: 'artikel', type: "string" },
        { name: 'wkst_nr', type: "string" },
        //{name: 'metall', type: "string"},
        { name: 'r_menge', type: "number" },
        { name: 'prod_geliefert', type: "number" },
        { name: 'prod_ungeliefert', type: "number" },
        { name: 'prod_offen', type: "number" },
        { name: 'msp_offen', type: "number" },
        { name: 'satz_nr_lk', type: "number" },
        { name: 'mitarbeiter', type: "string" },
        { name: 'gft', type: "date" }
    ];

    $scope.gridColumns = [
        {
            text: $filter('translate')('Allgemein.kontrakt'),
            datafield: 'kontrakt',
            width: 120,
            pinned: true,
            minwidth: 60,
            hidden: prefs.isHidden("auftraegeGrid", "kontrakt", false)
        }, {
            text: $filter('translate')('Auftraege.sorter'),
            datafield: 'sorter',
            filtertype: 'checkedlist',
            width: "auto",
            pinned: true,
            minwidth: 60,
            hidden: prefs.isHidden("auftraegeGrid", "sorter", false)
        }, {
            text: $filter('translate')('Auftraege.Sorter_konto'),
            datafield: 'sorter_konto',
            hidden: prefs.isHidden("auftraegeGrid", "sorter_konto", true)
        }, {
            text: $filter('translate')('Auftraege.empfaenger'),
            datafield: 'empfaenger',
            filtertype: 'checkedlist',
            width: "auto",
            pinned: true,
            minwidth: 60,
            hidden: prefs.isHidden("auftraegeGrid", "empfaenger", false)
        }, {
            text: $filter('translate')('Auftraege.Empfaenger_konto'),
            datafield: 'empfaenger_konto',
            hidden: prefs.isHidden("auftraegeGrid", "empfaenger_konto", true)
        }, {
            text: $filter('translate')('Auftraege.r_menge'),
            datafield: 'r_menge',
            //filtertype: 'number',
            width: "10%",
            minwidth: 60,
            aggregates: ['sum'],
            aggregatesrenderer: function (aggregates) {
                var renderstring = "";
                $.each(aggregates, function (key, value) {
                    renderstring += '<div style="position: relative; margin: 4px; overflow: hidden;">&Sigma;: ' + value;
                });
                return renderstring;
            },
            cellsalign: 'right',
            cellsformat: 'f0',
            hidden: prefs.isHidden("auftraegeGrid", "r_menge", false)
        }, {
            text: $filter('translate')('Auftraege.prod_ungeliefert'),
            datafield: 'prod_ungeliefert',
            filtertype: 'number',
            width: "10%",
            minwidth: 60,
            aggregates: ['sum'],
            aggregatesrenderer: function (aggregates) {
                var renderstring = "";
                $.each(aggregates, function (key, value) {
                    renderstring += '<div style="position: relative; margin: 4px; overflow: hidden;">&Sigma;: ' + value;
                });
                return renderstring;
            },
            cellsalign: 'right',
            cellsformat: 'f0',
            hidden: prefs.isHidden("auftraegeGrid", "prod_ungeliefert", false)
        }, {
            text: $filter('translate')('Auftraege.prod_geliefert'),
            datafield: 'prod_geliefert',
            filtertype: 'number',
            width: "10%",
            minwidth: 60,
            aggregates: ['sum'],
            aggregatesrenderer: function (aggregates) {
                var renderstring = "";
                $.each(aggregates, function (key, value) {
                    renderstring += '<div style="position: relative; margin: 4px; overflow: hidden;">&Sigma;: ' + value;
                });
                return renderstring;
            },
            cellsalign: 'right',
            cellsformat: 'f0',
            hidden: prefs.isHidden("auftraegeGrid", "prod_geliefert", false)
        }, {
            text: $filter('translate')('Auftraege.msp_offen'),
            datafield: 'msp_offen',
            filtertype: 'number',
            width: "10%",
            minwidth: 60,
            aggregates: ['sum'],
            aggregatesrenderer: function (aggregates) {
                var renderstring = "";
                $.each(aggregates, function (key, value) {
                    renderstring += '<div style="position: relative; margin: 4px; overflow: hidden;">&Sigma;: ' + value;
                });
                return renderstring;
            },
            cellsalign: 'right',
            cellsformat: 'f0',
            hidden: prefs.isHidden("auftraegeGrid", "msp_offen", false)
        }, {
            text: $filter('translate')('Auftraege.prod_offen'),
            datafield: 'prod_offen',
            filtertype: 'number',
            width: "10%",
            minwidth: 60,
            aggregates: ['sum'],
            aggregatesrenderer: function (aggregates) {
                var renderstring = "";
                $.each(aggregates, function (key, value) {
                    renderstring += '<div style="position: relative; margin: 4px; overflow: hidden;">&Sigma;: ' + value;
                });
                return renderstring;
            },
            cellsalign: 'right',
            cellsformat: 'f0',
            hidden: prefs.isHidden("auftraegeGrid", "prod_offen", false)
        }, {
            text: $filter('translate')('Allgemein.Artikel'),
            datafield: 'artikel',
            width: "8%",
            hidden: prefs.isHidden("auftraegeGrid", "artikel", false)
        }, {
            text: $filter('translate')('Allgemein.Werkstoff'),
            datafield: 'wkst_nr',
            filtertype: 'checkedlist',
            width: "8%",
            hidden: prefs.isHidden("auftraegeGrid", "wkst_nr", false)
        }, {
            text: "satz_nr_lk",
            datafield: 'satz_nr_lk',
            hidden: prefs.isHidden("auftraegeGrid", "satz_nr_lk", true)
        }, {
            text: $filter('translate')('Allgemein.Mitarbeiter'),
            datafield: 'mitarbeiter',
            width: "8%",
            minwidth: 60,
            hidden: prefs.isHidden("auftraegeGrid", "mitarbeiter", false)
        }, {
            text: $filter('translate')('Auftraege.gft'),
            datafield: 'gft',
            width: "15%",
            //filtertype: 'range',
            filtertype: 'date',
            columntype: 'datetimeinput',
            cellsformat: 'dd.MM.yyyy',

            minwidth: 60,
            hidden: prefs.isHidden("auftraegeGrid", "gft", false)
        }];
    //#endregion

    //#region AJAX
    var momentDates = [moment()];
    var getMomentDates = function (n, startdatum) {
        if (momentDates.length === n + 1) return momentDates;
        momentDates = [moment(startdatum)];
        for (var i = 1; i <= n; i++) {
            momentDates.push(moment(startdatum).add(i, "d"));
        }
        return momentDates;
    };

    var method = $scope.enableEditing ? "oeffnePlanung" : "getPlan";

    cache[method]($routeParams.id).then(function (plan) {

        $scope.plan = plan;

        var auftraegeSource = {
            datatype: "array",
            localdata: plan.auftragListe.auftraege,
            datafields: $scope.datafields,
            sortcolumn: 'gft',
            sortdirection: 'asc'
        };

        var auftraegeDataAdapter = new $.jqx.dataAdapter(auftraegeSource,
            {
                autoBind: true
            });

        auftraegeGridPromise.then(function () {
            $scope.auftraegeGridSettings.source = auftraegeDataAdapter;
        });

        $scope.anlagen = plan.anlagenListe.anlagen;

        _.each($scope.anlagen, function (anlage, i) {

            _.each(anlage.oefen, function (ofen, j) {
                var anlagenSource = {
                    datatype: "array",
                    localdata: ofen.ofenBelegungsListe === null ? [] : ofen.ofenBelegungsListe,
                    datafields: $scope.ofenDatafields,
                    sortcolumn: 'beginn',
                    sortdirection: 'asc'
                };

                var anlagenDataAdapter = new $.jqx.dataAdapter(anlagenSource,
                    {
                        autoBind: true
                    });

                // Settings-Objekt samt Source und Spalten anlegen, in Array speichern,
                // um später Methoden anwenden zu können
                ofen.id = ofen.name + "-grid";
                ofen.deferred = $q.defer();
                ofen.promise = ofen.deferred.promise;
                ofen.gridSettings = {
                    width: "100%",
                    height: "95%",
                    altrows: true,
                    sortable: true,
                    showstatusbar: false,
                    autoshowfiltericon: true,
                    columnsresize: true,
                    columnsreorder: true,
                    autoshowloadelement: false,
                    selectionmode: 'none',
                    localization: localization.get(),
                    groupable: false,
                    filterable: true,
                    columnsautoresize: true,
                    showfilterrow: true,
                    enabletooltips: true,
                    columns: $scope.ofenColumns,
                    source: anlagenDataAdapter
                };

                ofen.promise.then(function () {
                    //ofen.gridSettings.source = anlagenDataAdapter;
                });
            });
        });

        _.each($scope.plan.poolListe.pools, function (pool, i) {

            var poolSource = {
                datatype: "array",
                localdata: pool.poolBelegungsListe === null ? [] : pool.poolBelegungsListe,
                datafields: $scope.poolDatafields,
                sortcolumn: 'beginn',
                sortdirection: 'asc'
            };

            var poolDataAdapter = new $.jqx.dataAdapter(poolSource,
                {
                    autoBind: true
                });

            // Settings-Objekt samt Source und Spalten anlegen, in Array speichern,
            // um später Methoden anwenden zu können
            pool.id = pool.name + "-grid";
            pool.gridSettings = {
                width: "100%",
                height: "95%",
                altrows: true,
                sortable: true,
                showstatusbar: false,
                autoshowfiltericon: true,
                columnsresize: true,
                columnsreorder: true,
                autoshowloadelement: false,
                selectionmode: 'none',
                localization: localization.get(),
                groupable: false,
                filterable: true,
                columnsautoresize: true,
                showfilterrow: true,
                enabletooltips: true,
                columns: $scope.poolColumns,
                source: poolDataAdapter
            };
        });

        $scope.planReady = true;

    });
    //#endregion

    //#region Oefen
    $scope.ofenDatafields = [
        { name: 'giess_tag', type: "string" },
        { name: 'giess_woche', type: "string" },
        { name: 'status', type: "string" },
        { name: 'plan_menge', type: "float" },
        { name: 'pps_menge', type: "float" },
        { name: 'kontrakt', type: "string" },
        { name: 'artikel', type: "string" },
        { name: 'wkst_nr', type: "string" },
        { name: 'beginn', type: "date" },
        { name: 'ende', type: "date" },
        { name: 'ende_hs', type: "date" }
    ];
    $scope.ofenColumns = [
    {
        text: $filter("translate")("Anlagen.giessTag"),
        datafield: 'giess_tag',
        width: "7%",
        maxwidth: "33",
        hidden: prefs.isHidden("ofenGrid", "giess_tag", false)
    },
    {
        text: $filter("translate")("Anlagen.giessWoche"),
        datafield: 'giess_woche',
        width: "5%",
        maxwidth: "23",
        hidden: prefs.isHidden("ofenGrid", "giess_woche", false)
    },
    {
        text: $filter("translate")("Allgemein.Beginn"),
        datafield: 'beginn',
        columntype: 'datetimeinput',
        cellsformat: 'dd.MM HH:mm',
        width: "15%",
        maxwidth: "90",
        hidden: prefs.isHidden("ofenGrid", "beginn", false)
    },
    {
        text: $filter("translate")("Anlagen.Ende_HS"),
        datafield: 'ende_hs',
        columntype: 'datetimeinput',
        cellsformat: 'dd.MM HH:mm',
        width: "15%",
        maxwidth: "90",
        hidden: prefs.isHidden("ofenGrid", "ende_hs", false)
    },
    {
        text: $filter("translate")("Allgemein.Ende"),
        datafield: 'ende',
        columntype: 'datetimeinput',
        cellsformat: 'dd.MM HH:mm',
        width: "15%",
        maxwidth: "90",
        hidden: prefs.isHidden("ofenGrid", "ende", false)
    },
    {
        text: $filter("translate")("Allgemein.Artikel"),
        datafield: 'artikel',
        width: "auto",
        maxwidth: "80",
        hidden: prefs.isHidden("ofenGrid", "artikel", false)
    },
    {
        text: $filter("translate")("Allgemein.Werkstoff"),
        datafield: 'wkst_nr',
        width: "auto",
        maxwidth: "80",
        hidden: prefs.isHidden("ofenGrid", "wkst_nr", false)
    },
    {
        text: $filter("translate")("Anlagen.Plan_Menge"),
        datafield: 'plan_menge',
        //width: "10%",
        width: "auto",
        filtertype: 'number',
        cellsalign: 'right',
        cellsformat: 'f0',
        hidden: prefs.isHidden("ofenGrid", "plan_menge", false)
    },
    {
        text: $filter("translate")("Anlagen.PPS_Menge"),
        datafield: 'pps_menge',
        //width: "10%",
        width: "auto",
        filtertype: 'number',
        cellsalign: 'right',
        cellsformat: 'f0',
        hidden: prefs.isHidden("ofenGrid", "pps_menge", false)
    },
    {
        text: $filter("translate")("Allgemein.kontrakt"),
        datafield: 'kontrakt',
        width: "15%",
        maxwidth: "90",
        hidden: prefs.isHidden("ofenGrid", "kontrakt", false)
    },
    {
        text: $filter("translate")("Anlagen.status"),
        datafield: 'status',
        //width: "auto",
        hidden: prefs.isHidden("ofenGrid", "status", false)
    }
    ];
    //#endregion
    //#region Pools
    $scope.poolDatafields = [
        { name: 'artikel', type: "string" },
        { name: 'kontrakt', type: "string" },
        { name: 'r_menge', type: "float" },
        { name: 'satz_nr_lk', type: "string" },
        { name: 'wkst_nr', type: "string" }
    ];
    $scope.poolColumns = [
        {
            text: $filter("translate")("Auftraege.satz_nr_lk"),
            datafield: 'satz_nr_lk',
            width: "auto",
            hidden: prefs.isHidden("poolGrid", "satz_nr_lk", false)
        },
        {
            text: $filter("translate")("Allgemein.Artikel"),
            datafield: 'artikel',
            width: "auto",
            maxwidth: "80",
            hidden: prefs.isHidden("poolGrid", "artikel", false)
        },
        {
            text: $filter("translate")("Allgemein.Menge"),
            datafield: 'r_menge',
            //width: "10%",
            width: "auto",
            filtertype: 'number',
            cellsalign: 'right',
            cellsformat: 'f0',
            hidden: prefs.isHidden("poolGrid", "r_menge", false)
        },
        {
            text: $filter("translate")("Allgemein.kontrakt"),
            datafield: 'kontrakt',
            width: "15%",
            maxwidth: "90",
            hidden: prefs.isHidden("poolGrid", "kontrakt", false)
        },

        {
            text: $filter("translate")("Allgemein.Werkstoff"),
            datafield: 'wkst_nr',
            width: "auto",
            hidden: prefs.isHidden("poolGrid", "wkst_nr", false)
        }
    ];

    //#endregion

    var auftraegeGridDeferred = $q.defer();
    var auftraegeGridPromise = auftraegeGridDeferred.promise;

    var fertiglagerGridDeferred = $q.defer();
    var fertiglagerGridPromise = fertiglagerGridDeferred.promise;

    $scope.$on("jqxGridCreated", function (event, widget) {
        _.each($scope.anlagen, function (anlage, i) {
            _.each(anlage.oefen, function (ofen, j) {
                if (ofen.id === widget.id) {
                    ofen.deferred.resolve("ok");
                }
            })
        });

        if (widget.id === "auftraege-grid") {
            auftraegeGridDeferred.resolve("ok");
        } else if (widget.id === "fertiglager-grid") {
            fertiglagerGridDeferred.resolve("ok");
        }
    });

}]);