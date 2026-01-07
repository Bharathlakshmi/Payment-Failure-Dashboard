using Microsoft.EntityFrameworkCore;
using Payment_Failure_Dashboard.Data;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Repository
{
    public class PaymentTransactionRepository : IPaymentTransaction
    {
        private readonly PaymentContext _context;

        public PaymentTransactionRepository(PaymentContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PaymentTransaction>> GetAll()
        {
            return await _context.Set<PaymentTransaction>().ToListAsync();
        }
        
        public async Task<IEnumerable<PaymentTransaction>> GetByUserId(int userId)
        {
            return await _context.Set<PaymentTransaction>()
                .Where(t => t.UserId == userId)
                .ToListAsync();
        }

        public async Task<PaymentTransaction> GetById(int id)
        {
            return await _context.Set<PaymentTransaction>().FindAsync(id);
        }

        public async Task<PaymentTransaction> Add(PaymentTransaction entity)
        {
            _context.Set<PaymentTransaction>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task Update(int id, PaymentTransaction entity)
        {
            _context.Set<PaymentTransaction>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var entity = await _context.Set<PaymentTransaction>().FindAsync(id);
            if(entity == null) throw new KeyNotFoundException();
            _context.Set<PaymentTransaction>().Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
