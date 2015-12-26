import java.net.Socket;



public class ClientHuman extends Client {
	
	ChatGUI gui;
	int companionID = 0;
	ClientHuman thisClient;
	
	public ClientHuman(int port) {
		this.port = port;
		this.thisClient = this;
	}
	
	public void start() {
		t = new Thread(humanRunner);
		t.start();
	}
	
	public void interrupt() {
		t.interrupt();
	}
	
	Runnable humanRunner = new Runnable() {
		public void run() {
			try {
				clientSocket = new Socket("127.0.0.1", port);
				initiateStreams(clientSocket);
				if (clientSocket.isConnected()) {
					findOutMyID();
					findOutCompanionID();
					gui = new ChatGUI(thisClient, companionID);
					gui.drawFrame();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	};
	
	void findOutCompanionID() {
		companionID = (myID == 1) ? 2 : 1;		// TODO
	}
	

}
