using Forum.Domain.Entities.ForumEntities.Likes;

namespace Forum.Domain.Entities.ForumEntities
{
    /// <summary>
    /// Represents a trad in the system.
    /// </summary>
    public class TradEntity : ContentEntity
    {
        /// <summary>
        /// Navigation property for the posts associated with the thread.
        /// </summary>
        public virtual ICollection<PostEntity> Posts { get; set; }

        /// <summary>
        /// Navigation property for the likes associated with the thread.
        /// </summary>
        public virtual ICollection<TradLikeEntity> Likes { get; set; }
    }
}
