using Payment_Failure_Dashboard.DTOs;

namespace Payment_Failure_Dashboard.Services
{
    public interface ISimulatedFailureService
    {
        Task Create(SimulatedFailureConfigDTO dto);
        Task<IEnumerable<SimulatedFailureConfigDTO>> GetAll();
        Task<SimulatedFailureConfigDTO?> GetById(int id);
        Task<bool> Update(int id, SimulatedFailureConfigDTO dto);
        Task<bool> Delete(int id);
    }
}