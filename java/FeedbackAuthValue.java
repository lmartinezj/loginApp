import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

class FeedbackAuthValue {
    public static void main(String[] args) {
        String clientSecret = args[0];
        String bindIdAccessToken = args[1];
        try {
            String AuthValue = calculateAuthorizationHeaderValue(clientSecret, bindIdAccessToken);
            System.out.println("AuthValue: " + AuthValue); // Display the string.
        } catch (UnsupportedEncodingException unsupportedEncodingException) {
            System.out.println("unsupportedEncodingException: " + unsupportedEncodingException); // Display the string.
        } catch (InvalidKeyException invalidKeyException) {
            System.out.println("InvalidKeyException: " + invalidKeyException); // Display the string.
        } catch (NoSuchAlgorithmException noSuchAlgorithmException) {
            System.out.println("NoSuchAlgorithmException: " + noSuchAlgorithmException); // Display the string.
        } 
    }
     
    public static String calculateAuthorizationHeaderValue(String clientSecret, String bindIdAccessToken) throws UnsupportedEncodingException, InvalidKeyException, NoSuchAlgorithmException {

        // Create and initialize the Mac instance
        Mac mac = Mac.getInstance("HmacSHA256");
        byte[] keyBytes = clientSecret.getBytes(StandardCharsets.UTF_8);
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "HmacSHA256");
        mac.init(keySpec);
 
        // Calculate the MAC on the BindID AccessToken
        byte[] signedBytes = mac.doFinal(bindIdAccessToken.getBytes(StandardCharsets.UTF_8));
 
         // Encode the signed bytes to base64
        String encodedResult = Base64.getEncoder().encodeToString(signedBytes);
 
        // Create the Authorization Header value
        return "BindIdBackend AccessToken " + bindIdAccessToken + "; " + encodedResult;
    }
} 