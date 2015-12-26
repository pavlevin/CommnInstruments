import java.awt.event.*;

import javax.swing.*;

import org.apache.commons.lang3.StringUtils;



class StandaloneGUI extends GUI {
	
	final int BOX_WIDTH = 60;
	StandaloneFrame frame = new StandaloneFrame();
	
	String defaultInput = // "";
		// InOut.inputFromFiles().getOpenText();
		"Je baise votre cheval, monsieur.\n" + "I fuck your horse, sir.\n" +
	    	"Ich ficke dein Pferd, Herr.\n" + "Cojo tu coballo, senor.\n" +
	    	"Я ебу Вашего коня, мсье.";
	
	public void drawFrame() {
		frame.drawMainFrame();
		listenToTheButtons(frame.getButtons());
	    frame.show(); 
		frame.setInputFieldText(defaultInput);
	}
	
	public StandaloneGUI() {
	}

	void listenToTheButtons(JButton... buttons) {
		for (JButton button : buttons)
			button.addActionListener(new ButtonListenerStandaloneGUI(button));
	}

	class ButtonListenerStandaloneGUI extends ButtonListener {
		String function = "";
		
		public ButtonListenerStandaloneGUI(JButton button) {
			this.function = button.getText();
		}
		
		public void actionPerformed(ActionEvent event) {
			switch (function) {
				case "Encrypt":
					doEncrypt(readInput());
					break;
				case "Decrypt":
					doDecrypt(readInput());
					break;
				case "Clear":
					clearOutputField();
					break;
				case "Key import...":
					openKeyImportDialog();
					break;
				default:
					break;
			}
		}
	
	}

	void doEncrypt(String text) {
		if (StringUtils.isNotBlank(text)) {
			Cypher cypher = new Cypher(text, actualKey);
			cypher.setFontEncoding(frame.getSelectedEncoding());
			cypher.encryptSimpleGOST();
			write(StringMethods.
				widthLimit(cypher.getCypher(),BOX_WIDTH));
		}
		else
			clearOutputField();
	}
	
	void doDecrypt(String text) {
		if (StringUtils.isNotBlank(text)) {
			Cypher cypher = new Cypher(actualKey);
			cypher.putCypher(text);
			cypher.setFontEncoding(frame.getSelectedEncoding());
			cypher.decypherSimpleGOST();
			write(cypher.getOpenText());
		}
		else
			clearOutputField();
	}

	String readInput() {
		return frame.getInputFieldText().trim();
	}

	void clearOutputField() {
		write("");
	}
	
	void write(String s) {
		String[] lines = new String[1];
		lines[0] = s;
		write(lines);
	}
	
	void write(String[] lines) {
		frame.setOutputFieldText("");
		for (String line : lines)
			frame.appendOutputFieldText(line + "\n");
	}
	
}
