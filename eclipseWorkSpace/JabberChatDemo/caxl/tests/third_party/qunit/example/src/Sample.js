/**
 * filename:        Sample.js
 *
 * Portions created or assigned to Cisco Systems, Inc. are
 * Copyright (c) 2009-2011 Cisco Systems, Inc.  All Rights Reserved.
 */

var globalVar = 9;

/*
 * This is a simple sample object which is used in the contrived example unit tests.
 * It expects two parameter unpon initalisation, an integer and a string.
 */
function SampleObject(intVal, stringVal) {
	this.intVal = intVal;
	this.stringVal = stringVal;
}