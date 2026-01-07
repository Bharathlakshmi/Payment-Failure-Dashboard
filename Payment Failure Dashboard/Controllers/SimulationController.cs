using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Payment_Failure_Dashboard.DTOs;
using Payment_Failure_Dashboard.Services;

namespace Payment_Failure_Dashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SimulationController : ControllerBase
    {
        private readonly IPaymentTransactionService _paymentService;
        private readonly ISimulatedFailureService _simulationService;
        private readonly IPaymentFailureService _failureService;
        private readonly IFailureRootCauseService _rootCauseService;

        public SimulationController(
            IPaymentTransactionService paymentService, 
            ISimulatedFailureService simulationService,
            IPaymentFailureService failureService,
            IFailureRootCauseService rootCauseService)
        {
            _paymentService = paymentService;
            _simulationService = simulationService;
            _failureService = failureService;
            _rootCauseService = rootCauseService;
        }

        [HttpPost("timeout")]
        public async Task<ActionResult<object>> SimulateTimeout([FromBody] SimulationRequestDTO? request = null)
        {
            try
            {
                var dto = new CreatePaymentTransactionDTO
                {
                    UserId = GetCurrentUserId(),
                    Amount = request?.Amount ?? 100,
                    PaymentGateway = "SIMULATED",
                    PaymentChannel = request?.Channel ?? "WEB",
                    Bank = request?.Bank
                };

                var transaction = await _paymentService.Create(dto);
                
                // Mark as failed due to timeout
                await _paymentService.UpdateStatus(transaction.Id, "FAILED");

                // Create failure detail record
                var failureDto = new CreatePaymentFailureDTO
                {
                    PaymentTransactionId = transaction.Id,
                    ErrorCode = "NETWORK_TIMEOUT",
                    ErrorReason = "Payment timeout - simulated failure",
                    ErrorSource = "network",
                    ErrorStep = "payment",
                    RawErrorPayload = "{\"error_code\":\"NETWORK_TIMEOUT\",\"error_reason\":\"Simulated network timeout\"}"
                };
                
                await _failureService.Create(failureDto);
                
                // Create root cause master record
                var rootCauseDto = new FailureRootCauseDTO
                {
                    ErrorCode = "NETWORK_TIMEOUT",
                    ErrorSource = "network",
                    RootCauseCategory = "Network Timeout",
                    Severity = "MEDIUM",
                    Description = "Payment timeout - simulated failure"
                };
                
                await _rootCauseService.Create(rootCauseDto);

                return Ok(new
                {
                    id = transaction.TransactionId,
                    amount = transaction.Amount,
                    currency = "INR",
                    status = "FAILED",
                    channel = transaction.PaymentChannel,
                    gateway = transaction.PaymentGateway,
                    timestamp = transaction.CreatedAt,
                    errorMessage = "Payment timeout - simulated failure"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to simulate timeout", error = ex.Message });
            }
        }

        [HttpPost("system-error")]
        public async Task<ActionResult<object>> SimulateSystemError([FromBody] SimulationRequestDTO? request = null)
        {
            try
            {
                var dto = new CreatePaymentTransactionDTO
                {
                    UserId = GetCurrentUserId(),
                    Amount = request?.Amount ?? 100,
                    PaymentGateway = "SIMULATED",
                    PaymentChannel = request?.Channel ?? "WEB",
                    Bank = request?.Bank
                };

                var transaction = await _paymentService.Create(dto);
                
                // Mark as failed due to system error
                await _paymentService.UpdateStatus(transaction.Id, "FAILED");

                // Create failure detail record
                var failureDto = new CreatePaymentFailureDTO
                {
                    PaymentTransactionId = transaction.Id,
                    ErrorCode = "SYSTEM_ERROR",
                    ErrorReason = "System error - simulated failure",
                    ErrorSource = "system",
                    ErrorStep = "processing",
                    RawErrorPayload = "{\"error_code\":\"SYSTEM_ERROR\",\"error_reason\":\"Simulated system error\"}"
                };
                
                await _failureService.Create(failureDto);
                
                // Create root cause master record
                var rootCauseDto = new FailureRootCauseDTO
                {
                    ErrorCode = "SYSTEM_ERROR",
                    ErrorSource = "system",
                    RootCauseCategory = "System Error",
                    Severity = "HIGH",
                    Description = "System error - simulated failure"
                };
                
                await _rootCauseService.Create(rootCauseDto);

                return Ok(new
                {
                    id = transaction.TransactionId,
                    amount = transaction.Amount,
                    currency = "INR",
                    status = "FAILED",
                    channel = transaction.PaymentChannel,
                    gateway = transaction.PaymentGateway,
                    timestamp = transaction.CreatedAt,
                    errorMessage = "System error - simulated failure"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to simulate system error", error = ex.Message });
            }
        }

        [HttpPost("bank-server-down")]
        public async Task<ActionResult<object>> SimulateBankServerDown([FromBody] SimulationRequestDTO? request = null)
        {
            try
            {
                var dto = new CreatePaymentTransactionDTO
                {
                    UserId = GetCurrentUserId(),
                    Amount = request?.Amount ?? 100,
                    PaymentGateway = "SIMULATED",
                    PaymentChannel = request?.Channel ?? "WEB",
                    Bank = request?.Bank
                };

                var transaction = await _paymentService.Create(dto);
                await _paymentService.UpdateStatus(transaction.Id, "FAILED");

                var failureDto = new CreatePaymentFailureDTO
                {
                    PaymentTransactionId = transaction.Id,
                    ErrorCode = "BANK_SERVER_DOWN",
                    ErrorReason = "Bank server is temporarily unavailable",
                    ErrorSource = "bank",
                    ErrorStep = "authorization",
                    RawErrorPayload = "{\"error_code\":\"BANK_SERVER_DOWN\",\"error_reason\":\"Bank server unavailable\"}"
                };
                
                await _failureService.Create(failureDto);
                
                var rootCauseDto = new FailureRootCauseDTO
                {
                    ErrorCode = "BANK_SERVER_DOWN",
                    ErrorSource = "bank",
                    RootCauseCategory = "Bank Error",
                    Severity = "HIGH",
                    Description = "Bank server is temporarily unavailable"
                };
                
                await _rootCauseService.Create(rootCauseDto);

                return Ok(new
                {
                    id = transaction.TransactionId,
                    amount = transaction.Amount,
                    currency = "INR",
                    status = "FAILED",
                    channel = transaction.PaymentChannel,
                    gateway = transaction.PaymentGateway,
                    timestamp = transaction.CreatedAt,
                    errorMessage = "Bank server is temporarily unavailable"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to simulate bank server down", error = ex.Message });
            }
        }

        [HttpPost("insufficient-balance")]
        public async Task<ActionResult<object>> SimulateInsufficientBalance([FromBody] SimulationRequestDTO? request = null)
        {
            try
            {
                var dto = new CreatePaymentTransactionDTO
                {
                    UserId = GetCurrentUserId(),
                    Amount = request?.Amount ?? 100,
                    PaymentGateway = "SIMULATED",
                    PaymentChannel = request?.Channel ?? "WEB",
                    Bank = request?.Bank
                };

                var transaction = await _paymentService.Create(dto);
                await _paymentService.UpdateStatus(transaction.Id, "FAILED");

                var failureDto = new CreatePaymentFailureDTO
                {
                    PaymentTransactionId = transaction.Id,
                    ErrorCode = "INSUFFICIENT_BALANCE",
                    ErrorReason = "Insufficient funds in customer account",
                    ErrorSource = "customer",
                    ErrorStep = "validation",
                    RawErrorPayload = "{\"error_code\":\"INSUFFICIENT_BALANCE\",\"error_reason\":\"Insufficient funds\"}"
                };
                
                await _failureService.Create(failureDto);
                
                var rootCauseDto = new FailureRootCauseDTO
                {
                    ErrorCode = "INSUFFICIENT_BALANCE",
                    ErrorSource = "customer",
                    RootCauseCategory = "Customer Abort",
                    Severity = "LOW",
                    Description = "Insufficient funds in customer account"
                };
                
                await _rootCauseService.Create(rootCauseDto);

                return Ok(new
                {
                    id = transaction.TransactionId,
                    amount = transaction.Amount,
                    currency = "INR",
                    status = "FAILED",
                    channel = transaction.PaymentChannel,
                    gateway = transaction.PaymentGateway,
                    timestamp = transaction.CreatedAt,
                    errorMessage = "Insufficient funds in customer account"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to simulate insufficient balance", error = ex.Message });
            }
        }

        [HttpPost("kyc-incomplete")]
        public async Task<ActionResult<object>> SimulateKycIncomplete([FromBody] SimulationRequestDTO? request = null)
        {
            try
            {
                var dto = new CreatePaymentTransactionDTO
                {
                    UserId = GetCurrentUserId(),
                    Amount = request?.Amount ?? 100,
                    PaymentGateway = "SIMULATED",
                    PaymentChannel = request?.Channel ?? "WEB",
                    Bank = request?.Bank
                };

                var transaction = await _paymentService.Create(dto);
                await _paymentService.UpdateStatus(transaction.Id, "FAILED");

                var failureDto = new CreatePaymentFailureDTO
                {
                    PaymentTransactionId = transaction.Id,
                    ErrorCode = "KYC_INCOMPLETE",
                    ErrorReason = "Customer KYC verification is incomplete",
                    ErrorSource = "compliance",
                    ErrorStep = "verification",
                    RawErrorPayload = "{\"error_code\":\"KYC_INCOMPLETE\",\"error_reason\":\"KYC verification incomplete\"}"
                };
                
                await _failureService.Create(failureDto);
                
                var rootCauseDto = new FailureRootCauseDTO
                {
                    ErrorCode = "KYC_INCOMPLETE",
                    ErrorSource = "compliance",
                    RootCauseCategory = "Compliance Error",
                    Severity = "MEDIUM",
                    Description = "Customer KYC verification is incomplete"
                };
                
                await _rootCauseService.Create(rootCauseDto);

                return Ok(new
                {
                    id = transaction.TransactionId,
                    amount = transaction.Amount,
                    currency = "INR",
                    status = "FAILED",
                    channel = transaction.PaymentChannel,
                    gateway = transaction.PaymentGateway,
                    timestamp = transaction.CreatedAt,
                    errorMessage = "Customer KYC verification is incomplete"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to simulate KYC incomplete", error = ex.Message });
            }
        }

        [HttpPost("bank-declined")]
        public async Task<ActionResult<object>> SimulateBankDeclined([FromBody] SimulationRequestDTO? request = null)
        {
            try
            {
                var dto = new CreatePaymentTransactionDTO
                {
                    UserId = GetCurrentUserId(),
                    Amount = request?.Amount ?? 100,
                    PaymentGateway = "SIMULATED",
                    PaymentChannel = request?.Channel ?? "WEB",
                    Bank = request?.Bank
                };

                var transaction = await _paymentService.Create(dto);
                await _paymentService.UpdateStatus(transaction.Id, "FAILED");

                var failureDto = new CreatePaymentFailureDTO
                {
                    PaymentTransactionId = transaction.Id,
                    ErrorCode = "BANK_DECLINED",
                    ErrorReason = "Bank rejected transaction",
                    ErrorSource = "bank",
                    ErrorStep = "authorization",
                    RawErrorPayload = "{\"error_code\":\"BANK_DECLINED\",\"error_reason\":\"Bank rejected transaction\"}"
                };
                
                await _failureService.Create(failureDto);
                
                var rootCauseDto = new FailureRootCauseDTO
                {
                    ErrorCode = "BANK_DECLINED",
                    ErrorSource = "bank",
                    RootCauseCategory = "Bank Error",
                    Severity = "HIGH",
                    Description = "Bank rejected transaction"
                };
                
                await _rootCauseService.Create(rootCauseDto);

                return Ok(new
                {
                    id = transaction.TransactionId,
                    amount = transaction.Amount,
                    currency = "INR",
                    status = "FAILED",
                    channel = transaction.PaymentChannel,
                    gateway = transaction.PaymentGateway,
                    timestamp = transaction.CreatedAt,
                    errorMessage = "Bank rejected transaction"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to simulate bank declined", error = ex.Message });
            }
        }

        [HttpPost("limit-exceeded")]
        public async Task<ActionResult<object>> SimulateLimitExceeded([FromBody] SimulationRequestDTO? request = null)
        {
            try
            {
                var dto = new CreatePaymentTransactionDTO
                {
                    UserId = GetCurrentUserId(),
                    Amount = request?.Amount ?? 100,
                    PaymentGateway = "SIMULATED",
                    PaymentChannel = request?.Channel ?? "WEB",
                    Bank = request?.Bank
                };

                var transaction = await _paymentService.Create(dto);
                await _paymentService.UpdateStatus(transaction.Id, "FAILED");

                var failureDto = new CreatePaymentFailureDTO
                {
                    PaymentTransactionId = transaction.Id,
                    ErrorCode = "LIMIT_EXCEEDED",
                    ErrorReason = "Daily limit crossed",
                    ErrorSource = "bank",
                    ErrorStep = "validation",
                    RawErrorPayload = "{\"error_code\":\"LIMIT_EXCEEDED\",\"error_reason\":\"Daily limit crossed\"}"
                };
                
                await _failureService.Create(failureDto);
                
                var rootCauseDto = new FailureRootCauseDTO
                {
                    ErrorCode = "LIMIT_EXCEEDED",
                    ErrorSource = "bank",
                    RootCauseCategory = "Bank Error",
                    Severity = "MEDIUM",
                    Description = "Daily limit crossed"
                };
                
                await _rootCauseService.Create(rootCauseDto);

                return Ok(new
                {
                    id = transaction.TransactionId,
                    amount = transaction.Amount,
                    currency = "INR",
                    status = "FAILED",
                    channel = transaction.PaymentChannel,
                    gateway = transaction.PaymentGateway,
                    timestamp = transaction.CreatedAt,
                    errorMessage = "Daily limit crossed"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to simulate limit exceeded", error = ex.Message });
            }
        }

        [HttpPost("account-blocked")]
        public async Task<ActionResult<object>> SimulateAccountBlocked([FromBody] SimulationRequestDTO? request = null)
        {
            try
            {
                var dto = new CreatePaymentTransactionDTO
                {
                    UserId = GetCurrentUserId(),
                    Amount = request?.Amount ?? 100,
                    PaymentGateway = "SIMULATED",
                    PaymentChannel = request?.Channel ?? "WEB",
                    Bank = request?.Bank
                };

                var transaction = await _paymentService.Create(dto);
                await _paymentService.UpdateStatus(transaction.Id, "FAILED");

                var failureDto = new CreatePaymentFailureDTO
                {
                    PaymentTransactionId = transaction.Id,
                    ErrorCode = "ACCOUNT_BLOCKED",
                    ErrorReason = "Account blocked by bank",
                    ErrorSource = "bank",
                    ErrorStep = "authorization",
                    RawErrorPayload = "{\"error_code\":\"ACCOUNT_BLOCKED\",\"error_reason\":\"Account blocked by bank\"}"
                };
                
                await _failureService.Create(failureDto);
                
                var rootCauseDto = new FailureRootCauseDTO
                {
                    ErrorCode = "ACCOUNT_BLOCKED",
                    ErrorSource = "bank",
                    RootCauseCategory = "Bank Error",
                    Severity = "HIGH",
                    Description = "Account blocked by bank"
                };
                
                await _rootCauseService.Create(rootCauseDto);

                return Ok(new
                {
                    id = transaction.TransactionId,
                    amount = transaction.Amount,
                    currency = "INR",
                    status = "FAILED",
                    channel = transaction.PaymentChannel,
                    gateway = transaction.PaymentGateway,
                    timestamp = transaction.CreatedAt,
                    errorMessage = "Account blocked by bank"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to simulate account blocked", error = ex.Message });
            }
        }

        [HttpPost("blacklisted-user")]
        public async Task<ActionResult<object>> SimulateBlacklistedUser([FromBody] SimulationRequestDTO? request = null)
        {
            try
            {
                var dto = new CreatePaymentTransactionDTO
                {
                    UserId = GetCurrentUserId(),
                    Amount = request?.Amount ?? 100,
                    PaymentGateway = "SIMULATED",
                    PaymentChannel = request?.Channel ?? "WEB",
                    Bank = request?.Bank
                };

                var transaction = await _paymentService.Create(dto);
                await _paymentService.UpdateStatus(transaction.Id, "FAILED");

                var failureDto = new CreatePaymentFailureDTO
                {
                    PaymentTransactionId = transaction.Id,
                    ErrorCode = "BLACKLISTED_USER",
                    ErrorReason = "Blocked account",
                    ErrorSource = "compliance",
                    ErrorStep = "verification",
                    RawErrorPayload = "{\"error_code\":\"BLACKLISTED_USER\",\"error_reason\":\"Blocked account\"}"
                };
                
                await _failureService.Create(failureDto);
                
                var rootCauseDto = new FailureRootCauseDTO
                {
                    ErrorCode = "BLACKLISTED_USER",
                    ErrorSource = "compliance",
                    RootCauseCategory = "Compliance Error",
                    Severity = "HIGH",
                    Description = "Blocked account"
                };
                
                await _rootCauseService.Create(rootCauseDto);

                return Ok(new
                {
                    id = transaction.TransactionId,
                    amount = transaction.Amount,
                    currency = "INR",
                    status = "FAILED",
                    channel = transaction.PaymentChannel,
                    gateway = transaction.PaymentGateway,
                    timestamp = transaction.CreatedAt,
                    errorMessage = "Blocked account"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to simulate blacklisted user", error = ex.Message });
            }
        }

        [HttpPost("ip-blocked")]
        public async Task<ActionResult<object>> SimulateIpBlocked([FromBody] SimulationRequestDTO? request = null)
        {
            try
            {
                var dto = new CreatePaymentTransactionDTO
                {
                    UserId = GetCurrentUserId(),
                    Amount = request?.Amount ?? 100,
                    PaymentGateway = "SIMULATED",
                    PaymentChannel = request?.Channel ?? "WEB",
                    Bank = request?.Bank
                };

                var transaction = await _paymentService.Create(dto);
                await _paymentService.UpdateStatus(transaction.Id, "FAILED");

                var failureDto = new CreatePaymentFailureDTO
                {
                    PaymentTransactionId = transaction.Id,
                    ErrorCode = "IP_BLOCKED",
                    ErrorReason = "Suspicious IP",
                    ErrorSource = "security",
                    ErrorStep = "verification",
                    RawErrorPayload = "{\"error_code\":\"IP_BLOCKED\",\"error_reason\":\"Suspicious IP\"}"
                };
                
                await _failureService.Create(failureDto);
                
                var rootCauseDto = new FailureRootCauseDTO
                {
                    ErrorCode = "IP_BLOCKED",
                    ErrorSource = "security",
                    RootCauseCategory = "Security Error",
                    Severity = "HIGH",
                    Description = "Suspicious IP"
                };
                
                await _rootCauseService.Create(rootCauseDto);

                return Ok(new
                {
                    id = transaction.TransactionId,
                    amount = transaction.Amount,
                    currency = "INR",
                    status = "FAILED",
                    channel = transaction.PaymentChannel,
                    gateway = transaction.PaymentGateway,
                    timestamp = transaction.CreatedAt,
                    errorMessage = "Suspicious IP"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to simulate IP blocked", error = ex.Message });
            }
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

    public class SimulationRequestDTO
    {
        public decimal Amount { get; set; }
        public string Channel { get; set; } = "WEB";
        public string? Bank { get; set; }
    }
}