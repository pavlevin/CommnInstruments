import java.util.Scanner;


class ChoiceOfTwo {


	private String question;
	private char cTrue, cFalse, cEntered;
	private static Scanner scanner = EncoderConsole.getMainScanner();
	
	public ChoiceOfTwo(String question, char charTrue, char charFalse) {
		setQuestion(question);
		setConditions(charTrue, charFalse);
	}
	
	public void setQuestion(String question) {
		this.question = question;
	}
	
	public void setConditions(char charTrue, char charFalse) {
		this.cTrue = Character.toLowerCase(charTrue);
		this.cFalse = Character.toLowerCase(charFalse);
	}
	
	public boolean makeChoice() {
		while (!isOneOfTwoOptionsChosen()) {
			offerChoice();
			readAnswerFromConsole();
		}
		return getAnswer();
	}
	
	private boolean isOneOfTwoOptionsChosen() {
		return (cEntered == cTrue || cEntered == cFalse);
	}
	
	private void offerChoice() {
		System.out.print(question +
				" (" + String.valueOf(cTrue) + "/" +
				String.valueOf(cFalse) + "): ");
	}
	
	private void readAnswerFromConsole() {
		String s = scanner.next().toLowerCase();
		scanner.reset();
		System.out.println();
		writeAnswer(s.charAt(0));
	}

	private void writeAnswer(char charEntered) {
		this.cEntered = Character.toLowerCase(charEntered);
	}
	
	private boolean getAnswer() {
		if (cEntered == cTrue)	return true;
		return false;
	}
	
}
