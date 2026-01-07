using Payment_Failure_Dashboard.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payment_Failure_Dashboard.Interface
{
    public interface IUser
    {
        Task<IEnumerable<User>> GetAll();
        Task<User> GetById(int id);
        Task<User> Add(User entity);
        Task Update(int id, User entity);
        Task Delete(int id);
    }
}
