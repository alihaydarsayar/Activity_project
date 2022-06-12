sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/List",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, Dialog, List, Button) {
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
                    userId: ""
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
                        MessageBox.success("Silme İşlemi Başarılı");
                    },
                    error: function (oError) {
                        MessageBox.error("Silme İşlemi Başarısız");
                    }
                });
            },
            onPressOpenActivityCreateDialog: function () {
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
                //


                /*
                
                var that = this;
                this.oDataModel = this.getOwnerComponent().getModel();
                var oModel = new JSONModel({
                    activityId: "",
                    activityName: "",
                    activityDescription: "",
                    activityTime: "",
                   //activityDate: "",
                    userId: ""
                });
                this.getView().setModel(oModel, "aktiviteeModel");
                
                var oDataModel = this.getView().getModel();
                
                oDataModel.read("/AktiviteSet('00022')", {
                    method: "GET",
                    success: function (oData) {
                        MessageBox.success("İşlemi Başarılı");
                    },
                    error: function (oError) {
                        MessageBox.error(" İşlemi Başarısız");
                    }
                });
                
                */
                //
                var oView = this.getView();

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
                        //               oDialog.setModel(oModel, "aktiviteeModel");
                        oDialog.open();
                    }.bind(this)
                );

                /*
                this.oMyFirstDialog.then(function(oDialog) {
                    const oModel = new JSONModel({
                       
                    });
                    oDialog.setModel(oModel, "aktiviteeModel");
                    oDialog.open();
                    });
                
                */

            },
            onCreateAktivite: function () {
                var oEntry = {};
                var aktiviteModel = this.getView().getModel("aktiviteCreate");
                oEntry.Activityname = aktiviteModel.getData().activityName;
                oEntry.Activitydescription = aktiviteModel.getData().activityDescription;
                oEntry.Activityid = aktiviteModel.getData().activityId;
                oEntry.Activitytime = aktiviteModel.getData().activityTime;
                oEntry.Activitydate = new Date(aktiviteModel.getData().activityDate);
                oEntry.Userid = aktiviteModel.getData().userId;

                //console.log(oEntry.Activitydate);

                var oDataModel = this.getView().getModel();

                oDataModel.create("/AktiviteSet", oEntry, {
                    success: function (oData, oResponse) {
                        MessageBox.success("Kayıt İşlemi Başarılı");
                        /// buraya yazılmalı        oDataModel.refresh(true)
                        //oDataModel.setRefreshAfterChange(true);
                    },
                    error: function (oError) {
                        MessageBox.error("Kayıt İşlemi Başarısız");
                    }
                });
                //               oDataModel.setRefreshAfterChange(true);
            },
            onUpdate: function (oEvent) {
               // var contextPath = oEvent.getSource().getBindingContextPath();
                
                var id= oEvent.getSource().getProperty("description").split(" ")[2];
                
                //var id = this.getView().getModel("aktiviteModel").getProperty(contextPath).Activityid;
                console.log(id);

                var oEntry = {
                    "Activityid": YYY,
                    "Activityname": yeniKitapText,
                    "Activitydescription": yeniKitapText,
                    "Activitytime": yeniKitapText,
                    "Activitydate": yeniKitapText,
                    "Userid": yeniKitapText
                };

                var oDataModel = this.getView().getModel();

                oDataModel.update("/AktiviteSet(" + id + ")", oEntry, {
                    method: "PUT",
                    success: function (oData, oResponse) {
                        MessageBox.success("Güncelleme İşlemi Başarılı");
                    },
                    error: function (oError) {
                        MessageBox.error("Güncelleme İşlemi Başarısız");
                    }
                });


            },
            onCrtAkctClose: function () {
                this.byId('fragment01').close();

            },

            onUpdAkctClose: function () {
                this.byId('fragment02').close();
            },

            onNavBack: function () {
                this.getOwnerComponent().getRouter().navTo("RouteMainView");
            },

        });
    });
