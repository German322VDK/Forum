namespace Forum.Domain.Entities.Identity
{
    /// <summary>
    /// Defines the different statuses a user can have in the system.
    /// </summary>
    public enum UserStatus
    {
        /// <summary>
        /// User with administrative privileges.
        /// </summary>
        Admin = 1,

        /// <summary>
        /// Regular user with standard privileges.
        /// </summary>
        User = 2,

        /// <summary>
        /// User who has been banned from the system.
        /// </summary>
        Banned = 3
    }
}
