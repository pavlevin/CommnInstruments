/**
 * filename:        PrivacyListTest.js
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2009-2011 Cisco Systems, Inc.  All Rights Reserved.
 */

jabberwerx.$(document).ready(function() {
    var listNode;
    var ctrl;
    module("jabberwerx/model/privacylist", {
        setup: function() {
            var client = new jabberwerx.Client();
            ctrl = new jabberwerx.PrivacyListController(client);

            var builder = new jabberwerx.NodeBuilder("{jabber:iq:privacy}list").
                    attribute("name", "Deny");
            var idx = 0;
            builder.element("item").
                    attribute("type", "jid").
                    attribute("value", "jwtest10@example.com").
                    attribute("action", "deny").
                    attribute("order", idx++);
            builder.element("item").
                    attribute("type", "jid").
                    attribute("value", "jwtest11@example.com").
                    attribute("action", "deny").
                    attribute("order", idx++);
            builder.element("item").
                    attribute("type", "jid").
                    attribute("value", "jwtest30@example.com").
                    attribute("action", "deny").
                    attribute("order", idx++)
                        .element(jabberwerx.PrivacyList.MESSAGE).parent
                        .element(jabberwerx.PrivacyList.PRESENCE_IN);
            builder.element("item").
                    attribute("type", "jid").
                    attribute("value", "jwtest12@example.com").
                    attribute("action", "allow").
                    attribute("order", idx++);
            builder.element("item").
                    attribute("action", "allow").
                    attribute("order", idx++);

            listNode = builder.data;
        },
        teardown: function() {
        }
    });

    var __compareStringArrays = function(arr1, arr2) {
        if (arr1.length != arr2.length) {
            return false;
        }

        arr1.sort();
        arr2.sort();
        for (var idx = 0; idx < arr1.length; idx++) {
            if (arr1[idx] != arr2[idx]) {
                return false;
            }
        }

        return true;
    };

    var __compareJidArrays = function(arr1, arr2) {
        if (arr1.length != arr2.length) {
            return false;
        }

        arr1.sort();
        arr2.sort();
        for (var idx = 0; idx < arr1.length; idx++) {
            if (!arr1[idx].equals(arr2[idx])) {
                return false;
            }
        }

        return true;
    };
    test("Test Create", function() {
        var list = new jabberwerx.PrivacyList(listNode, ctrl);
        ok(list.controller === ctrl, "controller is PrivacyListController");
        equals(list.getName(), "Deny", "list name is 'Deny'");

        var expected = [new jabberwerx.JID("jwtest10@example.com"),
                        jabberwerx.JID.asJID("jwtest30@example.com"),
                        new jabberwerx.JID("jwtest11@example.com")];
        var actual = list.getBlockedJids();
        ok(__compareJidArrays(actual, expected),
           "blocked list [" + actual.join(", ") + "] matches expected [" + expected.join(", ") + "]");

        var blockedStanzas;
        blockedStanzas = list.getBlockedStanzas("jwtest30@example.com");
        ok(__compareStringArrays(blockedStanzas, ["message", "presence-in"]),
           "Blocking the correct stanzas: " + blockedStanzas.join(", "));
        blockedStanzas = list.getBlockedStanzas("jwtest10@example.com");
        ok(__compareStringArrays(blockedStanzas, ["all"]),
           "Blocking the correct stanzas: " + blockedStanzas.join(", "));

        try {
            list = new jabberwerx.PrivacyList(null, ctrl);
            ok(false, "expected error not thrown");
        } catch (ex) {
            ok(ex instanceof TypeError, "error is TypeError");
        }

        try {
            list = new jabberwerx.PrivacyList("list", ctrl);
            ok(false, "expected error not thrown");
        } catch (ex) {
            ok(ex instanceof TypeError, "error is TypeError");
        }

        try {
            list = new jabberwerx.PrivacyList(listNode, null);
            ok(false, "expected error not thrown");
        } catch (ex) {
            ok(ex instanceof TypeError, "error is TypeError");
        }

        try {
            list = new jabberwerx.PrivacyList(listNode, new jabberwerx.Client());
            ok(false, "expected error not thrown");
        } catch (ex) {
            ok(ex instanceof TypeError, "error is TypeError");
        }
    });
    test("Test blockJID exceptions", function() {
        var list = new jabberwerx.PrivacyList(listNode.cloneNode(true), ctrl);

        try {
            list.blockJid("@@@@@@");
            ok(false, "expected error not thrown");
        } catch (ex) {
            ok(ex instanceof jabberwerx.JID.InvalidJIDError, "Invalid JID thrown.");
        }

        try {
            list.blockJid("jwtest30@example.com", "bla");
            ok(false, "expected error not thrown");
        } catch (ex) {
            ok(ex instanceof TypeError, "Invalid stanza list thrown.");
        }

        try {
            list.blockJid("jwtest30@example.com", ["message", "bla"]);
            ok(false, "expected error not thrown");
        } catch (ex) {
            ok(ex instanceof TypeError, "Invalid stanza list thrown.");
        }

    });
    test("Test Block/Unblock", function() {
        var list = new jabberwerx.PrivacyList(listNode.cloneNode(true), ctrl);
        var actual, expected;
        actual = list.getBlockedJids();
        expected = [new jabberwerx.JID("jwtest10@example.com"),
                    jabberwerx.JID.asJID("jwtest30@example.com"),
                    new jabberwerx.JID("jwtest11@example.com")];
        ok(__compareJidArrays(actual, expected),
           "blocked list [" + actual.join(", ") + "] matches expected [" + expected.join(", ") + "]");
        list.unblockJid("jwtest30@example.com");

        // block new jid
        list.blockJid("jwtest\26@example.com");
        expected = [new jabberwerx.JID("jwtest10@example.com"),
                    new jabberwerx.JID("jwtest11@example.com"),
                    new jabberwerx.JID("jwtest\26@example.com")];
        actual = list.getBlockedJids();
        ok(__compareJidArrays(actual, expected),
           "blocked list [" + actual.join(", ") + "] matches expected [" + expected.join(", ") + "]");

        // block new jid
        list.blockJid("jwtest21@example.com");
        expected = [new jabberwerx.JID("jwtest10@example.com"),
                    new jabberwerx.JID("jwtest11@example.com"),
                    new jabberwerx.JID("jwtest\26@example.com"),
                    new jabberwerx.JID("jwtest21@example.com")];
        actual = list.getBlockedJids();
        ok(__compareJidArrays(actual, expected),
           "blocked list [" + actual.join(", ") + "] matches expected [" + expected.join(", ") + "]");

        // unblock new jid
        list.unblockJid("jwtest\26@example.com");
        expected = [new jabberwerx.JID("jwtest10@example.com"),
                    new jabberwerx.JID("jwtest11@example.com"),
                    new jabberwerx.JID("jwtest21@example.com")];
        actual = list.getBlockedJids();
        ok(__compareJidArrays(actual, expected),
           "blocked list [" + actual.join(", ") + "] matches expected [" + expected.join(", ") + "]");

        // unblock previous jid
        list.unblockJid("jwtest11@example.com");
        expected = [new jabberwerx.JID("jwtest10@example.com"),
                    new jabberwerx.JID("jwtest21@example.com")];
        actual = list.getBlockedJids();
        ok(__compareJidArrays(actual, expected),
           "blocked list [" + actual.join(", ") + "] matches expected [" + expected.join(", ") + "]");

        // block previous jid
        list.blockJid("jwtest10@example.com");
        expected = [new jabberwerx.JID("jwtest10@example.com"),
                    new jabberwerx.JID("jwtest21@example.com")];
        actual = list.getBlockedJids();
        ok(__compareJidArrays(actual, expected),
           "blocked list [" + actual.join(", ") + "] matches expected [" + expected.join(", ") + "]");

        // block previous "allow" jid
        list.blockJid("jwtest12@example.com");
        expected = [new jabberwerx.JID("jwtest10@example.com"),
                    new jabberwerx.JID("jwtest12@example.com"),
                    new jabberwerx.JID("jwtest21@example.com")];
        actual = list.getBlockedJids();
        ok(__compareJidArrays(actual, expected),
           "blocked list [" + actual.join(", ") + "] matches expected [" + expected.join(", ") + "]");

        var blockedStanzas;
        // Block a specific stanza
        list.blockJid("jwtest30@example.com", [jabberwerx.PrivacyList.MESSAGE]);
        expected = [new jabberwerx.JID("jwtest10@example.com"),
                    new jabberwerx.JID("jwtest12@example.com"),
                    new jabberwerx.JID("jwtest21@example.com"),
                    jabberwerx.JID.asJID("jwtest30@example.com")];
        actual = list.getBlockedJids();
        ok(__compareJidArrays(actual, expected),
           "blocked list [" + actual.join(", ") + "] matches expected [" + expected.join(", ") + "]");
        blockedStanzas = list.getBlockedStanzas("jwtest30@example.com");
        ok(__compareStringArrays(blockedStanzas, ["message"]),
           "Blocking the correct stanzas.");

        // Block different stanzas
        list.blockJid("jwtest30@example.com",
                [jabberwerx.PrivacyList.IQ,
                 jabberwerx.PrivacyList.PRESENCE_OUT]);
        expected = [new jabberwerx.JID("jwtest10@example.com"),
                    new jabberwerx.JID("jwtest12@example.com"),
                    new jabberwerx.JID("jwtest21@example.com"),
                    jabberwerx.JID.asJID("jwtest30@example.com")];
        actual = list.getBlockedJids();
        ok(__compareJidArrays(actual, expected),
           "blocked list [" + actual.join(", ") + "] matches expected [" + expected.join(", ") + "]");
        blockedStanzas = list.getBlockedStanzas("jwtest30@example.com");
        ok(__compareStringArrays(blockedStanzas, ["presence-out", "iq"]),
           "Blocking the correct stanzas.");

        // Change block from 'all' to something else.
        list.unblockJid("jwtest30@example.com");
        list.blockJid("jwtest10@example.com",
                [jabberwerx.PrivacyList.IQ,
                 jabberwerx.PrivacyList.PRESENCE_OUT]);
        expected = [new jabberwerx.JID("jwtest10@example.com"),
                    new jabberwerx.JID("jwtest12@example.com"),
                    new jabberwerx.JID("jwtest21@example.com")];
        actual = list.getBlockedJids();
        ok(__compareJidArrays(actual, expected),
           "blocked list [" + actual.join(", ") + "] matches expected [" + expected.join(", ") + "]");
        blockedStanzas = list.getBlockedStanzas("jwtest10@example.com");
        ok(__compareStringArrays(blockedStanzas, ["presence-out", "iq"]),
           "Blocking the correct stanzas.");

        // Block 'all' explicitly
        list.blockJid("jwtest30@example.com", [jabberwerx.PrivacyList.ALL]);
        blockedStanzas = list.getBlockedStanzas("jwtest30@example.com");
        ok(__compareStringArrays(blockedStanzas, ["all"]),
           "Blocking all stanzas.");

        // Block 'all' in the middle of a list
        list.blockJid("jwtest30@example.com",
                [jabberwerx.PrivacyList.MESSAGE,
                 jabberwerx.PrivacyList.ALL,
                 jabberwerx.PrivacyList.PRESENCE_IN]);
        blockedStanzas = list.getBlockedStanzas("jwtest30@example.com");
        ok(__compareStringArrays(blockedStanzas, ["all"]),
           "Only blocking all stanzas.");

    });
});
