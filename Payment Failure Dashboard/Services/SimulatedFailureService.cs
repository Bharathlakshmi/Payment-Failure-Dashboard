using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Services
{
    public class SimulatedFailureService : ISimulatedFailureService
    {
        private readonly ISimulatedFailureConfig _repo;

        public SimulatedFailureService(ISimulatedFailureConfig repo)
        {
            _repo = repo;
        }

        public async Task Create(SimulatedFailureConfigDTO dto)
        {
            var cfg = new SimulatedFailureConfig
            {
                FailureType = dto.FailureType,
                Enabled = dto.Enabled,
                FailureProbability = dto.FailureProbability
            };

            await _repo.Add(cfg);
        }

        public async Task<IEnumerable<SimulatedFailureConfigDTO>> GetAll()
        {
            var list = await _repo.GetAll();

            return list.Select(c => new SimulatedFailureConfigDTO
            {
                FailureType = c.FailureType,
                Enabled = c.Enabled,
                FailureProbability = c.FailureProbability
            });
        }

        public async Task<SimulatedFailureConfigDTO?> GetById(int id)
        {
            var c = await _repo.GetById(id);
            if (c == null) return null;

            return new SimulatedFailureConfigDTO
            {
                FailureType = c.FailureType,
                Enabled = c.Enabled,
                FailureProbability = c.FailureProbability
            };
        }

        public async Task<bool> Update(int id, SimulatedFailureConfigDTO dto)
        {
            var existing = await _repo.GetById(id);
            if (existing == null) return false;

            existing.FailureType = dto.FailureType;
            existing.Enabled = dto.Enabled;
            existing.FailureProbability = dto.FailureProbability;

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
    }
}