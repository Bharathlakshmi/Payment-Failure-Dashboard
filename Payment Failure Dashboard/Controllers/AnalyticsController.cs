using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Payment_Failure_Dashboard.Services;
using Payment_Failure_Dashboard.DTOs;

namespace Payment_Failure_Dashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalyticsController : ControllerBase
    {
        private readonly IPaymentTransactionService _paymentService;
        private readonly IPaymentFailureService _failureService;
        private readonly IFailureRootCauseService _rootCauseService;

        public AnalyticsController(
            IPaymentTransactionService paymentService,
            IPaymentFailureService failureService,
            IFailureRootCauseService rootCauseService)
        {
            _paymentService = paymentService;
            _failureService = failureService;
            _rootCauseService = rootCauseService;
        }

        [HttpGet("failure-analytics")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetFailureAnalytics(string? timeRange = "24h")
        {
            try
            {
                var allTransactions = await _paymentService.GetAll();
                var allFailures = await _failureService.GetAll();
                var rootCauses = await _rootCauseService.GetAll();

                // Filter by time range
                var cutoffDate = GetCutoffDate(timeRange);
                var filteredTransactions = allTransactions.Where(t => t.CreatedAt >= cutoffDate).ToList();
                var failedTransactions = filteredTransactions.Where(t => t.Status == "FAILED").ToList();

                var totalTransactions = filteredTransactions.Count;
                var failedCount = failedTransactions.Count;
                var failureRate = totalTransactions > 0 ? (double)failedCount / totalTransactions : 0;

                // Group failures by channel
                var failuresByChannel = failedTransactions
                    .GroupBy(t => t.PaymentChannel)
                    .ToDictionary(g => g.Key, g => g.Count());

                // Group failures by gateway
                var failuresByGateway = failedTransactions
                    .GroupBy(t => t.PaymentGateway)
                    .ToDictionary(g => g.Key, g => g.Count());

                // Group failures by bank - use real data
                var failuresByBank = failedTransactions
                    .Where(t => !string.IsNullOrEmpty(t.Bank))
                    .GroupBy(t => t.Bank)
                    .ToDictionary(g => g.Key, g => g.Count());

                // Group failures by error source from PaymentFailureDetail
                var failedTransactionIds = failedTransactions.Select(t => t.Id).ToList();
                var failuresByErrorSource = allFailures
                    .Where(f => failedTransactionIds.Contains(f.PaymentTransactionId))
                    .GroupBy(f => f.ErrorSource ?? "Unknown")
                    .ToDictionary(g => g.Key, g => g.Count());

                // Generate failure trend (last 7 days)
                var failuresTrend = GenerateFailureTrend(failedTransactions, 7);

                var analytics = new
                {
                    totalTransactions,
                    failedTransactions = failedCount,
                    failureRate,
                    failuresByChannel,
                    failuresByGateway,
                    failuresByBank,
                    failuresByErrorSource,
                    failuresTrend
                };

                return Ok(analytics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to get failure analytics", error = ex.Message });
            }
        }

        private DateTime GetCutoffDate(string? timeRange)
        {
            return timeRange switch
            {
                "1h" => DateTime.Now.AddHours(-1),
                "24h" => DateTime.Now.AddDays(-1),
                "7d" => DateTime.Now.AddDays(-7),
                "30d" => DateTime.Now.AddDays(-30),
                _ => DateTime.Now.AddDays(-1)
            };
        }

        private List<object> GenerateFailureTrend(List<GetPaymentTransactionDTO> failedTransactions, int days)
        {
            var trend = new List<object>();
            for (int i = days - 1; i >= 0; i--)
            {
                var date = DateTime.Now.AddDays(-i).Date;
                var count = failedTransactions.Count(t => t.CreatedAt.Date == date);
                trend.Add(new
                {
                    date = date.ToString("yyyy-MM-dd"),
                    count
                });
            }
            return trend;
        }
    }
}