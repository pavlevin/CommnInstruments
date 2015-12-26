
class Block64 extends BytesAndInts {

	
	public final static int
		LENGTH_BITS = 64,
		LENGTH_BYTES = 8,
		LENGTH_INTS = 2;

	private int upperHalf, lowerHalf;
	
	public Block64(int upperHalf, int lowerHalf) {
		setWhole(upperHalf,lowerHalf);
	}

	public Block64() {
		setWhole(0,0);
	}

	public static Block64[] getBlocksFromSting(String s) {
		return getBlocksFromBytes(s.getBytes());
	}

	public static Block64[] getBlocksFromBytes(byte[] byteArray) {
        return getBlocksFromInts(bytesToInts(byteArray));
	}

	public static Block64[] getBlocksFromInts(int[] intArray) {
		int blockArrayLength = lengthOfShorterArray(intArray,2);
		Block64[] blockArray = new Block64[blockArrayLength];

		for (int i = 0; i < blockArrayLength; i++) {
			int upperHalf = intArray[2*i];
			int lowerHalf = (2*i+1 < intArray.length) ?
					intArray[2*i+1] : 0; 
			blockArray[i] = new Block64(upperHalf,lowerHalf);
		}
		return blockArray;
	}

	public static int[] getInts(Block64[] blockArray) {
		int[] intArray = new int[blockArray.length*2];
		for (int i = 0; i < blockArray.length; i++) {
			intArray[2*i] = blockArray[i].getUpperHalf();
			intArray[2*i+1] = blockArray[i].getLowerHalf();
		}
		return intArray;
	}

	public static byte[] getBytes(Block64[] blockArray) {
		return intsToBytes(getInts(blockArray));
	}

	public int getUpperHalf() {
		return upperHalf;
	}

	public int getLowerHalf() {
		return lowerHalf;
	}

	public int[] getWholeAsInts() {
		int[] whole = {upperHalf,lowerHalf};
		return whole;
	}

	public void setWhole(int upperHalf, int lowerHalf) {
		this.upperHalf = upperHalf;
		this.lowerHalf = lowerHalf;
	}

	public void setUpperHalf(int upperHalf) {
		this.upperHalf = upperHalf;
	}

	public void setLowerHalf(int lowerHalf) {
		this.lowerHalf = lowerHalf;
	}

}
