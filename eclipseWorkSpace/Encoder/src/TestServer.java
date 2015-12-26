
public class TestServer extends Thread {
	
	int port, timeout;
	private Thread t = new Thread();

	public TestServer(int port, int timeout) {
		this.port = port;
		this.timeout = timeout;
	}
	
	Runnable sRunner = new Runnable() {
		public void run() {
			try {
				Server server = new Server(port, timeout);
				server.run();
			} catch (Exception e) {
				System.out.println("Exception caught running server");
				e.printStackTrace();
			}
		}
	};
	
	public void start() {
		t = new Thread(sRunner);
		t.start();
	}
	
	public void interrupt() {
		t.interrupt();;
	}
	
}
