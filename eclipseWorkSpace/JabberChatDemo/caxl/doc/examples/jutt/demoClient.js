/**
 * filename:        demoClient.js
 *
 * Cisco encourages developers to incorporate example code into
 * their applications.
 */

/**
 * This is a sample JabberWerx client which demonstrates the following functionality:
 *
 *  - connect
 *  - disconnect
 *  - receive presence change notifications
 *  - receive roster updates
 *  - fetch roster
 *  - send chat message
 *  - handle disconnect
 *  - handle error
 *
 *  This JavaScript file is used in conjunction with index.html for UI display
 *
 *  The file is configured to work for the following settings:
 *
 *  - server:       example.com
 *  - proxy url:    /httpbinding
 *  - user:         jwtest1@example.com
 *  - password:     test
 *
 */


//TODO: fetch roster is broken, the JIDs are already in the entity set ....
//TODO: sometimes the roster is not showing up in the HTML

JWA = {};
JWA.Application = jabberwerx.JWModel.extend({

    /**
     * Creates a client, user and server objects.
     * Registers for important events
     */
    init: function() {
        this._super();

        // create a new Client object for this resource
        this.client = new jabberwerx.Client('sampleclient');
        // create a new instance of the RosterController
        var rosterController = this.client.controllers.roster || new jabberwerx.RosterController(this.client);
        // TODO: complete this
        // register callbacks for events
        this.client.event("clientStatusChanged").bind(this.invocation("onStatusChanged"));

        // Setup username and password
        this.username = "jwtest1@example.com";
        this.password = "test";

        jabberwerx.globalEvents.bind("discoInitialized", this.invocation("onDiscoInit"));

        jabberwerx.globalEvents.bind("batchUpdateStarted", this.invocation("onBatchStarted"));
        jabberwerx.globalEvents.bind("batchUpdateEnded", this.invocation("onBatchEnded"));

        jabberwerx.globalEvents.bind("entityCreated", this.invocation("onEntityAdded"));
        jabberwerx.globalEvents.bind("entityDestroyed", this.invocation("onEntityDestroyed"));
        jabberwerx.globalEvents.bind("entityUpdated", this.invocation("onEntityUpdated"));
        jabberwerx.globalEvents.bind("entityRenamed", this.invocation("onEntityRenamed"));

        jabberwerx.globalEvents.bindWhen("presenceReceived", ":not([type]),[type='unavailable']", this.invocation("onPresenceReceived"));
        jabberwerx.globalEvents.bind("primaryPresenceChanged", this.invocation("onPrimaryPresenceUpdated"));
        jabberwerx.globalEvents.bind("resourcePresenceChanged", this.invocation("onResourcePresenceUpdated"));
        jabberwerx.globalEvents.bind("beforeIqReceived", this.invocation("_handleStanzaReceived"));
        jabberwerx.globalEvents.bind("beforeMessageReceived", this.invocation("_handleStanzaReceived"));
        jabberwerx.globalEvents.bind("beforePresenceReceived", this.invocation("_handleStanzaReceived"));
        jabberwerx.globalEvents.bind("iqSent", this.invocation("_handleStanzaSent"));
        jabberwerx.globalEvents.bind("messageSent", this.invocation("_handleStanzaSent"));
        jabberwerx.globalEvents.bind("presenceSent", this.invocation("_handleStanzaSent"));

        jabberwerx.globalEvents.bind("roomEntered", this.invocation("onMUCRoom"));
        jabberwerx.globalEvents.bind("roomExited", this.invocation("onMUCRoom"));
        jabberwerx.globalEvents.bind("roomBroadcastReceived", this.invocation("onMUCRoom"));
        jabberwerx.globalEvents.bind("roomSubjectChanged", this.invocation("onMUCRoom"));

        jabberwerx.globalEvents.bind("errorEncountered", this.invocation("onErrorEncountered"));
    },

    /**
     * Connect a user to the BOSH service
     */
    connect: function() {
        this.client.connect(this.username, this.password);
    },

    /**
     * Disconnect a user to the BOSH service
     */
    disconnect: function() {
        this.client.disconnect();
    },

    /**
     * Handle a roster update event to update the HTML UI to display the contact details
     *
     * @param {jabberwerx.Contact} contact The updated contact in the roster
     */
    updateRosterItem: function(contact) {
        // get the JID string associated with the contact
        var jid = contact.jid.toString();

        // get the contact nickname
        var name = contact.getDisplayName();

        // create a list of groups which the contacts belong to
        var groups = jabberwerx.$.map(contact.getGroups(), function(group) {
            return "[" + group + "]";
        }).join(" ");

        // get the subscription/ask attributes
        var subscr = contact.properties.subscription || "";
        var ask = contact.properties.ask || "";
        var tsub = contact.properties.temp_sub;

        // update the roster HTML UI with the contact details
        var id = "roster_item_" + contact._guid;
        jabberwerx.util.debug.log("updating UI for " + id);

        var item = jabberwerx.$("#" + id);
        if (item.length == 0) {
            var that = this;

            item = jabberwerx.$(".roster #roster-item .roster-item").clone();
            item.attr("id", id);
            item.appendTo(".roster #roster-list");
            item.find(".actions #delete-roster-item").bind("click", function() {
                contact.remove();
            });
            item.find(".actions #im-contact").bind("click", function() {
                jabberwerx.$(".chat").show();
                jabberwerx.$(".chat #outgoing-message").find(":input[name='to']").val(jid);
                startChatSession(jid);
            });
        }
        item.children(".jid").text(jid);
        item.children(".name").text(name || "\u00a0");
        item.children(".groups").text(groups || "\u00a0");
        item.children(".props").text(jabberwerx.$.trim(subscr + " " + ask + " " + (tsub ? "temp_sub" : "")));
    },
    /**
     * Handle a roster item deleted event to update the HTML UI
     *
     * @param {jabberwerx.Contact} contact The deleted contact in the roster
     */
    removeRosterItem: function(contact) {
        // get the jid of the deleted contact
        var jid = contact.jid;

        // update the roster HTML UI by removing the contact
        var id = "roster_item_" + contact._guid;
        jabberwerx.util.debug.log("removing UI for " + id);
        jabberwerx.$(".roster #roster-list").find("#" + id).remove();
    },

    updateMUCRoom: function(room) {
        var jid = room.jid.toString();
        var name = room.getDisplayName();

        var subject = room.properties.subject;

        var groups = jabberwerx.$.map(room.getGroups(), function(group) {
            return "[" + group + "]";
        }).join(" ");

        var id = "muc_room_" + room._guid;
        var item = jabberwerx.$("#" + id);
        if (item.length == 0) {
            var that = this;

            item = jabberwerx.$(".muc #muc-room-item .muc-room").clone();
            item.attr("id", id);
            item.appendTo(".muc #muc-room-list");

            var that = this;
            item.find(".actions #enter-muc-room").bind("click", function() {
                var nick = window.prompt(
                        "Type your nickname",
                        that.client.connectedUser.jid.getNode());

                room.enter(nick);
            });
            item.find(".actions #delete-muc-room").bind("click", function() {
                room.remove();
            });
            item.find(".actions #change-nick").bind("click", function() {
                var nick = room.me.getNickname();
                nick = prompt("Enter new nickname:", nick);
                if (nick && nick != room.me.getNickname()) {
                    room.changeNickname(nick);
                }
            });
            item.find(".actions #change-subject").bind("click", function() {
                var subject = room.properties.subject;
                subject = prompt("Enter the new room subject:", subject);
                if (subject != null) {
                    room.changeSubject(subject);
                }
            });
            item.find(".actions #send-broadcast").bind("click", function() {
                var bcast = prompt("Enter the message to broadcast to " + room.jid);
                if (bcast != null) {
                    room.sendBroadcast(bcast);
                }
            });
        }
        item.children(".jid").text(jid);
        item.children(".name").text(name || "\u00a0");
        item.children(".groups").text(groups || "\u00a0");
        item.children(".props").text((subject && subject) || "\u00a0");
    },
    removeMUCRoom: function(room) {
        var id = "muc_room_" + room._guid;
        jabberwerx.$(".muc #muc-room-list").find("#" + id).remove();
    },

    /**
     * Start a chat session
     *
     * @param {jabberwerx.jid} jid The jid to start a chat with
     */
    startChat: function(jid) {
        // create a new instance of ChatController
        var chatController = new jabberwerx.ChatController(this.client);
        return chatController.openSession(jid);
    },

    /**
     * Send a chat message as part of a chat session
     *
     * @param {jabberwerx.ChatSession} chatSession The active chat session
     * @param {String} message The message to send
     */
    sendChatMessage: function(chatSession, message) {
        chatSession.sendMessage(message);
    },

    /**
     * Handle the user's status changed event to update the UI
     *
     * @param {jabberwerx.EventNotifier} event The status changed event
     */
    onStatusChanged: function(event) {
        // get the associated jabberwerx.Client object
        var client = event.source;

        // get the previous and next status values
        var prev = client.getClientStatusString(event.data.previous);
        var next = client.getClientStatusString(event.data.next);

        if (event.data.error) {
            // report error!
            log("client", "ERROR!! " + event.data.error.xml);
        }

        // update the console HTML UI with the status update
        log("client", "status " + prev + " ===> " + next);

        var $ = jabberwerx.$;
        // update the status HTML UI with the status update
        switch (event.data.next) {
            case jabberwerx.Client.status_connected:
                $(".presence").show();
                $("#client-status").text("ONLINE");
                $("#act-login").hide();
                $("#act-logout").show();
                $(".roster").show();
                $(".muc").show();
                $("#muc-room-server").text("conference." + this.client.connectedServer.jid.toString());
                //$(".chat").show();
                break;
            case jabberwerx.Client.status_disconnected:
                $(".presence").hide();
                $("#client-status").text("OFFLINE");
                $("#act-login").show();
                $("#act-logout").hide();
                $(".muc").hide();
                $(".roster").hide();
                $(".chat").hide();
                break;
            default:
                $("#client-status").text(" - - - ");
        }
    },

    onDiscoInit: function(event) {
        log("disco", "disco initialized!");
    },
    onBatchStarted: function(event) {
        this._bstarted = new Date();
        log("entity", "Entity cache batch update started");

        jabberwerx.globalEvents.unbind("entityCreated", this.invocation("onEntityAdded"));
        jabberwerx.globalEvents.unbind("entityDestroyed", this.invocation("onEntityDestroyed"));
        jabberwerx.globalEvents.unbind("entityUpdated", this.invocation("onEntityUpdated"));
        jabberwerx.globalEvents.unbind("entityRenamed", this.invocation("onEntityRenamed"));
    },
    onBatchEnded: function(event) {
        log("entity", "Entity cache batch update completed in " +
                      (new Date() - this._bstarted) + "ms with " +
                      event.data.length + " events.");
        delete this._bstarted;
        //walk event data array and fire appropriate event handlers
        var events = event.data;

        for (var i = 0; i < events.length; ++i) {
            var evtObj =
                new jabberwerx.EventObject(this.client.entitySet.event(events[i].name),
                                           events[i].data);
            if (evtObj.name == "entitycreated") {
                this.onEntityAdded(evtObj);
            } else if (evtObj.name == "entitydestroyed") {
                this.onEntityDestroyed(evtObj);
            } else if (evtObj.name == "entityupdated") {
                this.onEntityUpdated(evtObj);
            }else if (evtObj.name == "entityrenamed") {
                this.onEntityRenamed(evtObj);
            }
        }
        jabberwerx.globalEvents.bind("entityCreated", this.invocation("onEntityAdded"));
        jabberwerx.globalEvents.bind("entityDestroyed", this.invocation("onEntityDestroyed"));
        jabberwerx.globalEvents.bind("entityUpdated", this.invocation("onEntityUpdated"));
        jabberwerx.globalEvents.bind("entityRenamed", this.invocation("onEntityRenamed"));
    },

    /**
     * Callback for the "entityAdded" event
     *
     * @param {jabberwerx.EventNotifier} event The entity added event
     */
    onEntityAdded: function(event) {
        // get the associated jabberwerx.Entity object
        var entity = event.data;
        // update the console HTML UI
        log("entity", "added "  + entity);

        // if the entity is a contact, then trigger the roster UI update
        if (entity instanceof jabberwerx.Contact) {
            this.updateRosterItem(entity);
        } else if (entity instanceof jabberwerx.MUCRoom) {
            this.updateMUCRoom(entity);
        }
    },

    /**
     * Callback for the "entityUpdated" event
     *
     * @param {jabberwerx.EventNotifier} event The entity updated event
     */
    onEntityUpdated: function(event) {
        // get the associated jabberwerx.Entity object
        var entity = event.data;

        // update the console HTML UI
        log("entity", "updated " + entity);

        // if the entity is a contact, then trigger the roster UI update
        if (entity instanceof jabberwerx.Contact) {
            this.updateRosterItem(entity);
        } else if (entity instanceof jabberwerx.MUCRoom) {
            this.updateMUCRoom(entity);
        }
    },
    /**
     *
     */
    onEntityRenamed: function(event) {
        var entity = event.data.entity;

        log("entity", "renamed " + entity + " from " + event.data.jid + " to " + entity.jid);
    },

    /**
     * Callback for the "entityDestroyed" event
     *
     * @param {jabberwerx.EventNotifier} event The entity deleted event
     */
    onEntityDestroyed: function(event) {
        // get the associated jabberwerx.Entity object
        var entity = event.data;

        // update the console HTML UI
        log("entity", "deleted "  + entity);

        // if the entity is a contact, then trigger the roster UI update
        if (entity instanceof jabberwerx.Contact) {
            this.removeRosterItem(entity);
        } else if (entity instanceof jabberwerx.MUCRoom) {
            this.removeMUCRoom(entity);
        }
    },

    /**
     * Callback for "presenceReceived" event
     *
     * @param {jabberwerx.EventNotifier} event The presence received event
     */
    onPresenceReceived: function(event) {
        // get the associated jabberwerx.Presence object
        var presence = event.data;

        // TODO: what is this algorithm?
        var show = presence.getType() || presence.getShow() || "available";
        var status = presence.getStatus();
        var priority = String(presence.getPriority());

        // update the console HTML UI
        log("presence",
            "received " +
            "[" + (priority || "") + "] " +
            jabberwerx.$.trim(show + " " + ((status && "(" + status + ")") || "")) +
            " from " + presence.getFrom());

        // if the presence event relates to the currently logged-in user, update the presence status HTML UI
        if (this.client.connectedUser.jid.toString() == presence.getFromJID().getBareJIDString() &&
            this.client.resourceName == presence.getFromJID().getResource()) {
        	jabberwerx.$(".presence #my-presence").find(":input[name='show']").val(presence.getShow());
        	jabberwerx.$(".presence #my-presence").find(":input[name='status']").val(presence.getStatus());
            //find(":input[name='priority']").val(presence.getPriority());
        }
    },

    /**
     * Callback for "primaryPresenceChanged" event
     *
     * @param {jabberwerx.EventNotifier} event The primary presence updated event
     */
    onPrimaryPresenceUpdated: function(event) {
        // get the associated jabberwerx.Presence object
        var presence = event.data.presence;

        // TODO: what is the algorithm here?
        var show = (presence && (presence.getType() || presence.getShow() || "available")) || "unknown";
        var status = (presence && presence.getStatus());
        var priority = presence && presence.getPriority();
        var resource = event.data.fullJid.getResource();

        priority = (priority && "[" + priority + "]") || "";
        status = (status && "(" + status + ")") || "";

        //update the console HTML UI
        log("entity", "primary presence for " + event.source.jid + " now " + show + " at " + resource);

        //update the roster HTML UI with the new presence status
        jabberwerx.$("#roster_item_" + event.source._guid).
                children(".presence").
                text(jabberwerx.$.trim(priority + " " + show + " " + status));
    },
    /**
     * Callback for "resourcePresenceUpdated" event
     */
    onResourcePresenceUpdated: function(event) {
        // get the associated jabberwerx.Presence object
        var presence = event.data.presence;

        // TODO: what is the algorithm here?
        var show = (presence && (presence.getType() || presence.getShow() || "available")) || "unknown";
        var status = (presence && presence.getStatus());
        var priority = presence && presence.getPriority();
        var resource = event.data.fullJid.getResource();

        priority = (priority && "[" + priority + "]") || "";
        status = (status && "(" + status + ")") || "";

        //update the console HTML UI
        log("entity", "resource presence for " + event.source.jid + " now " + show + " at " + resource);

        //update the roster HTML UI with the new presence status
        jabberwerx.$("#roster_item_" + event.source._guid).
                children(".presence").
                text(jabberwerx.$.trim(priority + " " + show + " " + status));
    },

    /**
     *
     */
    onMUCRoom: function(evt) {
        var name = evt.name.substring("room".length);
        var data = "";
        var replace = function(input) {
            if (!input) {
                return input;
            }

            return input.replace(/[<>&]/g, function(str) {
                switch (str) {
                    case "<":   return "&lt;";
                    case ">":   return "&gt;";
                    case "&":   return "&amp;";
                }

                return str;
            });
        };
        if (evt.data) {
            if (evt.data instanceof jabberwerx.Message) {
                var subject = evt.data.getSubject();
                var body = evt.data.getBody();
                var from = evt.data.getFromJID().getResource();
                data = (subject && "subject by " + from + ": " + replace(subject)) ||
                        (body && "broadcast from " + from + ": " + replace(body));
            } else {
                data = evt.data;
            }
            data = " (" + data + ")";
        }
        log("room", name + " on " + evt.source.jid + data);
    },
    onErrorEncountered: function(event) {
        var name;
        if (event.source instanceof jabberwerx.MUCRoom) {
            name = "room " + event.source.jid + " errored";
        } else if (event.source instanceof jabberwerx.RosterController) {
            name = "roster errored";
        }
        var op = (event.data.operation && "on " + event.data.operation) || "";
        var err = (event.data.error && "(" + event.data.error.xml + "") || "";
        log("error", jabberwerx.$.trim(op + " " + err));
    },

    _handleStanzaSent: function(evt) {
        var stanza = evt.data;
        log(stanza.pType(), "SENT: " + stanza.xml());
    },
    _handleStanzaReceived: function(evt) {
        var stanza = evt.data;
        log(stanza.pType(), "RECV: " + stanza.xml());
    }
}, "JWA.Application");

window.sample_app = null;
jabberwerx.$(document).ready(function() {
    window.sample_app = new JWA.Application();
});
