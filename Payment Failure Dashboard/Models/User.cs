using System;
using System.ComponentModel.DataAnnotations;

namespace Payment_Failure_Dashboard.Models
{
    public enum UserRole
    {
        User = 1,
        Staff = 2
    }
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
         public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}