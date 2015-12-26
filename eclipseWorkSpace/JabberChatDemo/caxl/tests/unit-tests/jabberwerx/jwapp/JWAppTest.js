/**
 * filename:        JWAppTest.js
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2009-2012 Cisco Systems, Inc.  All Rights Reserved.
 */

jabberwerx.$(document).ready(function() {

    jabberwerx.TestApp = jabberwerx.JWApp.extend({
        client: null,
        createCalled: false,
        initCalled: false,

        appCreate: function() {
            this._super();
            //use an unconnected client to test JWApp integration with persistence
            this.client = new jabberwerx.Client();
            this.createCalled = true;
        },
        appInitialize: function() {
            this._super();
            this.initCalled = true;
        },

        destroy: function() {
            this.client.destroy();
            this.client = null;
            this._super();
        }
    }, "jabberwerx.TestApp");

    module("jwapp/JWApp");

    test("test JWApp", function() {
        var ta = jabberwerx.util.loadApp("jabberwerx.TestApp");
        ok(ta.createCalled, "appCreate called when instantiating new JWApp");
        ok(ta.client != null, "client created when instantiating new JWApp");
        ok(ta.initCalled, "appInitialized called when instantiating new JWApp");
        ta.createCalled = ta.initCalled = false;

        jabberwerx.util.saveApp(ta);
        ta = jabberwerx.util.loadApp("jabberwerx.TestApp");

        ok(!ta.createCalled, "appCreate not called when loading JWApp");
        ok(ta.initCalled, "appInitialized called when loading JWApp");
        ok(ta.client != null, "client exists when loading JWApp");
        ta.createCalled = ta.initCalled = false;

        jabberwerx.util.saveApp(ta);
        jabberwerx.util.persistedApplicationClass("jabberwerx.TestApp");
        ta = jabberwerx.util.loadApp(); //using global class just defined
        ok(!ta.createCalled, "appCreate not called when loading via persistedApplicationClass");
        ok(ta.initCalled, "appInitialized called when loading via persistedApplicationClass");
        ok(ta.client != null, "client exists when loading via persistedApplicationClass");
    });
});
