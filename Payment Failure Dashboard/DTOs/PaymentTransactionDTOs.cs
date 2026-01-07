using System;

namespace Payment_Failure_Dashboard.DTOs
{
    public class GetPaymentTransactionDTO
    {
        public int Id { get; set; }
        public string TransactionId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentGateway { get; set; }
        public string PaymentChannel { get; set; }
        public string Status { get; set; }
        public string? Bank { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreatePaymentTransactionDTO
    {
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentGateway { get; set; }
        public string PaymentChannel { get; set; }
        public string? Bank { get; set; }
    }

    public class PaymentInitiateRequestDTO
    {
        public decimal amount { get; set; }
        public string currency { get; set; }
        public string channel { get; set; }
        public string gateway { get; set; }
        public string bank { get; set; }
    }

    public class UpdateStatusRequest
    {
        public string TransactionId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? RazorpayPaymentId { get; set; }
        public string? RazorpaySignature { get; set; }
        public string? ErrorCode { get; set; }
        public string? ErrorReason { get; set; }
        public string? ErrorStep { get; set; }
    }
}