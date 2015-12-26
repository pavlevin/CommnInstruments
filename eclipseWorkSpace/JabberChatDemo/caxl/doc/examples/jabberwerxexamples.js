/**
 * filename:  jabberwerxexamples.js
 *
 * Cisco encourages developers to incorporate example code into
 * their applications.
 */

/**
 * This file contains objects used between various examples.
 */
;(function() {

if (jabberwerx_examples) {
    return;
}

var jabberwerx_examples = {};

/**
 * HTML for a simple login UI. Used in addLogin below
 */
jabberwerx_examples.loginHTMLStr =
"<table align='center' border='0'>" +
    "<form>" +
    "<tr>" +
        "<td><label for='userNameField'>User Name: </label></td>" +
        "<td><input type='text' id='userNameField' size='30' maxLength='30'/></td>" +
    "</tr>" +
    "<tr>" +
        "<td><label for='passwordField'>Password: </label></td>" +
        "<td><input type='text' id='passwordField' size='30' maxLength='30'/></td>" +
    "</tr>" +
    "<tr>" +
        "<td><label for='statusLabel'>Status: </label></td>" +
        "<td><div id='statusLabel'>Disconnected</div></td>" +
    "</tr>" +
    "<tr>" +
        "<td><label for='errorLabel'>Error: </label></td>" +
        "<td><div id='errorLabel'>None</div></td>" +
    "</tr>" +
    "<tr>" +
        "<td colspan='2' align='center'>" +
            "<input type='button' id='connectButton' value='Connect'/>" +
            "<input type='button' id='disconnectButton' value='Disconnect'/>" +
            "<div id='conn-spacer'>&nbsp;</div>" +
        "</td>" +
    "</tr>" +
    "</form>" +
"</table>";

/**
 * Add a simple login to the given parent.
 *
 * Uses the given parent, jabberwerx.Client and configuration object to
 *  - append loginHTMLStr
 *  - Map connection and disconnection to newly added HTML through client
 *      using config.
 * config may contain successCallback and errorCallback functions that will be
 * invoked when a connection attempt is completed.
 *
 * \param parent The parent jQuery to append the login UI to
 * \param client The jabberwerx.Client to use for connection
 * \param config The connection arguments.
 * \throws TypeError if parent, client ot config is not provided.
 */
jabberwerx_examples.addLogin = function(parent, client, config) {
    if (!parent) {
        throw new TypeError("addExampleLogin expects a parent node.");
    }
    if (!client || !(client instanceof jabberwerx.Client)) {
        throw new TypeError("addExampleLogin expects a jabberwerx.Client.");
    }
    if (!config) {
        throw new TypeError("addExampleLogin expects a demo_config object.");
    }

    // Called when the "Connect" button is pressed
    var connect = function() {
        // As soon as the "Connect" button is clicked, hide it so that the user
        // can not click it again.
        jabberwerx.$('#connectButton', parent).hide();
        jabberwerx.$('#conn-spacer', parent).show();

        // Clear any previous error reporting
        jabberwerx.$('#errorLabel', parent).html('None');

        // Indicate to the user that we are in the process of connecting
        jabberwerx.$('#statusLabel', parent).html('Connecting...');

        // The user name that will be used for the client authentication
        var username = jabberwerx.$('#userNameField', parent).val() + "@" + config.domain;
        // The password that will be used for the client authentication
        var password = jabberwerx.$('#passwordField', parent).val();

        // Required connection arguments.
        var connectArgs = {
            // The proxy url to the BOSH server
            httpBindingURL: config.httpBindingURL,
            successCallback: function() {
                config.successCallback && config.successCallback();
            },
            // "onClientError" is the error callback method
            // It will automatically be called upon an unsuccessful connection.
            // When an error occurs we display it in the connection_status element
            errorCallback: function(error) {
                jabberwerx.$('#connectButton', parent).show();

                jabberwerx.$('#errorLabel', parent).html(jabberwerx.errorReporter.getMessage(error));
                config.errorCallback && config.errorCallback(error);
            }
        };

        // Attempt to connect to the XMPP/BOSH server
        try {
            client.connect(username, password, connectArgs);
        } catch (ex) {
            jabberwerx.$('#errorLabel', parent).html(ex.message);
        }
    }
    var disconnect = function() { // Called when the "Disconnect" button is pressed
        jabberwerx.$('#disconnectButton', parent).hide();
        jabberwerx.$('#conn-spacer', parent).show();

        // Indicate to the user that we are in the process of disconnecting
        jabberwerx.$('#statusLabel', parent).html('Disconnecting...');

        // Disconnect the client
        client.disconnect();
    }

    jabberwerx.$(parent).append(jabberwerx_examples.loginHTMLStr);

    jabberwerx.$('#userNameField', parent).val(config.username || "");
    jabberwerx.$('#passwordField', parent).val(config.password || "");

    jabberwerx.$('#connectButton', parent).click(connect);
    jabberwerx.$('#disconnectButton', parent).click(disconnect);
    jabberwerx.$('#disconnectButton', parent).hide();
    jabberwerx.$('#conn-spacer', parent).hide();

    // The Jabberwerx API supports binding to a "clientConnected" event.
    // The event will automatically be triggered when the client
    // is fully connected.
    client.event("clientConnected").bind(function(evt) {
        jabberwerx.$('#disconnectButton', parent).show();
        jabberwerx.$('#conn-spacer', parent).hide();

        jabberwerx.$('#statusLabel', parent).html('Connected as: ' + client.connectedUser.getDisplayName());
    });

    // The Jabberwerx API supports binding to a "clientDisconnected" event.
    // The event will automatically be triggered whenever the
    // client is disconnected. If some error caused the disconnect
    // an error stanza will be passed to the event.
    client.event("clientDisconnected").bind(function(evt) {
        jabberwerx.$('#connectButton', parent).show();
        jabberwerx.$('#conn-spacer', parent).hide();

        jabberwerx.$('#statusLabel', parent).html('Disconnected');
    });
    jabberwerx.$(parent).show();
}

window.jabberwerx_examples = jabberwerx_examples;
})();
