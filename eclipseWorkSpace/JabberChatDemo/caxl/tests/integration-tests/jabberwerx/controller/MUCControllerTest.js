/**
 * filename:        MUCControllerTest.js
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2009-2011 Cisco Systems, Inc.  All Rights Reserved.
 */

jabberwerx.$(document).ready(function() {
    var client = new jabberwerx.Client("muc-tests");
    var muc = new jabberwerx.MUCController(client);
    var room;
    var testCount = 0;

    var onConnected = function() {
        start();
    };
    var onClientError = function(err) {
        alert("Authentication error: " + err.xml);
    }

    var openRoom = function(mucCtrl, mucRoom, roomName, cb) {
        if (!mucRoom) {
            mucRoom = mucCtrl.room(roomName + "@conference." + defaults.domain);
        }
        if (!mucRoom.isActive()) {
            mucRoom.event("roomEntered").bind(function(evt) {
                evt.notifier.unbind(arguments.callee);
                cb.call(mucRoom);
            });
            mucRoom.enter("test-one");
        } else {
            cb.call(mucRoom);
        }
    }
    var openGlobalRoom = function(cb) {
        openRoom(muc, room, "glocal-room-uno", cb);
    };

    module("jabberwerx/controller/muccontroller", {
        setup: function() {
            if (!client.isConnected()) {
                var userJID = testUserJID(1);

                var args = {
                    httpBindingURL: defaults.httpBindingURL,
                    successCallback: onConnected,
                    errorCallback: onClientError
                };
                client.connect(userJID, defaults.password, args);
                stop();
            }
        },
        teardown: function() {
            if (testCount == 0) {
                client.disconnect();
            }
        }
    });

    var createEnterCB = function(expectCall, expectErr, keep) {
        return function(actualErr) {
            if (expectCall) {
                testCount--;
            }

            equals(true, expectCall, "Call expected");
            equals(Boolean(actualErr), Boolean(expectErr), "Error expected");
            ok(this instanceof jabberwerx.MUCRoom, "this instanceof MUCRoom");
            ok(client.entitySet.entity(this.jid) === this, "MUCRoom registered globally");
            ok(this.isActive(), "MUCRoom active");

            if (!keep) {
                removeAndWatch(this);
            } else {
                start();
            }
        }
    };
    var removeAndWatch = function(room) {
        client.entitySet.event("entityDestroyed").bind(function(evt) {
            if (evt.data === room) {
                evt.notifier.unbind(arguments.callee);
                start();
            }
        });
        room.remove();
    };

    test("Start search", function() {
        stop();
        var searchCallback = function(data, err) {
            ok(data instanceof jabberwerx.XDataForm, "An XDataForm was returned.");

            if (err instanceof jabberwerx.Stanza.ErrorInfo) {
                if (err.condition == jabberwerx.Stanza.ERR_BAD_REQUEST.condition) {
                    ok(false, "Persistent Gear needs to be turned on in TC.");
                } else {
                    ok(false, "Error was returned: " + err.condition);
                }
            }
            start();
        };

        muc.startSearch("conference." + defaults.domain, searchCallback);
    });

    test("Submit search", function() {
        stop();
        var searchCallback = function(data, err) {
            ok(data instanceof jabberwerx.XDataForm, "An XDataForm was returned.");

            if (err) {
                if (err instanceof jabberwerx.Stanza.ErrorInfo) {
                    ok(false, "Error was returned: " + err.condition);
                } else {
                    ok(false, "Unknown error occurred.");
                }
            }
            start();
        };

        var formString = '<x xmlns="jabber:x:data" type="submit"><instructions>Fill out the form below to specify search criteria.</instructions><field var="note" type="fixed" label="undefined"><value>Wildcard searches are not supported.</value></field><field var="room-type" type="list-single" label="undefined"><value>all</value><option label="All Rooms">all</option><option label="Permanent(Persistent) Rooms">persistent</option><option label="Temporary Rooms">ad-hoc</option></field><field var="room-name" type="text-single" label="undefined"><value>test</value></field></x>';
        var formElement = jabberwerx.util.unserializeXML(formString);
        var xdata = new jabberwerx.XDataForm(null, formElement);
        muc.submitSearch("conference." + defaults.domain, xdata, searchCallback);
    });

    testCount++;
    test("Test room.enter", function() {
        stop();
        var room = muc.room("test-room-uno@conference." + defaults.domain);
        room.enter("test-one", createEnterCB(true));
    });

    testCount++;
    test("Test room.enter (no callback)", function() {
        stop();
        var room = muc.room("temp-room-one@conference." + defaults.domain);
        room.event("roomEntered").bind(function(evt) {
            testCount--;
            ok(evt.source === room, "event source is expected room");
            equals(room.isActive(), true, "room active");

            removeAndWatch(evt.source);
        });

        room.enter("test-one");
    });

    testCount++;
    test("Test room.enter (bad nick)", function() {
        var room = muc.room("bad-room-uno@conference." + defaults.domain);
        var caught;
        try {
            caught = false;
            room.enter("", createEnterCB());
        } catch (ex) {
            caught = true;
            ok(ex instanceof TypeError, "error is TypeError");
        }
        ok(caught, "expected error thrown");
        room.destroy();
        testCount--;
    });

    testCount++;
    test("Test room.enter (bad callback)", function() {
        var room = muc.room("bad-room-uno@conference." + defaults.domain);
        var caught;
        try {
            caught = false;
            room.enter("test-one", {successCallback: "blah"});
        } catch (ex) {
            caught = true;
            ok(ex instanceof TypeError, "error is TypeError");
        }
        ok(caught, "expected error thrown");
        room.destroy();
        testCount--;
    });

    testCount++;
    test("Test broadcast", function() {
        stop();
        openGlobalRoom(function() {
            var room = this;
            var body = "broadcast message body";

            room.event("beforeRoomBroadcastSent").bind(function(evt) {
                equals(evt.name, "beforeRoomBroadcastSent".toLowerCase(), "event triggered");
                ok(evt.data instanceof jabberwerx.Message, "event data is Message");
                equals(evt.data.getBody(), body, "message body");
                evt.notifier.unbind(arguments.callee);
            });
            room.event("roomBroadcastSent").bind(function(evt) {
                equals(evt.name, "roomBroadcastSent".toLowerCase(), "event triggered");
                ok(evt.data instanceof jabberwerx.Message, "event data is Message");
                equals(evt.data.getBody(), body, "message body");
                evt.notifier.unbind(arguments.callee);
            });
            room.event("roomBroadcastReceived").bind(function(evt) {
                equals(evt.name, "roomBroadcastReceived".toLowerCase(), "event triggered");
                ok(evt.data instanceof jabberwerx.Message, "event data is Message");
                equals(evt.data.getBody(), body, "message body");
                evt.notifier.unbind(arguments.callee);

                testCount--;
                start();
            });

            room.sendBroadcast(body);
        });
    });

    testCount++;
    test("Test Change Subject", function() {
        stop();
        openGlobalRoom(function() {
            var room = this;
            var subject = "room subject";

            room.event("beforeRoomSubjectChanging").bind(function(evt) {
                equals(evt.name, "beforeRoomSubjectChanging".toLowerCase(), "event triggered");
                ok(evt.data instanceof jabberwerx.Message, "event data is Message");
                equals(evt.data.getSubject(), subject, "message subject");
                evt.notifier.unbind(arguments.callee);
            });
            room.event("roomSubjectChanging").bind(function(evt) {
                equals(evt.name, "roomSubjectChanging".toLowerCase(), "event triggered");
                ok(evt.data instanceof jabberwerx.Message, "event data is Message");
                equals(evt.data.getSubject(), subject, "message subject");
                evt.notifier.unbind(arguments.callee);
            });
            room.event("roomSubjectChanged").bind(function(evt) {
                equals(evt.name, "roomSubjectChanged".toLowerCase(), "event triggered");
                ok(evt.data instanceof jabberwerx.Message, "event data is Message");
                equals(evt.data.getSubject(), subject, "message subject");
                evt.notifier.unbind(arguments.callee);

                testCount--;
                start();
            });

            room.changeSubject(subject);
        });
    });

    //new module, use completely different client (no setup)
    var npClient;
    module("jabberwerx/controller/muccontroller/no-init-presence", {
        teardown: function() {
            if (npClient) {
                npClient.disconnect();
            }
        }
    });

    var checkMucInvite = function(roomNamePostfix, type, mediated) {
        stop();

        var client1, client2;
        client1 = new jabberwerx.Client('MUCInviteTest1');
        client2 = new jabberwerx.Client('MUCInviteTest2');

        new jabberwerx.MUCController(client1);
        new jabberwerx.MUCController(client2);

        var roomName = "test-muc-invite";
        if (roomNamePostfix) {
            roomName += roomNamePostfix;
        }
        var room = client2.controllers.muc.room(roomName + "@conference." + defaults.domain);
        var inviteReceived = false;

        var timingID;
        var timing = function() {
            clearTimeout(timingID);
            timingID = 0;

            ok(inviteReceived, "Invite Received");
            room.exit();
            client1.disconnect();
            client2.disconnect();
            setTimeout(start, 1000);
        };
 
        var numMessages = 0;

        var arg1, arg2;
        arg1 = {
            successCallback: function() {
                var client1muc = client1.controllers.muc;
                client1muc.event('mucInviteReceived').bind(function(evt) {
                    inviteReceived = true;
                    clearTimeout(timingID);
                    timingID = setTimeout(timing, 1000);
                    evt.notifier.unbind(arguments.callee);
                });

                client2.event('beforeMessageSent').bind(function(evt) {
                    if (type) {
                        evt.data.setType(type);
                    }
                    evt.notifier.unbind(arguments.callee);
                });

                room.invite(testUserJID(1), null, mediated);
                timingID = setTimeout(timing, 5000);
            },
            errorCallback: function(err) {
                ok(false, "client2 did not connect successfully");
                timingID = setTimeout(timing, 3000);
            }
        };
        arg2 = {
            successCallback: function() {
                client2.sendPresence();
                openRoom(client2.controllers.muc,
                         room,
                         roomName,
                         function() {
                            client1.connect(testUserJID(1), defaults.password, arg1);
                         });
            },
            errorCallback: function(err) {
                ok(false, "client1 did not connect successfully");
                timingID = setTimeout(timing, 3000);
            }
        };
        client2.connect(testUserJID(2), defaults.password, arg2);
    }

    test("Check MUC Invite Received (Direct: type='normal').", function() {
        checkMucInvite('1', 'normal');
    });



    test("Test enter room from within connect event handler", function() {
        stop();
        npClient = new jabberwerx.Client("muc-test-no-pres");
        var npMuc = new jabberwerx.MUCController(npClient);
        npClient.connect(testUserJID(1), defaults.password,{
            httpBindingURL: defaults.httpBindingURL,
            successCallback: function () {
                npMuc.room("nopres-room-uno@conference." + defaults.domain).
                    enter("nopres-test-1", function (err) {
                        ok(!err, "entered no init pres room");
                        start();
                    });
            },
            errorCallback: function(err) {
                ok(false, "enter room failed");
                start();
            }
        });
    });

    //new module, use completely different client (no setup)
    var ccClient = new jabberwerx.Client("muc-test-client-cache");
    var ccmuc = new jabberwerx.MUCController(ccClient);

    module("jabberwerx/controller/muccontroller/clientcache", {
        setup: function() {
            var args = {
                httpBindingURL: defaults.httpBindingURL,
                successCallback: onConnected,
                errorCallback: onClientError
            };
            ccClient.connect(testUserJID(1), defaults.password, args);
            stop();
        }
    });

    test("Test cleaning rooms on disconnect", function() {
        var __enterRooms = function(base, start, count, cb) {
            stop();
            var rcount = 0;
            var checkCount = function() {
                --rcount;
                if (!rcount) {
                    cb.call();
                }
            }
            for (var i = start; i < start + count; ++i) {
                var ccroom = ccmuc.room(base + i + "@conference." + + defaults.domain);
                if (!ccroom.isActive()) {
                    ++rcount;
                    ccroom.enter("" + base + i, {successCallback: checkCount, errorCallback: checkCount});
                }
            }
            if (!rcount) {
                cb.call();
            }
        }
        var __toArray = function(eset, etype) {
            if (etype === undefined) {
                return eset.toArray();
            }
            var ret = [];
            eset.each(function (entity) {
                if (entity instanceof etype) {
                    ret.push(entity);
                }
            });
            return ret;
        }

        var startlen = __toArray(ccClient.entitySet).length;
        ok(true,  startlen + " total entities to start");
        var len = __toArray(ccClient.entitySet, jabberwerx.MUCRoom).length;
        ok(len === 0, len + " rooms to start");
        var disconnectEventTriggered = false;
        
        ccClient.event("clientStatusChanged").bind(function(evt) {
            if (evt.data.next != jabberwerx.Client.status_disconnected) {
                return;
            }
            
            disconnectEventTriggered = true;
            
            len = __toArray(ccClient.entitySet, jabberwerx.MUCRoom).length;
            ok(len === 0, len + " rooms after disconnect");
            len = __toArray(ccClient.entitySet).length;
            /* this is not true if disco or some other controller is present
                will be addressed by multi-controller integration test
            ok(startlen == len, len + " total entities after disconnect");
             */
             
             evt.notifier.unbind(arguments.callee);
             start();
        });

        __enterRooms("client-cache", 1, 10, function() {
            len = __toArray(ccClient.entitySet, jabberwerx.MUCRoom).length;
            ok(len == 10, len + " rooms entered");
            ccClient.disconnect();
        });
    });
    test("Test cleaning rooms on forced disconnect", function() {
        var bounceClient = new jabberwerx.Client(ccClient.resourceName);
        bounceClient.event("clientStatusChanged").bind(function(evt) {
            switch (evt.data.next) {
                case jabberwerx.Client.status_connected:
                    // give some breathing room before initiating disconnect
                    setTimeout(bounceClient.invocation("disconnect"), 100);
                    break;
                case jabberwerx.Client.status_disconnected:
                    start();
                    break;
            }
        });
        var __enterRooms = function(base, start, count, cb) {
            stop();
            var rcount = 0;
            var checkCount = function() {
                --rcount;
                if (!rcount) {
                    cb.call();
                }
            }
            for (var i = start; i < start + count; ++i) {
                var ccroom = ccmuc.room(base + i + "@conference." + + defaults.domain);
                if (!ccroom.isActive()) {
                    ++rcount;
                    ccroom.enter("" + base + i, {successCallback: checkCount, errorCallback: checkCount});
                }
            }
            if (!rcount) {
                cb.call();
            }
        }
        var __toArray = function(eset, etype) {
            if (etype === undefined) {
                return eset.toArray();
            }
            var ret = [];
            eset.each(function (entity) {
                if (entity instanceof etype) {
                    ret.push(entity);
                }
            });
            return ret;
        }

        var startlen = __toArray(ccClient.entitySet).length;
        ok(true,  startlen + " total entities to start");
        var len = __toArray(ccClient.entitySet, jabberwerx.MUCRoom).length;
        ok(len === 0, len + " rooms to start");

        ccClient.event("clientStatusChanged").bind(function(evt) {
            if (evt.data.next != jabberwerx.Client.status_disconnected) {
                return;
            }
            
            len = __toArray(ccClient.entitySet, jabberwerx.MUCRoom).length;
            ok(len === 0, len + " rooms after disconnect");
            len = __toArray(ccClient.entitySet).length;
            /* this is not true if disco or some other controller is present
                will be addressed by multi-controller integration test
            ok(startlen == len, len + " total entities after disconnect");
             */
             
             evt.notifier.unbind(arguments.callee);
        });
        __enterRooms("client-cache", 1, 10, function() {
            len = __toArray(ccClient.entitySet, jabberwerx.MUCRoom).length;
            ok(len == 10, len + " rooms entered");
            var args = {
                httpBindingURL: defaults.httpBindingURL
            };
            bounceClient.connect(testUserJID(1), defaults.password, args);
        });
    });
});
