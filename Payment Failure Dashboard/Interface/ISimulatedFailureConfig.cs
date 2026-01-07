using Payment_Failure_Dashboard.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payment_Failure_Dashboard.Interface
{
    public interface ISimulatedFailureConfig
    {
        Task<IEnumerable<SimulatedFailureConfig>> GetAll();
        Task<SimulatedFailureConfig> GetById(int id);
        Task<SimulatedFailureConfig> Add(SimulatedFailureConfig entity);
        Task Update(int id, SimulatedFailureConfig entity);
        Task Delete(int id);
    }
}
