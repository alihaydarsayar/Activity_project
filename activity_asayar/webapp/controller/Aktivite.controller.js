sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/List",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, Dialog, List, Button, Filter, FilterOperator) {
        "use strict";


        return Controller.extend("as.activity.activityasayar.controller.Aktivite", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("aktivite").attachMatched(this._onAktiviteMatched, this);
            },

            _onAktiviteMatched: function (oEvent) {
                var userId = oEvent.getParameter('arguments').userId;
                console.log(userId);

                var that = this;
                var oDataModel = this.getOwnerComponent().getModel();
                var oModel = new JSONModel();

                this.getView().setModel(oModel, "aktiviteModel");

                // create
                var createAktiviteModel = new JSONModel({
                    activityId: "",
                    activityName: "",
                    activityDescription: "",
                    activityTime: "",
                    activityDate: "",
                    userId: userId
                });
                this.getView().setModel(createAktiviteModel, "aktiviteCreate");
                //
                oDataModel.read("/UserSet('" + userId + "')", {
                    urlParameters: { "$expand": "UserToAktiviteNav" },
                    method: "GET",
                    success: function (oData) {
                        that.getView().getModel("aktiviteModel").setProperty("/AktiviteList", oData.UserToAktiviteNav.results);
                        console.log(oData)
                    },
                    error: function (oError) { }
                });
            },
            onDelete: function (oEvent) {
                var contextPath = oEvent.getParameter("listItem").getBindingContextPath();
                var id = this.getView().getModel("aktiviteModel").getProperty(contextPath).Activityid;
                var oDataModel = this.getView().getModel();
                oDataModel.remove("/AktiviteSet('" + id + "')", {
                    success: function (oData) {
                        // MessageBox.success("Silme İşlemi Başarılı");
                    },
                    error: function (oError) {
                        MessageBox.error("Silme İşlemi Başarısız");
                    }
                });
                //location.reload();
                oDataModel.refresh();
            },
            onPressOpenActivityCreateDialog: function (oEvent) {
                var oView = this.getView();

                if (!this._pDialog) {
                    this._pDialog = this.loadFragment({
                        name: 'as.activity.activityasayar.view.dialog.aktcreate'
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pDialog.then(
                    function (oDialog) {

                        oDialog.open();
                    }.bind(this)
                );
            },
            onPressOpenActivityUpdateDialog: function (oEvent) {
                //  var oSelectedItem = oEvent.getSource().getBindingContext('aktiviteModel').getObject();
                var activityId = oEvent.getSource().getBindingContext('aktiviteModel').getObject("Activityid");

                var oBindingContext = oEvent.getSource().getBindingContext('aktiviteModel');
                //console.log(oSelectedItem, oBindingContext);
                console.log(activityId);
                var oItem = oEvent.getSource();
                var oView = this.getView();
                var oDataModel = this.getOwnerComponent().getModel();
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "aktiviteModel");

                oDataModel.read("/AktiviteSet('" + activityId + "')", {
                    method: "GET",
                    success: function (oData) {
                        // this.getView().getModel("aktiviteModel").setProperty("/Aktivite", oData.results);
                        //  console.log(oEvent, oItem,oData);
                        // console.log(oDataModel);

                        var oModel3 = new JSONModel({
                            Userid: oData.Userid,
                            Activityid: oData.Activityid,
                            Activityname: oData.Activityname,
                            Activitytime: oData.Activitytime,
                            Activitydate: oData.Activitydate,
                            Activitydescription: oData.Activitydescription
                        });

                        oModel.setData(oData);
                        oView.setModel(oModel, "aktiviteModel");
                        console.log(oModel);
                        console.log(oModel3);
                    },
                    error: function (oError) { }
                });
                //
                if (!this._pDialog) {
                    this._pDialog = this.loadFragment({
                        name: 'as.activity.activityasayar.view.dialog.aktupdate'
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._pDialog.then(
                    function (oDialog) {
                        oDialog.setModel(oModel, "aktiviteModel");   // 
                        oDialog.open();
                    }.bind(this)
                );
            },
            onCreateAktivite: function () {
                var oEntry = {};
                var aktiviteModel = this.getView().getModel("aktiviteCreate");
                oEntry.Activityname = aktiviteModel.getData().activityName;
                oEntry.Activitydescription = aktiviteModel.getData().activityDescription;
                oEntry.Activityid = String(Math.floor(Math.random() * 99999));
                oEntry.Activitytime = aktiviteModel.getData().activityTime;
                oEntry.Activitydate = new Date(aktiviteModel.getData().activityDate);
                oEntry.Userid = aktiviteModel.getData().userId;

                //console.log(oEntry.Activitydate);
                var oDataModel = this.getView().getModel();

                oDataModel.create("/AktiviteSet", oEntry, {
                    success: function (oData, oResponse) {
                        MessageBox.success("Kayıt İşlemi Başarılı");
                        // oDataModel.refresh(true)
                        // oDataModel.setRefreshAfterChange(true);
                    },
                    error: function (oError) {
                        MessageBox.error("Kayıt İşlemi Başarısız");
                    }
                });
                //               oDataModel.setRefreshAfterChange(true);
                location.reload();
            },
            onUpdate: function (oEvent) {
                var oEntry = {};
                var aktiviteModel = this.getView().getModel("aktiviteModel");
                oEntry.Activityname = aktiviteModel.getData().Activityname;
                oEntry.Activitydescription = aktiviteModel.getData().Activitydescription;
                oEntry.Activityid = aktiviteModel.getData().Activityid;
                oEntry.Activitytime = aktiviteModel.getData().Activitytime;
                oEntry.Activitydate = new Date(aktiviteModel.getData().Activitydate);
                oEntry.Userid = aktiviteModel.getData().Userid;

                console.log(oEntry.Activityid);
                var oDataModel = this.getView().getModel();
                oDataModel.update("/AktiviteSet('" + oEntry.Activityid + "')", oEntry, {
                    success: function (oData, oResponse) {
                        MessageBox.success("Güncelleme İşlemi Başarılı");
                    },
                    error: function (oError) {
                        MessageBox.error("Güncelleme İşlemi Başarısız");
                    }
                });

            },
            onSearch: function () {
                var aFilter = [];
                var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Title", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oTable = this.byId("table");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilter);
            },
            onCrtAkctClose: function () {
                this.byId('fragment01').close();
                location.reload();
            },
            onUpdAkctClose: function () {
                this.byId('fragment02').close();
                location.reload();
            },
            onNavBack: function () {
                this.getOwnerComponent().getRouter().navTo("RouteMainView");
                location.reload();
            }

        });
    });
