namespace Payment_Failure_Dashboard.DTOs
{
    public class SimulatedFailureConfigDTO
    {
        public string FailureType { get; set; }
        public bool Enabled { get; set; }
        public int FailureProbability { get; set; }
    }
}