using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Services;

namespace Payment_Failure_Dashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FailureRootCauseController : ControllerBase
    {
        private readonly IFailureRootCauseService _service;

        public FailureRootCauseController(IFailureRootCauseService service)
        {
            _service = service;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<FailureRootCauseDTO>>> GetAll()
        {
            return Ok(await _service.GetAll());
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<FailureRootCauseDTO>> GetById(int id)
        {
            var rc = await _service.GetById(id);
            if (rc == null) return NotFound();
            return Ok(rc);
        }

        [HttpPost]
        public async Task<ActionResult> Create(FailureRootCauseDTO dto)
        {
            await _service.Create(dto);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, FailureRootCauseDTO dto)
        {
            var updated = await _service.Update(id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _service.Delete(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
