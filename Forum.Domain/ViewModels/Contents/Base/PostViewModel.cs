namespace Forum.Domain.ViewModels.Contents.Base
{
    /// <summary>
    /// Represents a post view model.
    /// Inherits from <see cref="ContentViewModel"/>.
    /// </summary>
    public class PostViewModel : ContentViewModel
    {
        /// <summary>
        /// Gets or sets the comments associated with the post.
        /// </summary>
        public IEnumerable<CommentViewModel> Comments { get; set; }
    }
}
