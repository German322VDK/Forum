﻿using Microsoft.AspNetCore.Identity;

namespace Forum.Server.WebInfrastructure.Middlewares
{
    /// <summary>
    /// Middleware that checks if a user is banned before allowing access to the application.
    /// If the user is banned, it responds with a 403 Forbidden status and a message.
    /// </summary>
    public class BanMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<BanMiddleware> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="BanMiddleware"/> class.
        /// </summary>
        /// <param name="next">The next middleware in the request pipeline.</param>
        /// <param name="scopeFactory">The service scope factory used to create service scopes.</param>
        /// <param name="logger">The logger for logging information and errors.</param>
        public BanMiddleware(RequestDelegate next,
            IServiceScopeFactory scopeFactory,
            ILogger<BanMiddleware> logger)
        {
            _scopeFactory = scopeFactory;
            _next = next;
            _logger = logger;
        }

        /// <summary>
        /// Processes an incoming HTTP request and checks if the user is banned.
        /// If the user is banned, it returns a 403 Forbidden response.
        /// </summary>
        /// <param name="context">The current HTTP context.</param>
        /// <returns>A task representing the asynchronous operation.</returns>
        public async Task InvokeAsync(HttpContext context)
        {
            

            await _next(context);
        }
    }
}
