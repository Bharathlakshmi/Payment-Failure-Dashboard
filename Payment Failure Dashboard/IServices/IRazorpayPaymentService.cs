using Payment_Failure_Dashboard.DTOs;

namespace Payment_Failure_Dashboard.Services
{
    public interface IRazorpayPaymentService
    {
        Task Create(CreateRazorpayPaymentDTO dto);
        Task<IEnumerable<CreateRazorpayPaymentDTO>> GetAll();
        Task<CreateRazorpayPaymentDTO?> GetById(int id);
        Task<bool> Update(int id, CreateRazorpayPaymentDTO dto);
        Task<bool> Delete(int id);
    }
}