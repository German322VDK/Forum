using Forum.Domain.Entities.ForumEntities.Likes;

namespace Forum.Domain.Entities.ForumEntities
{
    /// <summary>
    /// Represents a post in a thread.
    /// </summary>
    public class PostEntity : ContentEntity
    {
        /// <summary>
        /// Gets or sets the ID of the trad to which the post belongs.
        /// </summary>
        public int TradId { get; set; }

        /// <summary>
        /// Navigation property to the trad that the post is associated with.
        /// </summary>
        public virtual TradEntity Trad { get; set; }

        /// <summary>
        /// Navigation property for the comments associated with the post.
        /// </summary>
        public virtual ICollection<CommentEntity> Comments { get; set; }

        /// <summary>
        /// Navigation property for the likes associated with the post.
        /// </summary>
        public virtual ICollection<PostLikeEntity> Likes { get; set; }
    }
}
