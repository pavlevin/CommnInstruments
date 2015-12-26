import java.awt.*;
import javax.swing.*;



class StandaloneFrame extends Frame {

	String mainFrameName = "GOST 28147-89 Encryptor";
	int
		frameWidth = 700,
		frameHeight = 800,
		panelWidth = 700,
		panelHeight = 500,
		areaColumns = 80,
		areaRows = 18;
	JLabel
		labelInput = new JLabel("Input:"),
		labelOutput = new JLabel("Output:"),
		labelFontEncoding = new JLabel("Font encoding:");
	JTextArea
		fieldInput = new JTextArea("",areaRows,areaColumns),
		fieldOutput = new JTextArea("",areaRows,areaColumns);
	JButton
		buttonEncrypt = new JButton("Encrypt"),
		buttonDecrypt = new JButton("Decrypt"),
		buttonClear = new JButton("Clear"),
		buttonImportKey = new JButton("Key import...");
	final String
		CP1251 = " cp1251 (Windows Cyrillic) ",
		CP866 = " cp866 (MS-DOS Russian) ",
		UTF8 = " UTF-8 (8bit Unicode) ",
		UTF16 = " UTF-16 (16bit Unicode) ",
		KOI8R = " KOI-8R (UNIX Russian) ";
	String[] encodings = {CP1251,CP866,UTF8,UTF16};
	JComboBox<String>
		comboEncoding = new JComboBox<String>(encodings);
	
	public StandaloneFrame() {}
	
	public JButton[] getButtons() {
		JButton[] buttons = new JButton[4];
		buttons[0] = buttonEncrypt;
		buttons[1] = buttonDecrypt;
		buttons[2] = buttonClear;
		buttons[3] = buttonImportKey;
		return buttons;
	}
	
	public void setInputFieldText(String text) {
		setFieldText(fieldInput, text);
	}
	
	public String getInputFieldText() {
		return getTextFromField(fieldInput);
	}
	
	public void setOutputFieldText(String text) {
		setFieldText(fieldOutput, text);
	}
	
	public void appendOutputFieldText(String text) {
		appendFieldText(fieldOutput, text);
	}

	void show() {
		drawMainFrame(mainFrameName, frameWidth, frameHeight);
		
	    panel.setSize(panelWidth,panelHeight);

	    GridBagLayout layout = new GridBagLayout();
	    panel.setLayout(layout);        

	    gbc = new GridBagConstraints();
	    gbc.insets = insets;

		resetGridBagSettings();
	    addLabel(labelInput,0,0);
	    addFieldWithScroll(fieldInput,0,1,5);

		resetGridBagSettings();
	    addLabel(labelOutput,0,2);
		alignRight();
		addButton(buttonImportKey,4,2);
		alignLeft();
	    addFieldWithScroll(fieldOutput,0,3,5);

		resetGridBagSettings();
	    addButton(buttonEncrypt,0,4);
	    addButton(buttonDecrypt,1,4);
		alignRight();
		addButton(buttonClear,4,4);

		resetGridBagSettings();
		alignRight();
		// addLabel(labelFontEncoding,2,4);
		alignLeft();
		addComboBox(comboEncoding,3,4);

	    fieldInput.setEditable(true);
	    fieldOutput.setEditable(false);

	    panel.revalidate();
	    controlPanel.add(panel);
	    mainFrame.setVisible(true);  
	}

	String getSelectedEncoding() {
		switch ((String) comboEncoding.getSelectedItem()) {
			case CP1251:	return "cp1251";
			case CP866:		return "cp866";
			case UTF8:		return "UTF-8";
			case UTF16:		return "UTF-16";
			case KOI8R:		return "KOI-8R";
			default:		return "cp1251";
		}
	}
	

}
