..
    Portions created or assigned to Cisco Systems, Inc. are
    Copyright (c) 2010 Cisco Systems, Inc.  All Rights Reserved.
..

.. meta::
   :description: This is a simple tutorial on how to get started with |JWA|
   :author: Michael J. Wegman <mwegman@cisco.com>
   :copyright: Copyright (c) 2012 Cisco Systems, Inc.  All Rights Reserved.
   :dateModified: 2012-02-09

.. |JWA| replace:: Cisco AJAX XMPP Library

|JWA|: Getting Started
======================

.. contents:: Table of Contents

Overview
--------

This tutorial will step you through the process of creating a basic web app
using |JWA|. Afterwards, you will be able to connect to an XMPP server, send 
messages and receive messages.

Some basic requirements before proceeding are:

- Basic knowledge of JavaScript and HTML.
- Basic understanding of `XMPP <http://www.xmpp.org>`_.
- Proper setup of a web server. An example of how to do this is discussed in
  the `Deployment Guide <api/deploymentGuide.html>`_. 

Setup
-----

Extract the contents of |JWA| to the working directory of your website.
In the same directory, create a file called index.html and insert the
following text::

  <html>                                                                  
    <head>                                                                  
      <script type="text/javascript" src="jabberwerx.js"></script>          
      <script type="text/javascript">                                         
        // The javascript necessary to get XMPP working goes here.                                     
      </script>                                                               
    </head>                                                                 
    <body>                                                                  
      <!-- The HTML markup for the page-->                                        
    </body>                                                                 
  </html>

Connecting to XMPP
------------------

First thing we need to do is create a `jabberwerx.Client <api/symbols/jabberwerx.Client.html>`_.
This is the object that drives the whole XMPP client session. In the javascript
section of the index.html file, add the following lines::

  client = new jabberwerx.Client();
  client.connect("jwtest0@example.com", "test");

The first line will create the jabberwerx.Client object. The second line will
connect to the XMPP server using the username "jwtest0" at the domain "example.com"
with the password "test." The information needs to be changed to an actual
account/password combination that exists on the XMPP server.

Most |JWA| applications manipulate the DOM in event callbacks. To ensure these callbacks
are done after the DOM is ready, we need to ensure the connect call is performed
after the DOM is ready. The jQuery library provided by the |JWA| can be used to
do this. Now our connect call looks like the following::

  jabberwerx.$(document).bind("ready", function() {
    client.connect("jwtest0@example.com", "test");
  });

We are now connected to an XMPP server.

Final index.html::

  <html>                                                                  
    <head>                                                                  
      <script type="text/javascript" src="jabberwerx.js"></script>          
      <script type="text/javascript">                                         
        client = new jabberwerx.Client();

        jabberwerx.$(document).bind("ready", function() {
          client.connect("jwtest0@example.com", "test");
        });
      </script>                                                               
    </head>                                                                 
    <body>                                                                  
      <!-- The HTML markup for the page-->                                        
    </body>                                                                 
  </html>

Send A Message
--------------

To send a message to another user, we need to wait for the jabberwerx.Client to
finish connecting to the XMPP server. This can be obtained from the
"clientStatusChanged" event in the jabberwerx.Client. Listening to the event is
done the following way::

  client.event("clientStatusChanged").bind(function(evt) { ... });

When the jabberwerx.Client object finishes connecting to the XMPP server, it will
call the anonymous function with the variable evt.data.next equal to
jabberwerx.Client.status_connected. At this point, we can send a message to another
user using the sendMessage method in the jabberwerx.Client object. The whole
operation looks like this::

  client.event("clientStatusChanged").bind(function(evt) {
    if (evt.data.next == jabberwerx.Client.status_connected) {
      client.sendMessage("jwtest1@example.com", "Hello XMPP User.");
    }
  });

We have successfully sent a message to another user.

Final index.html::

  <html>                                                                  
    <head>                                                                  
      <script type="text/javascript" src="jabberwerx.js"></script>          
      <script type="text/javascript">                                         
        client = new jabberwerx.Client();

        client.event("clientStatusChanged").bind(function(evt) {
          if (evt.data.next == jabberwerx.Client.status_connected) {
            client.sendMessage("jwtest1@example.com", "Hello XMPP User.");
          }
        });

        jabberwerx.$(document).bind("ready", function() {
          client.connect("jwtest0@example.com", "test");
        });

      </script>                                                               
    </head>                                                                 
    <body>                                                                  
      <!-- The HTML markup for the page-->                                        
    </body>                                                                 
  </html>

Receive Messages
----------------

Receiving messages requires another listener on an event in the jabberwerx.Client
object. This event is called "messageReceived." The following will inform us when
we receive a message::

  client.event("messageReceived").bind(function(evt) { ... });

The variable evt.data will be a `jabberwerx.Message <api/symbols/jabberwerx.Message.html>`_
object containing the received message. We can grab the body of the
jabberwerx.Message object and display it to the user as follows::

  client.event("messageReceived").bind(function(evt) {
    var message = evt.data;
    var body = message.getBody();
    if (body) {
      alert("From " + message.getFrom() + ": " + body);
    }
  });

We are now receiving messages from other users.

Final index.html::

  <html>                                                                  
    <head>                                                                  
      <script type="text/javascript" src="jabberwerx.js"></script>          
      <script type="text/javascript">                                         
        client = new jabberwerx.Client();

        client.event("clientStatusChanged").bind(function(evt) {
          if (evt.data.next == jabberwerx.Client.status_connected) {
            client.sendMessage("jwtest1@example.com", "Hello XMPP User.");
          }
        });

        client.event("messageReceived").bind(function(evt) {
          var message = evt.data;
          var body = message.getBody();
          if (body) {
            alert("From " + message.getFrom() + ": " + body);
          }
        });

        jabberwerx.$(document).bind("ready", function() {
          client.connect("jwtest0@example.com", "test");
        });

      </script>                                                               
    </head>                                                                 
    <body>                                                                  
      <!-- The HTML markup for the page-->                                        
    </body>                                                                 
  </html>

Conclusion
----------

We've just created a very simple XMPP client using the |JWA|. For more information about additional
features and functionality including more demo applications, please refer to the
`main page <index.html>`_ of the |JWA| documentation.
