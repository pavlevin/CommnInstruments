/**
 * filename:        ClientTest.js
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2009-2011 Cisco Systems, Inc.  All Rights Reserved.
 */

jabberwerx.$(document).ready(function() {
    module("jabberwerx/model/client");
    
    test("Test Start Reconnect Countdown Default Period", function() {
        var countdownTime = null;
        var client = new jabberwerx.Client();
        client.event('reconnectCountdownStarted').bind(function(eventObj) {
            countdownTime = eventObj.data;
        });
        client._startReconnectCountdown();
        ok(countdownTime >= 27 && countdownTime <= 33, 
           "Countdown time should be between 27 and 33 inclusive by default and was " + 
           countdownTime);
        client.cancelReconnect();
    });
    
    // Originally had a test here to check that the timeout got to the end and correctly tried to
    // reconnect, but was having issues between QUnit start and stop methods and our reconnect timer
    // code so got rid of them
    
    test("Test Reconnect Cancelled Event Firing", function() {
        var reconnectCancelledEventFired = false;
        var client = new jabberwerx.Client();
        client.event("reconnectCancelled").bind(function() {
            reconnectCancelledEventFired = true;
        });
        client._startReconnectCountdown();
        client.cancelReconnect();
        ok(reconnectCancelledEventFired, "reconnectCancelled event should have been fired");
        same(client._reconnectTimerID, null, "timerID should be null");
    });
    
    test("Test Start Reconnect Countdown With Base Reconnect Period of Zero", function() {
        var client = new jabberwerx.Client();
        jabberwerx._config.baseReconnectCountdown = 0;
        client._startReconnectCountdown();
        same(client._reconnectTimerID, null, "timerID should be null");
    });
    
    test("Test processReceiveQueue with 5 Stanzas", function() {
        var iqReceivedCount = 0;
        var presenceReceivedCount = 0;
        var messageReceivedCount = 0;
        
        var incorrectOrderErrorOccurred = false;
        
        var client = new jabberwerx.Client();
        
        client.event("beforeiqReceived").bind(function(evt) {
            if(incorrectOrderErrorOccurred) {
                return;
            }
            
            if(evt.data.getFrom() == '1') {
                if((presenceReceivedCount != 0) || (messageReceivedCount != 0)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(iqReceivedCount != 0) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        iqReceivedCount++;
                    }
                }
            } else if(evt.data.getFrom() == '4') {
                if((presenceReceivedCount != 3) || (messageReceivedCount != 3)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(iqReceivedCount != 3) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        iqReceivedCount++;
                    }
                }
            } else {
                errorCount++;
            }
        });
        client.event("iqReceived").bind(function(evt) {
            if(incorrectOrderErrorOccurred) {
                return;
            }
            
            if(evt.data.getFrom() == '1') {
                if((presenceReceivedCount != 0) || (messageReceivedCount != 0)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(iqReceivedCount != 1) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        iqReceivedCount++;
                    }
                }
            } else if(evt.data.getFrom() == '4') {
                if((presenceReceivedCount != 3) || (messageReceivedCount != 3)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(iqReceivedCount != 4) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        iqReceivedCount++;
                    }
                }
            } else {
                incorrectOrderErrorOccurred = true;
            }
        });
        client.event("afteriqReceived").bind(function(evt) {
            if(incorrectOrderErrorOccurred) {
                return;
            }
            
            if(evt.data.getFrom() == '1') {
                if((presenceReceivedCount != 0) || (messageReceivedCount != 0)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(iqReceivedCount != 2) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        iqReceivedCount++;
                    }
                }
            } else if(evt.data.getFrom() == '4') {
                if((presenceReceivedCount != 3) || (messageReceivedCount != 3)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(iqReceivedCount != 5) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        iqReceivedCount++;
                    }
                }
            } else {
                incorrectOrderErrorOccurred = true;
            }
        });
        
        client.event("beforepresenceReceived").bind(function(evt) {
            if(incorrectOrderErrorOccurred) {
                return;
            }
            
            if(evt.data.getID() == '2') {
                if((iqReceivedCount != 3) || (messageReceivedCount != 0)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(presenceReceivedCount != 0) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        presenceReceivedCount++;
                    }
                }
            } else if(evt.data.getID() == '5') {
                if((iqReceivedCount != 6) || (messageReceivedCount != 3)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(presenceReceivedCount != 3) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        presenceReceivedCount++;
                    }
                }
            } else {
                incorrectOrderErrorOccurred = true;
            }
        });
        client.event("presenceReceived").bind(function(evt) {
            if(incorrectOrderErrorOccurred) {
                return;
            }
            
            if(evt.data.getID() == '2') {
                if((iqReceivedCount != 3) || (messageReceivedCount != 0)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(presenceReceivedCount != 1) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        presenceReceivedCount++;
                    }
                }
            } else if(evt.data.getID() == '5') {
                if((iqReceivedCount != 6) || (messageReceivedCount != 3)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(presenceReceivedCount != 4) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        presenceReceivedCount++;
                    }
                }
            } else {
                incorrectOrderErrorOccurred = true;
            }
        });
        client.event("afterpresenceReceived").bind(function(evt) {
            if(incorrectOrderErrorOccurred) {
                return;
            }
            
            if(evt.data.getID() == '2') {
                if((iqReceivedCount != 3) || (messageReceivedCount != 0)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(presenceReceivedCount != 2) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        presenceReceivedCount++;
                    }
                }
            } else if(evt.data.getID() == '5') {
                if((iqReceivedCount != 6) || (messageReceivedCount != 3)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(presenceReceivedCount != 5) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        presenceReceivedCount++;
                    }
                }
            } else {
                incorrectOrderErrorOccurred = true;
            }
        });
        
        client.event("beforemessageReceived").bind(function(evt) {
            if(incorrectOrderErrorOccurred) {
                return;
            }
            
            if(evt.data.getID() == '3') {
                if((iqReceivedCount != 3) || (presenceReceivedCount != 3)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(messageReceivedCount != 0) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        messageReceivedCount++;
                    }
                }
            } else {
                incorrectOrderErrorOccurred = true;
            }
        });
        client.event("messageReceived").bind(function(evt) {
            if(incorrectOrderErrorOccurred) {
                return;
            }
            
            if(evt.data.getID() == '3') {
                if((iqReceivedCount != 3) || (presenceReceivedCount != 3)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(messageReceivedCount != 1) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        messageReceivedCount++;
                    }
                }
            } else {
                incorrectOrderErrorOccurred = true;
            }
        });
        client.event("aftermessageReceived").bind(function(evt) {
            if(incorrectOrderErrorOccurred) {
                return;
            }
            
            if(evt.data.getID() == '3') {
                if((iqReceivedCount != 3) || (presenceReceivedCount != 3)) {
                    incorrectOrderErrorOccurred = true;
                } else {
                    if(messageReceivedCount != 2) {
                        incorrectOrderErrorOccurred = true;
                    } else {
                        messageReceivedCount++;
                    }
                }
            } else {
                incorrectOrderErrorOccurred = true;
            }
        });
        
        var iq1 = new jabberwerx.IQ();
        iq1.setType("result");
        iq1.setFrom("1");
        client._stanzaRecvQ.push(iq1.getNode());
            
        var presence2 = new jabberwerx.Presence();
        presence2.setID("2");
        presence2.setFrom("example.com");
        client._stanzaRecvQ.push(presence2.getNode());
            
        var message3 = new jabberwerx.Message();
        message3.setID("3");
        client._stanzaRecvQ.push(message3.getNode());
            
        var iq4 = new jabberwerx.IQ();
        iq4.setType("result");
        iq4.setFrom("4");
        client._stanzaRecvQ.push(iq4.getNode());
            
        var presence5 = new jabberwerx.Presence();
        presence5.setID("5");
        presence5.setFrom("example.com");
        client._stanzaRecvQ.push(presence5.getNode());
        
        client._processReceiveQueue();
        
        var testSuccess = true;
        
        if(incorrectOrderErrorOccurred) {
            testSuccess = false;
        }
        
        ok(testSuccess, "No stanzas are out of order");
    });
});
