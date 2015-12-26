import java.io.Serializable;
import java.util.Date; 


public class Message 
implements Commands, MessageStates, Serializable {
	
	private static final long serialVersionUID = 8558129429394237455L;
	
	private int senderID = 0;
	private int recipientID = 0;
	private int messageID = 0;
	private String text = "";
	private int length = text.length();
	private Command command = Command.EMPTY;
	public MessageState state = MessageState.VOID;
	private Date date = null;
	
	public Message() {}
	
	public Message(int senderID, int recipientID, String text) {
		set(senderID, recipientID, text, Command.EMPTY);
	}
	
	public Message(int senderID, int recipientID, String text, Command command) {
		set(senderID, recipientID, text, command);
	}
	
	public void switchState() {
		int stateNum = this.getState().ordinal();
		if (MessageState.values().length > stateNum + 1)
			stateNum++;
		MessageState newState = MessageState.values()[stateNum];
		this.setState(newState);
	}
	
	public void setState(MessageState newState) {
		state = newState;
	}
	
	public synchronized void encryptWith(String key) {
		if (!text.isEmpty())
			this.text = encryptParameter(text, key);
	}
	
	public synchronized void decryptWith(String key) {
		if (!text.isEmpty())
			this.text = decryptParameter(text, key);
	}
	
	private String encryptParameter(String parameter, String key) {
		Cypher cypher = new Cypher(parameter, key);
		cypher.encryptSimpleGOST();
		return cypher.getCypher();
	}
	
	private String decryptParameter(String parameter, String key) {
		Cypher cypher = new Cypher(key);
		cypher.putCypher(parameter);
		cypher.decypherSimpleGOST();
		return cypher.getOpenText();
	}
	
	public synchronized int getSenderID() 		{	return senderID; }
	public synchronized int getRecipientID() 	{	return recipientID; }
	public synchronized int getMessageID() 		{	return messageID; }
	public synchronized String getText() 		{	return text; }
	public synchronized int length()			{	return length;	}
	public synchronized Command getCommand()	{	return command; }
	public synchronized MessageState getState() {	return state;	}
	public synchronized Date getDate()			{	return date; }
	
	private void set(int senderID, int recipientID, String text, Command command) {
		this.senderID = senderID;
		this.recipientID = recipientID;
		this.text = text;
		this.length = text.length();
		this.command = command;

		date = new Date(System.currentTimeMillis());
		messageID = date.hashCode();
	}

}
