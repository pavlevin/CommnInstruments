..
    Portions created or assigned to Cisco Systems, Inc. are
    Copyright (c) 2010 Cisco Systems, Inc.  All Rights Reserved.
..

.. meta::
   :description: This document describes the compliance with public protocols
                 supported by the |CAXL|
   :author: Matthew A. Miller <mamille2@cisco.com>
   :copyright: Copyright (c) 2010 Cisco Systems, Inc.  All Rights Reserved.
   :dateModified: 2010-02-11

.. |CAXL| replace:: Cisco AJAX XMPP Library

|CAXL|: Public Protocol Compliance
===================================

.. contents:: Table of Contents

Overview
--------

This document describes the compliance with public protocols supported by
the |CAXL|. This document only details those specifications that the |CAXL| has some
level of support for. This document does not discuss compliance with RFC 2616
and its successors; The |CAXL| relies on its execution container (e.g. web browser)
to support compliance regarding HTTP specifics.

Terminology
...........

The following requirements keywords as used in this document are to be
interpreted as described in `RFC 2119 <http://www.ietf.org/rfc/rfc2119.txt>`_:
"MUST", "SHALL", "REQUIRED"; "MUST NOT", "SHALL NOT"; "SHOULD", "RECOMMENDED";
"SHOULD NOT", "NOT RECOMMENDED"; "MAY", "OPTIONAL".

This document only discusses those protocols for which the |CAXL| contains some
support for. If an RFC or XEP is not listed, the |CAXL| does not contain any
explicit support for that protocol.  When a protocol is listed, the "Level of
Support" column indicates one of the following:

 * **Full**: All MUSTs, MUST NOTs, SHOULDs, SHOULD NOTs, and MAYs regarding
   client-side requirements are implemented.
 * **Partial**: All MUSTs and MUST NOTs are implemented, but other areas of
   the implementation do not meet all of the requirements.  This document
   is a section that details what implmentation limitations exist for that
   protocol.

Supported RFCs
--------------

The |CAXL| provides support the following RFCs:

=====================================   ==================
RFC                                     Level of Support
=====================================   ==================
`RFC 6120`_ XMPP-Core                   Partial
`RFC 6121`_ XMPP-IM                     Partial
`RFC 6122`_ XMPP-ADDR                   Partial
=====================================   ==================

_`RFC 6120`: XMPP-Core
......................

The |CAXL| partially supports all sections except for the following:

* **4.9.3.23. unsupported-feature**: A stream error is not generated for
  unknown mandatory to negotiate features.
* **7.3.1. Mandatory-to-Negotiate Bind**: Resource binding is not required.
* **11.1. XML restrictions**: Restricted XML is ignored.
* **11.3. Well-Formedness**: An <xml-not-well-formed/> error is sent
  rather than the now required <not-well-formed/> error.
* **13.8.1.  For Authentication Only**: The |CAXL| does not support
   SCRAM-SHA-1 or SCRAM-SHA-1-PLUS.

_`RFC 6121`: XMPP-IM
.....................

The |CAXL| partially supports all sections except for the following:

* **2.1.2.5. Subscription Attribute**: The subscription state is assumed
  to be one of the known states.
* **5.2.2. Type Attribute**: Unknown message types are not treated as
  "normal"s, they are instead ignored.

`RFC 6121` defines new features *NOT SUPPORTED* in the |CAXL|. These include,
but are not limited to, the following:

* **2.6. Roster Versioning**: Unsupported
* **3.1.1.  Outbound Subscription Request**: The suggested 'id' attribute
  is not added to a presence subscription request.
* **3.4. Pre-Approving a Subscription Request**: Unsupported
* **5.1. One To One Chat Sessions**: The suggested directed presence when
  not subscribed to chat recipient.

_`RFC 6122`: XMPP-ADDR
......................

The |CAXL| fully supports all sections except for the following:

* **2. Addresses**: The |CAXL| does not implement true Stringprep due to
  performance limitations in JavaScript.  Instead, a reasonable attempt is
  made to prohibit common characters from appearing in the "node" and "domain"
  portion of the JID; a locale-independent case mapping (to lower case
  equivalents) is done to the "node" and "domain" portion of the JID.

Supported XEPs
--------------

