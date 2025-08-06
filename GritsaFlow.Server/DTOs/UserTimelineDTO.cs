namespace GritsaFlow.Server.Models
{
    public class TimelineItemDTO
    {
        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string DateTime { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string TaskLink { get; set; } = string.Empty;
        public string? FromLabel { get; set; }
        public string? ToLabel { get; set; }
    }
}
