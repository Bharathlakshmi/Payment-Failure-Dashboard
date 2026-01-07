using Payment_Failure_Dashboard.DTOs;

namespace Payment_Failure_Dashboard.Services
{
    public interface IFailureRootCauseService
    {
        Task Create(FailureRootCauseDTO dto);
        Task<IEnumerable<FailureRootCauseDTO>> GetAll();
        Task<FailureRootCauseDTO?> GetById(int id);
        Task<bool> Update(int id, FailureRootCauseDTO dto);
        Task<bool> Delete(int id);
    }
}