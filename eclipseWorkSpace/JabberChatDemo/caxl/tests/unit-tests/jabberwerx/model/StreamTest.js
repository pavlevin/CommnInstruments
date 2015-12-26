/**
 * filename:        StreamTest.js
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2009-2011 Cisco Systems, Inc.  All Rights Reserved.
 */

jabberwerx.$(document).ready(function() {
    module("jabberwerx/model/stream:errorinfo");
    test("Test create", function() {
        var err = new jabberwerx.Stream.ErrorInfo(
                "{urn:ietf:params:xml:ns:xmpp-streams}service-unavailable",
                "this service is not available");
        equals(err.condition, "{urn:ietf:params:xml:ns:xmpp-streams}service-unavailable");
        equals(err.text, "this service is not available");
    });
    test("Test createWithNode", function() {
        var node;
        node = new jabberwerx.NodeBuilder("{http://etherx.jabber.org/streams}stream:error");
        node.element("{urn:ietf:params:xml:ns:xmpp-streams}undefined-condition").parent.
             element("{urn:ietf:params:xml:ns:xmpp-streams}text").text("unknown failure").parent;
        node = node.data;

        var info = jabberwerx.Stream.ErrorInfo.createWithNode(node);
        ok(info instanceof jabberwerx.Stream.ErrorInfo);
        equals(info.condition, "{urn:ietf:params:xml:ns:xmpp-streams}undefined-condition");
        equals(info.text, "unknown failure");
    });
});
