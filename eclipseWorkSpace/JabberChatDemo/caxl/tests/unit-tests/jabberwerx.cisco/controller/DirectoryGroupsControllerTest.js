/**
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2010-2013 Cisco Systems, Inc.  All Rights Reserved.
 */

jabberwerx.$(document).ready(function() {
    var client, dcontrl;

    var _resultDOMS = [
                        '<presence xmlns="jabber:client" to="testgroupserverurl"><x xmlns="http://webex.com/connect/cs" type="initial"/></presence>',
                        '<query xmlns="jabber:iq:search"><x xmlns="jabber:x:data" type="submit"><field type="hidden" var="FORM_TYPE"><value>http://webex.com/connect/cs</value></field><field var="groupname"><value>group1</value></field><field var="count"><value>10</value></field></x></query>',
                        '<query xmlns="jabber:iq:search"><x xmlns="jabber:x:data" type="submit"><field type="hidden" var="FORM_TYPE"><value>http://webex.com/connect/cs</value></field><field var="userid"><value>2356</value></field><field var="displayname"><value>user</value></field></x></query>',
                        '<pubsub xmlns="http://jabber.org/protocol/pubsub"><subscribe node="group" jid="jwtest@example.com/directory-test"/></pubsub>',
                      ];
    var grpSearchResults = "<items node='GROUPID1'><item id='ID1'><member xmlns='http://webex.com/connect/cs' displayname='DISPLAYNAME1' username='USERNAME1' jobtitle='JOBTITLE1' phone='PHONE1' email='EMAIL1' ssoid='SSOID1'/></item><item id='ID2'><member xmlns='http://webex.com/connect/cs' displayname='DISPLAYNAME2' username='USERNAME2' jobtitle='JOBTITLE2' phone='PHONE2' email='EMAIL2' ssoid='SSOID2'/></item></items>";

    var _normalizeDOMStr = function(domstr) {
        var dom = jabberwerx.util.unserializeXML(domstr);
        return jabberwerx.util.serializeXML(dom);
    }

    module("jabberwerx.cisco/controller/DirectoryGroupsController", {
        setup: function() {
            client = new jabberwerx.Client();
            client.sendStanza = function(stanza) {
                client.result = stanza.getNode();
            };
            client.sendIq = function(type, host, content, callback){
                if (content) {
                    if (jabberwerx.util.isString(content)) {
                        content = jabberwerx.util.unserializeXML(content);
                    } else if (jabberwerx.isDocument(content)) {
                        content = content.documentElement;
                    }
                }
                client.result = content;
            };
            client.isConnected = function(){
                return true;
            };
            client.getCurrentPresence = function(){
                return new jabberwerx.Presence();
            };
            client.connectedUser = {jid: "jwtest@example.com"};
            client.resourceName = "directory-test";

            dcontrl = new jabberwerx.cisco.DirectoryGroupsController(client);
        },

        teardown: function() {
            client.destroy();
        }
    });

    test("creation-destruction", function() {
        equals(dcontrl._subcrbItemsBuff.length, 0, "init success");
    });

    test("isLDAPContact", function(){
        ok(true, "placeholder");
    });

    test("activateSubscriptions", function(){
        dcontrl._hasLDAPFeature = function(){return true;}
        dcontrl._getGroupServerHost = function(){return "testgroupserverurl"};
        dcontrl.activateSubscriptions();
        ok(client.result, "client result set");
        equals(_normalizeDOMStr(_resultDOMS[0]), client.result.xml);
        client.result = null;
    });

    test("searchGroup", function(){
        dcontrl._hasLDAPFeature = function(){return true;}
        dcontrl._getGroupServerHost = function(){return "testgroupserverurl"};

        dcontrl.searchGroup('group1',10);
        equals(_normalizeDOMStr(_resultDOMS[1]), client.result.xml);
        client.result = null;
    });

    test("searchUsersByFields", function(){
        dcontrl._hasLDAPFeature = function(){return true;}
        dcontrl._getGroupServerHost = function(){return "testgroupserverurl"};

        var searchFields = {userid : '2356', displayname : 'user'};
        dcontrl.searchUsersByFields(searchFields,10);
        equals(_normalizeDOMStr(_resultDOMS[2]), client.result.xml);
        client.result = null;
    });

    test("subscribeGroup", function(){
        dcontrl._hasLDAPFeature = function(){return true;}
        dcontrl._getGroupServerHost = function(){return "testgroupserverurl"};

        var groupId = 'group';
        dcontrl.subscribeGroup(groupId,10);
        equals(_normalizeDOMStr(_resultDOMS[3]), client.result.xml);
        client.result = null;
    });

    test("unsubscribeGroup", function(){
        ok(true, "placeholder");
    });

    var groupNode = jabberwerx.util.unserializeXML(grpSearchResults);
    test("_updateLdapGroup", function(){
        //expect(2);
        dcontrl.event("LDAPContactAdded").bind(function(evt){
            var data = evt.data;
            if(data.username == "USERNAME1"){
                ok(true);
            }else
            if(data.username == "USERNAME2"){
                ok(true);
            }
            start();
        });
        dcontrl._updateLdapGroup([groupNode]);
        stop();
    });

});
