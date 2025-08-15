using GritsaFlow.Models;

namespace GritsaFlow.Server.DTOs
{
    public class ProjectDTO
    {
        public string Id { get; set; }
        public string ProjectId { get; set; }
        public string ProjectTitle { get; set; }
        public string ProjectDescription { get; set; }
        public List<EmployeeRef>? Employees { get; set; }
        public string ProjectStatus { get; set; }
        public DateTime DueDate { get; set; }
        public Creator Creator { get; set; }
        public Updator Updator { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class ProjectEmployeeDto
    {
        public string ProjectId { get; set; }
        public string ProjectTitle { get; set; }
        public List<EmployeeRef> Employees { get; set; }
    }


}
