/**
 * filename:        StanzaTest.js
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2009-2011 Cisco Systems, Inc.  All Rights Reserved.
 */

jabberwerx.$(document).ready(function() {

    module("jabberwerx/model/stanza");
    var CMP_NODE_OK = "actual and expected nodes are equal";

    function _cmpNodes(actual, expected) {
        var cstr;
        if (actual && expected)
        {
            if (actual.nodeType != expected.nodeType) { return "nodeType actual: " + actual.nodeType + " != expected: " + expected.nodeType; }
            if (actual.nodeName != expected.nodeName) { return "nodeName actual: " + actual.nodeName + " != expected: " + expected.nodeName; }
            if (actual.nodeValue != expected.nodeValue) { return "nodeValue actual: " + actual.nodeValue + " != expected: " + expected.nodeValue; }
            cstr = _compareNodeLists(actual.attributes, expected.attributes);
            if(cstr) { return "attributes: " + cstr; }
            cstr = _compareNodeLists(actual.childNodes, expected.childNodes);
            if(cstr) {  return "children: " + cstr; }
        } else if (actual || expected) { return "refs actual: " + actual + " != expected: " + expected; }
        return CMP_NODE_OK;
    }

    function _compareNodeLists(actual, expected) {
        var cstr;
        if (actual && expected) {
            if (actual.length != expected.length) {return "length actual: " + actual.length + " != expected: " + expected.length;  }
            var nodes1 = _nodesToSortedArray(actual);
            var nodes2 = _nodesToSortedArray(expected);
            for (var i=0; i<nodes1.length; i++) {
                cstr = _compareNodeLists(nodes1.childNodes, nodes2.childNodes);
                if(cstr != null) { return cstr; }
            }
        } else if (actual || expected) { return "refs actual: " + actual + " != expected: " + expected; }
        return null;
    }

    function _nodesToSortedArray(nodes) {
        var arr = [];
        jabberwerx.$.each(nodes, function() {
            arr.push(this);
        });
        arr.sort(function(a,b) {
            if (a.nodeType > b.nodeType) {
                return 1;
            } else if (a.nodeType < b.nodeType) {
                return -1;
            }

            if (a.nodeName > b.nodeName) {
                return 1;
            } else if (a.nodeName < b.nodeName) {
                return -1;
            }

            return 0;
        });
        return arr;
    }
    function _str2node(str) {
        return jabberwerx.system.parseXMLFromString(str);
    }

    test("Test Create with String", function() {
        var stanza;
        stanza = new jabberwerx.Stanza("{urn:jabberwerx:test}stanza");
        equals(stanza.pType(), "stanza", "pType is 'stanza'");
        equals(stanza.getNode().namespaceURI, "urn:jabberwerx:test", "namespace is 'urn:jabberwerx:test'");
        ok(stanza.timestamp instanceof Date, "contains timestamp");

        stanza = new jabberwerx.Stanza("message");
        equals(stanza.pType(), "message", "pType is 'message'");
        equals(stanza.getNode().namespaceURI, "jabber:client", "namespace is 'jabber:client'");
        ok(stanza.timestamp instanceof Date, "contains timestamp");
    });
    test("Test Create with Node", function() {
        var stanza;
        stanza = new jabberwerx.Stanza(new jabberwerx.NodeBuilder("{urn:jabberwerx:test}stanza").data);
        equals(stanza.pType(), "stanza", "pType is 'stanza'");
        ok(stanza.timestamp instanceof Date, "containst timestamp");
    });
    test("Test static create method", function() {
        var stanza, node;
    });

    test("Test Delayed Timestamp", function() {
        var builder, msg, date;
        builder = new jabberwerx.NodeBuilder("{jabber:client}message");
        builder.element("{jabber:x:delay}x").
                attribute("stamp", "20090924T11:39:36").
                attribute("from", "user@example.com");
        msg = jabberwerx.Stanza.createWithNode(builder.data);
        date = new Date(Date.UTC(2009,8,24,11,39,36));
        same(msg.timestamp, date);

        builder = new jabberwerx.NodeBuilder("{jabber:client}message");
        builder.element("{jabber:x:delay}x").
                attribute("stamp", "20090924T11:39:36.314159265").
                attribute("from", "user@example.com");
        msg = jabberwerx.Stanza.createWithNode(builder.data);
        date = new Date(Date.UTC(2009,8,24,11,39,36));
        //ignore factional part
        same(msg.timestamp, date);

        builder = new jabberwerx.NodeBuilder("{jabber:client}message");
        builder.element("{urn:xmpp:delay}delay").
                attribute("stamp", "2009-09-24T11:39:36Z").
                attribute("from", "user@example.com");
        msg = jabberwerx.Stanza.createWithNode(builder.data);
        date = new Date(Date.UTC(2009,8,24,11,39,36));
        same(msg.timestamp, date);

        builder = new jabberwerx.NodeBuilder("{jabber:client}message");
        builder.element("{urn:xmpp:delay}delay").
                attribute("stamp", "2009-09-24T11:39:36.314159265Z").
                attribute("from", "user@example.com");
        builder.element("{jabber:x:delay}x").
                attribute("stamp", "20100924T11:39:36").
                attribute("from", "user@example.com");
        msg = jabberwerx.Stanza.createWithNode(builder.data);
        //ignore factional part, should pickup urn:xmpp:delay over incorrect jabber:x:delay
        date = new Date(Date.UTC(2009,8,24,11,39,36));
        same(msg.timestamp, date);
    });
    test("Test Delayed Timestamp Incorrect Format", function() {
        var builder, msg,date;
        builder = new jabberwerx.NodeBuilder("message");
        builder.element("{jabber:x:delay}x").
                attribute("stamp", "incorrect format").
                attribute("from", "user@example.com");
        msg = jabberwerx.Stanza.createWithNode(builder.data);
        date = new Date();

        // Stanza constructor should set the timestamp to our current time if an invalid date is
        // passed through. Therefore we check to ensure the timestamp is within 1 second of the
        // current time (hacky but it works :-) )
        ok(msg.timestamp > date - 1000 && msg.timestamp <= date, "Timestamp is of Stanza object " +
                                                                  "creation time");
        builder = new jabberwerx.NodeBuilder("message");
        builder.element("{urn:xmpp:delay}delay").
                attribute("stamp", "incorrect format").
                attribute("from", "user@example.com");
        msg = jabberwerx.Stanza.createWithNode(builder.data);
        date = new Date();

        // Stanza constructor should set the timestamp to our current time if an invalid date is
        // passed through. Therefore we check to ensure the timestamp is within 1 second of the
        // current time (hacky but it works :-) )
        ok(msg.timestamp > date - 1000 && msg.timestamp <= date, "Timestamp is of Stanza object " +
                                                                  "creation time");
    });

    test("Test get/set Type", function() {
        var stanza;
        var cmpResult;
        stanza = new jabberwerx.Stanza("{urn:jabberwerx:test}stanza");
        equals(stanza.getType(), null);

        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setType("fake");
        equals(stanza.getType(), "fake");

        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" type="fake"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setType(null);
        equals(stanza.getType(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setType("faux");
        equals(stanza.getType(), "faux");
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" type="faux"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setType(undefined);
        equals(stanza.getType(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setType("bogus");
        equals(stanza.getType(), "bogus");
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" type="bogus"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setType("");
        equals(stanza.getType(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        var builder;
        builder = new jabberwerx.NodeBuilder("{urn:jabberwerx:test}stanza").
                    attribute("type", "artificial");
        stanza = new jabberwerx.Stanza(builder.data);
        equals(stanza.getType(), "artificial");
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" type="artificial"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setType("fake");
        equals(stanza.getType(), "fake");
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" type="fake"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setType(null);
        equals(stanza.getType(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);
    });
    test("Test get/set ID", function() {
        var stanza;
        var cmpResult;

        stanza = new jabberwerx.Stanza("{urn:jabberwerx:test}stanza");
        equals(stanza.getID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setID("id1");
        equals(stanza.getID(), "id1");
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" id="id1"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setID(null);
        equals(stanza.getID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setID("second-id");
        equals(stanza.getID(), "second-id");
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" id="second-id"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setID(undefined);
        equals(stanza.getID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setID("another id");
        equals(stanza.getID(), "another id");
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" id="another id"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setID("");
        equals(stanza.getID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        var builder;
        builder = new jabberwerx.NodeBuilder("{urn:jabberwerx:test}stanza").
                    attribute("id", "id:tres");
        stanza = new jabberwerx.Stanza(builder.data);
        equals(stanza.getID(), "id:tres");
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" id="id:tres"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setID("id4");
        equals(stanza.getID(), "id4");
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" id="id4"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setID(null);
        equals(stanza.getID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);
    });
    test("Test get/set From", function() {
        var stanza;
        var cmpResult;

        stanza = new jabberwerx.Stanza("{urn:jabberwerx:test}stanza");
        equals(stanza.getFrom(), null);
        equals(stanza.getFromJID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        var jid;
        jid = new jabberwerx.JID("jwtest0@example.com");
        stanza.setFrom("jwtest0@example.com");
        equals(stanza.getFrom(), "jwtest0@example.com");
        ok(stanza.getFromJID().equals(jid));
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" from="jwtest0@example.com"/>'));
        equals(cmpResult, CMP_NODE_OK);

        jid = new jabberwerx.JID("jwtest1@example.com");
        stanza.setFrom(jid);
        equals(stanza.getFrom(), "jwtest1@example.com");
        ok(stanza.getFromJID().equals(jid));
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" from="jwtest1@example.com"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setFrom(null);
        equals(stanza.getFrom(), null);
        equals(stanza.getFromJID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        jid = new jabberwerx.JID("jwtest2@example.com/resource");
        stanza.setFrom(jid);
        equals(stanza.getFrom(), "jwtest2@example.com/resource");
        ok(stanza.getFromJID().equals(jid));
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" from="jwtest2@example.com/resource"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setFrom(undefined);
        equals(stanza.getFrom(), null);
        equals(stanza.getFromJID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        jid = new jabberwerx.JID("jwtest3@example.com/resource");
        stanza.setFrom("jwtest3@example.com/resource");
        equals(stanza.getFrom(), "jwtest3@example.com/resource");
        ok(stanza.getFromJID().equals(jid));
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" from="jwtest3@example.com/resource"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setFrom("");
        equals(stanza.getFrom(), null);
        equals(stanza.getFromJID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        var builder;
        builder = new jabberwerx.NodeBuilder("{urn:jabberwerx:test}stanza").
                    attribute("from", "jwtest4@example.com");
        jid = new jabberwerx.JID("jwtest4@example.com");
        stanza = new jabberwerx.Stanza(builder.data);
        equals(stanza.getFrom(), "jwtest4@example.com");
        ok(stanza.getFromJID().equals(jid));
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" from="jwtest4@example.com"/>'));
        equals(cmpResult, CMP_NODE_OK);

        jid = new jabberwerx.JID("jwtest5@example.com");
        stanza.setFrom("jwtest5@example.com");
        equals(stanza.getFrom(), "jwtest5@example.com");
        ok(stanza.getFromJID().equals(jid));
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" from="jwtest5@example.com"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setFrom(null);
        equals(stanza.getFrom(), null);
        equals(stanza.getFromJID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);
    });
    test("Test get/set To", function() {
        var stanza;
        var cmpResult;

        stanza = new jabberwerx.Stanza("{urn:jabberwerx:test}stanza");
        equals(stanza.getTo(), null);
        equals(stanza.getToJID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        var jid;
        jid = new jabberwerx.JID("jwtest0@example.com");
        stanza.setTo("jwtest0@example.com");
        equals(stanza.getTo(), "jwtest0@example.com");
        ok(stanza.getToJID().equals(jid));
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" to="jwtest0@example.com"/>'));
        equals(cmpResult, CMP_NODE_OK);

        jid = new jabberwerx.JID("jwtest1@example.com");
        stanza.setTo(jid);
        equals(stanza.getTo(), "jwtest1@example.com");
        ok(stanza.getToJID().equals(jid));
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" to="jwtest1@example.com"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setTo(null);
        equals(stanza.getTo(), null);
        equals(stanza.getToJID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        jid = new jabberwerx.JID("jwtest2@example.com/resource");
        stanza.setTo(jid);
        equals(stanza.getTo(), "jwtest2@example.com/resource");
        ok(stanza.getToJID().equals(jid));
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" to="jwtest2@example.com/resource"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setTo(undefined);
        equals(stanza.getTo(), null);
        equals(stanza.getToJID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        jid = new jabberwerx.JID("jwtest3@example.com/resource");
        stanza.setTo("jwtest3@example.com/resource");
        equals(stanza.getTo(), "jwtest3@example.com/resource");
        ok(stanza.getToJID().equals(jid));
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" to="jwtest3@example.com/resource"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setTo("");
        equals(stanza.getTo(), null);
        equals(stanza.getToJID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);

        var builder;
        builder = new jabberwerx.NodeBuilder("{urn:jabberwerx:test}stanza").
                    attribute("to", "jwtest4@example.com");
        jid = new jabberwerx.JID("jwtest4@example.com");
        stanza = new jabberwerx.Stanza(builder.data);
        equals(stanza.getTo(), "jwtest4@example.com");
        ok(stanza.getToJID().equals(jid));
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" to="jwtest4@example.com"/>'));
        equals(cmpResult, CMP_NODE_OK);

        jid = new jabberwerx.JID("jwtest5@example.com");
        stanza.setTo("jwtest5@example.com");
        equals(stanza.getTo(), "jwtest5@example.com");
        ok(stanza.getToJID().equals(jid));
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" to="jwtest5@example.com"/>'));
        equals(cmpResult, CMP_NODE_OK);

        stanza.setTo(null);
        equals(stanza.getTo(), null);
        equals(stanza.getToJID(), null);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test"/>'));
        equals(cmpResult, CMP_NODE_OK);
    });
    test("Test swap", function() {
        var stanza;
        var cmpResult;

        stanza = new jabberwerx.Stanza("{urn:jabberwerx:test}stanza");
        stanza.setFrom("jwtest1@example.com");
        stanza.setTo("jwtest2@example.com");
        stanza.setID("some-random-id");
        new jabberwerx.NodeBuilder(stanza.getNode()).element("{jabber:x:oob}x").
            element("url").text("http://www.cisco.com/").parent.
            element("desc").text("Cisco Systems, Inc").parent;

        var swapped = stanza.swap();
        ok(swapped instanceof jabberwerx.Stanza, "instance of jabberwerx.Stanza");
        equals(swapped.getTo(), stanza.getFrom());
        equals(swapped.getFrom(), null);
        equals(swapped.getID(), stanza.getID());
        equals(swapped.getType(), stanza.getType());
        ok(jabberwerx.$(swapped.getNode()).children("x[xmlns='jabber:x:oob']").length == 1);

        cmpResult = _cmpNodes(swapped.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" to="jwtest1@example.com" id="some-random-id"><x xmlns="jabber:x:oob"><url>http://www.cisco.com/</url><desc>Cisco Systems, Inc</desc></x></stanza>'));
        equals(cmpResult, CMP_NODE_OK);
    });
    test("Test error", function() {
        var stanza;
        var cmpResult;

        stanza = new jabberwerx.Stanza("{urn:jabberwerx:test}stanza");
        stanza.setFrom("jwtest1@example.com");
        stanza.setTo("jwtest2@example.com");
        equals(stanza.isError(), false);

        stanza = stanza.errorReply(new jabberwerx.Stanza.ErrorInfo("cancel", "{urn:ietf:params:xml:ns:xmpp-stanzas}internal-server-error"));
        equals(stanza.isError(), true);
        cmpResult = _cmpNodes(stanza.getNode(), _str2node('<stanza xmlns="urn:jabberwerx:test" to="jwtest1@example.com" type="error"><error type="cancel"><internal-server-error xmlns="urn:ietf:params:xml:ns:xmpp-stanzas"/></error></stanza>'));
        equals(cmpResult, CMP_NODE_OK);
    });
    test("Test createWithNode", function() {
        var stanza;
        var node;

        node = new jabberwerx.NodeBuilder("{jabber:client}iq").
                attribute("id", "some-random-id").
                attribute("type", "result").
                attribute("from", "example.com").
                attribute("to", "jwtest1@example.com").
                data;
        stanza = jabberwerx.Stanza.createWithNode(node);
        ok((stanza instanceof jabberwerx.Stanza), "instanceof Stanza");
        ok((stanza instanceof jabberwerx.IQ), "instanceof IQ");
        ok(!(stanza instanceof jabberwerx.Message), "NOT instanceof Message");
        ok(!(stanza instanceof jabberwerx.Presence), "NOT instanceof Presence");

        node = new jabberwerx.NodeBuilder("{jabber:client}message").
                attribute("id", "some-random-id").
                attribute("type", "chat").
                attribute("from", "example.com").
                attribute("to", "jwtest1@example.com").
                element("body").text("some message").parent.
                data;
        stanza = jabberwerx.Stanza.createWithNode(node);
        ok((stanza instanceof jabberwerx.Stanza), "instanceof Stanza");
        ok(!(stanza instanceof jabberwerx.IQ), "NOT instanceof IQ");
        ok((stanza instanceof jabberwerx.Message), "instanceof Message");
        ok(!(stanza instanceof jabberwerx.Presence), "NOT instanceof Presence");

        node = new jabberwerx.NodeBuilder("{jabber:client}presence").
                attribute("from", "jwtest2@example.com/resource").
                attribute("to", "jwtest1@example.com").
                element("show").text("dnd").parent.
                element("status").text("busy testing").parent.
                data;
        stanza = jabberwerx.Stanza.createWithNode(node);
        ok((stanza instanceof jabberwerx.Stanza), "instanceof Stanza");
        ok(!(stanza instanceof jabberwerx.IQ), "NOT instanceof IQ");
        ok(!(stanza instanceof jabberwerx.Message), "NOT instanceof Message");
        ok((stanza instanceof jabberwerx.Presence), "instanceof Presence");

        node = new jabberwerx.NodeBuilder("{jabber:client}not-real").
                attribute("id", "some-random-id").
                attribute("type", "result").
                attribute("from", "example.com").
                attribute("to", "jwtest1@example.com").
                data;
        stanza = jabberwerx.Stanza.createWithNode(node);
        ok((stanza instanceof jabberwerx.Stanza), "instanceof Stanza");
        ok(!(stanza instanceof jabberwerx.IQ), "NOT instanceof IQ");
        ok(!(stanza instanceof jabberwerx.Message), "NOT instanceof Message");
        ok(!(stanza instanceof jabberwerx.Presence), "NOT instanceof Presence");

        var caught;
        try {
            stanza = jabberwerx.Stanza.createWithNode("not a node");
            caught = false;
        } catch (ex) {
            caught = true;
        }
        ok(caught, "expected error thrown");
    });

    module("jabberwerx/model/stanza:errorinfo");
    test("Test create", function() {
        var err = new jabberwerx.Stanza.ErrorInfo(
                "cancel",
                "{urn:ietf:params:xml:ns:xmpp-stanzas}bad-request",
                "the necessary information is missing");
        equals(err.type, "cancel");
        equals(err.condition, "{urn:ietf:params:xml:ns:xmpp-stanzas}bad-request");
        equals(err.text, "the necessary information is missing");
        cmpResult = _cmpNodes(err.getNode(), _str2node('<error type="cancel"><bad-request xmlns="urn:ietf:params:xml:ns:xmpp-stanzas"/><text xmlns="urn:ietf:params:xml:ns:xmpp-stanzas">the necessary information is missing</text></error>'));
        equals(cmpResult, CMP_NODE_OK);
    });
    test("Test createWithNode", function() {
        var node;
        node = new jabberwerx.NodeBuilder("{jabber:client}error");
        node.attribute("type", "cancel").
             element("{urn:ietf:params:xml:ns:xmpp-stanzas}feature-not-implemented").parent.
             element("{urn:ietf:params:xml:ns:xmpp-stanzas}text").text("this feature is not implemented").parent;
        node = node.data;

        var info = jabberwerx.Stanza.ErrorInfo.createWithNode(node);
        ok(info instanceof jabberwerx.Stanza.ErrorInfo);
        equals(info.type, "cancel");
        equals(info.condition, "{urn:ietf:params:xml:ns:xmpp-stanzas}feature-not-implemented");
        equals(info.text, "this feature is not implemented");
    });

    module("jabberwerx/model/stanza:iq");
    test("Test get/set Query", function() {
        var iq = new jabberwerx.IQ();
        equals(iq.getQuery(), null);

        var payload = new jabberwerx.NodeBuilder("{urn:jabberwerx:payload}root-element").
                data;
        iq.setQuery(payload);
        equals(iq.getQuery().xml, payload.xml);

        iq.setQuery(null);
        equals(iq.getQuery(), null);

        var caught;
        try {
            iq.setQuery("some random text");
            caught = false;
        } catch (ex) {
            caught = true;
        }
        ok(caught, "expected error thrown");
    });
    test("Test reply", function() {
        var cmpResult;

        var iq = new jabberwerx.IQ();
        iq.setFrom("jwtest1@example.com");
        iq.setTo("jwtest2@example.com");
        iq.setType("get");
        iq.setID("some-random-id");
        new jabberwerx.NodeBuilder(iq.getNode()).
                element("{urn:xmpp:ping}ping");

        var result = iq.reply();
        equals(result.getTo(), iq.getFrom());
        equals(result.getFrom(), null);
        equals(result.getID(), iq.getID());
        equals(result.getType(), "result");
        equals(result.getQuery(), null);
        cmpResult = _cmpNodes(result.getNode(), _str2node('<iq xmlns="jabber:client" to="jwtest1@example.com" type="result" id="some-random-id"/>'));
        equals(cmpResult, CMP_NODE_OK);

        var payload = new jabberwerx.NodeBuilder("{urn:xmpp:ping}pong").data;
        result = iq.reply(payload);
        equals(result.getTo(), iq.getFrom());
        equals(result.getFrom(), null);
        equals(result.getID(), iq.getID());
        equals(result.getType(), "result");
        equals(result.getQuery().xml, payload.xml);
        cmpResult = _cmpNodes(result.getNode(), _str2node('<iq xmlns="jabber:client" to="jwtest1@example.com" type="result" id="some-random-id"><pong xmlns="urn:xmpp:ping"/></iq>'));
        equals(cmpResult, CMP_NODE_OK);

        result = iq.reply("<pong xmlns='urn:xmpp:ping'/>");
        equals(result.getTo(), iq.getFrom());
        equals(result.getFrom(), null);
        equals(result.getID(), iq.getID());
        equals(result.getType(), "result");
        equals(result.getQuery().xml, payload.xml);
        cmpResult = _cmpNodes(result.getNode(), _str2node('<iq xmlns="jabber:client" to="jwtest1@example.com" type="result" id="some-random-id"><pong xmlns="urn:xmpp:ping"/></iq>'));
        equals(cmpResult, CMP_NODE_OK);

        var caught;
        try {
            result = iq.reply(42);
        } catch (ex) {
            caught = true;
        }
        ok(caught, "expected error thrown");
    });

    module("jabberwerx/model/stanza:message");
    /* Utility funuctions */
    function invokeInvalidContentFormat(str) {
        try {
            jabberwerx.Message.translate(str, "Foo");
            ok(false, "An exception should have been thrown before this line is reached.");
        } catch (e) {
            ok(e instanceof jabberwerx.Message.InvalidContentFormat,
               "The exception thrown should be an instance of jabberwerx.Message.InvalidContentFormat");
        }
    }

    /* Test functions */
    test("Test get/set Body", function() {
        var cmpResult;

        var msg = new jabberwerx.Message();
        equals(msg.getBody(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setBody("message text");
        equals(msg.getBody(), "message text");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><body>message text</body></message>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setBody("");
        equals(msg.getBody(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setBody("more message text");
        equals(msg.getBody(), "more message text");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><body>more message text</body></message>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setBody(null);
        equals(msg.getBody(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setBody("third message text");
        equals(msg.getBody(), "third message text");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><body>third message text</body></message>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setBody(undefined);
        equals(msg.getBody(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setBody("yet another message text!");
        equals(msg.getBody(), "yet another message text!");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><body>yet another message text!</body></message>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setBody();
        equals(msg.getBody(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);
   });
    test("Test get/set HTML", function() {
        var cmpResult;
        var expected;

        var msg = new jabberwerx.Message();
        equals(msg.getHTML(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setHTML();
        equals(msg.getHTML(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setHTML("");
        equals(msg.getHTML(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        //catch some exceptions when setting html
        try {
            msg.setHTML({});
            ok(false, "bad setHTML argument caught");
        } catch (ex) {
            ok(ex instanceof TypeError, "bad setHTML argument caught")
        }
        try {
            msg.setHTML([{}]);
            ok(false, "bad setHTML argument caught");
        } catch (ex) {
            ok(ex instanceof TypeError, "bad setHTML argument caught")
        }
        try {
            msg.setHTML([]);
            ok(false, "bad setHTML argument caught");
        } catch (ex) {
            ok(ex instanceof TypeError, "bad setHTML argument caught")
        }
        equals(msg.getHTML(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setHTML("<p style='font-size:large'>foo</p>");
        expected = _str2node("<body xmlns='http://www.w3.org/1999/xhtml'><p style='font-size:large'>foo</p></body>");
        var html = msg.getHTML();
        ok(html, "non null getHTML");
        equals(html.xml, expected.xml);

        expected = "<message xmlns='jabber:client'><html xmlns='http://jabber.org/protocol/xhtml-im'>" + expected.xml + "</html><body>foo</body></message>";
        cmpResult = _cmpNodes(msg.getNode(), _str2node(expected));
        equals(cmpResult, CMP_NODE_OK);

        msg.setHTML();
        equals(msg.getHTML(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setHTML("<p style='font-size:large'>foo</p>");
        msg.setBody("bar");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><body>bar</body></message>'));
        equals(cmpResult, CMP_NODE_OK);
    });
    test("Test get/set Subject", function() {
        var cmpResult;

        var msg = new jabberwerx.Message();
        equals(msg.getSubject(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setSubject("message subject");
        equals(msg.getSubject(), "message subject");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><subject>message subject</subject></message>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setSubject("");
        equals(msg.getSubject(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setSubject("more message subject");
        equals(msg.getSubject(), "more message subject");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><subject>more message subject</subject></message>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setSubject(null);
        equals(msg.getSubject(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setSubject("third message subject");
        equals(msg.getSubject(), "third message subject");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><subject>third message subject</subject></message>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setSubject(undefined);
        equals(msg.getSubject(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setSubject("yet another message subject!");
        equals(msg.getSubject(), "yet another message subject!");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><subject>yet another message subject!</subject></message>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setSubject();
        equals(msg.getSubject(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);
    });
    test("Test get/set Thread", function() {
        var cmpResult;

        var msg = new jabberwerx.Message();
        equals(msg.getThread(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setThread("some-message-thread");
        equals(msg.getThread(), "some-message-thread");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><thread>some-message-thread</thread></message>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setThread("");
        equals(msg.getThread(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setThread("more-message-thread");
        equals(msg.getThread(), "more-message-thread");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><thread>more-message-thread</thread></message>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setThread(null);
        equals(msg.getThread(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setThread("third-message-thread");
        equals(msg.getThread(), "third-message-thread");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><thread>third-message-thread</thread></message>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setThread(undefined);
        equals(msg.getThread(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setThread("yet-another-message-thread");
        equals(msg.getThread(), "yet-another-message-thread");
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"><thread>yet-another-message-thread</thread></message>'));
        equals(cmpResult, CMP_NODE_OK);

        msg.setThread();
        equals(msg.getThread(), null);
        cmpResult = _cmpNodes(msg.getNode(), _str2node('<message xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);
    });

    test("Test plaintext XEP-0245 Message", function() {
        var body = "/me shrugs in disgust";
        var displayName = "Foo";

        var msg = new jabberwerx.Message();
        msg.setBody(body);

        equals(jabberwerx.Message.translate(msg.getBody(), displayName), "* " + displayName + " shrugs in disgust");
    });

    test("Test XHTML-IM XEP-0245 Message", function() {
        var displayName = "Foo";
        var msg = new jabberwerx.Message();

        msg.setHTML("<p style='color:green'>/me shrugs in disgust</p>");
        msg = jabberwerx.Message.translate(msg.getHTML(), displayName);
        var expected = _str2node("<body xmlns=\"http://www.w3.org/1999/xhtml\"><p style=\"color:green\">* " + displayName + " shrugs in disgust</p></body>");
        equals(msg.xml, expected.xml);
     });

    test("Test plaintext Message without XEP-0245", function() {
        var text = ["/meshrugs in disgust",
                    "/me's disgusted",
                    " /me shrugs in disgust",
                    "\"/me shrugs in disgust\"",
                    "* Foo shrugs in disgust",
                    "Why did Foo say \"/me shrugs in disgust\"?"];
        var displayName = "Foo";
        var msg = new jabberwerx.Message();

        for (var i = 0; i < text.length; i++) {
            msg.setBody(text[i]);
            equals(jabberwerx.Message.translate(msg.getBody(), displayName), null);
        }
    });

    test("Test XHTML-IM Message without XEP-0245", function() {
        var oPTag = "<p style=\"color: green\">";
        var cPTag = "</p>";
        var text = ["/meshrugs in disgust",
                    "/me's disgusted",
                    " /me shrugs in disgust",
                    "\"/me shrugs in disgust\"",
                    "* Foo shrugs in disgust",
                    "Why did Foo say \"/me shrugs in disgust\"?"];

        var displayName = "Foo";
        var msg = new jabberwerx.Message();

        for (var i = 0; i < text.length; i++) {
            var html = oPTag + text[i] + cPTag;
            msg.setHTML(html);
            equals(jabberwerx.Message.translate(msg.getHTML(), displayName), null);
        }
    });

    test("Test Invalid Content Format", function() {
        invokeInvalidContentFormat(undefined);
        invokeInvalidContentFormat(null);
        invokeInvalidContentFormat(1);
    });

    test("Test _getChildText", function() {
        var badMessage = '<message xmlns="jabber:client"><body>good body</body><body xmlns="http://www.w3.org/1999/xhtml">bad body</body></message>';
        var msg = new jabberwerx.Message(jabberwerx.util.unserializeXML(badMessage));

        equals(msg.getBody(), "good body");
        equals(msg._getChildText("body"), "good body");
        equals(msg._getChildText('{http://www.w3.org/1999/xhtml}body'), "bad body");
        equals(msg.xml(), badMessage);
        equals(msg.getHTML(), null);
    });

    module("jabberwerx/model/stanza:presence");
    test("Test get/set Priority", function() {
        var cmpResult;

        var prs = new jabberwerx.Presence();
        equals(prs.getPriority(), 0);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setPriority(1);
        equals(prs.getPriority(), 1);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><priority>1</priority></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setPriority(0);
        equals(prs.getPriority(), 0);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><priority>0</priority></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setPriority(5);
        equals(prs.getPriority(), 5);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><priority>5</priority></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setPriority(null);
        equals(prs.getPriority(), 0);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setPriority(-1);
        equals(prs.getPriority(), -1);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><priority>-1</priority></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setPriority(undefined);
        equals(prs.getPriority(), 0);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setPriority(20);
        equals(prs.getPriority(), 20);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><priority>20</priority></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setPriority();
        equals(prs.getPriority(), 0);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        var caught;
        try {
            prs.setPriority("priority");
            caught = false;
        } catch (ex) {
            caught = true;
        }
        ok(caught, "expected error thrown");

        try {
            prs.setPriority("");
            caught = false;
        } catch (ex) {
            caught = true;
        }
        ok(caught, "expected error thrown");
    });
    test("Test get/set Show", function() {
        var cmpResult;

        var prs = new jabberwerx.Presence();
        equals(prs.getShow(), jabberwerx.Presence.SHOW_NORMAL);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setShow("chat");
        equals(prs.getShow(), jabberwerx.Presence.SHOW_CHAT);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><show>chat</show></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setShow("");
        equals(prs.getShow(), jabberwerx.Presence.SHOW_NORMAL);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setShow("away");
        equals(prs.getShow(), jabberwerx.Presence.SHOW_AWAY);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><show>away</show></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setShow(null);
        equals(prs.getShow(), jabberwerx.Presence.SHOW_NORMAL);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setShow("xa");
        equals(prs.getShow(), jabberwerx.Presence.SHOW_XA);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><show>xa</show></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setShow(undefined);
        equals(prs.getShow(), jabberwerx.Presence.SHOW_NORMAL);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setShow("dnd");
        equals(prs.getShow(), jabberwerx.Presence.SHOW_DND);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><show>dnd</show></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setShow();
        equals(prs.getShow(), jabberwerx.Presence.SHOW_NORMAL);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        var caught;
        try {
            prs.setShow("invalid");
            caught = false;
        } catch (ex) {
            caught = true;
        }
        ok(caught, "expected exception thrown");
    });
    test("Test get/set Status", function() {
        var cmpResult;

        var prs = new jabberwerx.Presence();
        equals(prs.getStatus(), null);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setStatus("some status value");
        equals(prs.getStatus(), "some status value");
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><status>some status value</status></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setStatus("");
        equals(prs.getStatus(), null);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setStatus("another status value");
        equals(prs.getStatus(), "another status value");
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><status>another status value</status></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setStatus(null);
        equals(prs.getStatus(), null);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setStatus("third status value");
        equals(prs.getStatus(), "third status value");
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><status>third status value</status></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setStatus(undefined);
        equals(prs.getStatus(), null);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setStatus("yet another status value!");
        equals(prs.getStatus(), "yet another status value!");
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"><status>yet another status value!</status></presence>'));
        equals(cmpResult, CMP_NODE_OK);

        prs.setStatus();
        equals(prs.getStatus(), null);
        cmpResult = _cmpNodes(prs.getNode(), _str2node('<presence xmlns="jabber:client"/>'));
        equals(cmpResult, CMP_NODE_OK);
    });

    test("Test Set Presence", function() {
        var p1 = new jabberwerx.Presence();

        same(p1.getPriority(), 0);

        p1.setPresence('chat', null, 2);
        same(p1.getPriority(), 2);

        p1.setPresence('chat', null, -2);
        same(p1.getPriority(), -2);

        p1.setPresence('chat', null, 0);
        same(p1.getPriority(), 0);
    });

    test("Test Presence Compare Equals Zero", function() {
        var p1 = new jabberwerx.Presence();
        var p2 = new jabberwerx.Presence();
        var d1 = new Date();
        var d2 = new Date();
        d2.setTime(d1.valueOf());
        p1.timestamp = d1;
        p2.timestamp = d2;
        //ensure show is no longer used in comparisions
        p1.setPresence(null, null, 1);
        p2.setPresence("xa", 'a status message', 1);
        same(p1.compareTo(p2), 0);
        same(p2.compareTo(p1), 0);
    });

    test("Test Presence Compare Greater Than Zero", function() {
        var p1 = new jabberwerx.Presence();
        var p2 = new jabberwerx.Presence();
        var d1 = new Date();
        var d2 = new Date();
        d2.setTime(d1.valueOf() - 1);
        p1.timestamp = d1;
        p2.timestamp = d2;

        p1.setPresence('chat', null, 1);
        p2.setPresence(null, 'a status message', 1);
        same(p1.compareTo(p2), 1);
        same(p2.compareTo(p1), -1);
        //ensure priority is primary key
        p2.timestamp.setTime(d1.valueOf() + 1);
        p1.setPresence('chat', null, 2);
        p2.setPresence('chat', null, 1);
        same(p1.compareTo(p2), 1);
        same(p2.compareTo(p1), -1);
    });

    test("Test Presence Compare Less Than Zero", function() {
        var p1 = new jabberwerx.Presence();
        var p2 = new jabberwerx.Presence();
        var d1 = new Date();
        var d2 = new Date();
        p1.timestamp = d1;
        p2.timestamp = d1;

        p1.setPresence('chat', null, 2);
        p2.setPresence('xa', null, 3);
        same(p1.compareTo(p2), -1);
        same(p2.compareTo(p1), 1);

        d2.setTime(d1.valueOf() - 1);
        p2.timestamp = d2;
        p1.setPresence('dnd', null, 1);
        p2.setPresence('away', 'a status message', 1);
        same(p1.compareTo(p2), 1);
        same(p2.compareTo(p1), -1);
    });

    test("Test Presence Compare Using Negative Priorities", function() {
        var p1 = new jabberwerx.Presence();
        var p2 = new jabberwerx.Presence();

        p1.setPresence('chat', null, -2);
        p2.setPresence('xa', null, -3);
        same(p1.compareTo(p2), 1);
        same(p2.compareTo(p1), -1);
    });
});
