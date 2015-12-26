import java.util.Iterator;


public class ContactMessagesReciever extends Thread {
	
	ServerDirector director;
	Contact contact;
	Iterator<Integer> contactsIterator;
	
	public boolean isRunning = false;
	
	public ContactMessagesReciever(ServerDirector sd, Contact contact) {
		director = sd;
		this.contact = contact;
		refreshContactInfo();
	}

	Runnable recieverRunner = new Runnable() {
		public void run() {
			isRunning = true;
			while (isRunning) {
				refreshContactInfo();
				director.askToGetMessageFrom(contact);
				pause(1000);
			}
		}
	};
	
	private Thread recieverThread = new Thread(recieverRunner);
	
	private void refreshContactInfo() {
		contact = director.getContact(contact.getID());
	}
	
	private void pause(int millis) {
		try {
			Thread.sleep(millis);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void start() {
		isRunning = true;
		recieverThread.start();
	}
	
	public void interrupt() {
		isRunning = false;
		recieverThread.interrupt();
	}
	
}
