/**
 * filename:        ContactTest.js
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2009-2011 Cisco Systems, Inc.  All Rights Reserved.
 */

jabberwerx.$(document).ready(function() {
    var roster;
    var itemNode;

    module("jabberwerx/model/rostercontact", {
        setup: function() {
            var client = new jabberwerx.Client();
            roster = new jabberwerx.RosterController(client);

            var builder;
            builder = new jabberwerx.NodeBuilder("{jabber:iq:roster}item");
            builder.attribute("jid", "user-one@example.com");
            builder.attribute("name", "User One");
            builder.attribute("subscription", "both");
            builder.element("group").text("group one");
            builder.element("group").text("group two");
            itemNode = builder.data;
        },
        teardown: function() {
            delete roster.client;
            delete roster;
            delete itemNode;
        }
    });

    var __validateArrays = function(actual, expected) {
        ok(actual, "actual exists");
        equals(actual.length, expected.length, "array lengths match");
        for (var idx in expected) {
            equals(actual[idx], expected[idx], "array[" + idx + "] values match");
        }
    };

    var __validateObjects = function(actual, expected) {
        ok(actual, "actual exists");
        for (var oneprop in expected) {
            if (expected.hasOwnProperty(oneprop)) {
                if (actual.hasOwnProperty(oneprop)) {
                    equals(expected[oneprop], actual[oneprop], "property " + oneprop + " values match");
                } else {
                    ok(false, "Actual did not contain expected property " + oneprop);
                }
            }
        }
    };

    test("Test Create", function() {
        var prsCB = function(evt) {
            fail("unexpected " + evt.name + "triggered");
            arguments.callee.triggered++;
        };
        prsCB.triggered = 0;
        jabberwerx.globalEvents.bind("primaryPresenceChanged", prsCB);
        jabberwerx.globalEvents.bind("resourcePresenceChanged", prsCB);

        var contact;
        var node;
        contact = new jabberwerx.RosterContact(itemNode, roster);
        ok(contact.getItemNode() === itemNode, "itemNode as expected");
        ok(contact.jid == "user-one@example.com", "jid as expected");
        ok(contact.node == "", "node as expected");
        ok(contact.getDisplayName() == "User One", "displayName as expected");
        __validateArrays(contact.getGroups(), ["group one", "group two"]);
        equals(prsCB.triggered, 0, "presence callbacks triggered");
        prsCB.triggered = 0;

        var caught;
        try {
            caught = false;
            contact = new jabberwerx.RosterContact(node);
        } catch (ex) {
            caught = true;
            ok(ex instanceof TypeError, "error instance of TypeError");
        }
        ok(caught, "expected error thrown");

        try {
            caught = false;
            contact = new jabberwerx.RosterContact(null, roster);
        } catch (ex) {
            caught = true;
            ok(ex instanceof TypeError, "error instance of TypeError");
        }
        ok(caught, "expected error thrown");

        try {
            caught = false;
            contact = new jabberwerx.RosterContact("item", roster);
        } catch (ex) {
            caught = true;
            ok(ex instanceof TypeError, "error instance of TypeError");
        }
        ok(caught, "expected error thrown");

        var builder = new jabberwerx.NodeBuilder("{jabber:iq:roster}item").
                attribute("jid", "foo\\40gmail.com@example.com").
                attribute("subscription", "both").
                element("group").text("group one").parent.
                element("group").text("group dos").parent;
        contact = new jabberwerx.RosterContact(builder.data, roster);
        ok(contact.getItemNode() === builder.data, "itemNode as expected");
        equals(contact.jid.toString(), "foo\\40gmail.com@example.com", "jid as expected");
        equals(contact.node, "", "node as expected");
        equals(contact.getDisplayName(), "foo@gmail.com@example.com", "displayName as expected");
        __validateArrays(contact.getGroups(), ["group one", "group dos"]);
        equals(prsCB.triggered, 0, "presence callbacks triggered");
        prsCB.triggered = 0;


        jabberwerx.globalEvents.unbind("primaryPresenceChanged", prsCB);
        jabberwerx.globalEvents.unbind("resourcePresenceChanged", prsCB);
    });

    test("Test Create from base", function() {
        var caught;
        try {
            caught = false;
            contact = new jabberwerx.RosterContact(itemNode, roster, {});
        } catch (ex) {
            caught = true;
            ok(ex instanceof TypeError, "error instance of TypeError");
        }
        ok(caught, "expected error thrown");

        var builder;
        builder = new jabberwerx.NodeBuilder("{jabber:iq:roster}item");
        builder.attribute("jid", "foo@example.com");
        builder.attribute("name", "User One");
        builder.attribute("subscription", "both");
        builder.element("group").text("group one");
        builder.element("group").text("group two");

        var ent_prs = [
            new jabberwerx.Presence().setPresence('chat', 'I want to chat', 1),
            new jabberwerx.Presence().setPresence('dnd', 'I am not available to chat', 2)
        ];
        var ent_props = {
            "property-one": "value one",
            "property-two": 2,
            "property-three": true
        };
        var ent_feats = [
            "jabber:iq:private",
            "jabber:x:conference",
            "http://jabber.org/protocol/muc"
        ];
        var ent_idents = [
            "client/pc"
        ];
        var ent_groups = [
            "ent grp1",
            "ent grp2"
        ];
        var ent = roster.client.entitySet.temporaryEntity("foo@example.com");

        for (var idx = 0; idx < ent_prs.length; idx++) {
            ent_prs[idx].setFrom("foo@example.com/resource" + (idx + 1));
            ent.updatePresence(ent_prs[idx]);
        }

        ent.properties = jabberwerx.$.extend(true, ent.properties, ent_props);
        ent.features = jabberwerx.$.extend(ent.features, ent_feats);
        ent.identities = jabberwerx.$.extend(ent.identities, ent_idents);
        ent._groups = jabberwerx.$.extend(ent._groups, ent_groups);
        ent._displayName = "ent-foo-tastic";

        var contact = new jabberwerx.RosterContact(builder.data, roster, ent);

        __validateArrays(contact.getGroups(), jabberwerx.$.extend(["group one", "group dos"], ent_groups));
        __validateArrays(contact.identities, ent_idents);
        __validateArrays(contact.features, ent_feats);
        var eprops = jabberwerx.$.extend({subscription: "both",
                                          ask: "",
                                          name: "User One"}, ent_props);
        __validateObjects(contact.properties, eprops);
        __validateObjects(eprops, contact.properties);

        equals(contact._displayName, "User One", "displayName from item");

        builder = new jabberwerx.NodeBuilder("{jabber:iq:roster}item");
        builder.attribute("jid", "foo@example.com");
        builder.attribute("subscription", "both");
        builder.element("group").text("group one");
        builder.element("group").text("group two");

        contact = new jabberwerx.RosterContact(builder.data, roster, ent);

        __validateArrays(contact.getGroups(), jabberwerx.$.extend(["group one", "group dos"], ent_groups));
        __validateArrays(contact.identities, ent_idents);
        __validateArrays(contact.features, ent_feats);
        eprops = jabberwerx.$.extend({subscription: "both",
                                      name: "",
                                      ask: ""}, ent_props);
        __validateObjects(contact.properties, eprops);
        __validateObjects(eprops, contact.properties);
        equals(contact._displayName, "ent-foo-tastic", "displayName from base");

        var numEntities = 0;
        roster.client.entitySet.each(function() {
            numEntities++;
        });
        ok(numEntities > 0, "1 or more entities in set");

        var numContacts = 0;
        roster.eachContact(function() {
            numContacts++;
        });
        equals(0, numContacts, "eachContact finds 0 roster contacts in entity set");
    });
    test("Test Get/Set ItemNode", function() {
        var node = itemNode;
        var contact = new jabberwerx.RosterContact(itemNode, roster);
        ok(contact.getItemNode() === node, "itemNode as expected");
        ok(contact.jid == "user-one@example.com", "jid as expected");
        ok(contact.node == "", "node as expected");
        ok(contact.getDisplayName() == "User One", "displayName as expected");
        __validateArrays(contact.getGroups(), ["group one", "group two"]);

        var builder = new jabberwerx.NodeBuilder("{jabber:iq:roster}item");
        builder.attribute("jid", "user-one@example.com");
        builder.attribute("subscription", "both");
        builder.element("group").text("group one");
        builder.element("group").text("group two");
        node = builder.data;

        contact.setItemNode(node);
        ok(contact.getItemNode() === node, "itemNode as expected");
        ok(contact.jid == "user-one@example.com", "jid as expected");
        ok(contact.node == "", "node as expected");
        ok(contact.getDisplayName() == "user-one@example.com", "displayName as expected");
        __validateArrays(contact.getGroups(), ["group one", "group two"]);
    });
});
