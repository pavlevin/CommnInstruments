

public class ServerContactProcessor {
	
	ServerDirector director;
	ServerContactProcessor cProcessor = this;
	
	public ServerContactProcessor(ServerDirector sd) {
		director = sd;
	}
	
	
	public void manage(Contact newContact) {
		if (newContact != null && !newContact.equals(null)) {
			System.out.printf("New client accepted. Login: %s\n",
					newContact.getLogin());
			director.notifyContactGotID(newContact.getID());
			bindRecieverTo(newContact);
			newContact.startSession();
		}
	}
	
	public void bindRecieverTo(Contact contact) {
		ContactMessagesReciever reciever = new ContactMessagesReciever(director, contact);
		contact.setReciever(reciever);
	}
	
	public void clientQuits(Contact contact) {
		System.out.printf("Client %s quits. Closing session.\n",
				contact.getLogin());
		contact.setStatusOffline();
		director.closeSocketAndForget(contact);
	}
	
	
}
