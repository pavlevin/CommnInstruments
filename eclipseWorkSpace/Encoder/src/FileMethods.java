import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;

import org.apache.commons.lang3.StringUtils;


class FileMethods {
    

    private static InputStream is;
    private static InputStreamReader isr;
    private static BufferedReader br;
    private static BufferedWriter bw;
    
    public static String[] readAllLines(File file) {
        int linesTotal = countLinesInFile(file);
        String[] linesRead = new String[linesTotal];
        BufferedReader reader = parseFileAsText(file);
        try {
            for (int i = 0; i < linesTotal; i++)
                linesRead[i] = reader.readLine() + "\n";
        } catch (IOException ioe) {
            reportExceptionCaughtWhileScanning(file);
            ioe.printStackTrace();
        }
        return linesRead;
    }
            
    public static BufferedReader parseFileAsText(File file) {
         String encoding = getFileEncoding(file);
         initiateInputStreamReaderForEncoding(file,encoding);
         br = new BufferedReader(isr);
         return br;
    }

    public static int countLinesInFile(File file) {
        initiateInputStream(file);
        int count = 0;
        try {
            count = countLines();
        } catch (IOException ioe) {
            reportExceptionCaughtWhileScanning(file);
            ioe.printStackTrace();
        } finally {
            closeInputStream();
        }
        return count;
    }

    private static int countLines() 
    throws IOException {
        int count = 0;
        byte[] c = new byte[1024];
        int readChars = 0;
        boolean empty = true;
        while ((readChars = is.read(c)) != -1) {
            empty = false;
            for (int i = 0; i < readChars; ++i) {
                if (c[i] == '\n')
                    ++count;
            }
        }
        return (count == 0 && !empty) ? 1 : count;
    }

    public static String getFileEncoding(File file) {
        initiateInputStreamReader(file);
        return isr.getEncoding();
    }
    
    public static void appendLinesToFile(File file,
                    String... lines) {
        writeStringArrayToFile(file,true,lines);
    }
    
    // No append
    public static void putLinesToFile(File file, String... lines) {
            writeStringArrayToFile(file,false,lines);
    }
    
    private static void
    writeStringArrayToFile(File file, boolean append, String... array) {
        boolean doWeAppendNow = append; 
        for (String line: array) {
            if (!StringUtils.isEmpty(line))
                writeStringToFile(file,doWeAppendNow,line);
            doWeAppendNow = true;
        }
    }

    private static void
    writeStringToFile(File file, boolean append, String s) {
        initiateBufferedWriter(file,append);
        try {
            bw.write(s);
            bw.write("\n");
         } catch (IOException ioe) {
            reportExceptionCaughtWhileWriting(file);
            ioe.printStackTrace();
         } finally {
            closeBufferedWriter();
         }
    }

    private static void initiateInputStream(File file) {
        try {
            is = new BufferedInputStream(new FileInputStream(file));
        } catch (FileNotFoundException fnfe) {
            reportNotFound(file);
            fnfe.printStackTrace();
        }
    }

    private static void initiateInputStreamReader(File file) {
        try {
             is = new FileInputStream(file);
             isr = new InputStreamReader(is);
        } catch (FileNotFoundException fnfe) {
            reportNotFound(file);
            fnfe.printStackTrace();
        }
    }

    private static void initiateBufferedWriter(File file, boolean append) {
        try {
            bw = new BufferedWriter(new FileWriter(file,append));
        } catch (IOException ioe) {
            reportExceptionCaughtWhileWriting(file);
            ioe.printStackTrace();
        }
    }
    
    private static void initiateInputStreamReaderForEncoding(File file, String enc) {
        try {
             is = new FileInputStream(file);
             isr = new InputStreamReader(is,Charset.forName(enc));
        } catch (FileNotFoundException fnfe) {
            reportNotFound(file);
            fnfe.printStackTrace();
        }
    }

    private static void closeInputStream() {
        try {
            is.close();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
    }

    private static void closeBufferedWriter() {
        try {
            bw.close();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
    }

    private static void reportExceptionCaughtWhileScanning(File file) {
        System.err.println("Exception caught while scanning file \'" +
                file.getName() + "\'.\n");
    }

    private static void reportExceptionCaughtWhileWriting(File file) {
        System.err.println("Exception caught while writing file \'" +
                file.getName() + "\'.\n");
    }

    private static void reportNotFound(File file) {
        System.err.println("File \'" + file.getName() +
                "\' not found.\n");
    }

}
