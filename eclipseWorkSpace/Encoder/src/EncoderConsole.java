import java.util.Scanner;

class EncoderConsole extends InOut {

    
    private static boolean
        flagDecryptionTest,
        flagEncryptionMode = true;

    private static Scanner
        mainScanner = new Scanner(System.in);


    public static void start() {
        ChoiceOfTwo encOrDec = new ChoiceOfTwo(
                "Encryption or decryption mode?",'e','d');
        if (encOrDec.makeChoice())
            runInEncryptionMode();
        else
            runInDecryptionMode();
    }
    
    private static void runInDecryptionMode() {
        setEncryptionMode(false);
        
        Cypher cypher = input();
        cypher.decypherSimpleGOST();
        output(cypher);
    }
    
    private static void runInEncryptionMode() {
        setEncryptionMode(true);
        
        Cypher cypher = input();
        cypher.encryptSimpleGOST();
        output(cypher);

        askUserForDecryptionTest();
        if (doWeRunDecryptionTest())
            runDecryptionTest(cypher);
    }
    
    private static void askUserForDecryptionTest() {
        ChoiceOfTwo makeDecTestOrNot = new ChoiceOfTwo(
                "Do we make decryption test?",'y','n');
        flagDecryptionTest = makeDecTestOrNot.makeChoice();
    }
    
    private static void runDecryptionTest(Cypher cypher) {
        System.out.println("Decryption test started.");
        cypher.decypherSimpleGOST();
        System.out.println("Test result:\n" + cypher.getOpenText());
    }
    
    private static void setEncryptionMode(boolean b) {
        flagEncryptionMode = b;
    }
    
    private static boolean doWeRunDecryptionTest() {
        return flagDecryptionTest;
    }
    
    public static boolean doWeEncrypt() {
        return flagEncryptionMode;
    }
    
    public static Scanner getMainScanner() {
        return mainScanner;
    }
    
}
