using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Payment_Failure_Dashboard.Models
{
    public class RazorpayPaymentDetail
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("PaymentTransaction")]
        public int PaymentTransactionId { get; set; }
        public PaymentTransaction PaymentTransaction { get; set; }

        public string RazorpayOrderId { get; set; }
        public string RazorpayPaymentId { get; set; }
        public string RazorpaySignature { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}