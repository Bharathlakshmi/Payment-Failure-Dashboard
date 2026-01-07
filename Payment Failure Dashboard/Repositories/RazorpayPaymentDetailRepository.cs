using Microsoft.EntityFrameworkCore;
using Payment_Failure_Dashboard.Data;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Repository
{
    public class RazorpayPaymentDetailRepository : IRazorpayPaymentDetail
    {
        private readonly PaymentContext _context;

        public RazorpayPaymentDetailRepository(PaymentContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RazorpayPaymentDetail>> GetAll()
        {
            return await _context.Set<RazorpayPaymentDetail>().ToListAsync();
        }

        public async Task<RazorpayPaymentDetail> GetById(int id)
        {
            return await _context.Set<RazorpayPaymentDetail>().FindAsync(id);
        }

        public async Task<RazorpayPaymentDetail> Add(RazorpayPaymentDetail entity)
        {
            _context.Set<RazorpayPaymentDetail>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task Update(int id, RazorpayPaymentDetail entity)
        {
            _context.Set<RazorpayPaymentDetail>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var entity = await _context.Set<RazorpayPaymentDetail>().FindAsync(id);
            if(entity == null) throw new KeyNotFoundException();
            _context.Set<RazorpayPaymentDetail>().Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
