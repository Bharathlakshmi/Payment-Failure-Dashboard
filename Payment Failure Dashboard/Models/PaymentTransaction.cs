using System;
using System.ComponentModel.DataAnnotations;

namespace Payment_Failure_Dashboard.Models
{
    public class PaymentTransaction
    {
        [Key]
        public int Id { get; set; }

        public string TransactionId { get; set; }
        public int UserId { get; set; }

        public decimal Amount { get; set; }
        public string PaymentGateway { get; set; }   // RAZORPAY | SIMULATED
        public string PaymentChannel { get; set; }   // UPI | Card | NetBanking
        public string Status { get; set; }           // SUCCESS | FAILED | PENDING
        public string? Bank { get; set; }            // HDFC | ICICI | SBI | etc.
        public DateTime CreatedAt { get; set; }
    }
}