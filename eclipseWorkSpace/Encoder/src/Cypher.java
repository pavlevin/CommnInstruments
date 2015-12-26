import java.io.UnsupportedEncodingException;

import org.apache.commons.lang3.StringUtils;

import javax.xml.bind.DatatypeConverter;


class Cypher {

	
	private String encoding = "cp1251";
	private final String BUILT_IN_KEY = "hjIT/TtM++7pMs0dUfVuh/7LsOhHVkZt";
	private final static int KEY_STRING_LENGTH = 32;
	private String
		openText = "",
		key = BUILT_IN_KEY,
		cypher = "";
	
	public Cypher(String openText, String key) {
		setKey(key);
		putOpenText(openText);
	}
	
	public Cypher(String text, String key, boolean doWeEncrypt) {
		setKey(key);
		if (doWeEncrypt)
			putOpenText(text);
		else
			putCypher(text);
	}
	
	public Cypher(String key) {
		setKey(key);
	}

	public Cypher() {
		setKey(BUILT_IN_KEY);
	}
	
	public void destroy() {
		setKey("");
		putOpenText("");
		putCypher("");
	}

	public void mergeKeys(String... keys) {
		for (String key : keys) {
			putOpenText(key);
			encryptSimpleGOST();
			setKey(cypher);
			putOpenText("");
			putCypher("");
		}
	}
	
	public void putOpenText(String text) {
		this.openText = text;
	}
	
	public void setKey(String key) {
		this.key = key.length() < KEY_STRING_LENGTH ?
				key : key.substring(0,KEY_STRING_LENGTH);
	}
	
	public void putCypher(String cypher) {
		this.cypher = cypher;
	}

	public void setFontEncoding(String encoding) {
		this.encoding = encoding;
	}
	
	public void encryptSimpleGOST() {
		assertLinesNotNullOrEmpty(openText,key);
		String text = spacesAppendToFillLastBlock(openText);
		byte[] code = CryptGOST.simple(text,key,true);
        cypher = DatatypeConverter.printBase64Binary(code);
	}
	
	public void decypherSimpleGOST() {
		assertLinesNotNullOrEmpty(cypher,key);
		byte[] code = DatatypeConverter.parseBase64Binary(cypher);
        byte[] endTextBytes = CryptGOST.simple(code,key.getBytes(),false);
        openText = parseBytesAsText(endTextBytes).trim();
	}

	private String spacesAppendToFillLastBlock(String s) {
		while (s.getBytes().length%8 != 0)
			s = s + " ";
		return s;
	}
	
	private String parseBytesAsText(byte[] bytes) {
    	String text = "";
        try {
            text = new String(bytes,encoding);
        } catch (UnsupportedEncodingException uee) {
            System.err.println("\nUnsupported encoding!");
            uee.printStackTrace();
        }
        return text;
    }
	
	private void assertLinesNotNullOrEmpty(String... lines) {
		for (String line: lines)
			assert(StringUtils.isNotBlank(line));
	}
	
	public String getOpenText() {
		return openText;
	}
	
	public String getKey() {
		return key;
	}
	
	public String getCypher() {
		return cypher;
	}
	
}
