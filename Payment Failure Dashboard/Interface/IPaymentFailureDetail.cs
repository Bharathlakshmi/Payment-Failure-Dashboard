using Payment_Failure_Dashboard.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payment_Failure_Dashboard.Interface
{
    public interface IPaymentFailureDetail
    {
        Task<IEnumerable<PaymentFailureDetail>> GetAll();
        Task<PaymentFailureDetail> GetById(int id);
        Task<PaymentFailureDetail> Add(PaymentFailureDetail entity);
        Task Update(int id, PaymentFailureDetail entity);
        Task Delete(int id);
    }
}
