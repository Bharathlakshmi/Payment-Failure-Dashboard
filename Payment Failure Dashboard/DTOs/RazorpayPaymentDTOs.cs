namespace Payment_Failure_Dashboard.DTOs
{
    public class CreateRazorpayPaymentDTO
    {
        public int PaymentTransactionId { get; set; }
        public string RazorpayOrderId { get; set; }
        public string RazorpayPaymentId { get; set; }
        public string RazorpaySignature { get; set; }
    }
}