import java.awt.event.ActionEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

import javax.swing.JButton;
import javax.swing.JTextArea;


public class ChatGUI extends GUI {
	
	static final int SPACEBAR_CODE = 10;
	
	ChatFrame frame = new ChatFrame();
	JButton
		buttonSend = frame.getSendButton(),
		buttonImportKey = frame.getImportKeyButton();
	JTextArea
		fieldInput = frame.getFieldInput(),
		fieldChat = frame.getFieldChat();
	
	ClientHuman me, companion;
	int myID, hisID;
	
	Runnable reciever = new Runnable() {
		public void run() {
			while (true) {
				try {
					Thread.sleep(1000);
					recieve();
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
		}
	};
	Thread recieverThread = new Thread(reciever);
	
	public ChatGUI(ClientHuman me, int companionID) {
		this.me = me;
		myID = me.getID();
		hisID = companionID;
	}
	
	public void drawFrame() {
		frame.show();
		initiateButtonListeners();
		initiateInputFieldListener();
		startReciever();
	}
	
	void startReciever() {
		recieverThread.start();
	}
	
	void initiateButtonListeners() {
		buttonSend.addActionListener(new ButtonSendListener());
		buttonImportKey.addActionListener(new ButtonImportKeyListener());
	}
	
	void initiateInputFieldListener() {
		fieldInput.addKeyListener(new KeyAdapter() {
			public void keyPressed(KeyEvent e) {
				if (e.getKeyCode() == SPACEBAR_CODE)
					send();
			}
			public void keyTyped(KeyEvent e) {}
			public void keyReleased(KeyEvent e) {}
		});
	}
	
	void send() {
		String text = readInput().trim();
		clearInputField();
		if (!text.isEmpty()) {
			Message message = new Message(myID, hisID, text);
			printLogFor(message);
			message.encryptWith(actualKey);
			me.send(message);
		}
	}
	
	void recieve() {
		Message newMessage = me.getMessage();
		newMessage.decryptWith(actualKey);
		printLogFor(newMessage);
	}
	
	String readInput() {
		return frame.getTextFromInputField();
	}
	
	void clearInputField() {
		frame.clearInput();
	}
	
	void printLogFor(Message message) {
		if (message != null && !message.equals(null))
			frame.addLog(generateLogFor(message));
	}
	
	private String[] generateLogFor(Message message) {
		String[] log = new String[2];
		log[0] = "Contact" + message.getSenderID();
		log[0] += " (" + message.getDate().toString() + "):\n";
		log[1] = message.getText() + "\n";
		return log;
	}

	class ButtonSendListener extends ButtonListener {
		
		public ButtonSendListener() {}
		
		public void actionPerformed(ActionEvent event) {
			send();
		}
	
	}
	
	class ButtonImportKeyListener extends ButtonListener {
		
		public ButtonImportKeyListener() {}
		
		public void actionPerformed(ActionEvent event) {
			openKeyImportDialog();
		}
	}

}
