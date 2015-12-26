
public class ContactNotFoundException extends Exception {
	
	private static final long serialVersionUID = 1L;

	public ContactNotFoundException(String s) {
		System.err.println(s);
	}
	
	public ContactNotFoundException() {}

}
