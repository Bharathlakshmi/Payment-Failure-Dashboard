using Payment_Failure_Dashboard.DTOs;

namespace Payment_Failure_Dashboard.Services
{
    public interface IPaymentFailureService
    {
        Task Create(CreatePaymentFailureDTO dto);
        Task<IEnumerable<CreatePaymentFailureDTO>> GetAll();
        Task<CreatePaymentFailureDTO?> GetById(int id);
        Task<bool> Update(int id, CreatePaymentFailureDTO dto);
        Task<bool> Delete(int id);
    }
}