=========================================   ========    ==================
XEP                                         Version     Level of Support
=========================================   ========    ==================
`XEP-0004`_: Data Forms                     2.9         Partial
`XEP-0016`_: Privacy Lists                  1.6         Partial
`XEP-0030`_: Service Discovery              2.4         Partial
`XEP-0045`_: Multi-User Chat                1.24        Partial
XEP-0049: Private XML Storage               1.2         Full
`XEP-0060`_: Publish-Subscribe              1.12        Partial
`XEP-0071`_: XHTML-IM                       1.4         Partial
`XEP-0077`_: In-Band Registration           2.3         Partial
XEP-0082: XMPP Date and Time Profiles       1.0         Full
`XEP-0085`_: Chat State Notifications       2.1         Partial
`XEP-0090`_: Legacy Entity Time             1.2         Partial
XEP-0091: Legacy Delayed Delivery           1.4         Full
`XEP-0106`_: JID Escaping                   1.1         Partial
XEP-0115: Entity Capabilities               1.5         Full
`XEP-0124`_: BOSH                           1.9         Partial
`XEP-0128`_: Service Discovery Extensions   1.0         Partial
`XEP-0163`_: Personal Eventing Protocol     1.2r3       Partial
`XEP-0202`_: Entity Time                    2.0         Partial
`XEP-0203`_: Delayed Delivery               2.0         Partial
XEP-0206: XMPP Over BOSH                    1.2         Full
XEP-0249: Direct MUC Invitations            1.1         Full
=========================================   ========    ==================

_`XEP-0004`: Data Forms
.......................

The |CAXL| provides model-level support for data forms of type "cancel", "form",
"result" and "submit".  Basic validation of <field/> values are supported,
with the following limitations:

* **"3.3. Field Types"**: Values with embedded line endings (\n \r) are handled
  in the suggested manner in the xdata form view (XDataFormView). The model will
  validate values but treats line endings as white space.

_`XEP-0016`: Privacy Lists
..........................

The |CAXL| fully supports all sections, including blocking by stanza type,
except for the following:

Only items with a type of "jid" and an action of "deny" are supported.
Blocking by subscription type, roster group or globally is not supported.

_`XEP-0030`: Service Discovery
..............................

The |CAXL| only implements the following from XEP-0030:

* **"3. Discovering Basic Information about a Jabber Entity"**: The |CAXL|
  implements all MUSTs and SHOULDs regarding client-side requirements.
