..
    Portions created or assigned to Cisco Systems, Inc. are
    Copyright (c) 2014 Cisco Systems, Inc.  All Rights Reserved.

    Cisco and the Cisco logo are trademarks or registered trademarks of Cisco
    and/or its affiliates in the U.S. and other countries. To view a list of
    Cisco trademarks, go to this URL: http://www.cisco.com/go/trademarks
    Third-party trademarks mentioned are the property of their respective owners.
    The use of the word partner does not imply a partnership relationship between
    Cisco and any other company. (1110R)
..

.. meta::
   :description: This document describes the compliance with proprietary
                 protocols supported by the |CAXL|
   :author: Matthew A. Miller <mamille2@cisco.com>
   :copyright: Copyright (c) 2014 Cisco Systems, Inc.  All Rights Reserved.
   :dateModified: 2010-02-11

.. |CAXL| replace:: Cisco AJAX XMPP Library

|CAXL|: Proprietary Protocol Compliance
=======================================

.. contents:: Table of Contents

Overview
--------

This document describes the compliance with proprietary protocols supported by
the |CAXL|. This document only details those specifications that the |CAXL| has some
level of support for.

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
   has a section that details what implmentation limitations exist for that
   protocol.

Supported IJEPs
---------------

=============================================   ========    ==================
IJEP                                            Version     Level of Support
=============================================   ========    ==================
`IJEP-069`_: Temporary Presence Subscription    1.1         Full
=============================================   ========    ==================

_`IJEP-069`: Temporary Presence Subscriptions
.............................................

The |CAXL| implements all MUSTs, MUST NOTs, SHOULDs, SHOULD NOTs, and MAYs from
IJEP-069.
