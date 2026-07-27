using System;
using MySqlConnector;

class Program {
    static void Main() {
        string connStr = "Server=bv06bt2zy97l0isi5art-mysql.services.clever-cloud.com;Port=3306;Database=bv06bt2zy97l0isi5art;Uid=u2gc4aj024abo5ax;Pwd=GSq7R7nvsOqMHtdjn2Yh;";
        using var conn = new MySqlConnection(connStr);
        conn.Open();
        
        using var cmd = new MySqlCommand("SELECT Email, PasswordHash, FailedLoginAttempts, IsLocked FROM Users WHERE Email='admin@elevate.edu'", conn);
        using var reader = cmd.ExecuteReader();
        while (reader.Read()) {
            Console.WriteLine($"Email: {reader.GetString(0)}");
            Console.WriteLine($"PasswordHash: {reader.GetString(1)}");
            Console.WriteLine($"FailedAttempts: {reader.GetInt32(2)}");
            Console.WriteLine($"IsLocked: {reader.GetBoolean(3)}");
            
            bool match = BCrypt.Net.BCrypt.Verify("Password123!", reader.GetString(1));
            Console.WriteLine($"Matches 'Password123!': {match}");
        }
    }
}
