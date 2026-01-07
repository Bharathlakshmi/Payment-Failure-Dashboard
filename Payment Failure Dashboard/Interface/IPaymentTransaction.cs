using Payment_Failure_Dashboard.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payment_Failure_Dashboard.Interface
{
    public interface IPaymentTransaction
    {
        Task<IEnumerable<PaymentTransaction>> GetAll();
        Task<IEnumerable<PaymentTransaction>> GetByUserId(int userId);
        Task<PaymentTransaction> GetById(int id);
        Task<PaymentTransaction> Add(PaymentTransaction entity);
        Task Update(int id, PaymentTransaction entity);
        Task Delete(int id);
    }
}
