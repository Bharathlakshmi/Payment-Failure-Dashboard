using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Payment_Failure_Dashboard.Migrations
{
    /// <inheritdoc />
    public partial class AddBankToPaymentTransaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Bank",
                table: "PaymentTransactions",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bank",
                table: "PaymentTransactions");
        }
    }
}
