/**
 * filename:        CryptTest.js
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2009-2011 Cisco Systems, Inc.  All Rights Reserved.
 */

jabberwerx.$(document).ready(function() {
    module("jabberwerx/util/crypto");

    //toggle functions based on crypt implementation allowing backward testing    
    //toggle functions based on crypt implementation allowing backward testing    
    var b64Enc = jabberwerx.util.crypto.b64Encode;
    var b64Dec = jabberwerx.util.crypto.b64Decode;
    var utf8Enc = jabberwerx.util.crypto.utf8Encode;
    var utf8Dec = jabberwerx.util.crypto.utf8Decode;
    var toHex = jabberwerx.util.crypto.str2hex;
    var toStrSha1 = jabberwerx.util.crypto.str_sha1;
    var toB64Sha1 = jabberwerx.util.crypto.b64_sha1;
    var toHexMD5 = jabberwerx.util.crypto.hex_md5;
    var toStrMD5 = jabberwerx.util.crypto.rstr_md5;
    
    test("B64 Encoding Functions", function() {
        var origStr = "tobyjulivaca";
        var encStr = "dG9ieWp1bGl2YWNh";        
        var enc = b64Enc(origStr);        
        equals(enc, encStr, "encoded " + origStr);        
        enc = b64Dec(encStr);
        equals(enc, origStr, "decoded " + encStr);        

        origStr = "Ѕ І Ї Ј Љ Њ Ћ Ќ Ў Џ А Б В Г Д";
        encStr = "0IUg0IYg0Icg0Igg0Ikg0Iog0Isg0Iwg0I4g0I8g0JAg0JEg0JIg0JMg0JQ=";        
        enc = b64Enc(utf8Enc(origStr));        
        equals(enc, encStr, "encoded " + origStr);        
        enc = utf8Dec(b64Dec(enc));
        equals(enc, origStr, "decoded " + encStr);        
    });
    
    test("UTF-8 Encoding", function() {
        var origStr = "tobyjulivaca";
        var encStr = utf8Enc(origStr);
        equals(encStr, origStr, "non utf-8 encodes unchanged");
        encStr = utf8Dec(encStr);
        equals(encStr, origStr, "non utf-8 decodes unchanged");
        
        origStr = "Ѕ І Ї Ј Љ Њ Ћ Ќ Ў Џ А Б В Г Д";
        var knownEncStr = "Ð Ð Ð Ð Ð Ð Ð Ð Ð Ð Ð Ð Ð Ð Ð";
        encStr = utf8Enc(origStr)
        equals(encStr, knownEncStr, "utf-8 encoded unicode");
        encStr = utf8Dec(encStr);
        equals(encStr, origStr, "utf-8 decoded back to original");        

        var invalidUtf8 = [ "\xf0\x80\xbf\x80",   // out of range
                            "\xc0\xbc",           // overlong
                            "\xe0\x8f\xbf",       // out of range
                            "\xed\xbf\xbf",       // out of range
                            "\xf0\x8f\xbf\xbf",   // out of range
                            "\xf0\xc0\xbf\xbf",   // out of range
                            "\xf4\x90\xbf\xbf" ]; // out of range
        var caught;
        for (var idx = 0; idx < invalidUtf8.length; idx++) {
            try {
                caught = false;
                encStr = utf8Dec(invalidUtf8[idx]);
            } catch (ex) {
                caught = true;
            }
            ok(caught, "expected error thrown for invalid utf-8: 0x" + toHex(invalidUtf8[idx]));
        }

        var validUtf8 = [ "\xe0\xa0\xbf",
                          "\xe0\xbf\xbf",
                          "\xed\x9f\xbf",
                          "\xed\x80\xbf",
                          "\xf0\x90\xbf\xbf",
                          "\xf0\xa5\x95\x9c",
                          "\xf0\xbf\x80\xbf",
                          "\xf4\x8e\xbf\xbf",
                          "\xf4\x8f\xbf\xbf",
                          "\xe5\x90\x89\xe7\xa5\xa5\xe5\xa6\x82\xe6\x84\x8f", // 吉祥如意
                          "\xe5\x9c\x8b\xe8\xaa\x9e\x2d\x74\x69\xe1\xba\xbf\x6e\x67\x20\x56\x69\xe1\xbb\x87\x74\x2d\xed\x95\xad\xea\xb8\x80\x2d\xd1\x80\xd1\x83\xd1\x81\xd1\x81\xd0\xba\xd0\xb8\xd0\xb9\x20\xd1\x8f\xd0\xb7\xd1\x8b\xd0\xba" ]; // 國語-tiếng Việt-항글-русский язык
        for (var idx = 0; idx < validUtf8.length; idx++) {
            encStr = utf8Dec(validUtf8[idx]);
            ok("" != encStr, "converted valid utf-8: " + encStr);
        }
    });
    
    test("Str2Hex", function() {
        var origStr = "tobyjulivaca";
        var hexStr = "746f62796a756c6976616361";
        equals(toHex(origStr), hexStr, "non-unicode hex string");
        
        origStr = "Ѕ І Ї Ј Љ Њ Ћ Ќ Ў Џ А Б В Г Д";
        hexStr = "052006200720082009200a200b200c200e200f20102011201220132014";
        equals(toHex(origStr), hexStr, "unicode hex string");
        
        hexStr = "052006200720082009200A200B200C200E200F20102011201220132014";
        equals(toHex(origStr, true), hexStr, "upper case unicode hex string");
    });
    test("Sha1 String Function", function() {
        var origStr = "tobyjulivaca";
        var encStr = "w6/DhjXDu8O0w5HDqsO0wqPDqMOywpfCj2tFw7/CmGJgCA==";
        var sha1 = b64Enc(utf8Enc(toStrSha1(origStr)));
        equals(sha1, encStr, "non-unicode b64 sha1 string");
        
        origStr = "Ѕ І Ї Ј Љ Њ Ћ Ќ Ў Џ А Б В Г Д";
        encStr = "DCjDkSc7fMKlU1fDg3/DkMOZw6vCvFzCljYUwr4=";        
        sha1 = b64Enc(utf8Enc(toStrSha1(origStr)));
        equals(sha1, encStr, "unicode b64 sha1 string");
    });
    test("String MD5 Function", function() {
        var origStr = "tobyjulivaca";
        var encStr = "a8KIasOxShPDskxcVsKhwq7CqUwqw5g=";
        var sha1 = b64Enc(utf8Enc(toStrMD5(origStr)));
        equals(sha1, encStr, "non-unicode MD5 string (as b64)");
        
        origStr = "Ѕ І Ї Ј Љ Њ Ћ Ќ Ў Џ А Б В Г Д";
        encStr = "w4/CpSsFw6nChTfDo8Onw5DCrSzCk8KTwozCpQ==";        
        sha1 = b64Enc(utf8Enc(toStrMD5(origStr)));
        equals(sha1, encStr, "unicode MD5 string (as b64)");
    });
    test("Hex MD5 Function", function() {
        var origStr = "tobyjulivaca";
        var encStr = "a8KIasOxShPDskxcVsKhwq7CqUwqw5g=";
        var sha1 = b64Enc(utf8Enc(toStrMD5(origStr)));
        equals(sha1, encStr, "non-unicode MD5 string (as b64)");
        
        origStr = "Ѕ І Ї Ј Љ Њ Ћ Ќ Ў Џ А Б В Г Д";
        encStr = "w4/CpSsFw6nChTfDo8Onw5DCrSzCk8KTwozCpQ==";        
        sha1 = b64Enc(utf8Enc(toStrMD5(origStr)));
        equals(sha1, encStr, "unicode MD5 string (as b64)");
    });
    
});
