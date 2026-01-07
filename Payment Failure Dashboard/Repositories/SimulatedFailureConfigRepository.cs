using Microsoft.EntityFrameworkCore;
using Payment_Failure_Dashboard.Data;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Repository
{
    public class SimulatedFailureConfigRepository : ISimulatedFailureConfig
    {
        private readonly PaymentContext _context;

        public SimulatedFailureConfigRepository(PaymentContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SimulatedFailureConfig>> GetAll()
        {
            return await _context.Set<SimulatedFailureConfig>().ToListAsync();
        }

        public async Task<SimulatedFailureConfig> GetById(int id)
        {
            return await _context.Set<SimulatedFailureConfig>().FindAsync(id);
        }

        public async Task<SimulatedFailureConfig> Add(SimulatedFailureConfig entity)
        {
            _context.Set<SimulatedFailureConfig>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task Update(int id, SimulatedFailureConfig entity)
        {
            _context.Set<SimulatedFailureConfig>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var entity = await _context.Set<SimulatedFailureConfig>().FindAsync(id);
            if(entity == null) throw new KeyNotFoundException();
            _context.Set<SimulatedFailureConfig>().Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
