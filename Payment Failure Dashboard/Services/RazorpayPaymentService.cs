using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Services
{
    public class RazorpayPaymentService : IRazorpayPaymentService
    {
        private readonly IRazorpayPaymentDetail _repo;

        public RazorpayPaymentService(IRazorpayPaymentDetail repo)
        {
            _repo = repo;
        }

        public async Task Create(CreateRazorpayPaymentDTO dto)
        {
            var rp = new RazorpayPaymentDetail
            {
                PaymentTransactionId = dto.PaymentTransactionId,
                RazorpayOrderId = dto.RazorpayOrderId,
                RazorpayPaymentId = dto.RazorpayPaymentId,
                RazorpaySignature = dto.RazorpaySignature,
                CreatedAt = DateTime.UtcNow
            };

            await _repo.Add(rp);
        }

        public async Task<IEnumerable<CreateRazorpayPaymentDTO>> GetAll()
        {
            var list = await _repo.GetAll();

            return list.Select(r => new CreateRazorpayPaymentDTO
            {
                PaymentTransactionId = r.PaymentTransactionId,
                RazorpayOrderId = r.RazorpayOrderId,
                RazorpayPaymentId = r.RazorpayPaymentId,
                RazorpaySignature = r.RazorpaySignature
            });
        }

        public async Task<CreateRazorpayPaymentDTO?> GetById(int id)
        {
            var r = await _repo.GetById(id);
            if (r == null) return null;

            return new CreateRazorpayPaymentDTO
            {
                PaymentTransactionId = r.PaymentTransactionId,
                RazorpayOrderId = r.RazorpayOrderId,
                RazorpayPaymentId = r.RazorpayPaymentId,
                RazorpaySignature = r.RazorpaySignature
            };
        }

        public async Task<bool> Update(int id, CreateRazorpayPaymentDTO dto)
        {
            var existing = await _repo.GetById(id);
            if (existing == null) return false;

            existing.RazorpayOrderId = dto.RazorpayOrderId;
            existing.RazorpayPaymentId = dto.RazorpayPaymentId;
            existing.RazorpaySignature = dto.RazorpaySignature;

            await _repo.Update(id, existing);
            return true;
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                await _repo.Delete(id);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}