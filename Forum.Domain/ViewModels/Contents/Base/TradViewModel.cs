namespace Forum.Domain.ViewModels.Contents.Base
{
    /// <summary>
    /// Represents a trad view model.
    /// Inherits from <see cref="ContentViewModel"/>.
    /// </summary>
    public class TradViewModel : ContentViewModel
    {
        /// <summary>
        /// Gets or sets the posts associated with the trad.
        /// </summary>
        public IEnumerable<PostViewModel> Posts { get; set; }
    }
}
