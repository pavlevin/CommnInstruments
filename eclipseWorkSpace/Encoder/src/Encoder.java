


class Encoder {

	private static final int PORT = 4447;
	private static final int TIMEOUT = (int) 60e3;
	private static final int CLIENTS_NUM = 2;
	
	public static void main(String[] args) {
		// StandaloneGUI gui = new StandaloneGUI();
		// gui.show();
		
		TestServer testServer = new TestServer(PORT, TIMEOUT);
		System.out.println("Launching server...");
		testServer.start();
		pause(1);
		TestClients testClients = new TestClients(PORT,CLIENTS_NUM);
		System.out.println("Launching clients...");
		testClients.start();
	}
	
	static void pause(int seconds) {
		try {
			Thread.sleep(seconds*1000);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
