namespace Payment_Failure_Dashboard.DTOs
{
    public class CreatePaymentFailureDTO
    {
        public int PaymentTransactionId { get; set; }
        public string ErrorCode { get; set; }
        public string ErrorReason { get; set; }
        public string ErrorSource { get; set; }
        public string ErrorStep { get; set; }
        public string RawErrorPayload { get; set; }
    }
}