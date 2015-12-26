/**
 * filename:        XHTMLIMTest.js
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2009-2011 Cisco Systems, Inc.  All Rights Reserved.
 */

jabberwerx.$(document).ready(function() {

    module("jabberwerx[xhtml-im]");

    test("Test bad argument", function() {
        try {
            jabberwerx.xhtmlim.sanitize(null);
            ok(false, "expected TypeError thrown for null argument");
        } catch (ex) {
            ok(ex instanceof TypeError, "Expected TypeError thrown for null argument");
        }

        try {
            jabberwerx.xhtmlim.sanitize({});
            ok(false, "expected TypeError thrown for non-DOM argument");
        } catch (ex) {
            ok(ex instanceof TypeError, "Expected TypeError thrown for non-DOM argument");
        }
        try {
            jabberwerx.xhtmlim.sanitize(new jabberwerx.NodeBuilder("bad-tag").data);
            ok(false, "expected TypeError thrown for non-allowed argument");
        } catch (ex) {
            ok(ex instanceof TypeError, "Expected TypeError thrown for non-allowed argument");
        }
    });

    test("Test trivial santization", function() {
        var bodyDOM = $(jabberwerx.util.unserializeXML("<body xmlns='http://www.w3.org/1999/xhtml'/>"));
        var testDOM = bodyDOM.clone();
        jabberwerx.xhtmlim.sanitize(testDOM.get(0));
        equals(bodyDOM.get(0).xml, testDOM.get(0).xml, "trivial body");
        testDOM = jabberwerx.util.unserializeXML("<body xmlns='http://www.w3.org/1999/xhtml'><bad-outer><bad-inner/></bad-outer></body>");
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(bodyDOM.get(0).xml, testDOM.xml, "trivial all bad tag");
        testDOM = jabberwerx.util.unserializeXML("<p><em>foo</em></p>");
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals("<p><em>foo</em></p>", testDOM.xml, "trivial good tag");
    });

    test("Test tag filtering", function() {
        var instr = "<p><remove-me><bar>text1<em>text2</em>text3</bar>text4</remove-me><strong>text5</strong>text6</p>";
        var outstr = "<p>text1<em>text2</em>text3text4<strong>text5</strong>text6</p>";
        var testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml);
    });

    test("Test attribute filtering", function() {
        var instr = "<p remove='me' style='font-size:large'><em>foo</em></p>";
        var outstr = '<p style="font-size:large"><em>foo</em></p>';
        var testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml);
    });

    test("Test style property filtering", function() {
        var instr = "<p style='font-size:large;remove:me;color:red'><em>foo</em></p>";
        var outstr = '<p style="font-size:large;color:red"><em>foo</em></p>';
        var testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml);
    });

    test("Test childrens attributes", function() {
        var instr = "<body><span bcd='abc' style='font-size:large'><p><em>foo</em></p></span></body>";
        var outstr = '<body><span style="font-size:large"><p><em>foo</em></p></body>';
        var outstr_ie = '<body><span style="font-size:large"><p><em>foo</em></p></span></body>';
        var testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        ok(outstr == testDOM.xml || outstr_ie == testDOM.xml, "expected result");
    });

     test("Test valid tags not allowing attributes", function() {
        var instr = '<br style="font-size:large"><span>text</span></br>';
        var outstr = '<br><span>text</span></br>';
        var testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml);
    });

    test("Test attribute filtering a+href", function() {
        var instr = "<a remove='me' href='http://www.jabber.org/'><p><em>foo</em></p></a>";
        var outstr = '<a href="http://www.jabber.org/"><p><em>foo</em></p></a>';
        var testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml);
    });

    test("Test attribute filtering a+style", function() {
        var instr = "<a remove='me' style='font-size:large'><p><em>foo</em></p></a>";
        var outstr = '<a style="font-size:large"><p><em>foo</em></p></a>';
        var testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml);
    });

    test("Test attribute filtering a+type", function() {
        var instr = "<a remove='me' type='stuff'><p><em>foo</em></p></a>";
        var outstr = '<a type="stuff"><p><em>foo</em></p></a>';
        var testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml);
    });

    test("Test attribute filtering img+src", function() {
        var instr = "<img remove='me' src='http://www.xmpp.org/images/psa-license.jpg'>bar</img>";
        var outstr = '<img src="http://www.xmpp.org/images/psa-license.jpg">bar</img>';
        var testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml);
    });

    test("Test attribute filtering img+alt", function() {
        var instr = "<img remove='me' alt='A License to Jabber'>bar</img>";
        var outstr = '<img alt="A License to Jabber">bar</img>';
        var testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml);
    });

    test("Test attribute filtering img+height", function() {
        var instr = "<img remove='me' height='261'>bar</img>";
        var outstr = '<img height="261">bar</img>';
        var testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml);
    });

    test("Test attribute filtering img+width", function() {
        var instr = "<img remove='me' width='537'>bar</img>";
        var outstr = '<img width="537">bar</img>';
        var testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml);
    });

    test("Test attribute filtering combo of (href|src)^=javascript:", function() {
        var instr, outstr, testDOM;

        instr = '<p><a href="javascript:window.close(); return false">click here</a></p>';
        outstr = '<p>click here</p>';
        testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml, "test for bad href");

        instr = '<p><a href="window.close(); return false">click here</a></p>';
        outstr = '<p><a href="window.close(); return false">click here</a></p>';
        testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml, "test for not bad href");

        instr = '<p><img src="javascript:window.close(); return false">foo</img>bar</p>';
        outstr = '<p>foobar</p>';
        testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml, "test for bad src");


        instr = '<p><img src="window.close(); return false">foo</img></p>';
        outstr = '<p><img src="window.close(); return false">foo</img></p>';
        testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml, "test for not bad src");

        instr = '<p><a href="javascript:window.close()">Click here<img src="http://example.com/img">bar</img></a> for something with <a href="http://www.cisco.com/">MORE<img src="javascript:window.location=\'http://www.cisco.com\'">of my</img>MOJO</a></p>';
        outstr = '<p>Click here<img src="http://example.com/img">bar</img> for something with <a href="http://www.cisco.com/">MOREof myMOJO</a></p>';
        testDOM = jabberwerx.util.unserializeXML(instr);
        jabberwerx.xhtmlim.sanitize(testDOM);
        equals(outstr, testDOM.xml, "test for combo");
    });
});
