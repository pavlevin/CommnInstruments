/**
 * filename:        cuphaTest.js
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2009-2013 Cisco Systems, Inc.  All Rights Reserved.
 */

jabberwerx.$(document).ready( function() {

    var cparams = {
        sdEnabled: true,
        httpBindingURL: "https://sdnode1.cisco.com:7335/httpbinding",
        httpBindingURL_secondary: "https://sdnode2.cisco.com:7335/httpbinding",
        jid: "jwtest1@example.com"
    };
    var feathosts =
        "<features>" +
            "<mechanisms xmlns='urn:ietf:params:xml:ns:xmpp-sasl'>" +
                "<mechanism>EXTERNAL</mechanism>" +
                "<mechanism>PLAIN</mechanism>" +
                "<hostname>home-node</hostname>" +
                "<hostname>backup-node</hostname>" +
            "</mechanisms>" +
        "</features>";

    var stringify = function(obj) {
        try {
            return JSON.stringify(obj);
        } catch (ex) {
            return jabberwerx.util.serialize(obj);
        }
    };
    var equalsCUPHA = function(actual, expected) {
        for (var p in expected) {
            if (expected.hasOwnProperty(p)) {
                if (expected[p] != actual[p]) {
                    jabberwerx.util.debug.log("equalsCUPHA checking expected failed for property: " + p + ", Expected: " + expected[p] + ", actual: " + actual[p]);
                    return false;
                }
            }
        }
        for (var p in actual) {
            if (actual.hasOwnProperty(p)) {
                if (expected[p] != actual[p]) {
                    jabberwerx.util.debug.log("equalsCUPHA checking actual failed: for property: " + p + ", Expected: " + expected[p] + ", actual: " + actual[p]);
                    return false;
                }
            }
        }
        return true;
    }

    function _convertStringToNode(str) {
        return jabberwerx.util.unserializeXML(str);
    }
    module("jabberwerx.cisco/cupha", {
        setup: function() {
        },

        teardown: function() {
        }
    });

    test("Test CUPHA node persistence", function() {
        //set with no jid specified
        jabberwerx.cisco.cupha._setPersistedNodes("jwtest100@cisco.com");
        var result = jabberwerx.cisco.cupha._getPersistedNodes("jwtest100@cisco.com");
        equals(undefined, result.home);
        equals(undefined, result.backup);
        jabberwerx.cisco.cupha._setPersistedNodes("jwtest100@cisco.com",
                                                   {home: "home-node",
                                                    backup: "backup-node"});
        result = jabberwerx.cisco.cupha._getPersistedNodes("jwtest100@cisco.com");
        equals("home-node", result.home);
        equals("backup-node", result.backup);
        jabberwerx.cisco.cupha._setPersistedNodes("jwtest100@cisco.com", {home:"foo.bar"});
        result = jabberwerx.cisco.cupha._getPersistedNodes("jwtest100@cisco.com");
        equals("foo.bar", result.home);
        equals(undefined, result.backup);

        jabberwerx.cisco.cupha._setPersistedNodes("jwtest100@cisco.com");
        var result = jabberwerx.cisco.cupha._getPersistedNodes("jwtest100@cisco.com");
        equals(undefined, result.home);
        equals(undefined, result.backup);
        //cleanup
        jabberwerx.cisco.cupha._setPersistedNodes("jwtest100@cisco.com");
    });

    test("Test CUPHA URL parser", function() {
        var purl = jabberwerx.cisco.cupha._parseURL();
        equals(jabberwerx.cisco.cupha._buildURL(purl), "");
        ok(!purl.isValid, "undefined URL is not valid");
        purl = jabberwerx.cisco.cupha._parseURL(null);
        equals(jabberwerx.cisco.cupha._buildURL(purl), "");
        ok(!purl.isValid, "null URL is not valid");
        purl = jabberwerx.cisco.cupha._parseURL("");
        equals(jabberwerx.cisco.cupha._buildURL(purl), "");
        ok(!purl.isValid, "empty URL is not valid");

        purl = jabberwerx.cisco.cupha._parseURL("/httpbinding");
        equals(stringify(purl), '{"original":"/httpbinding","protocol":"","host":"","hostname":"","port":"","path":"httpbinding","cupNode":"","cupDomain":"","isIP":false}');
        equals(jabberwerx.cisco.cupha._buildURL(purl), "/httpbinding");

        purl = jabberwerx.cisco.cupha._parseURL("http://sdnode1.cisco.com:7335/httpbinding");
        equals(stringify(purl), '{"original":"http://sdnode1.cisco.com:7335/httpbinding","protocol":"http:","host":"sdnode1.cisco.com:7335","hostname":"sdnode1.cisco.com","port":"7335","path":"httpbinding","cupNode":"sdnode1","cupDomain":"cisco.com","isIP":false}');
        equals(jabberwerx.cisco.cupha._buildURL(purl), "http://sdnode1.cisco.com:7335/httpbinding");

        purl = jabberwerx.cisco.cupha._parseURL("http://sdnode1.cisco.en.com:7335/httpbinding");
        equals(stringify(purl), '{"original":"http://sdnode1.cisco.en.com:7335/httpbinding","protocol":"http:","host":"sdnode1.cisco.en.com:7335","hostname":"sdnode1.cisco.en.com","port":"7335","path":"httpbinding","cupNode":"sdnode1","cupDomain":"cisco.en.com","isIP":false}');
        equals(jabberwerx.cisco.cupha._buildURL(purl), "http://sdnode1.cisco.en.com:7335/httpbinding");

        purl = jabberwerx.cisco.cupha._parseURL("sdnode1");
        equals(stringify(purl), '{"original":"sdnode1","protocol":"","host":"sdnode1","hostname":"sdnode1","port":"","path":"","cupNode":"sdnode1","cupDomain":"","isIP":false}');
        equals(jabberwerx.cisco.cupha._buildURL(purl), "sdnode1");

        purl = jabberwerx.cisco.cupha._parseURL("sdnode1:7335");
        equals(stringify(purl), '{"original":"sdnode1:7335","protocol":"","host":"sdnode1:7335","hostname":"sdnode1","port":"7335","path":"","cupNode":"sdnode1","cupDomain":"","isIP":false}');
        equals(jabberwerx.cisco.cupha._buildURL(purl), "sdnode1:7335");

        purl = jabberwerx.cisco.cupha._parseURL("sdnode1.com");
        equals(stringify(purl), '{"original":"sdnode1.com","protocol":"","host":"sdnode1.com","hostname":"sdnode1.com","port":"","path":"","cupNode":"","cupDomain":"sdnode1.com","isIP":false}');
        equals(jabberwerx.cisco.cupha._buildURL(purl), "sdnode1.com");

        purl = jabberwerx.cisco.cupha._parseURL("http://127.0.0.2:7335/httpbinding");
        equals(stringify(purl), '{"original":"http://127.0.0.2:7335/httpbinding","protocol":"http:","host":"127.0.0.2:7335","hostname":"127.0.0.2","port":"7335","path":"httpbinding","cupNode":"","cupDomain":"","isIP":true}');
        equals(jabberwerx.cisco.cupha._buildURL(purl), "http://127.0.0.2:7335/httpbinding");

        purl = jabberwerx.cisco.cupha._parseURL("http://127.0.0.1/httpbinding");
        equals(stringify(purl), '{"original":"http://127.0.0.1/httpbinding","protocol":"http:","host":"127.0.0.1","hostname":"127.0.0.1","port":"","path":"httpbinding","cupNode":"","cupDomain":"","isIP":true}');
        equals(jabberwerx.cisco.cupha._buildURL(purl), "http://127.0.0.1/httpbinding");

        purl = jabberwerx.cisco.cupha._parseURL("http://2001:db8:85a3::8a2e:370:7335/httpbinding");
        equals(stringify(purl), '{"original":"http://2001:db8:85a3::8a2e:370:7335/httpbinding","protocol":"http:","host":"2001:db8:85a3::8a2e:370:7335","hostname":"","port":"","path":"httpbinding","cupNode":"","cupDomain":"","isIP":true}');
        equals(jabberwerx.cisco.cupha._buildURL(purl), "http://2001:db8:85a3::8a2e:370:7335/httpbinding");

        purl = jabberwerx.cisco.cupha._parseURL("http://FE80::0202:B3FF:FE1E:8329/httpbinding");
        equals(stringify(purl), '{"original":"http://FE80::0202:B3FF:FE1E:8329/httpbinding","protocol":"http:","host":"FE80::0202:B3FF:FE1E:8329","hostname":"","port":"","path":"httpbinding","cupNode":"","cupDomain":"","isIP":true}');
        equals(jabberwerx.cisco.cupha._buildURL(purl), "http://FE80::0202:B3FF:FE1E:8329/httpbinding");

        purl = jabberwerx.cisco.cupha._parseURL("2001:db8:85a3::8a2e:370:7335");
        equals(stringify(purl), '{"original":"2001:db8:85a3::8a2e:370:7335","protocol":"","host":"2001:db8:85a3::8a2e:370:7335","hostname":"","port":"","path":"","cupNode":"","cupDomain":"","isIP":true}');
        equals(jabberwerx.cisco.cupha._buildURL(purl), "2001:db8:85a3::8a2e:370:7335");
    });

    test("Test CUPHA URL Generator", function() {
        //undefined, null or empty nodes returns the sd URL
        var curl = jabberwerx.cisco.cupha._computeURL("http://sdnode1.cisco.com:7335/httpbinding");
        equals(curl, "http://sdnode1.cisco.com:7335/httpbinding");
        curl = jabberwerx.cisco.cupha._computeURL("http://sdnode1.cisco.com:7335/httpbinding", null);
        equals(curl, "http://sdnode1.cisco.com:7335/httpbinding");
        curl = jabberwerx.cisco.cupha._computeURL("http://sdnode1.cisco.com:7335/httpbinding", "");
        equals(curl, "http://sdnode1.cisco.com:7335/httpbinding");
        // "path" only nodes return the path unchanged. Assuming proxy
        curl = jabberwerx.cisco.cupha._computeURL("http://do-not-care:7335/httpbinding", "/myhttpbinding");
        equals(curl, "/myhttpbinding");
        //node is IPv4
        curl = jabberwerx.cisco.cupha._computeURL("https://do-not-care:7335/myhttpbinding", "127.0.0.2");
        equals(curl, "https://127.0.0.2:7335/myhttpbinding");
        //sd is IPv4
        curl = jabberwerx.cisco.cupha._computeURL("https://127.0.0.1:7335/myhttpbinding", "cupnodea.cisco.com");
        equals(curl, "https://cupnodea.cisco.com:7335/myhttpbinding");
        //node is IPv6
        curl = jabberwerx.cisco.cupha._computeURL("https://2001:db8:85a3::8a2e:370:7335/myhttpbinding", "cupnodea");
        equals(curl, "https://cupnodea/myhttpbinding");
        //node is IPv6
        curl = jabberwerx.cisco.cupha._computeURL("https://do-not-care:7334/myhttpbinding", "2001:db8:85a3::8a2e:370:7335");
        equals(curl, "https://2001:db8:85a3::8a2e:370:7335/myhttpbinding");
        //service discovery binding url is IP
        curl = jabberwerx.cisco.cupha._computeURL("http://127.0.0.2:7335/httpbinding", "cupnodea.cisco.com");
        equals(curl, "http://cupnodea.cisco.com:7335/httpbinding");
        //SD is resource, binding URL is "resource like"
        curl = jabberwerx.cisco.cupha._computeURL("/httpbinding", "cup-node-a.cisco.com");
        equals(curl, "/cup-node-a.cisco.com");
        //node is a path, ignore SD URL
        curl = jabberwerx.cisco.cupha._computeURL("/httpbinding", "/cupnodea.cisco.com");
        equals(curl, "/cupnodea.cisco.com");
    });
    test("Test new CUPHA state", function() {
        var expected = {
            enabled: false,
            primarySD: null,
            attemptedPrimarySD: false,
            secondarySD: null,
            currentSD: undefined,
            homeNode: null,
            backupNode: null,
            currentNode: undefined,
            currentURL: undefined
        }

        var hosts = ["node1.cisco.com","node2.cisco.com"];
        //undefined connect params and jid
        var cupha = jabberwerx.cisco.cupha._newCUPHA();
        ok(equalsCUPHA(cupha, expected), "expected results returned when creating empty cupha");
        //undefined jid
        cupha = jabberwerx.cisco.cupha._newCUPHA(cparams);
        expected.enabled = true;
        expected.primarySD =  cparams.httpBindingURL;
        expected.secondarySD = cparams.httpBindingURL_secondary;
        expected.currentSD = expected.primarySD;
        ok(equalsCUPHA(cupha, expected), "expected results returned when creating with undefined jid");

        //no persisted nodes
        jabberwerx.cisco.cupha._setPersistedNodes(cparams.jid);
        cupha = jabberwerx.cisco.cupha._newCUPHA(cparams, cparams.jid);
        ok(equalsCUPHA(cupha, expected), "expected results returned when creating with no persisted nodes");

        //localstorage home and backup node loading
        jabberwerx.cisco.cupha._setPersistedNodes(cparams.jid,
                                                  {home: hosts[0]});
        //cparams
        cupha = jabberwerx.cisco.cupha._newCUPHA(cparams, cparams.jid);
        expected.homeNode = hosts[0];
        expected.currentNode = hosts[0];

        ok(equalsCUPHA(cupha, expected), "expected results returned when creating with home node persisted");
        //with cparams and hosts
        jabberwerx.cisco.cupha._setPersistedNodes(cparams.jid,
                                                  {home: hosts[0],
                                                   backup: hosts[1]});
        expected.backupNode = hosts[1];
        cupha = jabberwerx.cisco.cupha._newCUPHA(cparams, cparams.jid);
        ok(equalsCUPHA(cupha, expected), "expected results returned when creating with home and backup nodes persisted");
        //clear localstore before next test
        jabberwerx.cisco.cupha._setPersistedNodes(cparams.jid);
    });

    test("Test CUPHA OnSASL state changes", function() {
        var featnohosts =
            "<features>" +
                "<mechanisms xmlns='urn:ietf:params:xml:ns:xmpp-sasl'>" +
                    "<mechanism>EXTERNAL</mechanism>" +
                    "<mechanism>PLAIN</mechanism>" +
                "</mechanisms>" +
            "</features>";
        var feathomeonly =
            "<features>" +
                "<mechanisms xmlns='urn:ietf:params:xml:ns:xmpp-sasl'>" +
                    "<mechanism>EXTERNAL</mechanism>" +
                    "<mechanism>PLAIN</mechanism>" +
                    "<hostname>home-node</hostname>" +
                "</mechanisms>" +
            "</features>";

        var expected = {
            enabled: false,
            primarySD: null,
            attemptedPrimarySD: false,
            secondarySD: null,
            currentSD: undefined,
            homeNode: null,
            backupNode: null,
            currentNode: undefined,
            currentURL: undefined
        }

        //disabled cupha
        var cupha = jabberwerx.cisco.cupha._newCUPHA(cparams);
        cupha.enabled = false;
        expected = jabberwerx.$.extend({}, cupha);
        var result = jabberwerx.cisco.cupha._updateUserNodes(cupha, null, cparams.jid);
        ok(!result, "No restart required - CUPHA disabled");
        //unchanged cupha
        ok(equalsCUPHA(cupha, expected), "expected results returned");
        expected.enabled = cupha.enabled = true;
        //no feats packet ergo no hosts
        result = jabberwerx.cisco.cupha._updateUserNodes(cupha, null, cparams.jid);
        ok(!result, "No restart required - no feature stanza");
        ok(equalsCUPHA(cupha, expected), "expected results returned");
        // no hosts in feat
        var feats = jabberwerx.system.parseXMLFromString(featnohosts);
        result = jabberwerx.cisco.cupha._updateUserNodes(cupha, feats, cparams.jid);
        ok(!result, "No restart required - no hostnames in features");
        ok(equalsCUPHA(cupha, expected), "expected results returned");
        //home home node only
        feats = jabberwerx.system.parseXMLFromString(feathomeonly);
        result = jabberwerx.cisco.cupha._updateUserNodes(cupha, feats, cparams.jid);
        ok(result, "restart required - found new home node");
        expected.currentNode = expected.homeNode = "home-node";
        expected.currentURL = "https://home-node.cisco.com:7335/httpbinding";

        ok(equalsCUPHA(cupha, expected), "expected results returned");
        //Already connected to homeNode
        result = jabberwerx.cisco.cupha._updateUserNodes(cupha, feats, cparams.jid);
        ok(!result, "No restart required - already using homeNode");
        expected.currentURL = "https://home-node.cisco.com:7335/httpbinding";
        ok(equalsCUPHA(cupha, expected), "expected results returned");

        //home and backup nodes
        cupha.homeNode = cupha.backupNode = null;
        delete cupha.currentURL;
        feats = jabberwerx.system.parseXMLFromString(feathosts);
        result = jabberwerx.cisco.cupha._updateUserNodes(cupha, feats, cparams.jid);
        ok(result, "restart required - found new home and backup nodes");
        expected.currentNode = expected.homeNode = "home-node";
        expected.backupNode = "backup-node";
        ok(equalsCUPHA(cupha, expected), "expected results returned");

        //ensure backup cleared as needed
        cupha.homeNode = cupha.backupNode = null;
        delete cupha.currentURL;
        feats = jabberwerx.system.parseXMLFromString(feathomeonly);
        result = jabberwerx.cisco.cupha._updateUserNodes(cupha, feats, cparams.jid);
        ok(result, "restart required - found new home node");
        expected.backupNode = null;
        ok(equalsCUPHA(cupha, expected), "expected results returned");
        //already connected to correct home node
        cupha.currentURL = jabberwerx.cisco.cupha._computeURL(cupha.currentSD, cupha.homeNode);
        expected.currentURL = cupha.currentURL;
        expected.backupNode = "backup-node";
        feats = jabberwerx.system.parseXMLFromString(feathosts);
        result = jabberwerx.cisco.cupha._updateUserNodes(cupha, feats, cparams.jid);
        ok(!result, "no restart required - already connected to home node");
        ok(equalsCUPHA(cupha, expected), "expected results returned");
        //already connected to correct home node
        cupha.currentURL = jabberwerx.cisco.cupha._computeURL(cupha.currentSD, cupha.backupNode);
        expected.currentURL = cupha.currentURL;
        feats = jabberwerx.system.parseXMLFromString(feathosts);
        result = jabberwerx.cisco.cupha._updateUserNodes(cupha, feats, cparams.jid);
        ok(!result, "no restart required - already connected to backup node");
        ok(equalsCUPHA(cupha, expected), "expected results returned");
    });
    test("Test CUPHA OnConnectionError state changes", function() {
        var expected = {
            enabled: false,
            primarySD: null,
            attemptedPrimarySD: false,
            secondarySD: null,
            currentSD: undefined,
            homeNode: null,
            backupNode: null,
            currentNode: undefined,
            currentURL: undefined
        }

        var cupha = jabberwerx.cisco.cupha._newCUPHA(cparams);
        expected = jabberwerx.$.extend({}, cupha);
        //set initial home and backup nodes
        feats = jabberwerx.system.parseXMLFromString(feathosts);
        jabberwerx.cisco.cupha._updateUserNodes(cupha, feats, cparams.jid);
        expected = jabberwerx.$.extend({}, cupha);

        cupha.currentURL = null;
        var result = jabberwerx.cisco.cupha._updateOnDisconnect(cupha);
        //should have changed currentURl to home
        expected.currentURL = jabberwerx.cisco.cupha._computeURL(cupha.currentSD, cupha.currentNode);
        ok(result, "restart required - changed currentURL but node stayed the same, primary SD");
        ok(equalsCUPHA(cupha, expected), "expected results returned");

        expected.currentURL = jabberwerx.cisco.cupha._computeURL(cupha.currentSD, cupha.backupNode);
        expected.currentNode = cupha.backupNode;
        result = jabberwerx.cisco.cupha._updateOnDisconnect(cupha);
        ok(result, "restart required - changed from home to backup node, primary SD");
        ok(equalsCUPHA(cupha, expected), "expected results returned");

        // URL was backup node, should become primarySD
        result = jabberwerx.cisco.cupha._updateOnDisconnect(cupha);
        ok(result, "restart required - changed from backup node to primary SD");
        expected.currentNode = null;
        expected.currentSD = cupha.primarySD;
        expected.attemptedPrimarySD = true;
        expected.currentURL = jabberwerx.cisco.cupha._computeURL(cupha.primarySD, null);
        ok(equalsCUPHA(cupha, expected), "expected results returned");

        //URL was primary SD, should become secondary SD
        result = jabberwerx.cisco.cupha._updateOnDisconnect(cupha);
        ok(result, "restart required - changed from primary SD to secondary SD");
        expected.currentSD = cupha.secondarySD;
        expected.currentURL = jabberwerx.cisco.cupha._computeURL(cupha.secondarySD, null);
        ok(equalsCUPHA(cupha, expected), "expected results returned");

        cupha.currentNode = cupha.homeNode;
        var result = jabberwerx.cisco.cupha._updateOnDisconnect(cupha);
        //should have changed currentURl to home
        expected.currentURL = jabberwerx.cisco.cupha._computeURL(cupha.secondarySD, cupha.homeNode);
        expected.currentNode = cupha.homeNode;
        ok(result, "restart required - changed currentURL but node stayed the same, secondary SD");
        ok(equalsCUPHA(cupha, expected), "expected results returned");

        expected.currentURL = jabberwerx.cisco.cupha._computeURL(cupha.secondarySD, cupha.backupNode);
        expected.currentNode = cupha.backupNode;
        result = jabberwerx.cisco.cupha._updateOnDisconnect(cupha);
        ok(result, "restart required - changed from home to backup node, secondarySD");
        ok(equalsCUPHA(cupha, expected), "expected results returned");

        //URL was secondary, should just return false for normal non-recoverable error handling
        result = jabberwerx.cisco.cupha._updateOnDisconnect(cupha);
        ok(!result, "no restart required - no HA nodes are available");
    });

});
