using System;
using BCrypt.Net;

class Program {
    static void Main() {
        try {
            bool result = BCrypt.Net.BCrypt.Verify("Password123!", "TEMP");
            Console.WriteLine("Result: " + result);
        } catch (Exception ex) {
            Console.WriteLine("Exception: " + ex.GetType().Name);
        }
        
        try {
            bool result2 = BCrypt.Net.BCrypt.Verify("Password123!", "$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8");
            Console.WriteLine("Result2: " + result2);
        } catch (Exception ex) {
            Console.WriteLine("Exception2: " + ex.GetType().Name);
        }
    }
}
