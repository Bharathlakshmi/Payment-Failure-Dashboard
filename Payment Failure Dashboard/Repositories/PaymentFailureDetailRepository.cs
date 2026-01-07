using Microsoft.EntityFrameworkCore;
using Payment_Failure_Dashboard.Data;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Repository
{
    public class PaymentFailureDetailRepository : IPaymentFailureDetail
    {
        private readonly PaymentContext _context;

        public PaymentFailureDetailRepository(PaymentContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PaymentFailureDetail>> GetAll()
        {
            return await _context.Set<PaymentFailureDetail>().ToListAsync();
        }

        public async Task<PaymentFailureDetail> GetById(int id)
        {
            return await _context.Set<PaymentFailureDetail>().FindAsync(id);
        }

        public async Task<PaymentFailureDetail> Add(PaymentFailureDetail entity)
        {
            _context.Set<PaymentFailureDetail>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task Update(int id, PaymentFailureDetail entity)
        {
            _context.Set<PaymentFailureDetail>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var entity = await _context.Set<PaymentFailureDetail>().FindAsync(id);
            if(entity == null) throw new KeyNotFoundException();
            _context.Set<PaymentFailureDetail>().Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
