import java.io.File;
import java.util.Scanner;


class InOut extends FileMethods {

    
    private final static int BOX_WIDTH = 60;

    private static String
    	fontEncoding = "cp1251",
        dirExe = (new File("").getAbsolutePath()).replaceAll("\\\\","/") + "/",
        dirIO = dirExe + "io/";
    private static File
        fileKey = new File(dirIO + "Key.txt"),          // Key
        // Encryptor files
        fileEncIn = new File(dirIO + "EncIn.txt"),      // Open text
        fileEncOut = new File(dirIO + "EncOut.txt"),    // Encrypted message
        // Decryptor files
        fileDecIn = new File(dirIO + "DecIn.txt"),      // Encrypted message
        fileDecOut = new File(dirIO + "DecOut.txt");    // End text
    private static boolean
        flagConsoleOutput = true,
        flagFileInput = true,
        flagFileOutput = true;

    public static Cypher input() {
    	return flagFileInput ? inputFromFiles() : inputFromConsole();
    }

    private static Cypher inputFromConsole() {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a string:\n> ");
        String message = sc.nextLine();
        System.out.print("\nEnter the key:\n> ");
        String key = sc.nextLine();
        sc.close();
        return new Cypher(message,key,doWeEncrypt());
    }

    public static Cypher inputFromFiles() {
        File fileTxt = whatIsTheInputFile();
        String message = StringMethods.
        		stringArrayStretch(readAllLines(fileTxt));
        String key = StringMethods.
        		stringArrayStretch(readAllLines(fileKey));
        return new Cypher(message,key,doWeEncrypt());
    }

    public static void output(Cypher cypher) {
        if (doWeEncrypt())
            output(cypher.getCypher());
        else
            output(cypher.getOpenText());
    }
    
    public static void output(String... lines) {
        if (doWeEncrypt())
            lines = StringMethods.widthLimit(lines,BOX_WIDTH);
        if (flagConsoleOutput)
            outputToConsole(lines);
        if (flagFileOutput) {
            outputToFile(lines);
            reportOutputSuccessfull();
        }
    }

    private static void outputToConsole(String... lines) {
        System.out.println("The "+resultTextName()+":\n");
        for (String line: lines)
            System.out.println(line);
    }

    private static void outputToFile(String... lines) {
        File file = whatIsTheOutputFile();
        putLinesToFile(file,lines);
    }

    private static void reportOutputSuccessfull() {
        String fileName = whatIsTheOutputFile().getName();
        String s = flagConsoleOutput ?
        		"..." : "The "+resultTextName()+" ";
        System.out.println();
        System.out.println(s+"written to: "+fileName);
    }
    
    public static String whichEncodingDoWeUse() {
        return fontEncoding;
    }

	public static void setFontEncoding(String encoding) {
		fontEncoding = encoding;
	}
    
    private static String resultTextName() {
        return doWeEncrypt() ? "encrypted message" : "end text";
    }

    private static File whatIsTheInputFile() {
        return doWeEncrypt() ? fileEncIn : fileDecIn;
    }
    
    private static File whatIsTheOutputFile() {
        return doWeEncrypt() ? fileEncOut : fileDecOut;
    }
    
    private static boolean doWeEncrypt() {
        return EncoderConsole.doWeEncrypt();
    }
    
}
