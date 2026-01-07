using Microsoft.EntityFrameworkCore;
using Payment_Failure_Dashboard.Data;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Repository
{
    public class FailureRootCauseMasterRepository : IFailureRootCauseMaster
    {
        private readonly PaymentContext _context;

        public FailureRootCauseMasterRepository(PaymentContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FailureRootCauseMaster>> GetAll()
        {
            return await _context.Set<FailureRootCauseMaster>().ToListAsync();
        }

        public async Task<FailureRootCauseMaster> GetById(int id)
        {
            return await _context.Set<FailureRootCauseMaster>().FindAsync(id);
        }

        public async Task<FailureRootCauseMaster> Add(FailureRootCauseMaster entity)
        {
            _context.Set<FailureRootCauseMaster>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task Update(int id, FailureRootCauseMaster entity)
        {
            _context.Set<FailureRootCauseMaster>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var entity = await _context.Set<FailureRootCauseMaster>().FindAsync(id);
            if(entity == null) throw new KeyNotFoundException();
            _context.Set<FailureRootCauseMaster>().Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
