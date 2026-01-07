using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Payment_Failure_Dashboard.Models
{
    public class PaymentFailureDetail
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("PaymentTransaction")]
        public int PaymentTransactionId { get; set; }
        public PaymentTransaction PaymentTransaction { get; set; }

        public string ErrorCode { get; set; }
        public string ErrorReason { get; set; }
        public string ErrorSource { get; set; }   // customer | gateway | system
        public string ErrorStep { get; set; }     // authorization | payment | callback
        public string RawErrorPayload { get; set; }

        public DateTime FailedAt { get; set; }
    }
}