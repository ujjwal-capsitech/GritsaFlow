namespace GritsaFlow.DTOs
{
    public class TaskReportDto
    {
        public string Name { get; set; } = null!;
        public int Value { get; set; }
    }
    public class ProjectReportResponse
    {
        public List<TaskReportDto> StatusReport { get; set; } = new();
        public List<TaskReportDto> PriorityReport { get; set; } = new();
    }
}
