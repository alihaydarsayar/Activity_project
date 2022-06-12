/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"asactivity/activity_asayar/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
