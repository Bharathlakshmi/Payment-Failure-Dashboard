using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Services
{
    public class UserService : IUserService
    {
        private readonly IUser _repo;

        public UserService(IUser repo)
        {
            _repo = repo;
        }

 
        public async Task<GetUserDTO> CreateUser(CreateUserDTO dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = dto.Password,
                Role = dto.Role,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _repo.Add(user);

            return new GetUserDTO
            {
                Id = created.Id,
                Name = created.Name,
                Email = created.Email,
                Role = created.Role
            };
        }

        public async Task<IEnumerable<GetUserDTO>> GetAllUsers()
        {
            var users = await _repo.GetAll();

            return users.Select(u => new GetUserDTO
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role
            });
        }

    
        public async Task<GetUserDTO?> GetUserById(int id)
        {
            var user = await _repo.GetById(id);
            if (user == null) return null;

            return new GetUserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }

        
        public async Task<bool> UpdateUser(int id, CreateUserDTO dto)
        {
            var existing = await _repo.GetById(id);
            if (existing == null) return false;

            existing.Name = dto.Name;
            existing.Email = dto.Email;
            existing.Password = dto.Password;
            existing.Role = dto.Role;

            await _repo.Update(id, existing);
            return true;
        }

    
        public async Task<bool> DeleteUser(int id)
        {
            try
            {
                await _repo.Delete(id);
                return true;
            }
            catch (KeyNotFoundException)
            {
                return false;
            }
        }
    }
}
