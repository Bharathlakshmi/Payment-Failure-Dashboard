using Microsoft.EntityFrameworkCore;
using Payment_Failure_Dashboard.Models;

namespace Payment_Failure_Dashboard.Data
{
    public class PaymentContext : DbContext
    {
        public PaymentContext(DbContextOptions<PaymentContext> options)
            : base(options)
        {
        }

        // Core Tables
        public DbSet<User> Users { get; set; }
        public DbSet<PaymentTransaction> PaymentTransactions { get; set; }

        // Gateway Specific
        public DbSet<RazorpayPaymentDetail> RazorpayPaymentDetails { get; set; }

        // Failure Analysis
        public DbSet<PaymentFailureDetail> PaymentFailureDetails { get; set; }
        public DbSet<FailureRootCauseMaster> FailureRootCauseMasters { get; set; }

        // Simulation
        public DbSet<SimulatedFailureConfig> SimulatedFailureConfigs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

           
            //   User → PaymentTransaction (1 : M)
             
            modelBuilder.Entity<PaymentTransaction>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(pt => pt.UserId)
                .OnDelete(DeleteBehavior.Restrict);

           
             //  PaymentTransaction → RazorpayPaymentDetail (1 : 1)
             
            modelBuilder.Entity<RazorpayPaymentDetail>()
                .HasOne(rp => rp.PaymentTransaction)
                .WithOne()
                .HasForeignKey<RazorpayPaymentDetail>(rp => rp.PaymentTransactionId)
                .OnDelete(DeleteBehavior.Cascade);

            
            //   PaymentTransaction → PaymentFailureDetail (1 : 1)
             
            modelBuilder.Entity<PaymentFailureDetail>()
                .HasOne(pf => pf.PaymentTransaction)
                .WithOne()
                .HasForeignKey<PaymentFailureDetail>(pf => pf.PaymentTransactionId)
                .OnDelete(DeleteBehavior.Cascade);

          
              // FailureRootCauseMaster (Lookup Table)

            modelBuilder.Entity<FailureRootCauseMaster>()
                .HasIndex(rc => new { rc.ErrorCode, rc.ErrorSource })
                .IsUnique();

                 modelBuilder.Entity<User>()
                 .Property(u => u.Role)
                 .HasConversion<int>();
        }
    }
}
