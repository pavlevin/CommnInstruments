import java.awt.*;
import java.awt.event.*;

import javax.swing.*;

public abstract class Frame {

	JFrame mainFrame;
	JPanel controlPanel;
	GridBagConstraints gbc;
	Insets insets = new Insets(5,5,5,5);
	JPanel panel = new JPanel();
	int
		frameWidth = 700,
		frameHeight = 800,
		panelWidth = 700,
		panelHeight = 500,
		areaColumns = 80,
		areaRows = 18;
	
	abstract void show();
	
	void drawMainFrame() {
		drawMainFrame("Main frame", frameWidth, frameHeight);
	}
	
	void drawMainFrame(String frameName, int width, int height) {
		mainFrame = new JFrame(frameName);
	    mainFrame.setSize(width,height);
	    mainFrame.setResizable(false);
	    mainFrame.setLayout(new GridLayout(1, 1));

	    mainFrame.addWindowListener(new WindowAdapter() {
	       public void windowClosing(WindowEvent windowEvent){
	          System.exit(0);
	       }        
	    });    

	    controlPanel = new JPanel();
	    controlPanel.setLayout(new FlowLayout());
	    mainFrame.add(controlPanel);
	    mainFrame.setVisible(true);  
	}
	
	void setFieldText(JTextArea field, String text) {
		field.setText(text);
	}
	
	void appendFieldText(JTextArea field, String text) {
		field.append(text);
	}
	
	String getTextFromField(JTextArea field) {
		return field.getText();
	}
	
	void clearField(JTextArea field) {
		field.setText("");
	}
	
	void addLabel(JLabel label,int x, int y) {
	    gbc.gridx = x;
	    gbc.gridy = y;
	    panel.add(label,gbc);
	}

	void addFieldWithScroll(JTextArea field,
			int x, int y, int width) {
		addField(field,x,y,width);
		addScrollToField(field);
	}
	
	void addField(JTextArea field,
			int x, int y, int width) {
	    gbc.gridx = x;
	    gbc.gridy = y;
	    gbc.gridwidth = width;
		field.setLineWrap(true);
		field.setWrapStyleWord(true);
	    field.setFont(new Font("monospaced",Font.PLAIN,12));
	    panel.add(field,gbc); 
	}

	void addScrollToField(JTextArea field) {
	    JScrollPane scroll = new JScrollPane (field, 
				JScrollPane.VERTICAL_SCROLLBAR_ALWAYS,
				JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
		panel.add(scroll,gbc);
	}
	
	void addButton(JButton button, int x, int y) {
	    gbc.gridx = x;
	    gbc.gridy = y;
	    panel.add(button,gbc);
	}

	void addComboBox(JComboBox<String> comboBox, int x, int y) {
	    gbc.gridx = x;
	    gbc.gridy = y;
	    panel.add(comboBox,gbc);
	}

	void resetGridBagSettings() {
		gbc.ipady = 0;
		gbc.ipadx = 0;
	    gbc.gridwidth = 1;
		alignLeft();
	}

	void alignRight() {
		gbc.anchor = GridBagConstraints.LINE_END;
	}

	void alignLeft() {
		gbc.anchor = GridBagConstraints.LINE_START;
	}
	
}
