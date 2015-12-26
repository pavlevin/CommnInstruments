..
    Portions created or assigned to Cisco Systems, Inc. are
    Copyright (c) 2010 Cisco Systems, Inc.  All Rights Reserved.
..

.. meta::
   :description: This document describes the visual design decisions made for
                 the Kubrick-based default |CAXL| theme.
   :author: Matthew A. Miller <mamille2@cisco.com>
   :copyright: Copyright (c) 2010 Cisco Systems, Inc.  All Rights Reserved.
   :dateModified: 2010-02-11

.. |CAXL| replace:: Cisco AJAX XMPP Library

|CAXL|: Kubrick-based Theme Analysis
====================================

.. contents:: Table of Contents

Overview
--------

This document describes the approach taken to make the |CAXL|'s default theme more
in-line with Cisco's Product UE standards, also known as Kubrick. The
guidelines can be found at `<http://wwwin.cisco.com/CustAdv/PSG/cues/>`_.

The |CAXL| does not attempt to exhaustively and rigorously match the guidelines;
most of the choices made are due to the fact that the |CAXL| is providing individual
widgets and components, and not a complete user interface.  Some are due to the
limitations of HTML and JavaScript.

Fonts and Colors
----------------

The |CAXL| sets the font face to Arial (or Helvetica if Arial is not found), with a
a point size of 21 pixels from baseline to top.

The colors most used are as follows:

+--------------+-------------+------------------------------------------------+
| Color Name   | Color Value | Examples                                       |
+==============+=============+================================================+
| Selection 40 | #8DB71F     | Explicit selections (e.g. MUCSearchView room   |
|              |             | selection)                                     |
+--------------+-------------+------------------------------------------------+
| Iterface 05  | #F1F5FA     | "even" index table rows, background color for  |
|              |             | dialogs (e.g. MUCConfigView, MUCSearchView,    |
|              |             | SubscriptionView)                              |
+--------------+-------------+------------------------------------------------+
| Interface 50 | #8499A2     | Border to most container-oriented components   |
|              |             | and dialogs                                    |
+--------------+-------------+------------------------------------------------+
| Action 30    | #60E4FB     | Border to most input components (e.g. single-  |
|              |             | and multi-line text inputs).                   |
+--------------+-------------+------------------------------------------------+
| Alert 50     | #F35000     | Error messages and validation highlights       |
+--------------+-------------+------------------------------------------------+

The most common gradients are the following:

+---------------+-------------------------------------------------------------+
| Gradient Name | Examples                                                    |
+===============+=============================================================+
| Normal        | RosterView group titles, inactive tabs, pseudo-buttons      |
+---------------+-------------------------------------------------------------+

Common Exclusions
-----------------

Wherever possible, the |CAXL| relies on the underlying browser/operating system for
various input components (e.g. buttons, dropdown lists, etc). Because of the
differences in how and what styling can be applied to these components, the |CAXL|
has opted not to attempt to apply the Kubrick recommendations. The lone
exception are single- and mult-line text inputs, since the supported platforms
are consistent in how these components are styled.

Component Specifics
-------------------

Not all components are listed here. Only those components with significant
styling applications are included below.

ContactPresenceView
===================

The jabberwerx.ui.ContactPresenceView uses the Kubrick recommended icons for
displaying presence information. In the case where the presence state for an
entity is unknown, the icon is actually a fully transparent image of the same
dimensions as the other presence icons (20 by 20 pixels).

TabbedView
==========

The jabberwerx.ui.TabbedView uses a default background color of #F0F0F0 for the
tab contents; it provides a reasonable level of contrast without resorting to
the absolutes of the color scale.  Active tabs use this color as their default,
with a 22-pixel wide gradient fade to pure white (#FFFFFF) at the right-most
edge. Inactive tabs start with a color of #C1D0DB with a 22-pixel wide gradient
to ##FEFFFF.

RosterView
==========

The jabberwerx.ui.RosterView has two primary modes: grouped and single. The
grouped mode is typically used to represent a user's buddylist or roster of
contacts, while the single mode is used to list the occupants of MUC rooms.

Grouped Mode
------------

The RosterView in grouped mode displays in a manner similar to Kubrick's
concept of drawers.  Since there is no concept of a primary group, the styles
for the "selected" or "active" drawer is not used.

The group heading uses the Normal Gradient, with an indent to accomodate a
state icon: a right-pointing triangle for a collapsed or empty group, and a
down-pointing triangle for an expanded group.

The group container uses a background of pure white (#FFFFFF). Each contact
within the group is a double-height ContactPresenceView, with the first row
alloted to the display name of the contact in pure black (#000000) and the
succeeding line to render the contact's specific status (if any) using Neutral
50 (#8E8E8E).

Single Mode
-----------

There is no group heading.  Instead, the roster renders using the group
container details as above.

TextInput
=========

The jabberwerx.ui.TextInput component is used within the ChatView and MucView
components. This component renders as a text area with a "send" button
adjacent. This differs from the Kubrick standard, because the current layout
better utilizes the available space. The "send" button is rendered as per
Kubrick because this button required custom rendering to properly occupy the
available space.

XDataFormView
=============

The jabberwerx.ui.XDataFormView component has three "modes" of rendering: form,
name/value results, and tabular. The form and name/value results modes render
generally per Kubrick recommendations, labels aligning vertically along their
left edge, and fields bordered by a 1 pixel wide solid border colored in Action
50.

The tabular view renders generally per Kubrick recommendations, with the header
columns separated by a 2-D looking border, and item rows alternating between
Interface 05 and Interface 10 for the background color.  Selected rows render
with a backround of Selection 40.

Dialog-style Components
=======================

The dialog-style components (jabberwerx.ui.MUCConfigView,
jabberwerx.ui.MUCInviteView, jabberwerx.ui.SearchView, and
jabberwerx.ui.SubscriptionView) render generally per Kubrick recommendations
for modal dialogs, despite the fact these components are not trully modal in
|CAXL| applications. The major difference is the application of a Rounded
Interface border (one pixel wide, colored Interface 50). to better help
distinguish the bounds of the dialog from whatever may lie beneath it.

ConsoleView
===========

ConsoleView is styled after |CAXL| Dialog-style Components with
the same background and border. The ConsoleView toolbar and buttons do not
follow Kubrick recommendations for the same reasons at TextInput. When that
problem is solved it can be implemented here. The toolbar
does follow background and border specifications. ConsoleView's console area
uses the same background and borders as roster and chat history for consistency.
Margins and spacing throughout are from the Kubrick recommendations.

HTTP markup of xmpp packets is configurable through css. It's possible Kubrick defines
a color scheme for console output, this will need to be investigated further.
Error messages (jabberwerx.util.debug.error) are currently implemented
as log messages and are not presented using Kubrick's Alert 50 color scheme.
When the view is updated to correctly recognize log errors that color scheme will
be used.
