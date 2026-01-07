using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Services;

namespace Payment_Failure_Dashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RazorpayPaymentController : ControllerBase
    {
        private readonly IRazorpayPaymentService _service;

        public RazorpayPaymentController(IRazorpayPaymentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CreateRazorpayPaymentDTO>>> GetAll()
        {
            return Ok(await _service.GetAll());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CreateRazorpayPaymentDTO>> GetById(int id)
        {
            var r = await _service.GetById(id);
            if (r == null) return NotFound();
            return Ok(r);
        }

        [HttpPost]
        public async Task<ActionResult> Create(CreateRazorpayPaymentDTO dto)
        {
            await _service.Create(dto);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, CreateRazorpayPaymentDTO dto)
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
