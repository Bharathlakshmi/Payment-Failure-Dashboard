using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Services;

namespace Payment_Failure_Dashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SimulatedFailureController : ControllerBase
    {
        private readonly ISimulatedFailureService _service;

        public SimulatedFailureController(ISimulatedFailureService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SimulatedFailureConfigDTO>>> GetAll()
        {
            return Ok(await _service.GetAll());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SimulatedFailureConfigDTO>> GetById(int id)
        {
            var cfg = await _service.GetById(id);
            if (cfg == null) return NotFound();
            return Ok(cfg);
        }

        [HttpPost]
        public async Task<ActionResult> Create(SimulatedFailureConfigDTO dto)
        {
            await _service.Create(dto);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, SimulatedFailureConfigDTO dto)
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
