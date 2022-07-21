sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/List",
    "sap/ui/core/routing/Router"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, Dialog, List, Button, Router) {
        "use strict";


        return Controller.extend("as.activity.activityasayar.controller.MainView", {
            onInit: function () {

                var that = this;
                this.oDataModel = this.getOwnerComponent().getModel();
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "mainModel");

                var createUserModel = new JSONModel({
                    userName: "",
                    userId: ""
                });

                this.getView().setModel(createUserModel, "userCreate");

                this.oDataModel.read("/UserSet", {
                    success: function (oData, oResponse) {

                        that.getView().getModel("mainModel").setProperty("/UserList", oData.results);

                        console.log(oData, oResponse)

                    },
                    error: function (oError) { }
                });

            },
            onPressDeleteUser: function (oEvent) {

                var contextPath = oEvent.getParameter("listItem").getBindingContextPath();
                var id = this.getView().getModel("mainModel").getProperty(contextPath).Userid;


                this.oDataModel.remove("/UserSet('" + id + "')", {
                    method: "DELETE",
                    success: function (oData, oResponse) {
                        MessageBox.success("Silme İşlemi Başarılı");
                        // this.getView().getModel("mainModel").refresh(true);
                       // location.reload();
                        
                    },
                    error: function (oError) {
                        MessageBox.error("Silme İşlemi Başarısız");
                    }
                });
               location.reload();
            } /* */,
            onPressOpenUserDialog: function () {
                var oView = this.getView();

                if (!this._pDialog) {
                    this._pDialog = this.loadFragment({
                        name: 'as.activity.activityasayar.view.dialog.user'
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

            }/**/,
            onUserClose: function () {
                this.byId('fragment0').close();
                location.reload();

            } /**/,
            onCreateUser: function () {
                var oEntry = {};
                var userModel = this.getView().getModel("userCreate");
                oEntry.Username = userModel.getData().userName;
                oEntry.Userid = userModel.getData().userId;

                this.oDataModel.create("/UserSet", oEntry, {
                    success: function (oData, oResponse) {
                        MessageBox.success("Kayıt İşlemi Başarılı");
                    },
                    error: function (oError) {
                        MessageBox.error("Kayıt İşlemi Başarısız");
                    }
                });
            }/** update eklenecek/eklenebilir */,

            onPress: function (oEvent) {
                /*console.log(oEvent);

                var userId = oEvent.getSource().getProperty("description").split(" ")[2];

             //   this.getAktivity(userId);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("aktivite", { parameter: userId });*/


                var userId = oEvent.getSource().getProperty("description").split(" ")[2];
                this.getOwnerComponent().getRouter().navTo('aktivite', {userId: userId});

            },

            getAktivity(userId) {
                var that = this;
                this.oDataModel = this.getOwnerComponent().getModel();
                var oModel = new JSONModel();

                this.getView().setModel(oModel, "aktiviteModel");

                that.oDataModel.read("/UserSet('" + userId + "')", {
                    urlParameters: { "$expand": "UserToAktiviteNav" },
                    method: "GET",
                    success: function (oData) {
                        that.getView().getModel("aktiviteModel").setProperty("/UserList", oData.UserToAktiviteNav.results);

                        console.log(oData)
                    },
                    error: function (oError) { }
                });
            }

        });
    });
