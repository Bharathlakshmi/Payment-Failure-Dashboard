using Payment_Failure_Dashboard.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payment_Failure_Dashboard.Interface
{
    public interface IFailureRootCauseMaster
    {
        Task<IEnumerable<FailureRootCauseMaster>> GetAll();
        Task<FailureRootCauseMaster> GetById(int id);
        Task<FailureRootCauseMaster> Add(FailureRootCauseMaster entity);
        Task Update(int id, FailureRootCauseMaster entity);
        Task Delete(int id);
    }
}
