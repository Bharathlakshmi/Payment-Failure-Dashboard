using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Services
{
    public class PaymentFailureService : IPaymentFailureService
    {
        private readonly IPaymentFailureDetail _repo;

        public PaymentFailureService(IPaymentFailureDetail repo)
        {
            _repo = repo;
        }

        public async Task Create(CreatePaymentFailureDTO dto)
        {
            var failure = new PaymentFailureDetail
            {
                PaymentTransactionId = dto.PaymentTransactionId,
                ErrorCode = dto.ErrorCode,
                ErrorReason = dto.ErrorReason,
                ErrorSource = dto.ErrorSource,
                ErrorStep = dto.ErrorStep,
                RawErrorPayload = dto.RawErrorPayload,
                FailedAt = DateTime.UtcNow
            };

            await _repo.Add(failure);
        }

        public async Task<IEnumerable<CreatePaymentFailureDTO>> GetAll()
        {
            var list = await _repo.GetAll();

            return list.Select(f => new CreatePaymentFailureDTO
            {
                PaymentTransactionId = f.PaymentTransactionId,
                ErrorCode = f.ErrorCode,
                ErrorReason = f.ErrorReason,
                ErrorSource = f.ErrorSource,
                ErrorStep = f.ErrorStep,
                RawErrorPayload = f.RawErrorPayload
            });
        }

        public async Task<CreatePaymentFailureDTO?> GetById(int id)
        {
            var f = await _repo.GetById(id);
            if (f == null) return null;

            return new CreatePaymentFailureDTO
            {
                PaymentTransactionId = f.PaymentTransactionId,
                ErrorCode = f.ErrorCode,
                ErrorReason = f.ErrorReason,
                ErrorSource = f.ErrorSource,
                ErrorStep = f.ErrorStep,
                RawErrorPayload = f.RawErrorPayload
            };
        }

        public async Task<bool> Update(int id, CreatePaymentFailureDTO dto)
        {
            var existing = await _repo.GetById(id);
            if (existing == null) return false;

            existing.ErrorCode = dto.ErrorCode;
            existing.ErrorReason = dto.ErrorReason;
            existing.ErrorSource = dto.ErrorSource;
            existing.ErrorStep = dto.ErrorStep;
            existing.RawErrorPayload = dto.RawErrorPayload;

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