using Payment_Failure_Dashboard.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payment_Failure_Dashboard.Interface
{
    public interface IRazorpayPaymentDetail
    {
        Task<IEnumerable<RazorpayPaymentDetail>> GetAll();
        Task<RazorpayPaymentDetail> GetById(int id);
        Task<RazorpayPaymentDetail> Add(RazorpayPaymentDetail entity);
        Task Update(int id, RazorpayPaymentDetail entity);
        Task Delete(int id);
    }
}
