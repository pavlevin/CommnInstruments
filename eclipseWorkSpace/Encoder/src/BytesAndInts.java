
class BytesAndInts {

	
	public static int[] bytesToInts(byte[] byteArray) {			
		int intArrayLength = lengthOfShorterArray(byteArray,4);
		return bytesToInts(byteArray,intArrayLength);
	}

    public static int[] bytesToInts(byte[] byteArray, int intsLength) {
		int bytesLength = byteArray.length;
		checkLengthPositivity(intsLength);
		checkLengthNotLessThan(4*intsLength,bytesLength);

        String s = new String();
        int[] intArray = new int[intsLength];
		int bytesNewLength = makeLengthMultipleTo(bytesLength,4);
		byte[] byteArrayResized = byteArrayLengthFit(byteArray,bytesNewLength);

        for (int i = 0; i < bytesNewLength; i++) {
            s += intToBinaryString((int) byteArrayResized[i],8);
            if (i%4 == 3) {
                intArray[i/4] = (int) Long.parseLong(s,2);
                s = "";
            }
        }
        return intArray;
    }
    
    public static byte[] intsToBytes(int[] intArray) {
        int n = intArray.length;
        String s = new String();
        byte[] byteArray = new byte[4*n];
        for (int i = 0; i < n; i++) {
            s = intToBinaryString(intArray[i],32);
            for (int j = 0; j < 4; j++) {
                byteArray[4*i+j] = (byte) Integer.parseInt(
                        s.substring(8*j,8*(j+1)), 2);
            }
        }
        return byteArray;
    }
    
    public static String intToBinaryString(int n, int stringLength) {
		checkLengthPositivity(stringLength);
        String s = Integer.toBinaryString(n);
        // Fit string length
            // Leading zeros addition
        while (s.length() < stringLength)
            s = "0" + s;
            // Leaving required length by cutting upper bits
        s = s.substring(s.length() - stringLength,s.length());
        return s;
    }
        
	protected static byte[] byteArrayLengthFit(byte[] byteArray, int fitTo) {
		checkLengthPositivity(fitTo);
        byte[] out = new byte[fitTo];
        for (int i = 0; i < fitTo; i++)
            out[i] = (i < byteArray.length) ? byteArray[i] : 0;
        return out;
    }

	protected static byte[] byteArrayLengthFitCyclic(byte[] byteArray, int fitTo) {
		checkLengthPositivity(fitTo);
        byte[] out = new byte[fitTo];
        for (int i = 0; i < fitTo; i++)
            out[i] = byteArray[i%byteArray.length];
        return out;
    }

    protected static int lengthOfShorterArray(int[] array, int xTimesSmaller) {
    	return lengthOfShorterArray(array.length,xTimesSmaller);
    }
    
    protected static int lengthOfShorterArray(byte[] array, int xTimesSmaller) {
    	return lengthOfShorterArray(array.length,xTimesSmaller);
    }
    
    protected static int lengthOfShorterArray(int length, int xTimesSmaller) {
		checkLengthPositivity(length);
		checkPositivity(xTimesSmaller);
		return length/xTimesSmaller + ( (length%xTimesSmaller == 0) ? 0:1 );
	}

	protected static int makeLengthMultipleTo(int length, int multipleTo) {
		checkLengthPositivity(length);
		checkPositivity(multipleTo);
		int extension = multipleTo - (length % multipleTo);
		extension *= (length%multipleTo == 0) ? 0:1;
		return length + extension;
	}

    private static void checkPositivity(int n)
	throws IllegalArgumentException {
        if (n < 1)
            throw new IllegalArgumentException(
                    "\nThe argument must be positive.");
	}
    
	private static void checkLengthPositivity(int length)
	throws IllegalArgumentException {
        if (length < 1)
            throw new IllegalArgumentException(
                    "\nNon-positive length requested.");
	}
    
	private static void checkLengthNotLessThan(int length, int notLessThan)
	throws IllegalArgumentException {
        if (length < notLessThan) {
            throw new IllegalArgumentException(
                "\nInvalid requested length value: " + length + ".\n" +
				"It must be not less than " + notLessThan + ".");
        }
	}

}
