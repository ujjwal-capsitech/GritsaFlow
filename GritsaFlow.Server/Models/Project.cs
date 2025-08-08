using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace GritsaFlow.Models
{
    public class Project
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string ProjectId { get; set; } = null!;

        [Required]
        public string ProjectTitle { get; set; } = null!;

        [Required]
        public string ProjectDescription { get; set; } = null!;


        public List<EmployeeRef>? Employees { get; set; }

        [Required]
        public ProjectStatus ProjectStatus { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        [Required]
        public DateTime DueDate { get; set; }
        public Creator Creator { get; set; }
        public Updator Updator { get; set; }
            
        public bool IsDeleted { get; set; } = false;

    }


    public class EmployeeRef
    {
        public string EmpId { get; set; } = null!;
        public string EmpName { get; set; } = null!;
    }

    public enum ProjectStatus
    {
        Todo,
        Ongoing,
        Completed,
        UnderService,
    }
    
    public class Creator
    {
        public string Id { get; set; }
        public string Name { get; set; }
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    public class Updator
    {
        public string Id { get; set; }     

        public string Name { get; set; }
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime UpdatedAt { get; set; }
    }
}