* **"4. Discovering the Items Associated with a Jabber Entity"**: The |CAXL|
  does not provide a public method or API for fetching disco#items. However,
  it does a "disco walk" (disco#info, disco#items) against the hosting
  domain upon each successful connect.

_`XEP-0045`: Multi-User Chat
............................

The |CAXL| does *NOT* implement any of the following top-level use cases:

* "8. Moderator Use Cases"
* "9. Admin Use Cases"

The |CAXL| implements all of the MUSTs and SHOULDs in "7. Occupant User Cases",
except as noted below:

* **"7.1.1. Groupchat 1.0 Protocol"**: The |CAXL| always signals its support of MUC;
  it does not implement the groupchat 1.0 protocol form of entering a room.
* **"7.1.14. Room Logging"**: The |CAXL| does not warn users visually if they enter
  a logged room; the targeted service implementations have not supported this
  feature.
* **"7.1.16. Managing Discussion History"**: The |CAXL| does not implement any of
  the discussion history management features.
* **"7.6. Converting a One-to-One Chat Into a Multi-User Conference"**: This
  use case is not implemented.
* **"7.8. Sending a Private Message"**: This feature is implemented indirectly
  via traditional one-to-one chat session support; the user may specify the
  full JID of the remote party, and that the message is "permanently"
  pre-locked to the given resource.
* **"7.10. Registering with a Room"**: This feature is not implemented.
* **"7.11. Getting Member List"**: This feature is not implemented.
* **"7.12. Discovering Reserved Room Nickname"**: This feature is not
  implemented; The |CAXL| does not attempt to discover a reserved nickname because
  targeted server implementations have not supported this feature per the
  protocol.
* **"7.13. Requesting Voice"**: This feature is not implemented because the
  targeted service implementations have not implemented it to date.

The |CAXL| implements all of the MUSTs and SHOULDs in "10. Owner User Cases",
except as noted below:

* **"10.1.4. Requesting a Unique Room Name"**: This feature is not implemented.
* **"10.3. Granting Ownership Privledges"**: This feature is not implemented.
* **"10.4. Revoking Ownership Privledges"**: This feature is not implemented.
* **"10.5. Modifying the Owner List"**: This feature is not implemented.
* **"10.6. Granting Administrative Privledges"**: This feature is not
  implemented.
* **"10.7. Revoking Administrative Privileges"**: This feature is not
  implemented.
* **"10.8. Modifying the Admin List"**: This feature is not implemented.
* **"10.9. Destroying a Room"**: This feature is not implemented.

The |CAXL| implements the following from "17.2.1. IRC Command Mapping" as part of
its UI:

* "/nick <newnick>" to change the user's nickname
* "/topic <foo>" to change the room's subject

_`XEP-0060`: Publish-Subscribe
..............................

The |CAXL| Implements the MUSTs and SHOULDs in "6. Subscriber Use Cases", except for
the following:

* **"6.1.6. Configuration Required"**: This is not implemented.  Instead, the
  API user is informed the subscription failed.
* **"6.3. Configure Subscription Options"**: This is not implemented.
* **"6.4. Request Default Subscription Configuration Options"**: This is not
  implemented.
* **"6.5.4. Returning Some Items"**: Support for XEP-0059: Result Set
  Management is not implemented, so a partial list is treated as the full list.
* **"6.5.6. Returning Notifications Only"**: The |CAXL| does not implement
  retrieving individual items by ItemID.
* **"6.5.7. Requesting the Most Recent Items"**: This is not implemented.
* **"6.5.8. Requesting a Particular Item"**: This is not implemented.

The |CAXL| implements the MUSTs and SHOULDs in "7. Publisher Use Cases", except for
the following:

* **"7.1.5. Publishing Options"**: This is not implemented.
* **"7.2.1. Request"**: The |CAXL| does not include a "notify" attribute as part of
  the retract.

The |CAXL| implements the MUSTs and SHOULDs in "7. Owner Use Cases", except for
the following:

* **"8.1.2. Create a Node With Default Configuration"**: The |CAXL| does not support
  configuration of nodes; creating with all default options is the only
  implemented behavior.
* **"8.1.3. Create and Configure a Node"**: This is not implemented.
* **"8.2. Configure a Node"**: This is not implemented.
* **"8.2. Request Default Node Configuration Options"**: This is not
  implemented.
* **"8.5. Purge all Note Items"**: This is not implemented.
* **"8.6. Manage Subscription Requests"**: This is not implemented.
* **"8.7. Process Pending Subscription Requests"**: This is not implemented.
* **"8.8. Manage Subscriptions"**: This is not implemented.
* **"8.9. Manage Affiliations"**: This is not implemented.

_`XEP-0071`: XHTML-IM
.....................................

The |CAXL| Implements all MUSTs, MUST NOTs, SHOULDs, SHOULD NOTs, and MAYs with the
following exceptions:

* Any element containing a "href" or "src" attribute that starts with
  "javascript:" is removed, and its children parented.
* **"6. XHTML-IM Integration Set"**: The |CAXL| implements the subset defined
  in section 7. Recommended Profile.
* **"8.3 All tags must be complete"**: The |CAXL| will implement this in outgoing xhtml-im.
* **"8.4 Multiple body tags with unique xml:lang"**: The |CAXL| does not implement mutliple body messages.
* **"8.9 Cleaning CDATA"**: The |CAXL| will implement this in outgoing xhtml-im

_`XEP-0077`: In-Band Registration
.....................................

The |CAXL| provides very limited support for In-band registration as follows:

* **"3.1 Entity Registers with a Host"**: IQ set *ONLY* is supported.
* iq:register fields <username/> and <password/> *ONLY* are supported.
* Account registration *ONLY* is supported.

The |CAXL| does *NOT* implement support for the following:

* **"3.1 Entity Registers with a Host"**: IQ get is *NOT* supported.
* **"3.2 Entity Cancels an Existing Registration"**: cancelling a registration is *NOT* supported.
* **"3.3 User Changes Password"**: password change is *NOT* supported.
* **"4. Extensibility"**: Data Forms for In-band registration are *NOT* supported.
* **"5. Redirection"**: is *NOT* supported.

_`XEP-0085`: Chat State Notifications
.....................................

The |CAXL| Implements all MUSTs, MUST NOTs, SHOULDs, SHOULD NOTs, and MAYs with the
following exceptions:

* **"5.5. Use in Groupchat"**: The |CAXL| does not send or process XEP-0085
  notifications groupchat/MUC rooms.

_`XEP-0090`: Legacy Entity Time
...............................

The |CAXL| will respond to legacy entity time requests, but does not provide a method
for the API user to query another entity.

_`XEP-0106`: JID Escaping
.........................

The |CAXL| provides "escapeNode" and "unescapeNode" methods which support this\
protocol.  However, the '\' is only escaped from the input string if what
follows it appears to be the remainder of an escaping sequence.  For example:

* escapeNode("service\user") would result in the string "service\user"
* escapeNode("user\40service") would result in the string "user\5c40service"
* escapeNode("user\52service") would result in the string "user\52service"

_`XEP-0124`: BOSH
.................

The |CAXL| only implements the following sections from XEP-0124:

* **"7. Initiating a BOSH Session"**: The "xml:lang" attribute is not provided
  in the initial body due to a general lack of localization and
  internationalization support. The |CAXL| always uses a "hold" value of "1",
  meaning that no more than two requests will be made (except as noted in the
  section regarding "11. Overactivity" below).  Otherwise, all MUSTs and
  SHOULDs regarding client-side requirements are implemented.
* **"8. Sending and Receiving XML Payloads"**: All MUSTs and SHOULDs regarding
  client-side requirements are implemented.
* **"9.2. Request acknowledgements"**: The |CAXL| implements this optional section,
  retaining at most 2 requests back.
* **"10. Inactivity"**: All MUSTs and SHOULDs regarding client-side
  requirements are implemented.
* **"11. Overactivity"**: It is possible to make more than 2 requests in the |CAXL|
  when terminating the session (deviating from "the client SHOULD NOT make
  more simultaneous requests than specified by the 'requests' attribute...");
  this is an exceptionally rare case that can occur if the API user is
  terminating the session at the exact moment that the |CAXL| makes a "long polling"
  request.  Otherwise, all MUSTs and SHOULDs regarding client-side requirements
  are implemented.
* **"13. Terminating the HTTP Session"**: The |CAXL| implements the MUSTs and
  SHOULDs in this section, as well as the MAY regarding the sending of <body
  type='terminate'/>.  However, the |CAXL| does not provide any stanzas in the
  request <body/>.
* **"14. Request IDs"**: The |CAXL| implements all MUSTs regarding client-side
  requirements.

_`XEP-0128`: Service Discovery Extensions
.........................................

The |CAXL| includes the data forms that might be present in a disco#info result to
the API user. The sending of data forms as part of disco#info requests to a
|CAXL| application is not implemented.

_`XEP-0163`: Personal Eventing Protocol
.......................................

|CAXL| implements the MUSTS and MUST NOTs for owners, pubishers, and
subscribers, with the following caveats and conditions:

* **"3. Publishing Events"**: |CAXL| supports publishing of items, but does not
  support the "publish-options" feature of XEP-0060.
* **"4.2 Filtered Subscriptions"**: |CAXL| supports filtered subscriptions by
  modifying the Client's capabilities when the API user subscribes. Explicit
  subscriptions are NOT supported.
* **"4.3. Generating Notifications"**: |CAXL| supports the use of Extended
  Stanza Addressing for indicating the publisher of an item, if such an
  extension is present and would not override an explicit "publisher"
  indication in the publish-subscribe item data.
* **"6. Determining Support**": |CAXL| does not attempt to determine support
  for PEP before attempting to publish information due to its event- and
  user-driven architecture. It is assumed that API users are aware of the
  capabilities of their deployment, or that such discovery is performed by
  the API user.

_`XEP-0202`: Entity Time
........................

The |CAXL| will respond to entity time requests, but does not provide a method for
the API user to query another entity.

_`XEP-0203`: Delayed Delivery
.............................

The |CAXL| does not support the "from" attribute, and therefore does not note the
oringial sender of a stanza with this data attached.
