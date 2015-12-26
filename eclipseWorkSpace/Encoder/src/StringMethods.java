
class StringMethods {


    public static String stringArrayStretch(String[] array) {
        StringBuilder builder = new StringBuilder();
        for (String s: array)
            builder.append(s);
        return builder.toString();
    }
    
    public static String[] widthLimit(String[] lines, int boxWidth) {
    	String string = stringArrayStretch(lines);
    	return widthLimit(string,boxWidth);
    }
    
    public static String[] widthLimit(String string, int boxWidth) {
        checkLengthPositivity(boxWidth);

        int fullLength = string.length();
        int n = fullLength/boxWidth + 1;
        String[] box = new String[n];
        for (int i = 0; i < n; i++) {
            int lineStartPos = i*boxWidth;
            int lineEndPos = (i+1)*boxWidth;
            if (lineEndPos > fullLength)
            	lineEndPos = fullLength;
            	box[i] = string.substring(lineStartPos,lineEndPos);
            }
        return box;
    }

    private static void checkLengthPositivity(int length) {
    	if (length < 1) {
    		throw new IllegalArgumentException(
    		"\nNegative length requested: "+String.valueOf(length));
    	}
    }
}
