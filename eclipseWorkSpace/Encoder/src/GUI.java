import java.io.File;

import javax.swing.JFileChooser;


public abstract class GUI {
	
	String
    	dirExe = (new File("").getAbsolutePath()).replaceAll("\\\\","/") + "/",
    	dirIO = dirExe + "io/";
	File
		innerKeyFile = new File(dirIO + "Key.txt");
	String
		importedKey = "",
		innerKey = "",
		actualKey = (new Cypher()).getKey();	// Using built-in key by default
	
	abstract void drawFrame();
	abstract String readInput();
	
	void openKeyImportDialog() {
    	JFileChooser fileopen = new JFileChooser();
    	int ret = fileopen.showDialog(null, "Open file");                
    	importOnApproval(fileopen, ret);
	}
	
	void importOnApproval(JFileChooser chooser, int ret) {
		if (ret == JFileChooser.APPROVE_OPTION) {
    	    File file = chooser.getSelectedFile();
    	    doKeyImport(file);
    	}
	}
	
	void doKeyImport(File file) {
		importKey(file);
		getKeyFromInnerFile();
		setActualKey(getResultKey(innerKey, importedKey));
	}
	
	void importKey(File keyFile) {
		importedKey = readFile(keyFile);
	}

	void getKeyFromInnerFile() {
		innerKey = readFile(innerKeyFile);
	}

	String readFile(File file) {
		return StringMethods.stringArrayStretch(
				FileMethods.readAllLines(file));
	}

	String getResultKey(String key1, String key2) {
		Cypher cypher = new Cypher();
		cypher.mergeKeys(key1, key2);
		return cypher.getKey();
	}
	
	void setActualKey(String key) {
		actualKey = key;
	}

}
