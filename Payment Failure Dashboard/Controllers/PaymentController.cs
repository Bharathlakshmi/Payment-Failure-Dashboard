using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Services;

namespace Payment_Failure_Dashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentTransactionService _service;
        private readonly IRazorpayPaymentService _razorpayService;
        private readonly IPaymentFailureService _failureService;
        private readonly IFailureRootCauseService _rootCauseService;
        private readonly IConfiguration _configuration;

        public PaymentController(IPaymentTransactionService service, IRazorpayPaymentService razorpayService, IPaymentFailureService failureService, IFailureRootCauseService rootCauseService, IConfiguration configuration)
        {
            _service = service;
            _razorpayService = razorpayService;
            _failureService = failureService;
            _rootCauseService = rootCauseService;
            _configuration = configuration;
        }

        [HttpGet("user-transactions")]
        public async Task<ActionResult<IEnumerable<object>>> GetUserTransactions()
        {
            var userId = GetCurrentUserId();
            var transactions = await _service.GetByUserId(userId);
            var result = transactions.Select(t => new
            {
                id = t.TransactionId,
                amount = t.Amount,
                currency = "INR",
                status = t.Status,
                channel = t.PaymentChannel,
                gateway = t.PaymentGateway,
                timestamp = t.CreatedAt
            });
            return Ok(result);
        }

        [HttpGet("failed-transactions")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetFailedTransactions(int page = 1, int limit = 10)
        {
            var allTransactions = await _service.GetAll();
            var allFailures = await _failureService.GetAll();
            var failedTransactions = allTransactions.Where(t => t.Status == "FAILED").ToList();
            
            var total = failedTransactions.Count;
            var transactions = failedTransactions
                .OrderByDescending(t => t.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(t => {
                    var failure = allFailures.FirstOrDefault(f => f.PaymentTransactionId == t.Id);
                    return new
                    {
                        id = t.TransactionId,
                        amount = t.Amount,
                        currency = "INR",
                        status = t.Status,
                        channel = t.PaymentChannel,
                        gateway = t.PaymentGateway,
                        bank = t.Bank,
                        errorCode = failure?.ErrorCode,
                        errorMessage = failure?.ErrorReason,
                        timestamp = t.CreatedAt
                    };
                });

            return Ok(new
            {
                transactions,
                total,
                page,
                totalPages = (int)Math.Ceiling((double)total / limit)
            });
        }

        [HttpGet("all-transactions")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetAllTransactionsPaginated(int page = 1, int limit = 10)
        {
            var allTransactions = await _service.GetAll();
            var total = allTransactions.Count();
            var transactions = allTransactions
                .OrderByDescending(t => t.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(t => new
                {
                    id = t.TransactionId,
                    amount = t.Amount,
                    currency = "INR",
                    status = t.Status,
                    channel = t.PaymentChannel,
                    gateway = t.PaymentGateway,
                    bank = t.Bank,
                    timestamp = t.CreatedAt
                });

            return Ok(new
            {
                transactions,
                total,
                page,
                totalPages = (int)Math.Ceiling((double)total / limit)
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetPaymentTransactionDTO>> GetById(int id)
        {
            var tx = await _service.GetById(id);
            if (tx == null) return NotFound();
            return Ok(tx);
        }

        [HttpPost]
        public async Task<ActionResult<GetPaymentTransactionDTO>> Create(CreatePaymentTransactionDTO dto)
        {
            return Ok(await _service.Create(dto));
        }

        [HttpPost("initiate")]
        public async Task<ActionResult<object>> InitiatePayment([FromBody] PaymentInitiateRequestDTO paymentRequest)
        {
            var userId = GetCurrentUserId();
            if (paymentRequest == null)
                return BadRequest("Invalid payment data");

            try
            {
                var keyId = _configuration["Razorpay:KeyId"];
                
                // Save transaction as PENDING initially
                var dto = new CreatePaymentTransactionDTO
                {
                    UserId = userId,
                    Amount = paymentRequest.amount,
                    PaymentGateway = paymentRequest.gateway ?? "razorpay",
                    PaymentChannel = paymentRequest.channel ?? "WEB",
                    Bank = paymentRequest.bank
                };
                
                var result = await _service.Create(dto);
                
                return Ok(new
                {
                    id = result.TransactionId,
                    amount = result.Amount,
                    currency = paymentRequest.currency ?? "INR",
                    status = "PENDING",
                    channel = result.PaymentChannel,
                    gateway = result.PaymentGateway,
                    bank = paymentRequest.bank,
                    timestamp = result.CreatedAt,
                    razorpayKeyId = keyId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Payment initiation failed", error = ex.Message });
            }
        }


        [HttpPost("update-status")]
        [AllowAnonymous]
        public async Task<ActionResult> UpdatePaymentStatus([FromBody] UpdateStatusRequest request)
        {
            try
            {
                Console.WriteLine($"Received status update request: TransactionId={request.TransactionId}, Status={request.Status}");
                
                var transactions = await _service.GetAll();
                var transaction = transactions.FirstOrDefault(t => t.TransactionId == request.TransactionId);
                
                if (transaction != null)
                {
                    Console.WriteLine($"Found transaction: ID={transaction.Id}, TransactionId={transaction.TransactionId}, CurrentStatus={transaction.Status}");
                    
                    var updateResult = await _service.UpdateStatus(transaction.Id, request.Status);
                    
                    if (!updateResult)
                    {
                        Console.WriteLine($"Failed to update transaction {transaction.Id}");
                        return StatusCode(500, new { message = "Failed to update transaction status" });
                    }
                    
                    // If payment failed, create failure detail record
                    if (request.Status == "FAILED")
                    {
                        var errorCode = request.ErrorCode ?? "PAYMENT_FAILED";
                        var errorReason = request.ErrorReason ?? "Payment failed";
                        var errorStep = request.ErrorStep ?? "payment";
                        
                        var failureDto = new CreatePaymentFailureDTO
                        {
                            PaymentTransactionId = transaction.Id,
                            ErrorCode = errorCode,
                            ErrorReason = errorReason,
                            ErrorSource = "gateway",
                            ErrorStep = errorStep,
                            RawErrorPayload = $"{{\"error_code\":\"{errorCode}\",\"error_reason\":\"{errorReason}\"}}"
                        };
                        
                        await _failureService.Create(failureDto);
                        
                        // Create or update root cause master record
                        var rootCauseDto = new FailureRootCauseDTO
                        {
                            ErrorCode = errorCode,
                            ErrorSource = "gateway",
                            RootCauseCategory = GetRootCauseCategory(errorCode),
                            Severity = GetSeverity(errorCode),
                            Description = errorReason
                        };
                        
                        await _rootCauseService.Create(rootCauseDto);
                    }
                    
                    return Ok(new { message = "Status updated successfully", transactionId = request.TransactionId, newStatus = request.Status });
                }
                
                return NotFound(new { message = "Transaction not found", transactionId = request.TransactionId });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdatePaymentStatus: {ex.Message}");
                return StatusCode(500, new { message = "Failed to update status", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, CreatePaymentTransactionDTO dto)
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
        
        private string GetRootCauseCategory(string errorCode)
        {
            return errorCode switch
            {
                "USER_CANCELLED" => "Customer Abort",
                "GATEWAY_ERROR" => "Gateway Error",
                "RAZORPAY_INIT_FAILED" => "Gateway Error",
                "PAYMENT_TIMEOUT" => "Network Timeout",
                _ => "System Error"
            };
        }
        
        private string GetSeverity(string errorCode)
        {
            return errorCode switch
            {
                "USER_CANCELLED" => "LOW",
                "GATEWAY_ERROR" => "HIGH",
                "RAZORPAY_INIT_FAILED" => "HIGH",
                "PAYMENT_TIMEOUT" => "MEDIUM",
                _ => "MEDIUM"
            };
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            return int.Parse(userIdClaim);
        }
    }
}
