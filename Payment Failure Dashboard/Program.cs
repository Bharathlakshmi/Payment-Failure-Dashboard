using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Payment_Failure_Dashboard.Data;
using Payment_Failure_Dashboard.Interface;
using Payment_Failure_Dashboard.Repository;
using Payment_Failure_Dashboard.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c => {
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Key"]!))
    };
});

builder.Services.AddDbContext<PaymentContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("dbconn")));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPaymentTransactionService, PaymentTransactionService>();
builder.Services.AddScoped<IPaymentFailureService, PaymentFailureService>();
builder.Services.AddScoped<IRazorpayPaymentService, RazorpayPaymentService>();
builder.Services.AddScoped<IFailureRootCauseService, FailureRootCauseService>();
builder.Services.AddScoped<ISimulatedFailureService, SimulatedFailureService>();

builder.Services.AddScoped<IUser,UserRepository>();
builder.Services.AddScoped<ISimulatedFailureConfig, SimulatedFailureConfigRepository>();
builder.Services.AddScoped<IRazorpayPaymentDetail, RazorpayPaymentDetailRepository>();
builder.Services.AddScoped<IPaymentTransaction, PaymentTransactionRepository>();
builder.Services.AddScoped<IPaymentFailureDetail, PaymentFailureDetailRepository>();
builder.Services.AddScoped<IFailureRootCauseMaster, FailureRootCauseMasterRepository>();



//detected cycle error - while .include of other model
builder.Services.AddControllers().AddJsonOptions(opt =>
{
    opt.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});



builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowReact", pol => pol.AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader()
    );
});




var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
