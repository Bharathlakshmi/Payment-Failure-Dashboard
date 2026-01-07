using Microsoft.EntityFrameworkCore;
using Payment_Failure_Dashboard.Data;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Repository
{
    public class UserRepository : IUser
    {
        private readonly PaymentContext _context;

        public UserRepository(PaymentContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            return await _context.Set<User>().ToListAsync();
        }

        public async Task<User> GetById(int id)
        {
            return await _context.Set<User>().FindAsync(id);
        }

        public async Task<User> Add(User entity)
        {
            _context.Set<User>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task Update(int id, User entity)
        {
            _context.Set<User>().Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var entity = await _context.Set<User>().FindAsync(id);
            if(entity == null) throw new KeyNotFoundException();
            _context.Set<User>().Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
