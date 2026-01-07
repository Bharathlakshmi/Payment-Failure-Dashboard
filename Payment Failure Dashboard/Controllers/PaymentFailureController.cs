using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Services;

namespace Payment_Failure_Dashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentFailureController : ControllerBase
    {
        private readonly IPaymentFailureService _service;

        public PaymentFailureController(IPaymentFailureService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CreatePaymentFailureDTO>>> GetAll()
        {
            return Ok(await _service.GetAll());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CreatePaymentFailureDTO>> GetById(int id)
        {
            var f = await _service.GetById(id);
            if (f == null) return NotFound();
            return Ok(f);
        }

        [HttpPost]
        public async Task<ActionResult> Create(CreatePaymentFailureDTO dto)
        {
            await _service.Create(dto);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, CreatePaymentFailureDTO dto)
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
