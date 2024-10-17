namespace Forum.Infrastructure.Initializers
{
    /// <summary>
    /// Interface for initializing the database.
    /// </summary>
    public interface IDbInitializer
    {
        /// <summary>
        /// Initializes the database by applying any necessary migrations and seeding initial data.
        /// </summary>
        /// <returns>A task that represents the asynchronous initialization operation.</returns>
        public Task InitializeAsync();
    }
}
