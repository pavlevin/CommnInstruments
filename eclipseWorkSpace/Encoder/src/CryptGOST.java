
	/* Realisation of the simmetric encryption/decryption algorithm of
	 * the GOST 28147-89 cryptographic standard.
	   */

class CryptGOST extends BytesAndInts {


    private final static int KEY_LENGTH_BYTES = 32;	// bytes
    private static boolean doWeEncrypt;

    public static byte[] simple(Cypher cypher, boolean flagEncDec) {
		String s = flagEncDec ?
				cypher.getOpenText() : cypher.getCypher();
		return simple(s,cypher.getKey());
    }
    
    public static byte[] simple(String txt, String key) {
    	return simple(txt.getBytes(),key.getBytes());
    }
    
    public static byte[] simple(byte[] txt, byte[] key) {
    	return simple(txt,key,EncoderConsole.doWeEncrypt());
    }
    
    public static byte[] simple(String txt, String key, boolean flagEncDec) {
    	return simple(txt.getBytes(),key.getBytes(),flagEncDec);
    }
    
    public static byte[] simple(byte[] txt, byte[] key, boolean flagEncDec) {
    	doWeEncrypt = flagEncDec;
		Block64[] txtBlocks = Block64.getBlocksFromBytes(txt);
		int[] keyInts = getKeyIntsFixedLength(key);

        // System.out.println("Text length: " + txt.length +
        //         " bytes (" + txtBlocks.length + " blocks).\n");

		Block64[] resultBlocks = substitutionRounds(txtBlocks,keyInts);
		byte[] resultBytes = Block64.getBytes(resultBlocks);
        return byteArrayLengthFit(resultBytes,txt.length);
    }

    //  TODO Read wiki and modify
    public static byte[] gammaMode(byte[] txt, byte[] key,
						byte[] syncMsg, boolean flagEncDec) {
    	// Sync message to 64 bit length
    	byte[] syn = byteArrayLengthFit(syncMsg,8);
    	// Getting gamma out of sync message and the key
    	byte[] gam = simple(syn,key,false);
    	byte[] out = new byte[txt.length];
    	for (int i = 0; i < txt.length; i++)
    		out[i] = (byte) (txt[i] ^ gam[i%gam.length]);
    	return out;
    }
    
    private static Block64[] substitutionRounds(Block64[] txt, int[] key) {
    	final int roundsNum = 32;
    	Block64[] out = new Block64[txt.length];
    	for (int m = 0; m < txt.length; m++) {
    		int lowerHalf = txt[m].getLowerHalf();
    		int upperHalf = txt[m].getUpperHalf();

    		for (int i = 0; i < roundsNum; i++) {
				// SM2 32 bit adder, base 2
    			int processedHalf = upperHalf ^ feistelF(lowerHalf,
            						key[subkeyIndex(i)]);
    			if (i != roundsNum - 1) {
    				// Switch
    				upperHalf = lowerHalf;
    				lowerHalf = processedHalf;
    			}
    			else
    				upperHalf = processedHalf;
    		}
		out[m] = new Block64(upperHalf,lowerHalf);
    	}
    return out;
	}

	private static int[] getKeyIntsFixedLength(byte[] key) {
		byte[] keyFixed = byteArrayLengthFitCyclic(key,KEY_LENGTH_BYTES);
		if (keyFixed.length != key.length)
			warningKeySizeChanged(keyFixed);
        return bytesToInts(keyFixed,8);
	}
	
	private static void warningKeySizeChanged(byte[] newKey) {
        System.out.println("\nWarning!\nLength of the key " +
            "has been corrected during process.");
        /* */
        System.out.println("The new "+newKey.length*8+" bit key: "+
            (new String(newKey)) + "\n");
        /*    */
	}

    private static int subkeyIndex(int roundIndex) {
    	if (doWeEncrypt)		// Encryption key blocks consequence
    		return (roundIndex<24) ? (roundIndex%8) : (7-(roundIndex%8));
    	else                	// Decryption key blocks consequence
    		return (roundIndex<8)  ? (roundIndex%8) : (7-(roundIndex%8));
    }
    
    private static int feistelF(int txt, int subkey) {
        txt = (int) (         // SM1 32 bit adder, base 2e32
                (((long) txt) + ((long) subkey)) %
                    ((long) Math.pow(2,32))
                );
        txt = sBlock(txt);
        txt = Integer.rotateLeft(txt,11);       // Shift register
        return txt;
    }
    
    private static int sBlock(int in) {
        String sIn = intToBinaryString(in,32);
        String sub = new String();
        StringBuilder sOut = new StringBuilder();

        for (int i = 0; i < 8; i++) {
            sub = sIn.substring(4*i,4*(i+1));
            int knot = Integer.parseInt(sub,2);
            sub = intToBinaryString(sTab[i][knot], 4);
            sOut.append(sub);
        }
		// Parsing as Long to avoid exception caused by length
        return (int) Long.parseLong(sOut.toString(),2);
    }
    
    // Substitutions table
    private final static int[][] sTab = {
            // ID: id-Gost28147-89-CryptoPro-A-ParamSet
        { 9, 6, 3, 2, 8,11, 1, 7,10, 4,14,15,12, 0,13, 5},
        { 3, 7,14, 9, 8,10,15, 0, 5, 2, 6,12,11, 4,13, 1},
        {14, 4, 6, 2,11, 3,13, 8,12,15, 5,10, 0, 7, 1, 9},
        {14, 7,10,12,13, 1, 3, 9, 0, 2,11, 4,15, 8, 5, 6},
        {11, 5, 1, 9, 8,13,15, 0,14, 4, 2, 3,12, 7,10, 6},
        { 3,10,13,12, 1, 2, 0,11, 7, 5, 9, 4, 8,15,14, 6},
        { 1,13, 2, 9, 7,10, 6, 0, 8,12, 4, 5,15, 3,11,14},
        {11,10,15, 5, 0,12,14, 8, 6, 2, 3, 9, 1, 7,13, 4}
    };

}
