/**
 * filename:        JabberWerxUITest.js
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2009-2013 Cisco Systems, Inc.  All Rights Reserved.
 */

jabberwerx.$(document).ready(function() {

    module("jabberwerx.ui[core]");

    test("Test _getTimeDisplayString", function() {
        tdate = new Date(1970, 2, 5, 0, 0);
        tstr = jabberwerx.ui._getTimeDisplayString(tdate);
        equals(tstr, "12:00am", "midnight");
        tdate = new Date(1970, 2, 5, 12, 0);
        tstr = jabberwerx.ui._getTimeDisplayString(tdate);
        equals(tstr, "12:00pm", "noon");
        tdate = new Date(1970, 2, 5, 11, 59);
        tstr = jabberwerx.ui._getTimeDisplayString(tdate);
        equals(tstr, "11:59am", "almost noon");
        tdate = new Date(1970, 2, 5, 23, 59);
        tstr = jabberwerx.ui._getTimeDisplayString(tdate);
        equals(tstr, "11:59pm", "almost midnight");
        tdate = new Date(1970, 2, 5, 12, 1);
        tstr = jabberwerx.ui._getTimeDisplayString(tdate);
        equals(tstr, "12:01pm", "after noon");
        tdate = new Date(1970, 2, 5, 0, 1);
        tstr = jabberwerx.ui._getTimeDisplayString(tdate);
        equals(tstr, "12:01am", "after midnight");
        tdate = new Date(1970, 2, 5, 15, 14);
        tstr = jabberwerx.ui._getTimeDisplayString(tdate);
        equals(tstr, "3:14pm", "afternoon pi");
        tdate = new Date(1970, 2, 5, 3, 14);
        tstr = jabberwerx.ui._getTimeDisplayString(tdate);
        equals(tstr, "3:14am", "morning pi");
        tdate = new Date(1970, 2, 5, 3, 1);
        tstr = jabberwerx.ui._getTimeDisplayString(tdate);
        equals(tstr, "3:01am", "0 fill minutes");
    });
    test("Test _getDayDisplayString", function() {
        var tdate = new Date();
        //compare to now
        var tstr = jabberwerx.ui._getDayDisplayString(tdate);
        equals(tstr, "", "same date, empty");
        tdate = new Date(1968, 6, 20);
        var cdate = new Date(1969, 6, 20);
        tstr = jabberwerx.ui._getDayDisplayString(tdate, cdate);
        equals(tstr, "Jul 20, 1968", "different year");
        tdate = new Date(1969, 5, 20); //different month
        tstr = jabberwerx.ui._getDayDisplayString(tdate, cdate);
        equals(tstr, "Jun 20", "different month");
        tdate = new Date(1969, 6, 21); //different day
        tstr = jabberwerx.ui._getDayDisplayString(tdate, cdate);
        equals(tstr, "Jul 21", "different day");

        tdate = new Date(1970, 0, 2);
        cdate = new Date(1970, 0, 1);
        tstr = jabberwerx.ui._getDayDisplayString(tdate, cdate);
        equals(tstr, "Jan 02", "different day, 0 fill");
    });
    test("Test getDateDisplayString", function() {
        var now = new Date();
        //compare to now
        var tstr = jabberwerx.ui.getDateDisplayString(now);
        var timeStr = jabberwerx.ui._getTimeDisplayString(now);
        equals(tstr, timeStr, "same date, current time");
        var tdate = new Date(1970, now.getMonth(), now.getDate(), 0, 0);
        tstr = jabberwerx.ui.getDateDisplayString(tdate);
        var dayStr = jabberwerx.ui._getDayDisplayString(tdate);
        equals(tstr, dayStr + " 12:00am", "different year");
        var td = now.getMonth() === 1 ? 2: 1;
        tdate = new Date(now.getUTCFullYear(), td, now.getDate(), 0, 0);
        tstr = jabberwerx.ui.getDateDisplayString(tdate);
        dayStr = jabberwerx.ui._getDayDisplayString(tdate);
        equals(tstr, dayStr + " 12:00am", "different month");
        td = now.getDate() === 1 ? 2 : 1;
        tdate = new Date(now.getUTCFullYear(), now.getMonth(), td, 0, 0);
        dayStr = jabberwerx.ui._getDayDisplayString(tdate);
        tstr = jabberwerx.ui.getDateDisplayString(tdate);
        equals(tstr, dayStr + " 12:00am", "different day");
        td = now.getDate() === 10 ? 11 : 10;
        tdate = new Date(now.getUTCFullYear(), now.getMonth(), td, 0, 0);
        tstr = jabberwerx.ui.getDateDisplayString(tdate);
        dayStr = jabberwerx.ui._getDayDisplayString(tdate);
        equals(tstr, dayStr + " 12:00am", "different day, no 0 fill");

        tdate = new Date(1970, 0, 1, 0, 0);
        tstr = jabberwerx.ui.getDateDisplayString(tdate);
        equals(tstr, "Jan 01, 1970 12:00am", "full date midnight");
        tdate = new Date(1970, 0, 1, 12, 0);
        tstr = jabberwerx.ui.getDateDisplayString(tdate);
        equals(tstr, "Jan 01, 1970 12:00pm", "full date noon");
        tdate = new Date(1970, 0, 1, 0, 1);
        tstr = jabberwerx.ui.getDateDisplayString(tdate);
        equals(tstr, "Jan 01, 1970 12:01am", "full date after midnight");
        tdate = new Date(1970, 0, 1, 12, 1);
        tstr = jabberwerx.ui.getDateDisplayString(tdate);
        equals(tstr, "Jan 01, 1970 12:01pm", "full date after noon");
        tdate = new Date(1970, 0, 1, 3, 14);
        tstr = jabberwerx.ui.getDateDisplayString(tdate);
        equals(tstr, "Jan 01, 1970 3:14am", "full date morning pi");
        tdate = new Date(1970, 0, 1, 15, 14);
        tstr = jabberwerx.ui.getDateDisplayString(tdate);
        equals(tstr, "Jan 01, 1970 3:14pm", "full date afternoon pi");
    });
});
