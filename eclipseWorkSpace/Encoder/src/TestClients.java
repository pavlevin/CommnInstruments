

public class TestClients {
	
	private static final int CLIENTS_NUM = 5;
	private static final int DEFAULT_PORT = 4444;
	private int port = DEFAULT_PORT;
	private Client[] clients;
	private Thread t = new Thread();
	
	public static void main() {
		ClientBot[] clients = new ClientBot[CLIENTS_NUM];
		startClients(clients);
	}
	
	public TestClients(int port, int clientsNum) {
		this.port = port;
		this.clients = new ClientHuman[clientsNum];
	}
	
	public void start() {
		t = new Thread(testRunner);
		t.start();
	}
	
	public void interrupt() {
		interruptClients();
		t.interrupt();
	}
	
	Runnable testRunner = new Runnable() {
		public void run() {
			startClients(port, clients);
		}
	};
	
	private static void startClients(Client... clients) {
		startClients(DEFAULT_PORT, clients);
	}
	
	private static void startClients(int port, Client... clients) {
		for (Client c : clients) {
			try {
				c = new ClientHuman(port);
				c.start();
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
	
	private void interruptClients() {
		for (Client c : clients)
			if (c != null && !c.equals(null))
				c.interrupt();
	}

}
