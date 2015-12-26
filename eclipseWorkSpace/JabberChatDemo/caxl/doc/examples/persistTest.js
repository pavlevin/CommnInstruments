/**
 * filename:        persistTest.js
 *
 * Cisco encourages developers to incorporate example code into
 * Copyright (c) 2009-2011 Cisco Systems, Inc.  All Rights Reserved.
 */

// config
var demo_config = {
    httpBindingURL: "/httpbinding",
    username: "jwtest0@example.com",
    password: "test",
    resource: "persisttest",
    legacyAuth: true,
    appTag: "app-data-8"
};

function log(type, details) {
    var log = jabberwerx.$("#log-message .log-message").clone();
    log.children(".type").text(type);
    log.children(".details").text(details);
    log.appendTo(".log #details table");
    jabberwerx.$(".log #details")[0].scrollTop = jabberwerx.$(".log #details")[0].scrollHeight;
    jabberwerx.$("#act-clear").removeClass("disabled");

    jabberwerx.util.debug.log(type + ': ' + details);
}

var _app = null;
var JWA = {};

JWA.Application = jabberwerx.JWModel.extend({
    init: function() {
        log('JWA', 'Application.init begin');
        this._super();

        //all initializations should happen here. This should only be called once
        this.client = new jabberwerx.Client(demo_config.resource);

        this.client.event("clientStatusChanged").bind(this.invocation('_onClientStatusChanged'));

        log('JWA', 'Application.init end');
    },

    destroy: function() {
        this.client = null;
    },

    shouldBeSavedWithGraph: function() {
        return true;
    },

    connect: function() {
        if(this.client.isConnected()) {
            log("JWA", "client is already connected");
        } else {
            var connectArgs = {httpBindingURL: demo_config.httpBindingURL};
            this.client.connect(demo_config.username, demo_config.password, connectArgs);
        }
    },

    disconnect: function() {
        if(!this.client.isConnected()) {
            log("JWA","client is already disconnected");
        } else {
            this.client.disconnect();
        }
    },


    _setState: function(state) {
        var $ = jabberwerx.$;

        switch (state) {
            case -1:
                $(".toolbar #act-login").hide();
                $(".toolbar #act-logout").hide();
                $(".toolbar #client-status").text("invalid until loaded");
                return;
            case jabberwerx.Client.status_connected:
                $(".toolbar #act-login").hide();
                $(".toolbar #act-logout").show();
                break;
            case jabberwerx.Client.status_disconnected:
                $(".toolbar #act-logout").hide();
                $(".toolbar #act-login").show();
                break;
        }
        $(".toolbar #client-status").text(this.client.getClientStatusString(state));
    },

    _updateState: function() {
        this._setState(this.client.clientStatus);
    },

    _onClientStatusChanged: function(evt) {
        // get the associated jabberwerx.Client object
        var client = evt.source;

        // get the previous and next status values
        var prev = client.getClientStatusString(evt.data.previous);
        var next = client.getClientStatusString(evt.data.next);
        log("JWA", 'client changing state: ' + prev + ' --> ' + next);
        if (evt.data.error) {
            log("JWA","client error: " + evt.data.error.xml);
        }
        this._setState(evt.data.next);
    }

}, "JWA.Application");


function newApplication() {
     retApp = new JWA.Application();
    return retApp;
}


_save = function() {
    log("window","saving begin");

    try {
        jabberwerx.util.saveGraph(_app, demo_config.appTag);
    } catch(e) {
        log("window","saving failed: " + e.message);
    }

    _app._setState(-1);
    _app = null; //saved refs are no longer valid and should be invaldated
    log("window","saving end");
}

_load = function() {
    log("window","loading begin");
    _app = jabberwerx.util.loadGraph(demo_config.appTag);
    if (!_app) {
        log("window","creating new application");
        _app = newApplication();
    }

    _app._updateState();
    log("window","loading end");
}


jabberwerx.$(window).bind("unload", function() {
    log("window", "onUnload begin");

    _save();

    log("jwa","onUnload end");
});

jabberwerx.$(document).ready(function() {
    log('window', 'onReady begin');
    // Attempt to load the app once the jStore engine is ready
    jabberwerx.$.jStore.ready(function(engine){
        engine.ready(function(){
            log('window', 'storage engine ready');
            var $ = jabberwerx.$;

            //my sucky server only does plaintext auth. Enable iq:auth, SET BEFORE HYDRATION OR CREATION
            jabberwerx._config.unsecureAllowed = demo_config.legacyAuth;
            _load();
            $(".log #act-clear").bind("click", function() {
                $(".log #details table").empty();
                $(".log #act-clear").addClass("disabled");
            });
            $(".toolbar #act-login").bind("click", function() {
                _app.connect();
            });
            $(".toolbar #act-logout").bind("click", function() {
                _app.disconnect();
            });

            log('window', 'onReady end');
        });
    });
});
