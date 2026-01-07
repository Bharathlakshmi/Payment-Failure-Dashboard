using Payment_Failure_Dashboard.DTOs;

namespace Payment_Failure_Dashboard.Services
{
    public interface IPaymentTransactionService
    {
        Task<GetPaymentTransactionDTO> Create(CreatePaymentTransactionDTO dto);
        Task<IEnumerable<GetPaymentTransactionDTO>> GetAll();
        Task<IEnumerable<GetPaymentTransactionDTO>> GetByUserId(int userId);
        Task<GetPaymentTransactionDTO?> GetById(int id);
        Task<bool> Update(int id, CreatePaymentTransactionDTO dto);
        Task<bool> Delete(int id);
        Task<bool> UpdateStatus(int id, string status);
    }
}