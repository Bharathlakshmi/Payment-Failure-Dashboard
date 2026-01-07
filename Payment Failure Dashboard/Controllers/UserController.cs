using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Services;

namespace Payment_Failure_Dashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetUserDTO>>> GetAll()
        {
            return Ok(await _service.GetAllUsers());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetUserDTO>> GetById(int id)
        {
            var user = await _service.GetUserById(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<GetUserDTO>> Create(CreateUserDTO dto)
        {
            return Ok(await _service.CreateUser(dto));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, CreateUserDTO dto)
        {
            var updated = await _service.UpdateUser(id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteUser(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
