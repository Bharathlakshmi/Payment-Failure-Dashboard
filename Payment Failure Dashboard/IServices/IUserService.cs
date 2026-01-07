using Payment_Failure_Dashboard.DTOs;

namespace Payment_Failure_Dashboard.Services
{
    public interface IUserService
    {
        Task<GetUserDTO> CreateUser(CreateUserDTO dto);
        Task<IEnumerable<GetUserDTO>> GetAllUsers();
        Task<GetUserDTO?> GetUserById(int id);
        Task<bool> UpdateUser(int id, CreateUserDTO dto);
        Task<bool> DeleteUser(int id);
    }
}