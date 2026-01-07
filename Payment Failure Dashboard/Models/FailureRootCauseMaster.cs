using System.ComponentModel.DataAnnotations;

namespace Payment_Failure_Dashboard.Models
{
    public class FailureRootCauseMaster
    {
        [Key]
        public int Id { get; set; }

        public string ErrorCode { get; set; }
        public string ErrorSource { get; set; }

        public string RootCauseCategory { get; set; } // Customer Abort, Network Timeout
        public string Severity { get; set; }          // LOW | MEDIUM | HIGH
        public string Description { get; set; }
    }
}