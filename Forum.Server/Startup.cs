using Forum.Database.Context;
using Forum.Domain.Entities.ForumEntities;
using Forum.Domain.Entities.Identity;
using Forum.Infrastructure.Initializers;
using Forum.Infrastructure.Services.Stores.Contents;
using Forum.Server.WebInfrastructure.FileManagement.Images;
using Forum.Server.WebInfrastructure.Middlewares;
using Forum.Server.WebInfrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;

namespace Forum.Server
{
    /// <summary>
    /// The startup class for configuring services and the application pipeline.
    /// </summary>
    public class Startup
    {
        private readonly WebApplicationBuilder _builder;
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        /// <param name="args">The command-line arguments.</param>
        public Startup(string[] args)
        {
            _builder = WebApplication.CreateBuilder(args);
            _configuration = _builder.Configuration;

            Log.Logger = ConfigureLogger();
            _builder.Host.UseSerilog();
        }

        /// <summary>
        /// Initializes the application and configures services and middleware.
        /// </summary>
        /// <returns>The configured <see cref="WebApplication"/> instance.</returns>
        public WebApplication InitializeApp()
        {
            ConfigureServices(_builder.Services);
            WebApplication app = _builder.Build();
            Configure(app, app.Environment);
            return app;
        }

        /// <summary>
        /// Configures the services for dependency injection.
        /// </summary>
        /// <param name="services">The service collection to configure.</param>
        private void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ForumDbContext>(opt => opt
              .UseSqlite(_configuration.GetConnectionString("Sqlite"))
              .UseLazyLoadingProxies()
           );

            services.AddIdentity<UserEntity, RoleEntity>()
                .AddEntityFrameworkStores<ForumDbContext>()
                .AddDefaultTokenProviders();

            services.AddTransient<IDbInitializer, ForumDbInitializer>();
            services.AddTransient<IImageManager, ImageManager>();

            services.AddTransient<ITokenService, TokenService>();

            services.AddTransient<IStore<TradEntity>, TradStore>();
            services.AddTransient<IStore<PostEntity>, PostStore>();
            services.AddTransient<IStore<CommentEntity>, CommentStore>();

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", builder =>
                {
                    builder
                    .WithOrigins(_configuration["Ports:ClientPort"])
                    .AllowAnyMethod()
                    .AllowAnyHeader();

                    builder.WithOrigins(_configuration["Ports:TestClientPort"])
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                });
            });

            services.Configure<IdentityOptions>(options =>
            {
                IConfigurationSection identitySettings = _configuration.GetSection("Identity");

                options.Password.RequiredLength = identitySettings.GetValue<int>("Password:RequiredLength");
                options.Password.RequireDigit = identitySettings.GetValue<bool>("Password:RequireDigit");
                options.Password.RequireLowercase = identitySettings.GetValue<bool>("Password:RequireLowercase");
                options.Password.RequireUppercase = identitySettings.GetValue<bool>("Password:RequireUppercase");
                options.Password.RequireNonAlphanumeric = identitySettings.GetValue<bool>("Password:RequireNonAlphanumeric");
                options.Password.RequiredUniqueChars = identitySettings.GetValue<int>("Password:RequiredUniqueChars");

                // Настройки блокировки
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.Parse(identitySettings.GetValue<string>("Lockout:DefaultLockoutTimeSpan"));
                options.Lockout.MaxFailedAccessAttempts = identitySettings.GetValue<int>("Lockout:MaxFailedAccessAttempts");
                options.Lockout.AllowedForNewUsers = identitySettings.GetValue<bool>("Lockout:AllowedForNewUsers");
            });

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters =
                    CustomTokenOptions
                    .GetTokenValidationParameters(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], _configuration["Jwt:Key"]);
                });

            services.AddAuthorization();

            services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(opt =>
            {
                opt.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });

                opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });

                opt.AddSecurityRequirement(new OpenApiSecurityRequirement {
                {
                    new OpenApiSecurityScheme {
                        Reference = new OpenApiReference {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] {}
                }});
            });
        }

        /// <summary>
        /// Configures the application pipeline.
        /// </summary>
        /// <param name="app">The web application.</param>
        /// <param name="env">The web hosting environment.</param>
        private async void Configure(WebApplication app, IWebHostEnvironment env)
        {
            await DbInit(app);

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseMiddleware<ErrorHandlingMiddleware>();
            app.UseMiddleware<BanMiddleware>();

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.UseSerilogRequestLogging();
        }

        private async Task DbInit(WebApplication app)
        {
            using (IServiceScope scope = app.Services.CreateScope())
            {
                IServiceProvider services = scope.ServiceProvider;

                IDbInitializer dbInitializer = services.GetRequiredService<IDbInitializer>();
                await dbInitializer.InitializeAsync();
            }
        }

        /// <summary>
        /// Configures the logger for the application.
        /// </summary>
        /// <returns>A configured logger instance.</returns>
        private Serilog.ILogger ConfigureLogger() => new LoggerConfiguration()
            .ReadFrom.Configuration(_configuration)
            .MinimumLevel.Information()
            .Enrich.FromLogContext()
            .WriteTo.File($"Logs/Info/Full-Forum.Server[ {DateTime.Now:yyyy-MM-dd}].log", LogEventLevel.Information)
            .WriteTo.File($"Logs/Error/Error-Forum.Server[ {DateTime.Now:yyyy-MM-dd}].log", LogEventLevel.Error)
            .CreateLogger();
    }
}
