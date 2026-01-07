namespace Payment_Failure_Dashboard.DTOs
{
    public class FailureRootCauseDTO
    {
        public string ErrorCode { get; set; }
        public string ErrorSource { get; set; }
        public string RootCauseCategory { get; set; }
        public string Severity { get; set; }
        public string Description { get; set; }
    }
}