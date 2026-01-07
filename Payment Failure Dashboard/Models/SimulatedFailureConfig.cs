using System.ComponentModel.DataAnnotations;

namespace Payment_Failure_Dashboard.Models
{
    public class SimulatedFailureConfig
    {
        [Key]
        public int Id { get; set; }

        public string FailureType { get; set; } // NETWORK_TIMEOUT | GATEWAY_ERROR
        public bool Enabled { get; set; }
        public int FailureProbability { get; set; }
    }
}