using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Services
{
    public class PaymentTransactionService : IPaymentTransactionService
    {
        private readonly IPaymentTransaction _repo;

        public PaymentTransactionService(IPaymentTransaction repo)
        {
            _repo = repo;
        }

        public async Task<GetPaymentTransactionDTO> Create(CreatePaymentTransactionDTO dto)
        {
            var tx = new PaymentTransaction
            {
                TransactionId = Guid.NewGuid().ToString(),
                UserId = dto.UserId,
                Amount = dto.Amount,
                PaymentGateway = dto.PaymentGateway,
                PaymentChannel = dto.PaymentChannel,
                Bank = dto.Bank,
                Status = "FAILED", // Start as failed, update to success only when confirmed
                CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"))
            };

            var created = await _repo.Add(tx);

            return new GetPaymentTransactionDTO
            {
                Id = created.Id,
                TransactionId = created.TransactionId,
                Amount = created.Amount,
                PaymentGateway = created.PaymentGateway,
                PaymentChannel = created.PaymentChannel,
                Bank = created.Bank,
                Status = created.Status,
                CreatedAt = created.CreatedAt
            };
        }

        public async Task<IEnumerable<GetPaymentTransactionDTO>> GetAll()
        {
            var list = await _repo.GetAll();
            return MapToDTO(list);
        }

        public async Task<IEnumerable<GetPaymentTransactionDTO>> GetByUserId(int userId)
        {
            var list = await _repo.GetByUserId(userId);
            return MapToDTO(list);
        }

        private IEnumerable<GetPaymentTransactionDTO> MapToDTO(IEnumerable<PaymentTransaction> list)
        {
            return list.Select(t => new GetPaymentTransactionDTO
            {
                Id = t.Id,
                TransactionId = t.TransactionId,
                Amount = t.Amount,
                PaymentGateway = t.PaymentGateway,
                PaymentChannel = t.PaymentChannel,
                Bank = t.Bank,
                Status = t.Status,
                CreatedAt = t.CreatedAt
            });
        }

        public async Task<GetPaymentTransactionDTO?> GetById(int id)
        {
            var t = await _repo.GetById(id);
            if (t == null) return null;

            return new GetPaymentTransactionDTO
            {
                Id = t.Id,
                TransactionId = t.TransactionId,
                Amount = t.Amount,
                PaymentGateway = t.PaymentGateway,
                PaymentChannel = t.PaymentChannel,
                Bank = t.Bank,
                Status = t.Status,
                CreatedAt = t.CreatedAt
            };
        }

        public async Task<bool> Update(int id, CreatePaymentTransactionDTO dto)
        {
            var existing = await _repo.GetById(id);
            if (existing == null) return false;

            existing.Amount = dto.Amount;
            existing.PaymentGateway = dto.PaymentGateway;
            existing.PaymentChannel = dto.PaymentChannel;
            existing.Bank = dto.Bank;

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

        public async Task<bool> UpdateStatus(int id, string status)
        {
            try
            {
                var existing = await _repo.GetById(id);
                if (existing == null) 
                {
                    Console.WriteLine($"Transaction with ID {id} not found");
                    return false;
                }

                Console.WriteLine($"Updating transaction {existing.TransactionId} from {existing.Status} to {status}");
                existing.Status = status;
                await _repo.Update(id, existing);
                Console.WriteLine($"Transaction {existing.TransactionId} updated successfully");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating transaction status: {ex.Message}");
                return false;
            }
        }
    }
}