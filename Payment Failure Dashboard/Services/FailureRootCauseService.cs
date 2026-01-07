using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Services
{
    public class FailureRootCauseService : IFailureRootCauseService
    {
        private readonly IFailureRootCauseMaster _repo;

        public FailureRootCauseService(IFailureRootCauseMaster repo)
        {
            _repo = repo;
        }

        public async Task Create(FailureRootCauseDTO dto)
        {
            // Check if a root cause with the same ErrorCode and ErrorSource already exists
            var allRootCauses = await _repo.GetAll();
            var existing = allRootCauses.FirstOrDefault(rc => 
                rc.ErrorCode == dto.ErrorCode && 
                rc.ErrorSource == dto.ErrorSource);
            
            // Only create if it doesn't exist (to avoid duplicate key error from unique index)
            if (existing == null)
            {
                var rc = new FailureRootCauseMaster
                {
                    ErrorCode = dto.ErrorCode,
                    ErrorSource = dto.ErrorSource,
                    RootCauseCategory = dto.RootCauseCategory,
                    Severity = dto.Severity,
                    Description = dto.Description
                };

                await _repo.Add(rc);
            }
        }

        public async Task<IEnumerable<FailureRootCauseDTO>> GetAll()
        {
            var list = await _repo.GetAll();

            return list.Select(r => new FailureRootCauseDTO
            {
                ErrorCode = r.ErrorCode,
                ErrorSource = r.ErrorSource,
                RootCauseCategory = r.RootCauseCategory,
                Severity = r.Severity,
                Description = r.Description
            });
        }

        public async Task<FailureRootCauseDTO?> GetById(int id)
        {
            var r = await _repo.GetById(id);
            if (r == null) return null;

            return new FailureRootCauseDTO
            {
                ErrorCode = r.ErrorCode,
                ErrorSource = r.ErrorSource,
                RootCauseCategory = r.RootCauseCategory,
                Severity = r.Severity,
                Description = r.Description
            };
        }

        public async Task<bool> Update(int id, FailureRootCauseDTO dto)
        {
            var existing = await _repo.GetById(id);
            if (existing == null) return false;

            existing.ErrorCode = dto.ErrorCode;
            existing.ErrorSource = dto.ErrorSource;
            existing.RootCauseCategory = dto.RootCauseCategory;
            existing.Severity = dto.Severity;
            existing.Description = dto.Description;

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