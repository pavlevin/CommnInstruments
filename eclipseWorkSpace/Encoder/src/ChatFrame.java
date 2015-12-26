import java.awt.*;

import javax.swing.*;


public class ChatFrame extends Frame {

	String mainFrameName = "GostCrypt Chat";
	int
		frameWidth = 700,
		frameHeight = 520,
		inputAreaRows = 4,
		inputAreaColumns = areaColumns,
		chatAreaRows = 20,
		chatAreaColumns = areaColumns;
	JTextArea
		fieldInput = new JTextArea("",inputAreaRows,inputAreaColumns),
		fieldChat = new JTextArea("",chatAreaRows,chatAreaColumns);
	JButton
		buttonSend = new JButton("Send"),
		buttonImportKey = new JButton("ImportKey...");
	String logText = "";
	
	
	public ChatFrame() {}
	
	void show() {
		drawMainFrame(mainFrameName, frameWidth, frameHeight);
		
	    panel.setSize(panelWidth,panelHeight);

	    GridBagLayout layout = new GridBagLayout();
	    panel.setLayout(layout);        

	    gbc = new GridBagConstraints();
	    gbc.insets = insets;

		resetGridBagSettings();
		addFieldWithScroll(fieldChat,0,1,5);
		
		resetGridBagSettings();
	    addFieldWithScroll(fieldInput,0,3,5);

		resetGridBagSettings();
		addButton(buttonImportKey,1,4);
		alignRight();
		addButton(buttonSend,4,4);
		alignLeft();

	    fieldInput.setEditable(true);
	    fieldChat.setEditable(false);

	    panel.revalidate();
	    controlPanel.add(panel);
	    mainFrame.setVisible(true);  
	}
	
	public void setLog(String... logLines) {
		fieldChat.setText(StringMethods.stringArrayStretch(logLines));
	}
	
	public void addLog(String... newLines) {
		String lineToAppend = StringMethods.stringArrayStretch(newLines);
		logText += "\n" + lineToAppend;
		setLog(logText);
	}
	
	public JButton getSendButton() {
		return buttonSend;
	}
	
	public JButton getImportKeyButton() {
		return buttonImportKey;
	}
	
	public JTextArea getFieldInput() {
		return fieldInput;
	}
	
	public JTextArea getFieldChat() {
		return fieldChat;
	}
	
	public String getTextFromInputField() {
		return fieldInput.getText();
	}
	
	public void clearInput() {
		clearField(fieldInput);
	}
	
}
