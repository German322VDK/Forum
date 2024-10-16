using Microsoft.AspNetCore.Identity;

namespace Forum.Domain.Entities.Identity
{
    /// <summary>
    /// Represents a role in the identity system.
    /// Inherits from <see cref="IdentityRole{TKey}"/> where TKey is of type int.
    /// </summary>
    public class RoleEntity : IdentityRole<int>
    {
    }
}
